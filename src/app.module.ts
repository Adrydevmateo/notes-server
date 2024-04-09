import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './api/user/user.service';
import { UserController } from './api/user/user.controller';

@Module({
  imports: [],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule { }
