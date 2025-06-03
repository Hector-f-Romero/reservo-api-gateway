import { Injectable, Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

import { SERVICES } from "src/config";
import { LoginUserDto } from "./dto/login-user.dto";

@Injectable()
export class AuthService {
	constructor(
		@Inject(SERVICES.NATS_SERVICE) private readonly client: ClientProxy,
	) {}

	async verifyToken(token: string) {
		// 1. Verify if the JWT is valid through the Java MS.
		const verifyTokenResponse = await firstValueFrom(
			this.client.send("auth.verify", token),
		);
		return verifyTokenResponse;
	}

	async login(loginUserDto: LoginUserDto) {
		// 1. Verify if the user exists and the password is correct through the Java MS.
		const loginResponse = await firstValueFrom(
			this.client.send("auth.login", loginUserDto),
		);

		return loginResponse;
	}
}
