import { Injectable } from '@nestjs/common';
import { MongodbService } from 'src/db/mongodb/mongodb.service';
import { TUserCRUDResponse, TUserDTO } from './user.interface';

@Injectable()
export class UserService {
	constructor(private mongoService: MongodbService) { }

	async CreateUser(user: TUserDTO): Promise<TUserCRUDResponse> {
		const valid = await this.ValidateCreateUser(user)
		if (!valid.OK) return { msg: valid.msg, OK: false }
		const created = await this.mongoService.CREATE_USER({
			username: user.username,
			password: user.password
		})
		if (!created.acknowledged) return { msg: '[Invalid Operation]: could not create user', OK: false }
		return { msg: 'User created successfully', OK: true }
	}

	private async ValidateCreateUser(user: TUserDTO): Promise<TUserCRUDResponse> {
		if (!user.username) return { msg: '[Missing Field]: username was not provided', OK: false }
		if (typeof user.username !== 'string') return { msg: '[Invalid Type]: username is not a string', OK: false }

		if (!user.password) return { msg: '[Missing Field]: password was not provided', OK: false }
		if (typeof user.password !== 'string') return { msg: '[Invalid Type]: password is not a string', OK: false }

		const found: TUserCRUDResponse = await this.FindUserByName(user.username)
		if (found.OK) return { msg: '[Invalid Operation]: user already exist', OK: false }

		return { msg: 'User is valid', OK: true }
	}

	async FindUsers(): Promise<Array<TUserDTO>> {
		const users: Array<TUserDTO> = await this.mongoService.READ_USERS()
		return users
	}

	private async FindUserById(id: string): Promise<TUserCRUDResponse> {
		const found: TUserDTO | null = await this.mongoService.READ_USER_BY_ID(id)
		if (found === null) return { msg: '[Not Found]: user could not be found', OK: false }
		if (found !== null) return { msg: 'User has been found', OK: true, data: found }
	}

	private async FindUserByName(username: string): Promise<TUserCRUDResponse> {
		const found: TUserDTO | null = await this.mongoService.READ_USER_BY_NAME(username)
		if (found === null) return { msg: '[Not Found]: user could not be found', OK: false }
		if (found !== null) return { msg: 'User has been found', OK: true, data: found }
	}

	async UpdateUser(user: TUserDTO): Promise<TUserCRUDResponse> {
		const valid = await this.ValidateUpdateUser(user)
		if (!valid.OK) return { msg: valid.msg, OK: false }
		const created = await this.mongoService.UPDATE_USER({
			id: user.id,
			username: user.username ?? valid.data.username,
			password: user.password ?? valid.data.password
		})
		if (!created.acknowledged) return { msg: '[Invalid Operation]: could not update the user', OK: false }
		return { msg: 'User updated successfully', OK: true }
	}

	private async ValidateUpdateUser(user: TUserDTO): Promise<TUserCRUDResponse> {
		if (!user.id) return { msg: '[Invalid Type]: user id was not provided', OK: false }
		if (typeof user.id !== 'string') return { msg: '[Invalid Type]: user id is not a string', OK: false }
		if (user.username && typeof user.username !== 'string') return { msg: '[Invalid Type]: username is not a string', OK: false }
		if (user.password && typeof user.password !== 'string') return { msg: '[Invalid Type]: password is not a string', OK: false }
		if (!user.username && !user.password) return { msg: '[Invalid Operation]: nothing to update - data was not provided', OK: false }

		const foundById: TUserCRUDResponse = await this.FindUserById(user.id)
		if (!foundById.OK) return { msg: '[Invalid Operation]: user was not found', OK: false }

		const foundByName: TUserCRUDResponse = await this.FindUserByName(user.username)
		if (foundByName.OK) return { msg: '[Invalid Username]: username already taken', OK: false }

		return { msg: 'User is valid', OK: true, data: foundById.data }
	}

	async DeleteUser(id: string): Promise<TUserCRUDResponse> {
		const { deletedUser, deletedNote } = await this.mongoService.DELETE_USER(id)
		if (!deletedUser.acknowledged) return { msg: '[Invalid Operation]: could not delete user', OK: false }
		if (!deletedNote.acknowledged) return { msg: '[Invalid Operation]: could not delete the notes owned by the user', OK: false }
		return { msg: 'User deleted successfully', OK: true }
	}
}
