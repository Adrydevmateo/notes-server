import { Body, Controller, Delete, Get, HttpException, HttpStatus, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { TUserCRUDResponse, TUserDTO } from './user.interface';

@Controller('user')
export class UserController {
	constructor(private service: UserService) { }

	// @Get()
	// GetUsers() {
	// 	return this.service.FindUsers()
	// }

	@Post()
	async CreateUser(@Body() reqBody: TUserDTO): Promise<TUserCRUDResponse> {
		const created = await this.service.CreateUser(reqBody)
		if (!created.OK) return { msg: created.msg, statusCode: HttpStatus.CONTINUE, OK: false }
		return { msg: created.msg, OK: true, statusCode: HttpStatus.OK }
	}

	@Post('sign-in')
	async SignIn(@Body() reqBody: TUserDTO): Promise<TUserCRUDResponse> {
		const authorized = await this.service.SignIn(reqBody)
		if (!authorized.OK) return { msg: authorized.msg, statusCode: HttpStatus.CONTINUE, OK: false }
		return { msg: authorized.msg, OK: true, data: authorized.data, statusCode: HttpStatus.OK }
	}

	@Patch()
	async UpdateUser(@Body() reqBody: TUserDTO): Promise<TUserCRUDResponse> {
		if (!reqBody.token) return { msg: '[Missing Field]: token was not provided', OK: false }
		if (typeof reqBody.token !== 'string') return { msg: '[Invalid Type]: token is not a string', OK: false }
		const updated = await this.service.UpdateUser(reqBody)
		if (!updated.OK) return { msg: updated.msg, statusCode: HttpStatus.CONTINUE, OK: false }
		return { msg: updated.msg, OK: true, statusCode: HttpStatus.OK }
	}

	@Delete()
	async DeleteUser(@Body() reqBody: { id: string, token: string }): Promise<TUserCRUDResponse> {
		if (!reqBody.token) return { msg: '[Missing Field]: token was not provided', OK: false }
		if (typeof reqBody.token !== 'string') return { msg: '[Invalid Type]: token is not a string', OK: false }
		const deleted = await this.service.DeleteUser(reqBody)
		if (!deleted.OK) return { msg: deleted.msg, statusCode: HttpStatus.CONTINUE, OK: false }
		return { msg: deleted.msg, OK: true, statusCode: HttpStatus.OK }
	}
}
