import {
	Controller,
	Post,
	Body,
	UseInterceptors,
	Res,
	HttpStatus,
} from "@nestjs/common";
import { CookieOptions, Response } from "express";

import { AuthService } from "./auth.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { NatsMessagesInterceptor } from "src/common/interceptors/natsMessages.interceptor";
import { PublicRoute } from "src/common/decorators/public-route.decorator";

@UseInterceptors(NatsMessagesInterceptor)
@Controller("auth")
export class AuthController {
	private readonly COOKIE_OPTIONS: CookieOptions = {
		httpOnly: true,
		secure: false,
		sameSite: "lax",
		maxAge: 1000 * 60 * 60 * 24,
	};

	constructor(private readonly authService: AuthService) {}

	@PublicRoute()
	@Post("/login")
	async login(
		@Res({ passthrough: true }) response: Response,
		@Body() loginUserDto: LoginUserDto,
	) {
		// 1. Use the Auth MS using the service.
		const msResponse = await this.authService.login(loginUserDto);

		// 2. If login is successful, add the JWT to the cookie.
		if (msResponse.code === 200) {
			response.cookie(
				"access-token",
				msResponse.message.token,
				this.COOKIE_OPTIONS,
			);

			const { username, id } = msResponse.message;

			return {
				code: HttpStatus.OK,
				status: HttpStatus[HttpStatus.OK],
				message: { username, id },
			};
		}

		return msResponse;
	}

	@Post("/logout")
	logOut(@Res({ passthrough: true }) response: Response) {
		response.clearCookie("access-token", this.COOKIE_OPTIONS);
		return {
			code: HttpStatus.OK,
			status: HttpStatus[HttpStatus.OK],
			message: "Logout successful",
		};
	}

	@Post("/verify")
	verify(@Body() req: { token: string }) {
		return this.authService.verifyToken(req.token);
	}
}
