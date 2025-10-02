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
import { Publication } from './entities/publication.entity';
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
      const publicationEntity = this.publicationRepository.create({
        ...createPublicationDto,
        authorId,
        status: createPublicationDto.status || PublicationStatus.DRAFT,
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
  ): Promise<Publication> {
    this.logger.log(`Updating publication with ID: ${id}`);

    const publication = await this.findOne(id);

    // Verificar que el usuario sea el autor
    if (!publication.isAuthor(userId)) {
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
  async remove(id: string, userId: string): Promise<void> {
    this.logger.log(`Removing publication with ID: ${id}`);

    const publication = await this.findOne(id);

    // Verificar que el usuario sea el autor
    if (!publication.isAuthor(userId)) {
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

