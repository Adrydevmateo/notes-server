export type TNote = {
	id: string
	title: string
	description: string
	content: string
}

export type TNoteDTO = { id?: string, title?: string, description?: string, content?: string, ownerId?: string }

export type TNoteCRUDResponse = { OK?: boolean, msg?: string, data?: TNoteDTO }

export type TNoteUpsertDTO = { id: string, set: { title?: string, description?: string, content?: string, ownerId?: string } }
