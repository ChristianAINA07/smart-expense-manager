import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Route pour l'inscription : POST /auth/register
  @Post('register')
  async register(@Body() body: any) {
    return this.authService.register(body);
  }

  // Route pour la connexion : POST /auth/login
  @Post('login')
  async login(@Body() body: any) {
    return this.authService.login(body);
  }
}
