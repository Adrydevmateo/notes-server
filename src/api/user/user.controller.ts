import { Body, Controller, Get, HttpException, HttpStatus, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { TUserCRUDResponse, TUserDTO } from './user.interface';

@Controller('user')
export class UserController {
	constructor(private service: UserService) { }

	@Get()
	GetUsers() {
		return this.service.FindUsers()
	}

	@Get('notes')
	GetNotes() {
		return this.service.FindNotes()
	}

	@Get('delete')
	DELETE() {
		this.service.DELETE()
	}

	@Post('create')
	async CREATE(@Body() rq: TUserDTO): Promise<TUserCRUDResponse> {
		const u = await this.service.CREATE({
			"username": rq.username,
			"password": rq.password
		})
		if (!u.OK) throw new HttpException(u.msg, HttpStatus.NOT_ACCEPTABLE)
		return { OK: true, msg: u.msg }
	}

	@Post('sign-in')
	async SignIn(@Body() rq: TUserDTO): Promise<TUserCRUDResponse> {
		const u = await this.service.ValidateSignInUser(rq.username, rq.password)
		if (!u.OK) throw new HttpException(u.msg, HttpStatus.UNAUTHORIZED)
		return { OK: true, msg: 'AUTHORIZED' }
	}

	// @Post('update')
	// async UPDATE(@Body() rq: TUpdateUserDTO): Promise<TUpdateUserResponse> {
	// 	const u = await this.service.UPDATE(rq)
	// 	if (!u.OK) throw new HttpException(u.msg, HttpStatus.NOT_ACCEPTABLE)
	// 	return { OK: true, msg: u.msg }
	// }

	// @Post('update-note')
	// async UpdateUserNote(@Body() rq: TUpdateUserNoteDTO): Promise<TUpdateUserNoteResponse> {
	// 	const u = await this.service.UpdateUserNote(rq)
	// 	if (!u.OK) throw new HttpException(u.msg, HttpStatus.NOT_ACCEPTABLE)
	// 	return { OK: true, msg: u.msg }
	// }
}
