import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  // 1. Ajouter un revenu ou une dépense
  async create(userId: string, data: any) {
    return this.prisma.transaction.create({
      data: {
        userId,
        type: data.type, // REVENU ou DEPENSE
        amount: parseFloat(data.amount),
        category: data.category,
        description: data.description,
        date: data.date ? new Date(data.date) : new Date(),
      },
    });
  }

  // 2. Récupérer toutes les transactions d'un utilisateur (avec recherche)
  async findAll(userId: string, search?: string) {
    return this.prisma.transaction.findMany({
      where: {
        userId,
        OR: search
          ? [
              { category: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ]
          : undefined,
      },
      orderBy: { date: 'desc' }, // Séquence chronologique inverse
    });
  }

  // 3. Modifier une transaction existante
  async update(id: string, userId: string, data: any) {
    const transaction = await this.prisma.transaction.findFirst({
      where: { id, userId },
    });

    if (!transaction) {
      throw new NotFoundException("Transaction introuvable ou non autorisée.");
    }

    return this.prisma.transaction.update({
      where: { id },
      data: {
        amount: data.amount ? parseFloat(data.amount) : undefined,
        category: data.category,
        description: data.description,
        date: data.date ? new Date(data.date) : undefined,
      },
    });
  }

  // 4. Supprimer une transaction
  async remove(id: string, userId: string) {
    const transaction = await this.prisma.transaction.findFirst({
      where: { id, userId },
    });

    if (!transaction) {
      throw new NotFoundException("Transaction introuvable ou non autorisée.");
    }

    return this.prisma.transaction.delete({ where: { id } });
  }
}
