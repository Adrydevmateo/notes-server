import { Controller, Get, Post, Patch, Delete, Body, HttpException, HttpStatus, Param } from '@nestjs/common';
import { NoteService } from './note.service';
import { TNoteCRUDResponse, TNoteDTO } from './note.interface';

@Controller('note')
export class NoteController {
	constructor(private service: NoteService) { }

	// @Get()
	// GetNotes() {
	// 	return this.service.FindNotes()
	// }

	@Get(':ownerId')
	GetNotesByOwner(@Param() params: { ownerId: string }) {
		return this.service.FindNotesByOwner(params.ownerId)
	}

	@Post()
	async CreateNote(@Body() reqBody: TNoteDTO): Promise<TNoteCRUDResponse> {
		const created = await this.service.CreateNote(reqBody)
		if (!created.OK) return { msg: created.msg, statusCode: HttpStatus.NOT_ACCEPTABLE, OK: false }
		return { msg: created.msg, OK: true, statusCode: HttpStatus.OK }
	}

	@Patch()
	async UpdateNote(@Body() reqBody: TNoteDTO): Promise<TNoteCRUDResponse> {
		const updated = await this.service.UpdateNote(reqBody)
		if (!updated.OK) return { msg: updated.msg, statusCode: HttpStatus.NOT_ACCEPTABLE, OK: false }
		return { msg: updated.msg, OK: true, statusCode: HttpStatus.OK }
	}

	@Delete()
	async DeleteNote(@Body() reqBody: { ownerId: string }): Promise<TNoteCRUDResponse> {
		const deleted = await this.service.DeleteNote(reqBody.ownerId)
		if (!deleted.OK) return { msg: deleted.msg, statusCode: HttpStatus.NOT_ACCEPTABLE, OK: false }
		return { msg: deleted.msg, OK: true, statusCode: HttpStatus.OK }
	}
}
