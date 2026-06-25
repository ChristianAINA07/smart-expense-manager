import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(userId: string) {
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // Mois actuel (1-12)
    const currentYear = now.getFullYear();

    // 1. Récupérer toutes les transactions de l'année en cours pour l'évolution
    const transactionsAnnuel = await this.prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: new Date(`${currentYear}-01-01`),
          lte: new Date(),
        },
      },
    });

    // Filtrer pour obtenir uniquement les transactions du mois en cours
    const transactionsMois = transactionsAnnuel.filter(t => {
      const d = new Date(t.date);
      return (d.getMonth() + 1) === currentMonth;
    });

    let totalRevenus = 0;
    let totalDepenses = 0;

    // Calculer les totaux pour les cartes KPI du mois
    transactionsMois.forEach((t) => {
      if (t.type === 'REVENU') totalRevenus += t.amount;
      if (t.type === 'DEPENSE') totalDepenses += t.amount;
    });

    const profit = totalRevenus - totalDepenses;

    // 2. Préparer les données du Pie Chart (Dépenses groupées par catégorie)
    const categoriesMap: { [key: string]: number } = {};
    transactionsMois.filter(t => t.type === 'DEPENSE').forEach(t => {
      categoriesMap[t.category] = (categoriesMap[t.category] || 0) + t.amount;
    });

    const pieData = Object.keys(categoriesMap).map(cat => ({
      name: cat.toUpperCase(),
      value: categoriesMap[cat],
    }));

    // 3. Préparer les données du Bar Chart (Évolution mensuelle Revenus vs Dépenses)
    const moisNoms = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'];
    const barData = moisNoms.map((nom, index) => {
      const moisTransactions = transactionsAnnuel.filter(t => new Date(t.date).getMonth() === index);
      const rev = moisTransactions.filter(t => t.type === 'REVENU').reduce((sum, t) => sum + t.amount, 0);
      const dep = moisTransactions.filter(t => t.type === 'DEPENSE').reduce((sum, t) => sum + t.amount, 0);
      return { name: nom, Revenus: rev, Depenses: dep };
    });

    // 4. Moteur de Business Insights (Génération automatique des alertes)
    const insights: string[] = [];
    if (totalDepenses > totalRevenus && totalRevenus > 0) {
      insights.push("Attention : Vos dépenses dépassent vos revenus ce mois-ci.");
    }

    // Récupérer les budgets définis pour le mois en cours
    const budgets = await this.prisma.budget.findMany({
      where: { userId, month: currentMonth, year: currentYear },
    });

    // Vérifier les seuils de budget par catégorie
    for (const budget of budgets) {
      const depensesCategorie = transactionsMois
        .filter((t) => t.type === 'DEPENSE' && t.category.toLowerCase() === budget.category.toLowerCase())
        .reduce((sum, t) => sum + t.amount, 0);

      const pourcentage = (depensesCategorie / budget.amount) * 100;
      if (pourcentage >= 90 && pourcentage < 100) {
        insights.push(`Attention : Vous avez épuisé ${pourcentage.toFixed(0)}% de votre budget pour la catégorie "${budget.category}".`);
      } else if (pourcentage >= 100) {
        insights.push(`Alerte : Le budget pour la catégorie "${budget.category}" a été dépassé !`);
      }
    }

    if (insights.length === 0) {
      insights.push("Votre situation financière est stable pour le moment.");
    }

    return { totalRevenus, totalDepenses, profit, insights, pieData, barData };
  }
}
