import { Body, Controller, Get, HttpException, HttpStatus, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { TSignInDto, TSignInResponse } from './user.interface';

@Controller('user')
export class UserController {
	constructor(private service: UserService) { }

	@Get()
	Read() {
		return this.service.READ()
	}

	@Get('add')
	Create() {
		this.service.CREATE()
	}

	@Get('update')
	Update() {
		this.service.UPDATE()
	}

	@Get('del')
	Delete() {
		this.service.DELETE()
	}

	@Post('sign-in')
	async SignIn(@Body() rq: TSignInDto): Promise<TSignInResponse> {
		const u = await this.service.ValidateUser(rq.name, rq.password)
		if (!u.OK) throw new HttpException(u.msg, HttpStatus.UNAUTHORIZED)
		return { OK: true, msg: 'AUTHORIZED' }
	}
}
