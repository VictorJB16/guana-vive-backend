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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PublicationsService } from './publications.service';
import type { Request as ExpressRequest } from 'express';
import {
  CreatePublicationDto,
  UpdatePublicationDto,
  UpdateImageDto,
  ApprovePublicationDto,
} from './dto';
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
   * Subir una imagen
   */
  @Post('upload')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/publications',
        filename: (req, file, cb) => {
          const randomName = Array(16)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          const fileExt = extname(file.originalname).toLowerCase();
          cb(null, `publication-${Date.now()}-${randomName}${fileExt}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Tipo de archivo inválido. Solo se permiten JPG, PNG y WEBP.'), false);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('No se proporcionó ningún archivo');
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'Archivo subido exitosamente',
      data: {
        url: `http://localhost:3000/uploads/publications/${file.filename}`,
        filename: file.filename,
        size: file.size,
        mimetype: file.mimetype,
      },
    };
  }

  /**
   * Crear una nueva publicación
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createPublicationDto: CreatePublicationDto,
    @Request() req: ExpressRequest & { user?: { id?: string; role?: UserRole } },
  ) {
    this.logger.log(
      `Creating publication with title: ${createPublicationDto.title}`,
    );

    const publication = await this.publicationsService.create(
      createPublicationDto,
      req.user!.id!,
    );

    return {
      statusCode: HttpStatus.CREATED,
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
      statusCode: HttpStatus.OK,
      message: 'Publicaciones obtenidas exitosamente',
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
    @Request() req: ExpressRequest & { user?: { id?: string; role?: UserRole } },
    @Query() queryParams: PublicationQueryParams,
  ) {
    this.logger.log(`Getting publications for user ID: ${req.user?.id}`);

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
      req.user!.id!,
      options,
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'Mis publicaciones obtenidas exitosamente',
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
   * Obtener publicaciones por categoría específica
   */
  @Get('filter/category/:category')
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
      statusCode: HttpStatus.OK,
      message: `Publicaciones de la categoría: ${category}`,
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
   * Obtener publicaciones por estado específico
   */
  @Get('filter/status/:status')
  async findByStatus(
    @Param('status') status: PublicationStatus,
    @Query() queryParams: PublicationQueryParams,
  ) {
    this.logger.log(`Fetching publications with status: ${status}`);

    const options: IFindPublicationsOptions = {
      page: queryParams.page || 1,
      limit: queryParams.limit || 10,
      sortBy: queryParams.sortBy as PublicationSortBy,
      order: queryParams.order as SortOrder,
      category: queryParams.category as PublicationCategory,
      search: queryParams.search,
      status,
    };

    const result = await this.publicationsService.findAll(options);

    return {
      statusCode: HttpStatus.OK,
      message: `Publicaciones con estado: ${status}`,
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
   * Obtener publicaciones publicadas (solo publicadas)
   */
  @Get('published')
  async getPublishedPublications(@Query() queryParams: PublicationQueryParams) {
    this.logger.log('Fetching published publications');

    const options: IFindPublicationsOptions = {
      page: queryParams.page || 1,
      limit: queryParams.limit || 10,
      sortBy: queryParams.sortBy as PublicationSortBy,
      order: queryParams.order as SortOrder,
      category: queryParams.category as PublicationCategory,
      search: queryParams.search,
      status: PublicationStatus.PUBLISHED,
    };

    const result = await this.publicationsService.findAll(options);

    return {
      statusCode: HttpStatus.OK,
      message: 'Publicaciones publicadas',
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
      statusCode: HttpStatus.OK,
      message: 'Publicaciones del autor obtenidas exitosamente',
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
      statusCode: HttpStatus.OK,
      message: 'Publicación obtenida exitosamente',
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
    @Request() req: ExpressRequest & { user?: { id?: string; role?: UserRole } },
  ) {
    this.logger.log(`Updating publication with ID: ${id}`);

    const publication = await this.publicationsService.update(
      id,
      updatePublicationDto,
      req.user?.id as string,
      req.user?.role,
    );

    return {
      statusCode: HttpStatus.OK,
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
    @Request() req: ExpressRequest & { user?: { id?: string; role?: UserRole } },
  ) {
    this.logger.log(`Changing status of publication ${id} to ${status}`);

    const publication = await this.publicationsService.changeStatus(
      id,
      status,
      req.user?.id as string,
    );

    return {
      statusCode: HttpStatus.OK,
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
    @Request() req: ExpressRequest & { user?: { id?: string; role?: UserRole } },
  ) {
    this.logger.log(`Updating image for publication with ID: ${id}`);

    const publication = await this.publicationsService.updateImage(
      id,
      updateImageDto,
      req.user?.id as string,
    );

    return {
      statusCode: HttpStatus.OK,
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
    @Request() req: ExpressRequest & { user?: { id?: string; role?: UserRole } },
  ) {
    this.logger.log(`Removing image from publication with ID: ${id}`);

    const publication = await this.publicationsService.removeImage(
      id,
      req.user?.id as string,
    );

    return {
      statusCode: HttpStatus.OK,
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
    @Request() req: ExpressRequest & { user?: { id?: string; role?: UserRole } },
  ) {
    this.logger.log(`Requesting approval for publication with ID: ${id}`);

    const publication = await this.publicationsService.requestApproval(
      id,
      req.user?.id as string,
    );

    return {
      statusCode: HttpStatus.OK,
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

    const publication = await this.publicationsService.approvePublication(
      id,
      approveDto,
    );

    return {
      statusCode: HttpStatus.OK,
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

    const result =
      await this.publicationsService.getPendingPublications(options);

    return {
      statusCode: HttpStatus.OK,
      message: 'Publicaciones pendientes obtenidas exitosamente',
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
  async remove(@Param('id', ParseUUIDPipe) id: string, @Request() req: ExpressRequest & { user?: { id?: string; role?: UserRole } }) {
    this.logger.log(`Removing publication with ID: ${id}`);

    await this.publicationsService.remove(
      id,
      req.user?.id as string,
      req.user?.role,
    );

    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: PUBLICATION_SUCCESS_MESSAGES.DELETED,
    };
  }
}
