import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BudgetService {
  constructor(private prisma: PrismaService) {}

  // 1. Définir ou mettre à jour un budget pour une catégorie
  async upsertBudget(userId: string, data: any) {
    const month = parseInt(data.month);
    const year = parseInt(data.year);
    const amount = parseFloat(data.amount);
    const category = data.category.toLowerCase();

    // Utilisation de upsert : si le budget existe, il le modifie. Sinon, il le crée.
    return this.prisma.budget.upsert({
      where: {
        userId_category_month_year: {
          userId,
          category,
          month,
          year,
        },
      },
      update: {
        amount,
      },
      create: {
        userId,
        category,
        amount,
        month,
        year,
      },
    });
  }

  // 2. Récupérer tous les budgets d'un utilisateur pour un mois précis
  async getBudgetsByMonth(userId: string, month: number, year: number) {
    return this.prisma.budget.findMany({
      where: {
        userId,
        month,
        year,
      },
    });
  }
}
