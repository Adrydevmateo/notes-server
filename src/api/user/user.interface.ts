export interface IUser {
	id: string
	email: string
	password: string
	notes: Array<TNote>
}

export type TUserFound = { email: string, password: string }

type TNote = {
	id: string
	title: string
	description: string
	content: string
}

export type TValidateUser = {
	OK?: boolean,
	msg?: string,
	data?: { email: string, password: string }
}

export type TSignInDto = { email: string, password: string }

export type TSignInResponse = { OK: boolean, msg?: string }