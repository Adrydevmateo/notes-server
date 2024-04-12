export interface IUser {
	id: string
	name: string
	password: string
	notes: Array<TNote>
}

export type TUserFound = { name: string, password: string }

type TNote = {
	id: string
	title: string
	description: string
	content: string
}

export type TValidateUser = {
	OK?: boolean,
	msg?: string,
	data?: { name: string, password: string }
}

export type TSignInDto = { name: string, password: string }

export type TSignInResponse = { OK: boolean, msg?: string }