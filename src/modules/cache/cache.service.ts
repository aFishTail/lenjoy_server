import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisService } from 'nestjs-redis';

@Injectable()
export class CacheService {
  public client: Redis;
  constructor(private redisService: RedisService) {
    this.getClient();
  }
  async getClient() {
    console.log(this.redisService);
    this.client = await this.redisService.getClient();
  }

  //   public async set(key: string)
}
