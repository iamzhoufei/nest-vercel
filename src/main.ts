import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import {
  ValidationPipe,
  VersioningType,
  VERSION_NEUTRAL,
} from '@nestjs/common';

import { NestFactory } from '@nestjs/core';

import fastify from 'fastify';
import fastifyCookie from '@fastify/cookie';

// import split = require('split2');

// 拦截器
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor';

// 异常处理
import { AllExceptionsFilter } from '@/common/exceptions/base.exception.filter';
import { HttpExceptionFilter } from '@/common/exceptions/http.exception.filter';

// 日志服务
import { FastifyLogger } from '@/common/logger';

// 文档服务
import { generateDocument } from '@/doc';

// 根模块
import { AppModule } from '@/app.module';

// declare const module: any;

async function bootstrap() {
  // const stream = split(JSON.parse);

  const fastifyInstance = fastify({
    logger: FastifyLogger,
  });

  // 使用 fastify 作为底层框架
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(fastifyInstance as any),
  );

  // 增加请求版本控制
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: [VERSION_NEUTRAL, '1', '2'],
  });

  app.register(fastifyCookie, {
    secret: 'my-secret', // for cookies signature
  });

  // 增加全局拦截器
  app.useGlobalInterceptors(new TransformInterceptor());

  // 增加全局异常处理
  app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());

  // 启动全局字段校验，保证请求接口字段校验正确
  app.useGlobalPipes(new ValidationPipe());

  // 创建文档
  generateDocument(app);

  // 添加热更新
  // if (module.hot) {
  //   module.hot.accept();
  //   module.hot.dispose(() => app.close());
  // }

  // 开始监听端口
  console.log(
    `=========process.env.PORT=======${
      process.env.PORT || 'default is 8080'
    }==========`,
  );
  await app.listen(
    process.env.PORT || '8080',
    (err: Error, address: string) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`server success at: ${address}`);
      }
    },
  );
}

bootstrap();
