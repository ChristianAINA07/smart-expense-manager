import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Atao Global mba tsy ho renderina isaky ny Module
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
