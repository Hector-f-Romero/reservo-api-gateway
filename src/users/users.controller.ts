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
} from "@nestjs/common";
import { UUID } from "node:crypto";

import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { NatsMessagesInterceptor } from "src/common/interceptors/natsMessages.interceptor";

@UseInterceptors(NatsMessagesInterceptor)
@Controller("users")
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post()
	create(@Body() createUserDto: CreateUserDto) {
		return this.usersService.create(createUserDto);
	}

	@Get()
	findAll() {
		return this.usersService.findAll();
	}

	@Get(":id")
	async findOne(@Param("id") id: UUID) {
		console.log("INICIANDO CONTROLADOR");
		console.log("---------------------------");
		const res1 = await this.usersService.findOne(id);
		console.log("TERMINÓ EL SERVICIO");
		console.log("---------------------------");
		return res1;
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
