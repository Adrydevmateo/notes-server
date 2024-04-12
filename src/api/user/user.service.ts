import { Injectable } from '@nestjs/common';
import { MongodbService } from 'src/db/mongodb/mongodb.service';
import { IUser, TCreateUserDTO, TUserFound, TCRUDResponse } from './user.interface';

@Injectable()
export class UserService {
	constructor(private mongoService: MongodbService) { }

	async CREATE(u: TCreateUserDTO): Promise<TCRUDResponse> {
		const v = await this.ValidateCreateUser(u)
		if (!v.OK) return { msg: v.msg, OK: false }
		if (!u.notes) u.notes = []
		const rs = await this.mongoService.CREATE(u)
		if (rs.acknowledged) return { msg: 'User Created Successfully', OK: true }
		if (!rs.acknowledged) return { msg: 'Could Not Create User', OK: false }
	}

	private async ValidateCreateUser(u: TCreateUserDTO): Promise<TCRUDResponse> {
		if (typeof u.username !== 'string') return { msg: 'Username Is Not a String', OK: false }
		const rs: TUserFound | null = await this.mongoService.READ_BY_USER_NAME(u.username)
		if (rs !== null) return { msg: 'User Already Exist', OK: false }
		if (typeof u.password !== 'string') return { msg: 'Password Is Not a String', OK: false }
		if (u.notes && !Array.isArray(u.notes)) return { msg: 'Notes Is Not a Collection Of Notes', OK: false }
		if (u.notes) {
			for (const n of u.notes) {
				if (typeof n.id !== 'string') return { msg: 'ID Is Not a String', OK: false }
				if (typeof n.title !== 'string') return { msg: 'Title Is Not a String', OK: false }
				if (typeof n.description !== 'string') return { msg: 'Description Is Not a String', OK: false }
				if (typeof n.content !== 'string') return { msg: 'Content Is Not a String', OK: false }
			}
		}
		return { msg: 'User Not Found', OK: true }
	}

	async READ() {
		const rs: Array<IUser> = await this.mongoService.READ()
		return rs
	}

	async ValidateUser(n: string, p: string): Promise<TCRUDResponse> {
		const rs: TUserFound | null = await this.mongoService.READ_BY_USER_NAME(n)
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
