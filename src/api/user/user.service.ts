import { Injectable } from '@nestjs/common';
import { MongodbService } from 'src/db/mongodb/mongodb.service';
import { IUser, TUserCRUDResponse, TUserDTO } from './user.interface';

@Injectable()
export class UserService {
	constructor(private mongoService: MongodbService) { }

	async CREATE(u: TUserDTO): Promise<TUserCRUDResponse> {
		const v = await this.ValidateCreateUser(u)
		if (!v.OK) return { msg: v.msg, OK: false }
		const rs = await this.mongoService.CREATE(u)
		if (rs.acknowledged) return { msg: 'User Created Successfully', OK: true }
		if (!rs.acknowledged) return { msg: 'Could Not Create User', OK: false }
	}

	private async ValidateCreateUser(u: TUserDTO): Promise<TUserCRUDResponse> {
		if (typeof u.username !== 'string') return { msg: 'Username Is Not a String', OK: false }
		const rs: TUserDTO | null = await this.mongoService.READ_BY_USER_NAME(u.username)
		if (rs !== null) return { msg: 'User Already Exist', OK: false }
		if (typeof u.password !== 'string') return { msg: 'Password Is Not a String', OK: false }
		return { msg: 'User Is Valid', OK: true }
	}

	async FindUsers() {
		const users: Array<TUserDTO> = await this.mongoService.READ_USERS()
		return users
	}

	async ValidateSignInUser(n: string, p: string): Promise<TUserCRUDResponse> {
		const rs: TUserDTO | null = await this.mongoService.READ_BY_USER_NAME(n)
		if (rs === null) return { msg: "User Not Found", OK: false }
		if (rs.password === p)
			return { data: rs, OK: true }
		else
			return { msg: 'Incorrect Password', OK: false }
	}

	// async UPDATE(u: TUserDTO): Promise<TUserCRUDResponse> {
	// 	if (!u.id) return { msg: 'ID Was Not Provided', OK: false }
	// 	const v = await this.ValidateUpdateUser(u)
	// 	if (!v.OK) return { msg: v.msg, OK: false }
	// 	if (!u.password) u.password = v.data.password
	// 	if (!u.username) u.username = v.data.username
	// 	const rs = await this.mongoService.UPDATE(u)
	// 	if (rs.acknowledged) return { msg: 'User Data Updated Successfully', OK: true }
	// 	if (!rs.acknowledged) return { msg: 'Could Not Update User Data', OK: false }
	// }

	// private async ValidateUpdateUser(u: TUserDTO): Promise<TUserCRUDResponse> {
	// 	if (u.username && typeof u.username !== 'string') return { msg: 'Username Is Not a String', OK: false }
	// 	const rs: TUserDTO | null = await this.mongoService.READ_BY_USER_ID(u.id)
	// 	if (rs === null) return { msg: 'User Not Found', OK: false }
	// 	if (u.password && typeof u.password !== 'string') return { msg: 'Password Is Not a String', OK: false }
	// 	if (u.note && typeof u.note.id !== 'string') return { msg: 'Note ID Is Not a string', OK: false }
	// 	if (u.note && typeof u.note.title !== 'string') return { msg: 'Note Title Is Not a string', OK: false }
	// 	if (u.note && typeof u.note.description !== 'string') return { msg: 'Note Description Is Not a string', OK: false }
	// 	if (u.note && typeof u.note.content !== 'string') return { msg: 'Note Content Is Not a string', OK: false }
	// 	return { msg: 'User Is Valid', OK: true, data: rs }
	// }

	// async UpdateUserNote(n: TUpdateUserNoteDTO): Promise<TUpdateUserNoteResponse> {
	// 	const v = await this.ValidateUpdateUserNote(n)
	// 	if (!v.OK) return { msg: v.msg, OK: false }
	// 	const rs: TUserFound | null = await this.mongoService.READ_BY_USER_ID(n.userId)
	// 	if (rs === null) return { msg: 'User Not Found', OK: false }
	// 	if (rs.notes) {
	// 		const noteFound = rs.notes.find(f => f.id === n.id)
	// 		if (!n.title) n.title = noteFound.title
	// 		if (!n.description) n.title = noteFound.description
	// 	}
	// 	const updateRes = await this.mongoService.UPDATE_USER_NOTE(n.userId, n)
	// 	if (!updateRes.acknowledged) return { msg: 'Could Not Update User Note', OK: false }
	// 	if (updateRes.acknowledged) return { msg: 'User Note Updated Successfully', OK: true }
	// }

	// private async ValidateUpdateUserNote(n: TNote): Promise<TUpdateUserNoteResponse> {
	// 	if (n && typeof n.id !== 'string') return { msg: 'Note ID Is Not a string', OK: false }
	// 	if (n.title && typeof n.title !== 'string') return { msg: 'Note Title Is Not a string', OK: false }
	// 	if (n.description && typeof n.description !== 'string') return { msg: 'Note Description Is Not a string', OK: false }
	// 	if (n.content && typeof n.content !== 'string') return { msg: 'Note Content Is Not a string', OK: false }
	// 	return { msg: 'Note Is Valid', OK: true }
	// }

	DELETE() {
		this.mongoService.DELETE()
	}
}
