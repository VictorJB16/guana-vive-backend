import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Like } from 'typeorm';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { ApprovePublicationDto } from './dto/approve-publication.dto';
import { Publication } from './entities/publication.entity';
import { ImageService } from './image.service';
import { UserRole } from '../users/types/user.enum';
import {
  PublicationCategory,
  PublicationStatus,
  PublicationSortBy,
  SortOrder,
  IFindPublicationsOptions,
  IPaginatedResponse,
  PUBLICATION_CONSTANTS,
  PUBLICATION_ERROR_MESSAGES,
} from './types';

@Injectable()
export class PublicationsService {
  private readonly logger = new Logger(PublicationsService.name);

  constructor(
    @InjectRepository(Publication)
    private readonly publicationRepository: Repository<Publication>,
    private readonly imageService: ImageService,
  ) {}

  /**
   * Crea una nueva publicación
   */
  async create(
    createPublicationDto: CreatePublicationDto,
    authorId: string,
  ): Promise<Publication> {
    this.logger.log(
      `Attempting to create publication with title: ${createPublicationDto.title}`,
    );

    try {
      // Procesar URL de imagen si se proporciona
      const processedImageUrl = createPublicationDto.imageUrl
        ? this.imageService.processImageUrl(
            createPublicationDto.imageUrl,
            createPublicationDto.title,
          )
        : null;

      const publicationEntity = this.publicationRepository.create({
        ...createPublicationDto,
        authorId,
        status: createPublicationDto.status || PublicationStatus.DRAFT,
        imageUrl: processedImageUrl || undefined,
      });

      const savedPublication =
        await this.publicationRepository.save(publicationEntity);
      this.logger.log(
        `Publication created successfully with ID: ${savedPublication.id}`,
      );

      return this.findOne(savedPublication.id);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to create publication: ${errorMessage}`,
        errorStack,
      );
      throw new BadRequestException(
        PUBLICATION_ERROR_MESSAGES.CREATION_FAILED,
      );
    }
  }

  /**
   * Obtiene todas las publicaciones con opciones de filtrado y paginación
   */
  async findAll(
    options: IFindPublicationsOptions = {},
  ): Promise<IPaginatedResponse<Publication>> {
    this.logger.log('Fetching publications with options:', options);

    const {
      page = PUBLICATION_CONSTANTS.PAGINATION.DEFAULT_PAGE,
      limit = PUBLICATION_CONSTANTS.PAGINATION.DEFAULT_LIMIT,
      sortBy = PublicationSortBy.CREATED_AT,
      order = SortOrder.DESC,
      category,
      status,
      authorId,
      search,
    } = options;

    const validatedLimit = Math.min(
      limit,
      PUBLICATION_CONSTANTS.PAGINATION.MAX_LIMIT,
    );
    const skip = (page - 1) * validatedLimit;

    const whereConditions = this.buildWhereConditions({
      category,
      status,
      authorId,
      search,
    });

    const [publications, total] =
      await this.publicationRepository.findAndCount({
        where: whereConditions,
        order: { [sortBy]: order },
        skip,
        take: validatedLimit,
        relations: ['author'],
      });

    const totalPages = Math.ceil(total / validatedLimit);

    return {
      data: publications,
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
   * Busca una publicación por ID
   */
  async findOne(id: string): Promise<Publication> {
    this.logger.log(`Searching for publication with ID: ${id}`);

    const publication = await this.publicationRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!publication) {
      this.logger.warn(`Publication not found with ID: ${id}`);
      throw new NotFoundException(
        `${PUBLICATION_ERROR_MESSAGES.NOT_FOUND} con ID ${id}`,
      );
    }

    return publication;
  }

  /**
   * Obtiene todas las publicaciones de un autor
   */
  async findByAuthor(
    authorId: string,
    options: IFindPublicationsOptions = {},
  ): Promise<IPaginatedResponse<Publication>> {
    this.logger.log(`Fetching publications for author: ${authorId}`);
    return this.findAll({ ...options, authorId });
  }

  /**
   * Obtiene todas las publicaciones por categoría
   */
  async findByCategory(
    category: PublicationCategory,
    options: IFindPublicationsOptions = {},
  ): Promise<IPaginatedResponse<Publication>> {
    this.logger.log(`Fetching publications for category: ${category}`);
    return this.findAll({ ...options, category });
  }

  /**
   * Actualiza una publicación
   */
  async update(
    id: string,
    updatePublicationDto: UpdatePublicationDto,
    userId: string,
    userRole?: UserRole,
  ): Promise<Publication> {
    this.logger.log(`Updating publication with ID: ${id}`);

    const publication = await this.findOne(id);

    // Verificar permisos: el autor o un admin pueden actualizar
    const isAdmin = userRole === UserRole.ADMIN;
    if (!publication.isAuthor(userId) && !isAdmin) {
      this.logger.warn(
        `User ${userId} attempted to update publication ${id} without permission`,
      );
      throw new ForbiddenException(PUBLICATION_ERROR_MESSAGES.UNAUTHORIZED);
    }

    Object.assign(publication, updatePublicationDto);

    try {
      const updatedPublication =
        await this.publicationRepository.save(publication);
      this.logger.log(`Publication updated successfully with ID: ${id}`);
      return this.findOne(updatedPublication.id);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to update publication: ${errorMessage}`,
        errorStack,
      );
      throw new BadRequestException(PUBLICATION_ERROR_MESSAGES.UPDATE_FAILED);
    }
  }

  /**
   * Cambia el estado de una publicación
   */
  async changeStatus(
    id: string,
    status: PublicationStatus,
    userId: string,
  ): Promise<Publication> {
    this.logger.log(`Changing status of publication ${id} to ${status}`);

    const publication = await this.findOne(id);

    // Verificar que el usuario sea el autor
    if (!publication.isAuthor(userId)) {
      this.logger.warn(
        `User ${userId} attempted to change status of publication ${id} without permission`,
      );
      throw new ForbiddenException(PUBLICATION_ERROR_MESSAGES.UNAUTHORIZED);
    }

    publication.status = status;

    try {
      const updatedPublication =
        await this.publicationRepository.save(publication);
      this.logger.log(
        `Publication status changed successfully for ID: ${id}`,
      );
      return this.findOne(updatedPublication.id);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to change publication status: ${errorMessage}`,
        errorStack,
      );
      throw new BadRequestException(PUBLICATION_ERROR_MESSAGES.UPDATE_FAILED);
    }
  }

  /**
   * Elimina una publicación
   */
  async remove(id: string, userId: string, userRole?: UserRole): Promise<void> {
    this.logger.log(`Removing publication with ID: ${id}`);

    const publication = await this.findOne(id);

    // Verificar permisos: el autor o un admin pueden eliminar
    const isAdmin = userRole === UserRole.ADMIN;
    if (!publication.isAuthor(userId) && !isAdmin) {
      this.logger.warn(
        `User ${userId} attempted to delete publication ${id} without permission`,
      );
      throw new ForbiddenException(PUBLICATION_ERROR_MESSAGES.UNAUTHORIZED);
    }

    try {
      await this.publicationRepository.remove(publication);
      this.logger.log(`Publication removed successfully with ID: ${id}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to remove publication: ${errorMessage}`,
        errorStack,
      );
      throw new BadRequestException(PUBLICATION_ERROR_MESSAGES.DELETE_FAILED);
    }
  }

  /**
   * Solicita la aprobación de una publicación (cambio a pendiente_revision)
   */
  async requestApproval(id: string, userId: string): Promise<Publication> {
    this.logger.log(`Requesting approval for publication with ID: ${id}`);

    const publication = await this.findOne(id);

    // Solo el autor puede solicitar aprobación
    if (!publication.isAuthor(userId)) {
      this.logger.warn(
        `User ${userId} attempted to request approval for publication ${id} without being the author`,
      );
      throw new ForbiddenException(
        'Solo el autor puede solicitar aprobación de su publicación',
      );
    }

    // Verificar que no esté ya en revisión o publicada
    if (publication.status === PublicationStatus.PENDING_REVIEW) {
      throw new BadRequestException(
        'La publicación ya está en proceso de revisión',
      );
    }

    if (publication.status === PublicationStatus.PUBLISHED) {
      throw new BadRequestException('La publicación ya está publicada');
    }

    publication.status = PublicationStatus.PENDING_REVIEW;

    try {
      const updatedPublication =
        await this.publicationRepository.save(publication);
      this.logger.log(`Approval requested successfully for ID: ${id}`);
      return this.findOne(updatedPublication.id);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to request approval: ${errorMessage}`,
        errorStack,
      );
      throw new BadRequestException(
        'Error al solicitar aprobación de la publicación',
      );
    }
  }

  /**
   * Aprueba o rechaza una publicación (solo administradores)
   */
  async approvePublication(
    id: string,
    approveDto: ApprovePublicationDto,
  ): Promise<Publication> {
    this.logger.log(`Approving/Rejecting publication with ID: ${id}`);

    const publication = await this.findOne(id);

    // Validar que el nuevo estado sea válido para aprobación
    if (
      approveDto.status !== PublicationStatus.PUBLISHED &&
      approveDto.status !== PublicationStatus.ARCHIVED
    ) {
      throw new BadRequestException(
        'El estado debe ser "publicado" o "archivado"',
      );
    }

    publication.status = approveDto.status;

    try {
      const updatedPublication =
        await this.publicationRepository.save(publication);
      this.logger.log(
        `Publication ${approveDto.status === PublicationStatus.PUBLISHED ? 'approved' : 'rejected'} successfully for ID: ${id}`,
      );
      return this.findOne(updatedPublication.id);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to approve/reject publication: ${errorMessage}`,
        errorStack,
      );
      throw new BadRequestException(
        'Error al aprobar/rechazar la publicación',
      );
    }
  }

  /**
   * Obtiene todas las publicaciones pendientes de revisión (solo admin)
   */
  async getPendingPublications(
    options: IFindPublicationsOptions = {},
  ): Promise<IPaginatedResponse<Publication>> {
    this.logger.log('Fetching pending publications');
    return this.findAll({
      ...options,
      status: PublicationStatus.PENDING_REVIEW,
    });
  }

  /**
   * Actualiza solo la imagen de una publicación
   */
  async updateImage(
    id: string,
    updateImageDto: UpdateImageDto,
    userId: string,
  ): Promise<Publication> {
    this.logger.log(`Updating image for publication with ID: ${id}`);

    const publication = await this.findOne(id);

    // Verificar que el usuario sea el autor
    if (!publication.isAuthor(userId)) {
      this.logger.warn(
        `User ${userId} attempted to update image of publication ${id} without permission`,
      );
      throw new ForbiddenException(PUBLICATION_ERROR_MESSAGES.UNAUTHORIZED);
    }

    // Procesar URL de imagen
    const processedImageUrl = this.imageService.processImageUrl(
      updateImageDto.imageUrl,
      publication.title,
    );

    publication.imageUrl = processedImageUrl || undefined;

    try {
      const updatedPublication =
        await this.publicationRepository.save(publication);
      this.logger.log(`Publication image updated successfully for ID: ${id}`);
      return this.findOne(updatedPublication.id);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to update publication image: ${errorMessage}`,
        errorStack,
      );
      throw new BadRequestException(PUBLICATION_ERROR_MESSAGES.UPDATE_FAILED);
    }
  }

  /**
   * Elimina la imagen de una publicación
   */
  async removeImage(id: string, userId: string): Promise<Publication> {
    this.logger.log(`Removing image from publication with ID: ${id}`);

    const publication = await this.findOne(id);

    // Verificar que el usuario sea el autor
    if (!publication.isAuthor(userId)) {
      this.logger.warn(
        `User ${userId} attempted to remove image from publication ${id} without permission`,
      );
      throw new ForbiddenException(PUBLICATION_ERROR_MESSAGES.UNAUTHORIZED);
    }

    publication.imageUrl = undefined;

    try {
      const updatedPublication =
        await this.publicationRepository.save(publication);
      this.logger.log(`Publication image removed successfully for ID: ${id}`);
      return this.findOne(updatedPublication.id);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to remove publication image: ${errorMessage}`,
        errorStack,
      );
      throw new BadRequestException(PUBLICATION_ERROR_MESSAGES.UPDATE_FAILED);
    }
  }

  /**
   * Construye las condiciones WHERE para consultas
   */
  private buildWhereConditions(filters: {
    category?: PublicationCategory;
    status?: PublicationStatus;
    authorId?: string;
    search?: string;
  }): FindOptionsWhere<Publication>[] {
    const conditions: FindOptionsWhere<Publication>[] = [];
    const baseCondition: FindOptionsWhere<Publication> = {};

    if (filters.category) {
      baseCondition.category = filters.category;
    }

    if (filters.status) {
      baseCondition.status = filters.status;
    }

    if (filters.authorId) {
      baseCondition.authorId = filters.authorId;
    }

    if (filters.search) {
      const searchTerm = `%${filters.search}%`;
      conditions.push(
        { ...baseCondition, title: Like(searchTerm) },
        { ...baseCondition, content: Like(searchTerm) },
      );
    } else {
      conditions.push(baseCondition);
    }

    return conditions;
  }
}

