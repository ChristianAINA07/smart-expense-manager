import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // 1. Inscription d'un nouvel utilisateur (Register)
  async register(data: any) {
    const { email, password, businessName } = data;

    // Vérifier si l'adresse email existe déjà dans la base de données
    const userExists = await this.prisma.user.findUnique({ where: { email } });
    if (userExists) {
      throw new ConflictException('Cet email est déjà utilisé !');
    }

    // Hacher le mot de passe pour des raisons de sécurité
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer le nouvel utilisateur dans la base de données
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        businessName,
      },
    });

    // Générer et retourner le jeton JWT immédiatement après l'inscription
    return this.generateToken(user.id, user.email);
  }

  // 2. Connexion d'un utilisateur existant (Login)
  async login(data: any) {
    const { email, password } = data;

    // Rechercher l'utilisateur par son adresse email
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect !');
    }

    // Comparer le mot de passe saisi avec le mot de passe haché stocké
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect !');
    }

    // Générer et retourner le jeton JWT si les identifiants sont valides
    return this.generateToken(user.id, user.email);
  }

  // Fonction utilitaire pour générer le token JWT
  private generateToken(userId: string, email: string) {
    const payload = { sub: userId, email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
