import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/modules/auth/jwt.strategy';
import { CacheModule } from 'src/modules/cache/cache.module';
import { CaptchaModule } from 'src/modules/captcha/captcha.module';
import { UserModule } from 'src/modules/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

const passModule = PassportModule.register({ defaultStrategy: 'jwt' });

// const jwtModule = JwtModule.register({
//   secret: 'lenjoy66',
//   signOptions: { expiresIn: '7d' },
// });

@Global()
@Module({
  imports: [
    UserModule,
    passModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwtSecret'),
      }),
      inject: [ConfigService],
    }),
    CacheModule,
    CaptchaModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [passModule, JwtModule],
})
export class AuthModule {}
