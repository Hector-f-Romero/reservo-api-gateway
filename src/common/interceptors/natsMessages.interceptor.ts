import {
	BadRequestException,
	CallHandler,
	ConflictException,
	ExecutionContext,
	Injectable,
	InternalServerErrorException,
	NestInterceptor,
	NotFoundException,
} from "@nestjs/common";
import { map, Observable } from "rxjs";

import { NatsMessage } from "../types/nats-message.type";
import { NatsErrorMessage } from "../types/nats-error-message.type";

@Injectable()
export class NatsMessagesInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		return next.handle().pipe(
			map((data: NatsMessage | NatsErrorMessage) => {
				// 1. Check if the NATS response represents an error. Always NATS send an NatsMessageResponse object or ErrorNatsMessageResponse.
				if (this.isErrorResponse(data)) {
					return this.handleNatsExceptions(data);
				}

				// 2. Return the actual payload if the response is successful
				return data.message;
			}),
		);
	}

	private isErrorResponse(
		data: NatsMessage | NatsErrorMessage,
	): data is NatsErrorMessage {
		return data.code >= 400;
	}

	private handleNatsExceptions(errorResponse: NatsErrorMessage) {
		const { code, message, status, path } = errorResponse;

		// Convert the error into an appropriate HTTP exception.
		switch (code) {
			case 400:
				throw new BadRequestException({
					message,
					status,
					path,
				});

			case 404:
				throw new NotFoundException({
					message,
					status,
					path,
				});
			case 409:
				throw new ConflictException({
					message,
					status,
					path,
				});
			case 500:
				throw new InternalServerErrorException({
					message,
					status,
					path,
				});
			default:
				throw new InternalServerErrorException({
					message,
					status,
					path,
				});
		}
	}
}
