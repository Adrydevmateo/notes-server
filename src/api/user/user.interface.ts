import { TNote } from "../note/note.interface"

export interface IUser {
	id: string
	username: string
	password: string
	notes: Array<TNote>
}

export type TUserDTO = { id?: string, username?: string, password?: string }
export type TUserCRUDResponse = { OK?: boolean, msg?: string, data?: TUserDTO }