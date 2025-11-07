import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { CategoriesService } from './categories/categories.service';
import { SubscriptionsService } from './subscriptions/subscriptions.service';
import { PublicationsService } from './publications/publications.service';
import { UserRole } from './users/types/user.enum';
import { PublicationStatus } from './publications/types/publication.enum';
import {
  SubscriptionPlan,
  SubscriptionStatus,
} from './subscriptions/entities/subscription.entity';
import { Category } from './categories/entities/category.entity';

/**
 * Script de seed para poblar la base de datos con datos de prueba
 * Ejecutar con: pnpm run seed
 */
async function bootstrap() {
  console.log('🌱 Iniciando seed de la base de datos...\n');

  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const usersService = app.get(UsersService);
    const categoriesService = app.get(CategoriesService);
    const subscriptionsService = app.get(SubscriptionsService);
    const publicationsService = app.get(PublicationsService);

    // ============================================
    // 1. CREAR USUARIOS
    // ============================================
    console.log('👥 Creando usuarios...');

    // Usuario Admin
    let adminUser;
    try {
      adminUser = await usersService.findByEmail('admin@guanavive.com', false);
      console.log('✅ Usuario Admin ya existe');
    } catch {
      adminUser = await usersService.create({
        email: 'admin@guanavive.com',
        password: 'Admin123!',
        firstName: 'Admin',
        lastName: 'GuanaVive',
        role: UserRole.ADMIN,
        isActive: true,
      });
      console.log('✅ Usuario Admin creado');
    }

    // Usuario Regular
    let regularUser;
    try {
      regularUser = await usersService.findByEmail(
        'usuario@guanavive.com',
        false,
      );
      console.log('✅ Usuario Regular ya existe');
    } catch {
      regularUser = await usersService.create({
        email: 'usuario@guanavive.com',
        password: 'Usuario123!',
        firstName: 'Juan',
        lastName: 'Pérez',
        role: UserRole.USER,
        isActive: true,
      });
      console.log('✅ Usuario Regular creado');
    }

    // Usuario Regular 2
    let regularUser2;
    try {
      regularUser2 = await usersService.findByEmail(
        'maria@guanavive.com',
        false,
      );
      console.log('✅ Usuario Regular 2 ya existe');
    } catch {
      regularUser2 = await usersService.create({
        email: 'maria@guanavive.com',
        password: 'Maria123!',
        firstName: 'María',
        lastName: 'Gómez',
        role: UserRole.USER,
        isActive: true,
      });
      console.log('✅ Usuario Regular 2 creado');
    }

    // ============================================
    // 2. CREAR CATEGORÍAS
    // ============================================
    console.log('\n🏷️  Creando categorías...');

    const categoriesData = [
      {
        name: 'Música',
        description: 'Artistas y grupos musicales tradicionales',
      },
      { name: 'Danza', description: 'Grupos de danza folclórica' },
      { name: 'Arte', description: 'Artistas plásticos y visuales' },
      { name: 'Gastronomía', description: 'Cocina tradicional guanacasteca' },
      { name: 'Artesanía', description: 'Productos artesanales locales' },
      { name: 'Turismo', description: 'Atractivos turísticos de la región' },
    ];

    const categories: Category[] = [];
    for (const catData of categoriesData) {
      try {
        const existing = await categoriesService.findAll({
          page: 1,
          limit: 1,
          search: catData.name,
        });
        if (existing.data.length > 0) {
          categories.push(existing.data[0]);
          console.log(`✅ Categoría "${catData.name}" ya existe`);
        } else {
          const category = await categoriesService.create(catData);
          categories.push(category);
          console.log(`✅ Categoría "${catData.name}" creada`);
        }
      } catch (error: any) {
        console.log(
          `⚠️  Error con categoría "${catData.name}":`,
          error.message,
        );
      }
    }

    // ============================================
    // 3. CREAR SUSCRIPCIONES
    // ============================================
    console.log('\n💳 Creando suscripciones...');

    try {
      await subscriptionsService.create({
        userId: regularUser.id,
        plan: SubscriptionPlan.PREMIUM,
        status: SubscriptionStatus.ACTIVE,
      });
      console.log('✅ Suscripción Premium para usuario regular creada');
    } catch (error) {
      console.log('⚠️  Suscripción ya existe o error:', error.message);
    }

    try {
      await subscriptionsService.create({
        userId: regularUser2.id,
        plan: SubscriptionPlan.BASIC,
        status: SubscriptionStatus.ACTIVE,
      });
      console.log('✅ Suscripción Básica para usuario regular 2 creada');
    } catch (error) {
      console.log('⚠️  Suscripción ya existe o error:', error.message);
    }

    // ============================================
    // 4. CREAR PUBLICACIONES
    // ============================================
    console.log('\n📝 Creando publicaciones...');

    const publicationsData = [
      // MÚSICA
      {
        title: 'Marimba Orquesta Los Golobios - Santa Cruz',
        content:
          'Reconocida agrupación santacruceña que combina la marimba tradicional con orquesta, interpretando melodías populares de la pampa guanacasteca. Con más de 30 años de trayectoria, han representado a Guanacaste en festivales nacionales e internacionales.',
        categoryId: categories.find((c) => c.name === 'Música')?.id,
        status: PublicationStatus.PUBLISHED,
        authorId: adminUser.id,
        imageUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/6e/f5/c1/6ef5c1ab-18ef-857a-2eaa-64872319ae83/198026841780.jpg/600x600bf-60.jpg',
      },
      {
        title: 'Guadalupe Urbina - Cantautora Guanacasteca',
        content:
          'Cantautora guanacasteca con una destacada trayectoria nacional e internacional, promotora del folclor costarricense y la identidad cultural del pueblo. Sus interpretaciones han llevado la música guanacasteca a escenarios de todo el mundo.',
        categoryId: categories.find((c) => c.name === 'Música')?.id,
        status: PublicationStatus.PUBLISHED,
        authorId: regularUser.id,
        imageUrl: 'https://www.teatronacional.go.cr/repositorio/detail/92-5388_imagen3.jpg',
      },
      {
        title: 'Los de la Bajura - Tradición Sabanera',
        content:
          'Grupo folclórico de larga trayectoria, representante de las raíces guanacastecas con un repertorio lleno de humor, historia y música tradicional. Sus presentaciones son un homenaje vivo a la cultura sabanera.',
        categoryId: categories.find((c) => c.name === 'Música')?.id,
        status: PublicationStatus.PUBLISHED,
        authorId: regularUser2.id,
        imageUrl: 'https://cloudfront-us-east-1.images.arcpublishing.com/gruponacion/IJXGQEJZ7FEVTAO3YRGEG7JCMI.jpg',
      },
      {
        title: 'Malpaís - Raíces Guanacastecas',
        content:
          'Grupo costarricense con profundas raíces guanacastecas, reconocido por su mezcla de poesía, trova y ritmos del folclor nacional. Su música refleja la esencia de la cultura costarricense con influencias de la región nicoyanas.',
        categoryId: categories.find((c) => c.name === 'Música')?.id,
        status: PublicationStatus.PENDING_REVIEW,
        authorId: regularUser.id,
        imageUrl: 'https://sicultura-live.s3.amazonaws.com/public/media/malpais.jpg',
      },

      // DANZA
      {
        title: 'Grupo Folklórico Flor de Caña',
        content:
          'Agrupación emblemática de Santa Cruz que rescata las danzas típicas guanacastecas con coreografías llenas de color, energía y tradición sabanera. Sus presentaciones son un espectáculo visual y cultural imperdible que recorre desde el Punto Guanacasteco hasta bailes modernos con raíces tradicionales.',
        categoryId: categories.find((c) => c.name === 'Danza')?.id,
        status: PublicationStatus.PUBLISHED,
        authorId: adminUser.id,
        imageUrl: 'https://guananoticias.com/wp-content/uploads/2022/06/IMG-20220627-WA0038-1000x600.jpg',
      },
      {
        title: 'Taller de Danza Tradicional - Todos Bienvenidos',
        content:
          'Aprende los pasos básicos de nuestras danzas tradicionales guanacastecas. Grupo de danza tradicional que preserva las raíces culturales de Guanacaste a través de coreografías auténticas y vestuarios tradicionales. Cada presentación es un homenaje a nuestros ancestros.',
        categoryId: categories.find((c) => c.name === 'Danza')?.id,
        status: PublicationStatus.PUBLISHED,
        authorId: regularUser2.id,
        imageUrl: 'https://scontent-mia3-1.xx.fbcdn.net/v/t1.6435-9/67421925_2378009295596639_8824664137583026176_n.jpg',
      },

      // ARTESANÍA
      {
        title: 'Maribel Sánchez Grijalba - Cerámica Chorotega',
        content:
          'Artesana de cerámica chorotega que combina técnicas ancestrales con diseños contemporáneos, preservando la tradición de su comunidad en Nicoya. Sus piezas son obras de arte que cuentan historias milenarias, utilizando el barro y los colores naturales de la región.',
        categoryId: categories.find((c) => c.name === 'Artesanía')?.id,
        status: PublicationStatus.PUBLISHED,
        authorId: regularUser.id,
        imageUrl: 'https://www.ecotranscostarica.com/wp-content/uploads/2016/04/Ecotrans-Im%C3%A1genes-Tours-400x300-05.png',
      },
      {
        title: 'Cerámica Tradicional Guanacasteca',
        content:
          'Artesano especializado en cerámica tradicional guanacasteca. Creaciones que reflejan la identidad cultural de la región con técnicas transmitidas de generación en generación. Cada pieza es única y cuenta una historia de nuestra tierra.',
        categoryId: categories.find((c) => c.name === 'Artesanía')?.id,
        status: PublicationStatus.PUBLISHED,
        authorId: adminUser.id,
        imageUrl: 'https://semanariouniversidad.com/wp-content/uploads/C09-Cer%C3%A1mica-1.jpg',
      },
      {
        title: 'Don Gilberto Duarte - Talabartero Tradicional',
        content:
          'Talabartero experimentado que fabrica monturas, cinturones y accesorios de cuero inspirados en la vida de la hacienda y las tradiciones sabaneras de Bagaces. Cada pieza es única y hecha a mano con técnicas que se remontan a la época de las grandes haciendas ganaderas.',
        categoryId: categories.find((c) => c.name === 'Artesanía')?.id,
        status: PublicationStatus.DRAFT,
        authorId: regularUser2.id,
        imageUrl: 'https://vozdeguanacaste.com/wp-content/uploads/2018/01/004.jpg',
      },

      // GASTRONOMÍA
      {
        title: 'Recetas Tradicionales Guanacastecas',
        content:
          'Compartimos las recetas más auténticas de la cocina guanacasteca: desde el tradicional gallo pinto hasta los tamales asados, rosquillas, cuajadas y el chorreado. Sabores que nos conectan con nuestras raíces y la tradición culinaria de nuestras abuelas.',
        categoryId: categories.find((c) => c.name === 'Gastronomía')?.id,
        status: PublicationStatus.PUBLISHED,
        authorId: adminUser.id,
        imageUrl: 'https://www.nacion.com/resizer/v2/CQBHQ5ZYOFGBVP3QT4ASZX7EIA.jpg?auth=0f1b21f8f9b7a8a6c5d4e3f2a1b0c9d8e7f6a5b4&width=1440',
      },
      {
        title: 'Cocina de Fogón - Tradición Familiar',
        content:
          'La cocina de fogón es parte integral de nuestra identidad guanacasteca. Recetas preparadas como lo hacían nuestras abuelas, con amor y tradición. El olor del humo de leña y el sabor inigualable de los alimentos cocidos lentamente en cazuelas de barro.',
        categoryId: categories.find((c) => c.name === 'Gastronomía')?.id,
        status: PublicationStatus.PENDING_REVIEW,
        authorId: regularUser.id,
        imageUrl: 'https://www.nacion.com/resizer/v2/TRADITIONAL-KITCHEN-GUANACASTE.jpg?auth=abc123&width=1200',
      },

      // ARTE
      {
        title: 'Exposición de Arte Local - Santa Cruz',
        content:
          'Galería de obras de artistas locales que plasman la belleza y cultura de Guanacaste. Pinturas, esculturas y fotografías que cuentan nuestra historia, desde las haciendas sabaneras hasta la modernidad urbana. Entrada libre todos los fines de semana.',
        categoryId: categories.find((c) => c.name === 'Arte')?.id,
        status: PublicationStatus.PUBLISHED,
        authorId: regularUser2.id,
        imageUrl: 'https://www.nacion.com/resizer/v2/ART-EXHIBITION-GUANACASTE.jpg?auth=xyz789&width=1200',
      },
      {
        title: 'Carlos Leitón - Retahílero Nicoyano',
        content:
          'Reconocido retahílero nicoyano con un estilo jocoso y espontáneo, mezcla humor y sabiduría popular en cada verso improvisado. Sus presentaciones son un espectáculo de ingenio y cultura que mantiene viva la tradición oral guanacasteca.',
        categoryId: categories.find((c) => c.name === 'Arte')?.id,
        status: PublicationStatus.PUBLISHED,
        authorId: regularUser.id,
        imageUrl: 'https://directoriobombasyretahilas.wordpress.com/wp-content/uploads/2021/10/carlos.jpg',
      },
      {
        title: 'Jorge Debravo - Poeta del Pueblo',
        content:
          'Poeta guanacasteco que con sus versos retrata la vida cotidiana, las luchas y alegrías del pueblo. Su legado literario es parte fundamental de nuestra identidad cultural. Sus poemas son recitados en escuelas y festivales culturales de toda la región.',
        categoryId: categories.find((c) => c.name === 'Arte')?.id,
        status: PublicationStatus.DRAFT,
        authorId: regularUser2.id,
        imageUrl: 'https://www.nacion.com/resizer/v2/UDVRNJYEAZBP7N2KDYSCIB6V6I.jpg?auth=c217e2b40a63a91766070523f68c292a9296cbbe6172eb0fb7ad2448173723d4&width=1440',
      },

      // TURISMO
      {
        title: 'Hacienda La Pinta - Turismo Cultural',
        content:
          'Antigua finca ganadera de Santa Cruz que conserva la arquitectura y las costumbres rurales de la sabana guanacasteca. Actualmente promueve el turismo cultural y ecológico, ofreciendo recorridos por sus instalaciones históricas y experiencias de vida sabanera.',
        categoryId: categories.find((c) => c.name === 'Turismo')?.id,
        status: PublicationStatus.PUBLISHED,
        authorId: adminUser.id,
        imageUrl: 'https://sicultura-live.s3.amazonaws.com/public/media/68811416_641621039682343_7819470398864490496_n.jpg',
      },
      {
        title: 'Fiestas Típicas Nacionales de Santa Cruz',
        content:
          'La celebración más representativa de Guanacaste, declarada de interés cultural nacional. Reúne música, danza, corridas de toros y gastronomía tradicional en honor al Santo Cristo de Esquipulas. Una semana completa de celebración que atrae a miles de visitantes cada año.',
        categoryId: categories.find((c) => c.name === 'Turismo')?.id,
        status: PublicationStatus.PUBLISHED,
        authorId: regularUser.id,
        imageUrl: 'https://www.periodicomensaje.com/images/B1B1B2.jpg',
      },
      {
        title: 'La Lagarteada - Tradición Santacruceña',
        content:
          'Una de las tradiciones más antiguas y emblemáticas de Santa Cruz. Evento cultural que atrae visitantes de todo el país para presenciar esta celebración única que combina historia, valentía y respeto por nuestras tradiciones ancestrales.',
        categoryId: categories.find((c) => c.name === 'Turismo')?.id,
        status: PublicationStatus.PENDING_REVIEW,
        authorId: regularUser2.id,
        imageUrl: 'https://guananoticias.com/wp-content/uploads/2024/01/lagarteada-festividad.jpg',
      },
      {
        title: 'Recorrido por Nicoya - Cuna de la Cultura Chorotega',
        content:
          'Descubre Nicoya, la ciudad colonial más antigua de Costa Rica y cuna de la cultura chorotega. Historia, tradición y belleza arquitectónica en cada rincón. Su iglesia colonial es Patrimonio Nacional y testimonio vivo de nuestra historia.',
        categoryId: categories.find((c) => c.name === 'Turismo')?.id,
        status: PublicationStatus.PUBLISHED,
        authorId: adminUser.id,
        imageUrl: 'https://www.visitcentroamerica.com/wp-content/uploads/2019/05/nicoya-church-colonial.jpg',
      },
      {
        title: 'Festival de Bombas y Retahílas - Patrimonio Cultural',
        content:
          'Celebración anual que reúne a los mejores retahíleros de la provincia. Un evento lleno de ingenio, humor y tradición oral que mantiene viva nuestra cultura. Las bombas y retahílas son expresiones únicas del folclor guanacasteco, llenas de picardía y sabiduría popular.',
        categoryId: categories.find((c) => c.name === 'Turismo')?.id,
        status: PublicationStatus.PUBLISHED,
        authorId: regularUser.id,
        imageUrl: 'https://guananoticias.com/wp-content/uploads/2023/07/festival-retahilas-cultura.jpg',
      },
    ];

    for (const pubData of publicationsData) {
      try {
        await publicationsService.create(pubData, pubData.authorId);
        console.log(`✅ Publicación "${pubData.title}" creada`);
      } catch (error) {
        console.log(
          `⚠️  Error con publicación "${pubData.title}":`,
          error.message,
        );
      }
    }

    // ============================================
    // MOSTRAR CREDENCIALES
    // ============================================
    console.log('\n' + '='.repeat(60));
    console.log('🎉 SEED COMPLETADO EXITOSAMENTE');
    console.log('='.repeat(60));
    console.log('\n📋 CREDENCIALES DE ACCESO:\n');
    console.log('👤 USUARIO ADMINISTRADOR:');
    console.log('   Email:    admin@guanavive.com');
    console.log('   Password: Admin123!');
    console.log('   Rol:      admin\n');
    console.log('👤 USUARIO REGULAR 1:');
    console.log('   Email:    usuario@guanavive.com');
    console.log('   Password: Usuario123!');
    console.log('   Rol:      user');
    console.log('   Plan:     Premium\n');
    console.log('👤 USUARIO REGULAR 2:');
    console.log('   Email:    maria@guanavive.com');
    console.log('   Password: Maria123!');
    console.log('   Rol:      user');
    console.log('   Plan:     Básico\n');
    console.log('='.repeat(60));
    console.log('\n✅ Puedes usar estos usuarios para probar el frontend\n');
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  } finally {
    await app.close();
  }
}

bootstrap()
  .then(() => {
    console.log('✨ Proceso completado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  });
