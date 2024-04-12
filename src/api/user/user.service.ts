import { Injectable } from '@nestjs/common';
import { MongodbService } from 'src/db/mongodb/mongodb.service';
import { IUser, TUserFound, TValidateUser } from './user.interface';

@Injectable()
export class UserService {
	constructor(private mongoService: MongodbService) { }

	CREATE() {
		this.mongoService.CREATE()
	}

	async READ() {
		const rs: Array<IUser> = await this.mongoService.READ()
		return rs
	}

	async ValidateUser(e: string, p: string): Promise<TValidateUser> {
		const rs: TUserFound | null = await this.mongoService.READ_BY_NAME(e)
		if (rs === null) return { msg: "User Not Found", OK: false }
		if (rs.password === p)
			return { data: rs, OK: true }
		else
			return { msg: 'Incorrect Password', OK: false }
	}

	UPDATE() {
		this.mongoService.UPDATE()
	}

	DELETE() {
		this.mongoService.DELETE()
	}
}
