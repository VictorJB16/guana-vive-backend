import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Query,
  Logger,
  ValidationPipe,
  UsePipes,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { FileService } from './file.service';
import { AuthService } from './auth.service';
import {
  CreateUserDto,
  UpdateUserDto,
  ChangePasswordDto,
  LoginDto,
  ValidateUserDto,
  UpdateProfileDto,
  UploadAvatarDto,
} from './dto';
import {
  UserResponse,
  CreateUserResponse,
  UpdateUserResponse,
  DeleteUserResponse,
  PasswordChangeResponse,
  GetUsersResponse,
  GetUserResponse,
  UserValidationResponse,
  IFindUsersOptions,
  USER_SUCCESS_MESSAGES,
  UserSortBy,
  SortOrder,
  UserRole,
} from './types';
import type { UserQueryParams } from './types';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('users')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly fileService: FileService,
    private readonly authService: AuthService,
  ) {}

  /**
   * Crear un nuevo usuario
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CreateUserResponse> {
    this.logger.log(`Creating user with email: ${createUserDto.email}`);

    const user = await this.usersService.create(createUserDto);

    return {
      success: true,
      message: USER_SUCCESS_MESSAGES.USER_CREATED,
      data: user as UserResponse,
    };
  }

  /**
   * Obtener todos los usuarios con filtros y paginación
   */
  @Get()
  async findAll(
    @Query() queryParams: UserQueryParams,
  ): Promise<GetUsersResponse> {
    this.logger.log('Fetching users with filters:', queryParams);

    const options: IFindUsersOptions = {
      page: queryParams.page || 1,
      limit: queryParams.limit || 10,
      sortBy: queryParams.sortBy as UserSortBy,
      order: queryParams.order as SortOrder,
      role: queryParams.role as UserRole,
      isActive: queryParams.isActive,
      search: queryParams.search,
    };

    const result = await this.usersService.findAll(options);

    return {
      success: true,
      data: result.data as UserResponse[],
      meta: {
        total: result.meta.total,
        page: result.meta.page,
        limit: result.meta.limit,
        totalPages: result.meta.totalPages,
      },
    };
  }

  /**
   * Obtener perfil del usuario autenticado
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: any): Promise<GetUserResponse> {
    this.logger.log(`Getting profile for user ID: ${req.user.id}`);

    const user = await this.usersService.getProfile(req.user.id);

    return {
      success: true,
      data: user as UserResponse,
    };
  }

  /**
   * Obtener un usuario por ID
   */
  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<GetUserResponse> {
    this.logger.log(`Fetching user with ID: ${id}`);

    const user = await this.usersService.findOne(id);

    return {
      success: true,
      data: user as UserResponse,
    };
  }

  /**
   * Obtener un usuario por email
   */
  @Get('email/:email')
  async findByEmail(@Param('email') email: string): Promise<GetUserResponse> {
    this.logger.log(`Fetching user with email: ${email}`);

    const user = await this.usersService.findByEmail(email, false);

    return {
      success: true,
      data: user as UserResponse,
    };
  }

  /**
   * Actualizar un usuario
   */
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserResponse> {
    this.logger.log(`Updating user with ID: ${id}`);

    const user = await this.usersService.update(id, updateUserDto);

    return {
      success: true,
      message: USER_SUCCESS_MESSAGES.USER_UPDATED,
      data: user as UserResponse,
    };
  }

  /**
   * Cambiar contraseña de un usuario
   */
  @Patch(':id/change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<PasswordChangeResponse> {
    this.logger.log(`Changing password for user with ID: ${id}`);

    await this.usersService.changePassword(id, changePasswordDto);

    return {
      success: true,
      message: USER_SUCCESS_MESSAGES.PASSWORD_CHANGED,
    };
  }

  /**
   * Activar/desactivar un usuario
   */
  @Patch(':id/toggle-status')
  async toggleStatus(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UpdateUserResponse> {
    this.logger.log(`Toggling status for user with ID: ${id}`);

    const user = await this.usersService.toggleStatus(id);

    return {
      success: true,
      message: USER_SUCCESS_MESSAGES.STATUS_TOGGLED,
      data: user as UserResponse,
    };
  }

  /**
   * Eliminar un usuario
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<DeleteUserResponse> {
    this.logger.log(`Removing user with ID: ${id}`);

    await this.usersService.remove(id);

    return {
      success: true,
      message: USER_SUCCESS_MESSAGES.USER_DELETED,
    };
  }

  /**
   * Validar credenciales de usuario (para login)
   */
  @Post('validate')
  @HttpCode(HttpStatus.OK)
  async validateUser(
    @Body() validateUserDto: ValidateUserDto,
  ): Promise<UserValidationResponse> {
    this.logger.log(
      `Validating user credentials for email: ${validateUserDto.email}`,
    );

    const user = await this.usersService.validateUser(
      validateUserDto.email,
      validateUserDto.password,
    );

    return {
      isValid: !!user,
      user: user as UserResponse,
    };
  }

  /**
   * Login de usuario con JWT
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    this.logger.log(`User login attempt for email: ${loginDto.email}`);

    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const result = await this.authService.login(user);
    this.logger.log(`Login successful for user: ${user.email}, token generated`);
    return result;
  }

  /**
   * Actualizar perfil del usuario autenticado
   */
  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Request() req: any,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<UpdateUserResponse> {
    this.logger.log(`Updating profile for user ID: ${req.user.id}`);

    const user = await this.usersService.updateProfile(
      req.user.id,
      updateProfileDto,
    );

    return {
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: user as UserResponse,
    };
  }

  /**
   * Actualizar avatar del usuario autenticado
   */
  @Post('profile/avatar')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateAvatar(
    @Request() req: any,
    @Body() uploadAvatarDto: UploadAvatarDto,
  ): Promise<UpdateUserResponse> {
    this.logger.log(`Updating avatar for user ID: ${req.user.id}`);

    // Validar y procesar la URL del avatar
    const processedAvatarUrl = this.fileService.processAvatarUrl(
      uploadAvatarDto.avatarUrl || '',
      req.user.firstName,
      req.user.lastName,
    );

    const user = await this.usersService.updateAvatar(
      req.user.id,
      processedAvatarUrl,
    );

    return {
      success: true,
      message: 'Avatar actualizado exitosamente',
      data: user as UserResponse,
    };
  }
}
