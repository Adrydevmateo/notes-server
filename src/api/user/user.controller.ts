import { Body, Controller, Delete, Get, HttpException, HttpStatus, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { TUserCRUDResponse, TUserDTO } from './user.interface';

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

	@Post('sign-in')
	async SignIn(@Body() reqBody: TUserDTO): Promise<TUserCRUDResponse> {
		const authorized = await this.service.SignIn(reqBody)
		if (!authorized.OK) throw new HttpException(authorized.msg, HttpStatus.UNAUTHORIZED)
		return { msg: authorized.msg, OK: true }
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
}
