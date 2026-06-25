import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { PrismaModule } from '../prisma/prisma.module'; // 1. Nampiana ity mba hifandraisana amin'ny DB

@Module({
  imports: [PrismaModule], // 2. Tsy maintsy ampidirina eto ny PrismaModule
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
