import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './api/user/user.service';
import { UserController } from './api/user/user.controller';
import { MongodbService } from './db/mongodb/mongodb.service';

@Module({
  imports: [
    ConfigModule.forRoot()
  ],
  controllers: [AppController, UserController],
  providers: [AppService, UserService, MongodbService],
})
export class AppModule { }
