import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	ParseUUIDPipe,
	UseInterceptors,
	Res,
	HttpStatus,
} from "@nestjs/common";
import { UUID } from "node:crypto";
import { CookieOptions, Response } from "express";

import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { NatsMessagesInterceptor } from "src/common/interceptors/natsMessages.interceptor";
import { PublicRoute } from "src/common/decorators/public-route.decorator";

@UseInterceptors(NatsMessagesInterceptor)
@Controller("users")
export class UsersController {
	private readonly COOKIE_OPTIONS: CookieOptions = {
		httpOnly: true,
		secure: false,
		sameSite: "lax",
		maxAge: 1000 * 60 * 60 * 24,
	};

	constructor(private readonly usersService: UsersService) {}

	@PublicRoute()
	@Post()
	async create(
		@Res({ passthrough: true }) response: Response,
		@Body() createUserDto: CreateUserDto,
	) {
		const newUser = await this.usersService.create(createUserDto);

		console.log("EN CONTROLLER");
		console.log(newUser);
		if (newUser.code === 200) {
			response.cookie(
				"access-token",
				newUser.message.token,
				this.COOKIE_OPTIONS,
			);

			return {
				code: HttpStatus.OK,
				status: HttpStatus[HttpStatus.OK],
				message: newUser.message.user,
			};
		}

		return newUser;
	}

	@Get()
	findAll() {
		return this.usersService.findAll();
	}

	@Get(":id")
	findOne(@Param("id") id: UUID) {
		return this.usersService.findOne(id);
	}

	@Patch(":id")
	update(
		@Param("id", ParseUUIDPipe) id: UUID,
		@Body() updateUserDto: UpdateUserDto,
	) {
		return this.usersService.update(id, updateUserDto);
	}

	@Delete(":id")
	remove(@Param("id", ParseUUIDPipe) id: UUID) {
		return this.usersService.remove(id);
	}
}
