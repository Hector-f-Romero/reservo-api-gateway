import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
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
		try {
			const response = await firstValueFrom(
				this.client.send("users.create", createUserDto),
			);
			return JSON.parse(response);
		} catch (error) {
			throw new RpcException(error);
		}
	}

	async findAll() {
		try {
			const response = await firstValueFrom(
				this.client.send("users.get.all", "ok"),
			);

			return response;
		} catch (error) {
			throw new RpcException(error);
		}
	}

	async findOne(id: UUID) {
		try {
			const response = await firstValueFrom(
				this.client.send("users.get.id", id),
			);
			return JSON.parse(response);
		} catch (error) {
			throw new RpcException(error);
		}
	}

	async login(loginUserDto: LoginUserDto) {
		try {
			const response = await firstValueFrom(
				this.client.send("users.login", loginUserDto),
			);
			return JSON.parse(response);
		} catch (error) {
			throw new RpcException(error);
		}
	}

	async update(id: UUID, updateUserDto: UpdateUserDto) {
		try {
			const response = await firstValueFrom(
				this.client.send("users.update", { ...updateUserDto, id }),
			);
			return JSON.parse(response);
		} catch (error) {
			throw new RpcException(error);
		}
	}

	async remove(id: UUID) {
		try {
			const response = await firstValueFrom(
				this.client.send("users.delete", id),
			);
			return response;
		} catch (error) {
			throw new RpcException(error);
		}
	}
}
