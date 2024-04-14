import { Injectable } from '@nestjs/common';
import { MongodbService } from 'src/db/mongodb/mongodb.service';
import { IUser, TNoteCRUDResponse, TNoteDTO, TNoteUpsertDTO, TUserCRUDResponse, TUserDTO } from './user.interface';

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
		if (typeof note.ownerId !== 'string') return { msg: '[Invalid Type]: note owner id is not a string', OK: false }

		if (!note.title) return { msg: '[Missing Field]: note title was not provided', OK: false }
		if (typeof note.title !== 'string') return { msg: '[Invalid Type]: note title is not a string', OK: false }

		const found: TNoteCRUDResponse = await this.FindNote(note.id)
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

	async UpdateNote(note: TNoteDTO): Promise<TNoteCRUDResponse> {
		const valid = await this.ValidateUpdateNote(note)
		if (!valid.OK) return { msg: valid.msg, OK: false }

		const updateData: TNoteUpsertDTO = { id: note.id, set: {} }

		const found: TNoteCRUDResponse = await this.FindNote(note.id)
		if (found.OK) {
			if (note.title) updateData.set.title = note.title ?? found.data.title ?? "New note title"
			if (note.description) updateData.set.description = note.description ?? found.data.description
			if (note.content) updateData.set.content = note.content ?? found.data.content
		} else {
			if (note.title) updateData.set.title = note.title ?? "New note title"
			if (note.description) updateData.set.description = note.description
			if (note.content) updateData.set.content = note.content
			updateData.set.ownerId = note.ownerId
		}
		const updated = await this.mongoService.UPDATE_NOTE(updateData)
		if (!updated.acknowledged) return { msg: '[Invalid Operation]: could not update the note', OK: false }

		return { msg: 'Note updated successfully', OK: true }
	}

	private async ValidateUpdateNote(note: TNoteDTO): Promise<TNoteCRUDResponse> {
		if (!note.ownerId) return { msg: '[Missing Field]: note owner id was not provided', OK: false }
		if (typeof note.ownerId !== 'string') return { msg: '[Invalid Type]: note owner id is not a string', OK: false }
		if (note.id && typeof note.id !== 'string') return { msg: '[Invalid Type]: note id is not a string', OK: false }
		if (note.title && typeof note.title !== 'string') return { msg: '[Invalid Type]: note title is not a string', OK: false }
		if (note.description && typeof note.description !== 'string') return { msg: '[Invalid Type]: note description is not a string', OK: false }
		if (note.content && typeof note.content !== 'string') return { msg: '[Invalid Type]: note content is not a string', OK: false }
		if (!note.title && !note.description && !note.content) return { msg: '[Invalid Operation]: nothing to update - data was not provided', OK: false }
		return { msg: 'Note is valid', OK: true }
	}

	async DeleteNote(ownerId: string): Promise<TNoteCRUDResponse> {
		if (!ownerId) return { msg: '[Missing Field]: owner id was not provided', OK: false }
		if (typeof ownerId !== 'string') return { msg: '[Invalid Type]: owner id is not a string', OK: false }
		const deleted = await this.mongoService.DELETE_NOTE(ownerId)
		if (!deleted.acknowledged) return { msg: '[Invalid Operation]: could not delete note', OK: false }
		return { msg: 'Note deleted successfully', OK: true }
	}
	//#endregion Note
}
