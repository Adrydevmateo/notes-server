import { Injectable } from '@nestjs/common';
import { MongodbService } from 'src/db/mongodb/mongodb.service';
import { IUser } from './user.interface';

@Injectable()
export class UserService {
    constructor(private mongoService: MongodbService) { }

    CREATE() { }

    async READ() {
        const rs: Array<IUser> = await this.mongoService.READ()
        for (const r of rs) {
            console.dir(r.notes)
        }
        return rs[0].notes[2].content
    }

    UPDATE() { }

    DELETE() { }
}
