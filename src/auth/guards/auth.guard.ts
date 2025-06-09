import {
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import { firstValueFrom } from "rxjs";
import { Reflector } from "@nestjs/core";
import { ClientProxy } from "@nestjs/microservices";

import { SERVICES } from "src/config";
import { IS_PUBLIC_ROUTE } from "src/common/decorators/public-route.decorator";

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		@Inject(SERVICES.NATS_SERVICE) private readonly client: ClientProxy,
		private readonly reflector: Reflector,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		// 1. Check if the route is marked as public via @PublicRoute custom decorator.
		const isPublicRoute = this.reflector.getAllAndOverride<boolean>(
			IS_PUBLIC_ROUTE,
			[context.getHandler(), context.getClass()],
		);

		// 2. If the metadata is found, the route is public and doesn't requiere JWT validation.
		if (isPublicRoute) return true;

		// 3. Extract the HTTP request from the context.
		const request = context.switchToHttp().getRequest() as Request;

		// 4. Retrieve the token from the "acces-token" cookie.
		const token = request.cookies["access-token"];

		if (!token) {
			throw new UnauthorizedException("Auth token is missing.");
		}

		// 5. Send the token to Auth MS via NATS to verify its validity.
		const authMSResponse = await firstValueFrom(
			this.client.send("auth.verify", token),
		);

		// 6. If the Auth MS response is not successful, deny access.
		if (authMSResponse.code !== 200) {
			throw new UnauthorizedException("Invalid auth token.");
		}

		return true;
	}
}
