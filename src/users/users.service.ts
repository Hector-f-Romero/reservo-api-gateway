import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { UUID } from "node:crypto";

import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { SERVICES } from "src/config";
import { LoginUserDto } from "./dto/login-user.dto";

@Injectable()
export class UsersService {
	constructor(
		@Inject(SERVICES.NATS_SERVICE) private readonly client: ClientProxy,
	) {}

	async create(createUserDto: CreateUserDto) {
		const response = await firstValueFrom(
			this.client.send("users.create", createUserDto),
		);
		return response;
	}

	async findAll() {
		const response = await firstValueFrom(
			this.client.send("users.get.all", "ok"),
		);

		return response;
	}

	async findOne(id: UUID) {
		const response = await firstValueFrom(
			this.client.send("users.get.id", id),
		);
		return response;
	}

	async login(loginUserDto: LoginUserDto) {
		const response = await firstValueFrom(
			this.client.send("users.login", loginUserDto),
		);
		return response;
	}

	async update(id: UUID, updateUserDto: UpdateUserDto) {
		const response = await firstValueFrom(
			this.client.send("users.update", { ...updateUserDto, id }),
		);
		return response;
	}

	async remove(id: UUID) {
		const response = await firstValueFrom(
			this.client.send("users.delete", id),
		);
		return response;
	}
}
