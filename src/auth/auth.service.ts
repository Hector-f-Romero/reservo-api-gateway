import { Injectable } from "@nestjs/common";

import { LoginUserDto } from "./dto/login-user.dto";
import { NatsClientWrapper } from "src/transports/nats-client-wrapper.service";
import { LoginUserResponseDto } from "./dto/login-user-response.dto";

@Injectable()
export class AuthService {
	constructor(private readonly natsClient: NatsClientWrapper) {}

	async verifyToken(token: string) {
		// 1. Verify if the JWT is valid through the Java MS.
		return await this.natsClient.send("auth.verify", token);
	}

	async login(loginUserDto: LoginUserDto) {
		// 1. Verify if the user exists and the password is correct through the Java MS.
		return await this.natsClient.send<LoginUserResponseDto>(
			"auth.login",
			loginUserDto,
		);
	}
}
