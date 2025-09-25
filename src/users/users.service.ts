import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Like } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, ChangePasswordDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import {
  UserRole,
  UserSortBy,
  SortOrder,
  IFindUsersOptions,
  IPaginatedResponse,
  IUserWithoutPassword,
  USER_ERROR_MESSAGES,
  USER_CONSTANTS,
} from './types';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Crea un nuevo usuario en el sistema
   */
  async create(createUserDto: CreateUserDto): Promise<IUserWithoutPassword> {
    this.logger.log(
      `Attempting to create user with email: ${createUserDto.email}`,
    );

    try {
      await this.validateEmailUniqueness(createUserDto.email);

      const userEntity = this.userRepository.create({
        ...createUserDto,
        role: (createUserDto.role as UserRole) || UserRole.USER,
        isActive: createUserDto.isActive ?? true,
      });

      const savedUser = await this.userRepository.save(userEntity);
      this.logger.log(`User created successfully with ID: ${savedUser.id}`);

      return this.transformToSafeUser(savedUser);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Failed to create user: ${errorMessage}`, errorStack);
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException(USER_ERROR_MESSAGES.USER_CREATION_FAILED);
    }
  }

  /**
   * Obtiene todos los usuarios con opciones de filtrado y paginación
   */
  async findAll(
    options: IFindUsersOptions = {},
  ): Promise<IPaginatedResponse<IUserWithoutPassword>> {
    this.logger.log('Fetching users with options:', options);

    const {
      page = USER_CONSTANTS.PAGINATION.DEFAULT_PAGE,
      limit = USER_CONSTANTS.PAGINATION.DEFAULT_LIMIT,
      sortBy = UserSortBy.CREATED_AT,
      order = SortOrder.DESC,
      role,
      isActive,
      search,
    } = options;

    const validatedLimit = Math.min(limit, USER_CONSTANTS.PAGINATION.MAX_LIMIT);
    const skip = (page - 1) * validatedLimit;

    const whereConditions = this.buildWhereConditions({
      role,
      isActive,
      search,
    });

    const [users, total] = await this.userRepository.findAndCount({
      where: whereConditions,
      order: { [sortBy]: order },
      skip,
      take: validatedLimit,
    });

    const totalPages = Math.ceil(total / validatedLimit);

    return {
      data: users.map((user) => this.transformToSafeUser(user)),
      meta: {
        page,
        limit: validatedLimit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  /**
   * Busca un usuario por ID
   */
  async findOne(id: string): Promise<IUserWithoutPassword> {
    this.logger.log(`Searching for user with ID: ${id}`);

    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      this.logger.warn(`User not found with ID: ${id}`);
      throw new NotFoundException(
        `${USER_ERROR_MESSAGES.USER_NOT_FOUND} con ID ${id}`,
      );
    }

    return this.transformToSafeUser(user);
  }

  /**
   * Busca un usuario por email
   */
  async findByEmail(
    email: string,
    includePassword = false,
  ): Promise<User | IUserWithoutPassword> {
    this.logger.log(`Searching for user with email: ${email}`);

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      this.logger.warn(`User not found with email: ${email}`);
      throw new NotFoundException(USER_ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return includePassword ? user : this.transformToSafeUser(user);
  }

  /**
   * Actualiza los datos de un usuario
   */
  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<IUserWithoutPassword> {
    this.logger.log(`Updating user with ID: ${id}`);

    const user = await this.findUserByIdOrThrow(id);

    // Validar email único si se está actualizando
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      await this.validateEmailUniqueness(updateUserDto.email);
    }

    // Aplicar actualizaciones seguras (UpdateUserDto ya excluye password)
    Object.assign(user, updateUserDto);

    try {
      const updatedUser = await this.userRepository.save(user);
      this.logger.log(`User updated successfully with ID: ${id}`);
      return this.transformToSafeUser(updatedUser);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Failed to update user: ${errorMessage}`, errorStack);
      throw new BadRequestException(USER_ERROR_MESSAGES.USER_UPDATE_FAILED);
    }
  }

  /**
   * Cambia la contraseña de un usuario
   */
  async changePassword(
    id: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    this.logger.log(`Changing password for user with ID: ${id}`);

    const user = await this.findUserByIdOrThrow(id);

    const isCurrentPasswordValid = await user.validatePassword(
      changePasswordDto.currentPassword,
    );

    if (!isCurrentPasswordValid) {
      this.logger.warn(`Invalid current password for user ID: ${id}`);
      throw new UnauthorizedException(
        USER_ERROR_MESSAGES.INVALID_CURRENT_PASSWORD,
      );
    }

    user.password = changePasswordDto.newPassword;

    try {
      await this.userRepository.save(user);
      this.logger.log(`Password changed successfully for user ID: ${id}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to change password: ${errorMessage}`,
        errorStack,
      );
      throw new BadRequestException('Error al cambiar la contraseña');
    }
  }

  /**
   * Elimina un usuario del sistema
   */
  async remove(id: string): Promise<void> {
    this.logger.log(`Removing user with ID: ${id}`);

    const user = await this.findUserByIdOrThrow(id);

    try {
      await this.userRepository.remove(user);
      this.logger.log(`User removed successfully with ID: ${id}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Failed to remove user: ${errorMessage}`, errorStack);
      throw new BadRequestException('Error al eliminar el usuario');
    }
  }

  /**
   * Activa o desactiva un usuario
   */
  async toggleStatus(id: string): Promise<IUserWithoutPassword> {
    this.logger.log(`Toggling status for user with ID: ${id}`);

    const user = await this.findUserByIdOrThrow(id);
    user.isActive = !user.isActive;

    try {
      const updatedUser = await this.userRepository.save(user);
      this.logger.log(`User status toggled successfully for ID: ${id}`);
      return this.transformToSafeUser(updatedUser);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to toggle user status: ${errorMessage}`,
        errorStack,
      );
      throw new BadRequestException('Error al cambiar el estado del usuario');
    }
  }

  /**
   * Valida las credenciales de un usuario
   */
  async validateUser(
    email: string,
    password: string,
  ): Promise<IUserWithoutPassword | null> {
    this.logger.log(`Validating user credentials for email: ${email}`);

    try {
      const user = (await this.findByEmail(email, true)) as User;
      const isPasswordValid = await user.validatePassword(password);

      if (isPasswordValid && user.isActive) {
        this.logger.log(`User validation successful for email: ${email}`);
        return this.transformToSafeUser(user);
      }

      this.logger.warn(`User validation failed for email: ${email}`);
      return null;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.warn(
        `User validation error for email: ${email}`,
        errorMessage,
      );
      return null;
    }
  }

  /**
   * Busca un usuario por ID y lanza excepción si no existe
   */
  private async findUserByIdOrThrow(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(
        `${USER_ERROR_MESSAGES.USER_NOT_FOUND} con ID ${id}`,
      );
    }

    return user;
  }

  /**
   * Valida que un email no esté ya registrado
   */
  private async validateEmailUniqueness(email: string): Promise<void> {
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException(USER_ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
    }
  }

  /**
   * Construye las condiciones WHERE para consultas
   */
  private buildWhereConditions(filters: {
    role?: UserRole;
    isActive?: boolean;
    search?: string;
  }): FindOptionsWhere<User>[] {
    const conditions: FindOptionsWhere<User>[] = [];
    const baseCondition: FindOptionsWhere<User> = {};

    if (filters.role) {
      baseCondition.role = filters.role;
    }

    if (filters.isActive !== undefined) {
      baseCondition.isActive = filters.isActive;
    }

    if (filters.search) {
      const searchTerm = `%${filters.search}%`;
      conditions.push(
        { ...baseCondition, firstName: Like(searchTerm) },
        { ...baseCondition, lastName: Like(searchTerm) },
        { ...baseCondition, email: Like(searchTerm) },
      );
    } else {
      conditions.push(baseCondition);
    }

    return conditions;
  }

  /**
   * Obtiene el perfil completo de un usuario
   */
  async getProfile(userId: string): Promise<IUserWithoutPassword> {
    this.logger.log(`Getting profile for user with ID: ${userId}`);
    return await this.findOne(userId);
  }

  /**
   * Actualiza el perfil de un usuario (solo campos de perfil)
   */
  async updateProfile(
    userId: string,
    updateProfileDto: any,
  ): Promise<IUserWithoutPassword> {
    this.logger.log(`Updating profile for user with ID: ${userId}`);

    const user = await this.findUserByIdOrThrow(userId);

    // Convertir dateOfBirth de string a Date si viene
    if (updateProfileDto.dateOfBirth) {
      updateProfileDto.dateOfBirth = new Date(updateProfileDto.dateOfBirth);
    }

    // Aplicar solo las actualizaciones de perfil permitidas
    const allowedFields = [
      'firstName',
      'lastName',
      'phone',
      'bio',
      'dateOfBirth',
      'address',
      'city',
      'country',
    ];

    for (const field of allowedFields) {
      if (updateProfileDto[field] !== undefined) {
        user[field] = updateProfileDto[field];
      }
    }

    try {
      const updatedUser = await this.userRepository.save(user);
      this.logger.log(`Profile updated successfully for user ID: ${userId}`);
      return this.transformToSafeUser(updatedUser);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Failed to update profile: ${errorMessage}`, errorStack);
      throw new BadRequestException('Error al actualizar el perfil');
    }
  }

  /**
   * Actualiza el avatar de un usuario
   */
  async updateAvatar(
    userId: string,
    avatarUrl: string,
  ): Promise<IUserWithoutPassword> {
    this.logger.log(`Updating avatar for user with ID: ${userId}`);

    const user = await this.findUserByIdOrThrow(userId);
    user.avatar = avatarUrl;

    try {
      const updatedUser = await this.userRepository.save(user);
      this.logger.log(`Avatar updated successfully for user ID: ${userId}`);
      return this.transformToSafeUser(updatedUser);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Failed to update avatar: ${errorMessage}`, errorStack);
      throw new BadRequestException('Error al actualizar el avatar');
    }
  }

  /**
   * Transforma un usuario a su versión segura (sin contraseña)
   */
  private transformToSafeUser(user: User): IUserWithoutPassword {
    return user.toSafeObject() as IUserWithoutPassword;
  }
}
