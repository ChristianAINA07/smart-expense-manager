import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TransactionModule } from './transaction/transaction.module';
import { DashboardModule } from './dashboard/dashboard.module'; // Importation manuelle
import { BudgetModule } from './budget/budget.module';

@Module({
  imports: [
    PrismaModule, 
    AuthModule, 
    TransactionModule, 
    DashboardModule, // Ilay namboarinao teo no ampidirina eto
    BudgetModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
