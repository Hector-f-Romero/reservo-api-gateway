import {
	BadRequestException,
	HttpStatus,
	Inject,
	Injectable,
} from "@nestjs/common";
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
		// 1. Create the user in DB
		const userMSresponse = await firstValueFrom(
			this.client.send("users.create", createUserDto),
		);

		if (userMSresponse.code !== 200) {
			return userMSresponse;
		}

		console.log(userMSresponse);
		const { id, username } = userMSresponse.message;

		// 2. Generate JWT for the new user.
		const authMSResponse = await firstValueFrom(
			this.client.send("auth.signup", { id, username }),
		);

		if (authMSResponse.code !== 200) {
			return authMSResponse;
		}

		console.log("AUTH RESPONSE");
		console.log(authMSResponse);

		return {
			code: HttpStatus.OK,
			status: HttpStatus[HttpStatus.OK],
			message: {
				user: userMSresponse.message,
				token: authMSResponse.message.token,
			},
		};
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
