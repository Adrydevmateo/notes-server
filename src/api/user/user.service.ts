import { Injectable } from '@nestjs/common';
import { MongodbService } from 'src/db/mongodb/mongodb.service';

@Injectable()
export class UserService {
    constructor(private mongoService: MongodbService) { }

    CREATE() { }

    READ() {
        this.mongoService.Run()
    }

    UPDATE() { }

    DELETE() { }
}
