import { Controller, Post, Body, UseInterceptors } from "@nestjs/common";

import { AuthService } from "./auth.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { NatsMessagesInterceptor } from "src/common/interceptors/natsMessages.interceptor";

@UseInterceptors(NatsMessagesInterceptor)
@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("/login")
	login(@Body() loginUserDto: LoginUserDto) {
		return this.authService.login(loginUserDto);
	}

	@Post("/verify")
	verify(@Body() req: { token: string }) {
		return this.authService.verifyToken(req.token);
	}
}
