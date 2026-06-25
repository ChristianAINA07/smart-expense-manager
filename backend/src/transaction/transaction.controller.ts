import { Controller, Post, Get, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('transactions')
@UseGuards(JwtAuthGuard) // Sécurise automatiquement toutes les routes de ce contrôleur
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  // Route pour ajouter : POST /transactions
  @Post()
  async create(@Request() req: any, @Body() body: any) {
    // req.user est injecté automatiquement par la stratégie JWT Passport
    return this.transactionService.create(req.user.id, body);
  }

  // Route pour l'historique et recherche : GET /transactions?search=internet
  @Get()
  async findAll(@Request() req: any, @Query('search') search: string) {
    return this.transactionService.findAll(req.user.id, search);
  }

  // Route pour modifier : PUT /transactions/:id
  @Put(':id')
  async update(@Param('id') id: string, @Request() req: any, @Body() body: any) {
    return this.transactionService.update(id, req.user.id, body);
  }

  // Route pour supprimer : DELETE /transactions/:id
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    return this.transactionService.remove(id, req.user.id);
  }
}
