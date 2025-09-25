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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { FileService } from './file.service';
import {
  CreateUserDto,
  UpdateUserDto,
  ChangePasswordDto,
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
  IFindUsersOptions,
  USER_SUCCESS_MESSAGES,
  UserSortBy,
  SortOrder,
  UserRole,
} from './types';
import type { UserQueryParams } from './types';
import { JwtAuthGuard } from '../auth/guards';

@Controller('users')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly fileService: FileService,
  ) {}

  /**
   * Crear un nuevo usuario (solo para administradores)
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
