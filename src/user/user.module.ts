import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserProviders } from './user.providers';

import { RedisCacheService } from '@/common/cache/redis-cache.service';

import { DatabaseModule } from '@/common/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [...UserProviders, UserService, RedisCacheService],
  exports: [UserService],
})
export class UserModule {}
