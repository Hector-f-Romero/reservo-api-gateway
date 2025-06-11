import {
	BadRequestException,
	ConflictException,
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException,
	UnauthorizedException,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

import { MicroserviceResponse } from "./interfaces/microservice-response.interface";

@Injectable()
export class NatsClientWrapper {
	private readonly logger = new Logger(NatsClientWrapper.name);
	constructor(private readonly client: ClientProxy) {}

	async send<T>(pattern: string, data: unknown): Promise<T> {
		/*
			* NOTE:
			The client only resolves the promise if the value received through NATS is a primitive array or string.
			Therefore, on the backend we need to serialize the data before publishing it.
			See: https://nats-io.github.io/nats.js/core/index.html#publish-and-subscribe

			As a side effect, we need to parse the response from NATS to JSON. NestJS automatically parse it.
		*/
		const response: MicroserviceResponse<T> = await firstValueFrom(
			this.client.send(pattern, data),
		);

		if (response.code >= 200 && response.code < 300) {
			return response.message;
		}

		this.handleMicroserviceError(response, pattern);
	}

	private handleMicroserviceError(
		response: MicroserviceResponse<unknown>,
		pattern: string,
	) {
		const { code, message, status } = response;

		this.logger.warn(
			`Microservice error - Pattern: ${pattern}, Status: ${status}`,
		);

		// Convert the error into an appropriate HTTP exception.
		switch (code) {
			case 400:
				throw new BadRequestException(message);
			case 401:
				throw new UnauthorizedException(message);
			case 404:
				throw new NotFoundException(message);
			case 409:
				throw new ConflictException(message);
			case 500:
				throw new InternalServerErrorException(message);
			default:
				throw new InternalServerErrorException(message);
		}
	}
}
