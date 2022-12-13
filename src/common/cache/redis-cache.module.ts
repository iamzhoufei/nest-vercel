import { getConfig } from '@/utils';
import { Module, CacheModule } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-store';
import { RedisCacheService } from './redis-cache.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        return {
          store: redisStore as any,
          url: getConfig('REDIS_CONFIG').url,
          // host: getConfig('REDIS_CONFIG').host,
          // port: getConfig('REDIS_CONFIG').port,
          db: getConfig('REDIS_CONFIG').db, //目标库,
          // user: getConfig('REDIS_CONFIG').user,
          // auth_pass: getConfig('REDIS_CONFIG').auth, // 密码,没有可以不写
        };
      },
    }),
  ],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class RedisCacheModule {}
