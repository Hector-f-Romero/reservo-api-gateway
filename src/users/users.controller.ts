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
	HttpCode,
} from "@nestjs/common";
import { UUID } from "node:crypto";
import { CookieOptions, Response } from "express";

import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

import { PublicRoute } from "src/common/decorators/public-route.decorator";
import {
	ApiCookieAuth,
	ApiNoContentResponse,
	ApiNotFoundResponse,
	ApiOperation,
	ApiParam,
	ApiSecurity,
} from "@nestjs/swagger";

@Controller("users")
@ApiCookieAuth("cookie-auth")
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
	@ApiSecurity(undefined)
	@ApiOperation({ summary: "Create a new user" })
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
	@ApiOperation({ summary: "Get all users" })
	findAll() {
		return this.usersService.findAll();
	}

	@Get(":id")
	@ApiOperation({ summary: "Get user by ID" })
	@ApiParam({
		name: "id",
		type: "string",
		description: "User UUID v4",
		example: "03634755-5055-4b9f-a9a9-5de014214b5e",
	})
	findOne(@Param("id") id: UUID) {
		return this.usersService.findOne(id);
	}

	@Patch(":id")
	@ApiOperation({ summary: "Update user by ID" })
	@ApiParam({
		name: "id",
		type: "string",
		description: "User UUID v4",
		example: "03634755-5055-4b9f-a9a9-5de014214b5e",
	})
	update(
		@Param("id", ParseUUIDPipe) id: UUID,
		@Body() updateUserDto: UpdateUserDto,
	) {
		return this.usersService.update(id, updateUserDto);
	}

	@Delete(":id")
	@HttpCode(204)
	@ApiOperation({ summary: "Delete user by ID" })
	@ApiParam({
		name: "id",
		type: "string",
		description: "User UUID v4",
		example: "03634755-5055-4b9f-a9a9-5de014214b5e",
	})
	@ApiNoContentResponse({ description: "User deleted" })
	@ApiNotFoundResponse({ description: "User not found" })
	remove(@Param("id", ParseUUIDPipe) id: UUID) {
		this.usersService.remove(id);
	}
}
