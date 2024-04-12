import { Body, Controller, Get, HttpException, HttpStatus, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { TCreateUserDTO, TCreateUserResponse, TSignInDTO, TSignInResponse } from './user.interface';

@Controller('user')
export class UserController {
	constructor(private service: UserService) { }

	@Get()
	READ() {
		return this.service.READ()
	}

	@Get('update')
	UPDATE() {
		this.service.UPDATE()
	}

	@Get('del')
	DELETE() {
		this.service.DELETE()
	}

	@Post('create')
	async CREATE(@Body() rq: TCreateUserDTO): Promise<TCreateUserResponse> {
		const u = await this.service.CREATE({
			"username": rq.username,
			"password": rq.password,
			"notes": rq.notes
		})
		if (!u.OK) throw new HttpException(u.msg, HttpStatus.NOT_ACCEPTABLE)
		return { OK: true, msg: u.msg }
	}

	@Post('sign-in')
	async SignIn(@Body() rq: TSignInDTO): Promise<TSignInResponse> {
		const u = await this.service.ValidateUser(rq.username, rq.password)
		if (!u.OK) throw new HttpException(u.msg, HttpStatus.UNAUTHORIZED)
		return { OK: true, msg: 'AUTHORIZED' }
	}
}
