import { Injectable, Inject } from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

import { SERVICES } from "src/config";
import { LoginUserDto } from "./dto/login-user.dto";

@Injectable()
export class AuthService {
	constructor(
		@Inject(SERVICES.NATS_SERVICE) private readonly client: ClientProxy,
	) {}

	async login(loginUserDto: LoginUserDto) {
		const response = await firstValueFrom(
			this.client.send("users.login", loginUserDto),
		);

		if (response.code === 400) {
			throw new RpcException(response.message);
		}

		return JSON.parse(response);
	}
}
