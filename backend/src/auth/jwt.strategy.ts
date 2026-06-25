import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      // Extraire le token Bearer depuis l'en-tête Authorization
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Le point d'exclamation (!) rassure TypeScript que la clé existe dans le .env
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  // Valider le contenu du jeton décodé
  async validate(payload: { sub: string; email: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException("Cet utilisateur n'est plus autorisé.");
    }

    return { id: user.id, email: user.email, businessName: user.businessName };
  }
}
