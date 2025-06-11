import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	ParseUUIDPipe,
	Res,
} from "@nestjs/common";
import { UUID } from "node:crypto";
import { CookieOptions, Response } from "express";

import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

import { PublicRoute } from "src/common/decorators/public-route.decorator";

@Controller("users")
export class UsersController {
	private readonly COOKIE_OPTIONS: CookieOptions = {
		httpOnly: true,
		secure: false,
		sameSite: "lax",
		maxAge: 1000 * 60 * 60 * 2,
	};

	constructor(private readonly usersService: UsersService) {}

	@PublicRoute()
	@Post()
	async create(
		@Res({ passthrough: true }) response: Response,
		@Body() createUserDto: CreateUserDto,
	) {
		// 1. Use the service to retrieve the new user and its JWT
		const { user, token } = await this.usersService.create(createUserDto);

		// 2. Set JWT in "acccess-token" cookie
		response.cookie("access-token", token, this.COOKIE_OPTIONS);

		return user;
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
