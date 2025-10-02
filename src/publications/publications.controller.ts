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
import { PublicationsService } from './publications.service';
import { CreatePublicationDto, UpdatePublicationDto, UpdateImageDto, ApprovePublicationDto } from './dto';
import {
  PublicationCategory,
  PublicationStatus,
  PublicationSortBy,
  SortOrder,
  IFindPublicationsOptions,
  PUBLICATION_SUCCESS_MESSAGES,
} from './types';
import type { PublicationQueryParams } from './types';
import { JwtAuthGuard } from '../auth/guards';
import { Roles } from './decorators';
import { RolesGuard } from './guards';
import { UserRole } from '../users/types/user.enum';

@Controller('publications')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class PublicationsController {
  private readonly logger = new Logger(PublicationsController.name);

  constructor(private readonly publicationsService: PublicationsService) {}

  /**
   * Crear una nueva publicación
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createPublicationDto: CreatePublicationDto,
    @Request() req: any,
  ) {
    this.logger.log(
      `Creating publication with title: ${createPublicationDto.title}`,
    );

    const publication = await this.publicationsService.create(
      createPublicationDto,
      req.user.id,
    );

    return {
      success: true,
      message: PUBLICATION_SUCCESS_MESSAGES.CREATED,
      data: publication,
    };
  }

  /**
   * Obtener todas las publicaciones con filtros y paginación
   */
  @Get()
  async findAll(@Query() queryParams: PublicationQueryParams) {
    this.logger.log('Fetching publications with filters:', queryParams);

    const options: IFindPublicationsOptions = {
      page: queryParams.page || 1,
      limit: queryParams.limit || 10,
      sortBy: queryParams.sortBy as PublicationSortBy,
      order: queryParams.order as SortOrder,
      category: queryParams.category as PublicationCategory,
      status: queryParams.status as PublicationStatus,
      authorId: queryParams.authorId,
      search: queryParams.search,
    };

    const result = await this.publicationsService.findAll(options);

    return {
      success: true,
      data: result.data,
      meta: {
        total: result.meta.total,
        page: result.meta.page,
        limit: result.meta.limit,
        totalPages: result.meta.totalPages,
      },
    };
  }

  /**
   * Obtener publicaciones del usuario autenticado
   */
  @Get('my-publications')
  @UseGuards(JwtAuthGuard)
  async getMyPublications(
    @Request() req: any,
    @Query() queryParams: PublicationQueryParams,
  ) {
    this.logger.log(`Getting publications for user ID: ${req.user.id}`);

    const options: IFindPublicationsOptions = {
      page: queryParams.page || 1,
      limit: queryParams.limit || 10,
      sortBy: queryParams.sortBy as PublicationSortBy,
      order: queryParams.order as SortOrder,
      category: queryParams.category as PublicationCategory,
      status: queryParams.status as PublicationStatus,
      search: queryParams.search,
    };

    const result = await this.publicationsService.findByAuthor(
      req.user.id,
      options,
    );

    return {
      success: true,
      data: result.data,
      meta: {
        total: result.meta.total,
        page: result.meta.page,
        limit: result.meta.limit,
        totalPages: result.meta.totalPages,
      },
    };
  }

  /**
   * Obtener publicaciones por categoría
   */
  @Get('category/:category')
  async findByCategory(
    @Param('category') category: PublicationCategory,
    @Query() queryParams: PublicationQueryParams,
  ) {
    this.logger.log(`Fetching publications for category: ${category}`);

    const options: IFindPublicationsOptions = {
      page: queryParams.page || 1,
      limit: queryParams.limit || 10,
      sortBy: queryParams.sortBy as PublicationSortBy,
      order: queryParams.order as SortOrder,
      status: queryParams.status as PublicationStatus,
      search: queryParams.search,
    };

    const result = await this.publicationsService.findByCategory(
      category,
      options,
    );

    return {
      success: true,
      data: result.data,
      meta: {
        total: result.meta.total,
        page: result.meta.page,
        limit: result.meta.limit,
        totalPages: result.meta.totalPages,
      },
    };
  }

  /**
   * Obtener publicaciones de un autor específico
   */
  @Get('author/:authorId')
  async findByAuthor(
    @Param('authorId', ParseUUIDPipe) authorId: string,
    @Query() queryParams: PublicationQueryParams,
  ) {
    this.logger.log(`Fetching publications for author: ${authorId}`);

    const options: IFindPublicationsOptions = {
      page: queryParams.page || 1,
      limit: queryParams.limit || 10,
      sortBy: queryParams.sortBy as PublicationSortBy,
      order: queryParams.order as SortOrder,
      category: queryParams.category as PublicationCategory,
      status: queryParams.status as PublicationStatus,
      search: queryParams.search,
    };

    const result = await this.publicationsService.findByAuthor(
      authorId,
      options,
    );

    return {
      success: true,
      data: result.data,
      meta: {
        total: result.meta.total,
        page: result.meta.page,
        limit: result.meta.limit,
        totalPages: result.meta.totalPages,
      },
    };
  }

  /**
   * Obtener una publicación por ID
   */
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.log(`Fetching publication with ID: ${id}`);

    const publication = await this.publicationsService.findOne(id);

    return {
      success: true,
      data: publication,
    };
  }

  /**
   * Actualizar una publicación (autor o admin)
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePublicationDto: UpdatePublicationDto,
    @Request() req: any,
  ) {
    this.logger.log(`Updating publication with ID: ${id}`);

    const publication = await this.publicationsService.update(
      id,
      updatePublicationDto,
      req.user.id,
      req.user.role,
    );

    return {
      success: true,
      message: PUBLICATION_SUCCESS_MESSAGES.UPDATED,
      data: publication,
    };
  }

  /**
   * Cambiar el estado de una publicación
   */
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  async changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: PublicationStatus,
    @Request() req: any,
  ) {
    this.logger.log(`Changing status of publication ${id} to ${status}`);

    const publication = await this.publicationsService.changeStatus(
      id,
      status,
      req.user.id,
    );

    return {
      success: true,
      message: PUBLICATION_SUCCESS_MESSAGES.STATUS_CHANGED,
      data: publication,
    };
  }

  /**
   * Actualizar imagen de una publicación
   */
  @Patch(':id/image')
  @UseGuards(JwtAuthGuard)
  async updateImage(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateImageDto: UpdateImageDto,
    @Request() req: any,
  ) {
    this.logger.log(`Updating image for publication with ID: ${id}`);

    const publication = await this.publicationsService.updateImage(
      id,
      updateImageDto,
      req.user.id,
    );

    return {
      success: true,
      message: 'Imagen de la publicación actualizada exitosamente',
      data: publication,
    };
  }

  /**
   * Eliminar imagen de una publicación
   */
  @Delete(':id/image')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async removeImage(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: any,
  ) {
    this.logger.log(`Removing image from publication with ID: ${id}`);

    const publication = await this.publicationsService.removeImage(
      id,
      req.user.id,
    );

    return {
      success: true,
      message: 'Imagen de la publicación eliminada exitosamente',
      data: publication,
    };
  }

  /**
   * Solicitar aprobación de una publicación (cambiar a pendiente_revision)
   */
  @Post(':id/request-approval')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async requestApproval(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: any,
  ) {
    this.logger.log(`Requesting approval for publication with ID: ${id}`);

    const publication = await this.publicationsService.requestApproval(
      id,
      req.user.id,
    );

    return {
      success: true,
      message: 'Solicitud de aprobación enviada exitosamente',
      data: publication,
    };
  }

  /**
   * Aprobar o rechazar una publicación (solo administradores)
   */
  @Post(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async approvePublication(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() approveDto: ApprovePublicationDto,
  ) {
    this.logger.log(
      `Admin approving/rejecting publication with ID: ${id} with status: ${approveDto.status}`,
    );

    const publication =
      await this.publicationsService.approvePublication(id, approveDto);

    return {
      success: true,
      message:
        approveDto.status === 'publicado'
          ? 'Publicación aprobada exitosamente'
          : 'Publicación rechazada',
      data: publication,
    };
  }

  /**
   * Obtener publicaciones pendientes de aprobación (solo administradores)
   */
  @Get('admin/pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getPendingPublications(@Query() queryParams: PublicationQueryParams) {
    this.logger.log('Admin fetching pending publications');

    const options: IFindPublicationsOptions = {
      page: queryParams.page || 1,
      limit: queryParams.limit || 10,
      sortBy: queryParams.sortBy as PublicationSortBy,
      order: queryParams.order as SortOrder,
      search: queryParams.search,
    };

    const result = await this.publicationsService.getPendingPublications(options);

    return {
      success: true,
      data: result.data,
      meta: {
        total: result.meta.total,
        page: result.meta.page,
        limit: result.meta.limit,
        totalPages: result.meta.totalPages,
      },
    };
  }

  /**
   * Eliminar una publicación (autor o admin)
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseUUIDPipe) id: string, @Request() req: any) {
    this.logger.log(`Removing publication with ID: ${id}`);

    await this.publicationsService.remove(id, req.user.id, req.user.role);

    return {
      success: true,
      message: PUBLICATION_SUCCESS_MESSAGES.DELETED,
    };
  }
}

