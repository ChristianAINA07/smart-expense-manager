import { Controller, Post, Get, Body, Query, UseGuards, Request } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('budgets')
@UseGuards(JwtAuthGuard) // Sécurisation globale par JWT Token
export class BudgetController {
  constructor(private budgetService: BudgetService) {}

  // Route pour définir/modifier un budget : POST /budgets
  @Post()
  async upsertBudget(@Request() req: any, @Body() body: any) {
    return this.budgetService.upsertBudget(req.user.id, body);
  }

  // Route pour récupérer les budgets : GET /budgets?month=6&year=2026
  @Get()
  async getBudgets(
    @Request() req: any,
    @Query('month') month: string,
    @Query('year') year: string,
  ) {
    const currentMonth = month ? parseInt(month) : new Date().getMonth() + 1;
    const currentYear = year ? parseInt(year) : new Date().getFullYear();
    
    return this.budgetService.getBudgetsByMonth(req.user.id, currentMonth, currentYear);
  }
}
