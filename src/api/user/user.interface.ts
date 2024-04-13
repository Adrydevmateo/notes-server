export interface IUser {
	id: string
	username: string
	password: string
	notes: Array<TNote>
}

export type TNote = {
	id: string
	title: string
	description: string
	content: string
}


export type TUserDTO = { id?: string, username?: string, password?: string }

export type TNoteDTO = { id?: string, title?: string, description?: string, ownerId?: string }

export type TUserCRUDResponse = { OK?: boolean, msg?: string, data?: TUserDTO }

export type TNoteCRUDResponse = { OK?: boolean, msg?: string, data?: TNoteDTO }