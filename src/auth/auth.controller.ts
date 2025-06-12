import { Controller, Post, Body, Res, Delete, HttpCode } from "@nestjs/common";
import { CookieOptions, Response } from "express";
import {
	ApiBody,
	ApiCookieAuth,
	ApiOkResponse,
	ApiOperation,
	ApiResponse,
	ApiSecurity,
} from "@nestjs/swagger";

import { AuthService } from "./auth.service";
import { LoginUserDto } from "./dto/login-user.dto";

import { PublicRoute } from "src/common/decorators/public-route.decorator";

@Controller("auth")
@ApiCookieAuth("cookie-auth")
export class AuthController {
	private readonly COOKIE_OPTIONS: CookieOptions = {
		httpOnly: true,
		secure: false,
		sameSite: "lax",
	};

	constructor(private readonly authService: AuthService) {}

	@PublicRoute()
	@Post("/login")
	@HttpCode(200)
	@ApiSecurity(undefined)
	@ApiOperation({ summary: "Login user" })
	@ApiOkResponse({
		description:
			'User logged successful and JWT set in "access-token" cookie.',
	})
	async login(
		@Res({ passthrough: true }) response: Response,
		@Body() loginUserDto: LoginUserDto,
	) {
		// 1. Use the Auth MS using the service.
		const { id, token, username } =
			await this.authService.login(loginUserDto);

		// 2. If login is successful, add the JWT to the cookie.
		response.cookie("access-token", token, {
			...this.COOKIE_OPTIONS,
			maxAge: 1000 * 60 * 60 * 2,
		});

		return { username, id };
	}

	@Delete("/logout")
	@HttpCode(204)
	@ApiOperation({ summary: "Logout user" })

	@ApiResponse({
		status: 204,
		description: "User logged out and JWT cookie cleared",
	})
	logOut(@Res({ passthrough: true }) response: Response) {
		response.clearCookie("access-token", {
			httpOnly: true,
			secure: false,
			sameSite: "lax",
		});
	}

	@Post("/verify")
	@ApiOperation({ summary: "Verify JWT token" })
	@ApiBody({
		schema: {
			type: "object",
			properties: {
				token: {
					type: "string",
					description: "JWT token to verify",
				},
			},
		},
	})
	@ApiResponse({ status: 200, description: "Token is valid" })
	@ApiResponse({ status: 401, description: "Token is invalid or expired" })
	verify(@Body() req: { token: string }) {
		return this.authService.verifyToken(req.token);
	}
}
