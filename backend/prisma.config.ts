import 'dotenv/config';
import { defineConfig, env } from 'prisma/config'; // Importation correcte pour Prisma v7

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'), // Configuration de l'URL de la base de données
  },
});
