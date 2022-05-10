import { Module } from '@nestjs/common';
import { UserFavoriteService } from './user-favorite.service';
import { UserFavoriteController } from './user-favorite.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserFavorite } from './entities/user-favorite.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserFavorite])],
  controllers: [UserFavoriteController],
  providers: [UserFavoriteService],
})
export class UserFavoriteModule {}
