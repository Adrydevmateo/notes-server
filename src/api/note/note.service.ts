import { Injectable } from '@nestjs/common';
import { TNoteCRUDResponse, TNoteDTO, TNoteUpsertDTO } from './note.interface';
import { MongodbService } from 'src/db/mongodb/mongodb.service';
import { ObjectId } from 'mongodb';

@Injectable()
export class NoteService {
	constructor(private mongoService: MongodbService) { }

	async CreateNote(note: TNoteDTO): Promise<TNoteCRUDResponse> {
		const valid = await this.ValidateCreateNote(note)
		if (!valid.OK) return { msg: valid.msg, OK: false }
		const created = await this.mongoService.CREATE_NOTE({
			ownerId: note.ownerId,
			title: note.title,
			description: note.description ?? "",
			content: note.content ?? ""
		})
		if (!created.acknowledged) return { msg: 'Could not create note', OK: false }
		return { msg: 'Note Created Successfully', OK: true }
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

	async FindNotesByOwner(ownerId: string): Promise<Array<TNoteDTO>> {
		const notes: Array<TNoteDTO> = await this.mongoService.READ_NOTES_BY_OWNER(ownerId)
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
}
