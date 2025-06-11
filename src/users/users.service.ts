import { Injectable } from "@nestjs/common";
import { UUID } from "node:crypto";

import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { NatsClientWrapper } from "src/transports/nats-client-wrapper.service";
import { CreateUserResponseDto } from "./dto/create-user-response.dto";

@Injectable()
export class UsersService {
	constructor(private readonly natsClient: NatsClientWrapper) {}

	async create(createUserDto: CreateUserDto) {
		// 1. Create the user in DB
		const userMSResponse =
			await this.natsClient.send<CreateUserResponseDto>(
				"users.create",
				createUserDto,
			);

		const { id, username } = userMSResponse;

		// 2. Generate JWT for the new user.
		const authMSResponse = await this.natsClient.send<{ token: string }>(
			"auth.signup",
			{
				id,
				username,
			},
		);

		// 3. Return the user created and its JWT
		return {
			user: userMSResponse,
			token: authMSResponse.token,
		};
	}

	async findAll() {
		return await this.natsClient.send("users.get.all", "ok");
	}

	async findOne(id: UUID) {
		return await this.natsClient.send("users.get.id", id);
	}

	async login(loginUserDto: LoginUserDto) {
		return await this.natsClient.send("users.login", loginUserDto);
	}

	async update(id: UUID, updateUserDto: UpdateUserDto) {
		return await this.natsClient.send("users.update", {
			...updateUserDto,
			id,
		});
	}

	async remove(id: UUID) {
		return await this.natsClient.send("users.delete", id);
	}
}
