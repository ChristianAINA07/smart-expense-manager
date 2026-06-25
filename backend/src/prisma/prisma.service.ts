import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // 1. Créer un pool de connexions PostgreSQL natif
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    // 2. Instancier l'adaptateur requis pour Prisma v7
    const adapter = new PrismaPg(pool);

    // 3. Passer l'adaptateur au constructeur de la classe parente
    super({ adapter });
  }

  // Connexion à la base de données au démarrage de l'application
  async onModuleInit() {
    await this.$connect();
  }

  // Déconnexion propre à la fermeture de l'application
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
