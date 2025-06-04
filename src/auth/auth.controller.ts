import {
	Controller,
	Post,
	Body,
	UseInterceptors,
	Req,
	Res,
	HttpStatus,
} from "@nestjs/common";

import { AuthService } from "./auth.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { NatsMessagesInterceptor } from "src/common/interceptors/natsMessages.interceptor";
import { Response } from "express";

@UseInterceptors(NatsMessagesInterceptor)
@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("/login")
	async login(
		@Res({ passthrough: true }) response: Response,
		@Body() loginUserDto: LoginUserDto,
	) {
		// 1. Use the Auth MS using the service.
		const msResponse = await this.authService.login(loginUserDto);

		// 2. If login is successful, add the JWT to the cookie.
		if (msResponse.code === 200) {
			response.cookie("access-token", msResponse.message.token, {
				httpOnly: true,
				secure: false,
				sameSite: "lax",
				maxAge: 1000 * 60 * 60 * 24,
			});

			const { username, id } = msResponse.message;

			return {
				code: HttpStatus.OK,
				status: HttpStatus[HttpStatus.OK],
				message: { username, id },
			};
		}

		return msResponse;
	}

	@Post("/verify")
	verify(@Body() req: { token: string }) {
		return this.authService.verifyToken(req.token);
	}
}
