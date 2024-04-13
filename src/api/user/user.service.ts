import { Injectable } from '@nestjs/common';
import { MongodbService } from 'src/db/mongodb/mongodb.service';
import { IUser, TNoteCRUDResponse, TNoteDTO, TUserCRUDResponse, TUserDTO } from './user.interface';

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
		if (typeof user.username !== 'string') return { msg: '[Invalid Field]: username is not a string', OK: false }

		if (!user.password) return { msg: '[Missing Field]: password was not provided', OK: false }
		if (typeof user.password !== 'string') return { msg: '[Invalid Field]: password is not a string', OK: false }

		const found: TUserCRUDResponse | null = await this.FindUserByName(user.username)
		if (found.OK) return { msg: '[Invalid Operation]: user already exist', OK: false }

		return { msg: 'User is valid', OK: true }
	}

	async FindUsers(): Promise<Array<TUserDTO>> {
		const users: Array<TUserDTO> = await this.mongoService.READ_USERS()
		return users
	}

	private async FindUserByName(username: string): Promise<TUserCRUDResponse> {
		const found: TUserDTO | null = await this.mongoService.READ_USER_BY_NAME(username)
		if (found === null) return { msg: '[Not Found]: user could not be found', OK: false }
		if (found !== null) return { msg: 'User has been found', OK: true, data: found }
	}

	// async ValidateSignInUser(n: string, p: string): Promise<TUserCRUDResponse> {
	// 	const rs: TUserDTO | null = await this.mongoService.READ_BY_USER_NAME(n)
	// 	if (rs === null) return { msg: "User Not Found", OK: false }
	// 	if (rs.password === p)
	// 		return { data: rs, OK: true }
	// 	else
	// 		return { msg: 'Incorrect Password', OK: false }
	// }

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

	//#region Note
	async CreateNote(note: TNoteDTO): Promise<TNoteCRUDResponse> {
		const valid = await this.ValidateCreateNote(note)
		if (!valid.OK) return { msg: valid.msg, OK: false }
		const created = await this.mongoService.CREATE_NOTE({
			ownerId: note.ownerId,
			title: note.title,
			description: note.description ?? "",
			content: note.content ?? ""
		})
		if (!created.acknowledged) return { msg: 'Could Not Create User', OK: false }
		return { msg: 'User Created Successfully', OK: true }
	}

	private async ValidateCreateNote(note: TNoteDTO): Promise<TNoteCRUDResponse> {
		if (!note.ownerId) return { msg: '[Missing Field]: note owner id was not provided', OK: false }
		if (typeof note.ownerId !== 'string') return { msg: '[Invalid Field]: note owner id is not a string', OK: false }

		if (!note.title) return { msg: '[Missing Field]: note title was not provided', OK: false }
		if (typeof note.title !== 'string') return { msg: '[Invalid Field]: note title is not a string', OK: false }

		const found: TNoteCRUDResponse | null = await this.FindNote(note.id)
		if (found.OK) return { msg: 'Note already exist', OK: false }

		return { msg: 'Note is valid', OK: true }
	}

	async FindNotes(): Promise<Array<TNoteDTO>> {
		const notes: Array<TNoteDTO> = await this.mongoService.READ_NOTES()
		return notes
	}

	private async FindNote(id: string): Promise<TNoteCRUDResponse> {
		const found: TNoteDTO | null = await this.mongoService.READ_NOTE_BY_ID(id)
		if (found === null) return { msg: '[Not Found]: note could not be found', OK: false }
		if (found !== null) return { msg: 'Note has been found', OK: true, data: found }
	}
	//#endregion Note
}
