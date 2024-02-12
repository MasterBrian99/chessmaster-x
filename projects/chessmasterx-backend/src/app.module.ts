import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'nestjs-prisma';
import { AuthenticationModule } from './authentication/authentication.module';

@Module({
  imports: [PrismaModule.forRootAsync({
    isGlobal: true,
    useFactory: () => ({
      prismaOptions: {
        log: ['info', 'query'],
      },
      explicitConnect: false,
    }),
  }), AuthenticationModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
