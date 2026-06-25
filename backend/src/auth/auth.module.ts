import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy'; // Importation de notre stratégie

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' }, // Le jeton expire après 7 jours
    }),
  ],
  providers: [AuthService, JwtStrategy], // Ajout de JwtStrategy dans les providers
  controllers: [AuthController],
})
export class AuthModule {}
