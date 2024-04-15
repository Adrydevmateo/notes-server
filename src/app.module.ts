import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './api/user/user.service';
import { UserController } from './api/user/user.controller';
import { MongodbService } from './db/mongodb/mongodb.service';
import { NoteService } from './api/note/note.service';
import { NoteController } from './api/note/note.controller';

@Module({
  imports: [
    ConfigModule.forRoot()
  ],
  controllers: [AppController, UserController, NoteController],
  providers: [AppService, UserService, MongodbService, NoteService],
})
export class AppModule { }
