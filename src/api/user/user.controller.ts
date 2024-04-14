import { Body, Controller, Delete, Get, HttpException, HttpStatus, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { TNoteCRUDResponse, TNoteDTO, TUserCRUDResponse, TUserDTO } from './user.interface';

@Controller('user')
export class UserController {
	constructor(private service: UserService) { }

	@Get()
	GetUsers() {
		return this.service.FindUsers()
	}

	@Post()
	async CreateUser(@Body() reqBody: TUserDTO): Promise<TUserCRUDResponse> {
		const created = await this.service.CreateUser(reqBody)
		if (!created.OK) throw new HttpException(created.msg, HttpStatus.NOT_ACCEPTABLE)
		return { msg: created.msg, OK: true }
	}

	@Patch()
	async UpdateUser(@Body() reqBody: TUserDTO): Promise<TUserCRUDResponse> {
		const updated = await this.service.UpdateUser(reqBody)
		if (!updated.OK) throw new HttpException(updated.msg, HttpStatus.NOT_ACCEPTABLE)
		return { msg: updated.msg, OK: true }
	}

	@Delete()
	async DeleteUser(@Body() reqBody: { id: string }): Promise<TUserCRUDResponse> {
		const deleted = await this.service.DeleteUser(reqBody.id)
		if (!deleted.OK) throw new HttpException(deleted.msg, HttpStatus.NOT_ACCEPTABLE)
		return { msg: deleted.msg, OK: true }
	}

	// @Post('sign-in')
	// async SignIn(@Body() rq: TUserDTO): Promise<TUserCRUDResponse> {
	// 	const u = await this.service.ValidateSignInUser(rq.username, rq.password)
	// 	if (!u.OK) throw new HttpException(u.msg, HttpStatus.UNAUTHORIZED)
	// 	return { OK: true, msg: 'AUTHORIZED' }
	// }

	//#region Note
	@Get('notes')
	GetNotes() {
		return this.service.FindNotes()
	}

	@Post('create-note')
	async CreateNote(@Body() reqBody: TNoteDTO): Promise<TNoteCRUDResponse> {
		const created = await this.service.CreateNote(reqBody)
		if (!created.OK) throw new HttpException(created.msg, HttpStatus.NOT_ACCEPTABLE)
		return { msg: created.msg, OK: true }
	}

	@Patch('update-note')
	async UpdateNote(@Body() reqBody: TNoteDTO): Promise<TNoteCRUDResponse> {
		const updated = await this.service.UpdateNote(reqBody)
		if (!updated.OK) throw new HttpException(updated.msg, HttpStatus.NOT_ACCEPTABLE)
		return { msg: updated.msg, OK: true }
	}

	@Delete('delete-note')
	async DeleteNote(@Body() reqBody: { ownerId: string }): Promise<TNoteCRUDResponse> {
		const deleted = await this.service.DeleteNote(reqBody.ownerId)
		if (!deleted.OK) throw new HttpException(deleted.msg, HttpStatus.NOT_ACCEPTABLE)
		return { msg: deleted.msg, OK: true }
	}
	//#endregion Note
}
