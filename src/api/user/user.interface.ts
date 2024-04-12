export interface IUser {
	id: string
	username: string
	password: string
	notes: Array<TNote>
}

type TNote = {
	id: string
	title: string
	description: string
	content: string
}

export type TUserFound = { username: string, password: string }

export type TCreateUserDTO = { username: string, password: string, notes: Array<TNote> }

export type TSignInDTO = { username: string, password: string }

export type TCreateUserResponse = { OK: boolean, msg?: string }

export type TSignInResponse = { OK: boolean, msg?: string }

export type TCRUDResponse = {
	OK?: boolean,
	msg?: string,
	data?: { username?: string, password?: string }
}