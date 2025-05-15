import { Inject, Injectable } from "@nestjs/common";
import {
	ClientGrpcProxy,
	ClientProxy,
	RpcException,
} from "@nestjs/microservices";
import { catchError } from "rxjs/internal/operators/catchError";

import { SERVICES } from "src/config";
import { CreateEventDto } from "./dto/create-event.dto";
import { first, firstValueFrom } from "rxjs";

@Injectable()
export class EventsService {
	constructor(
		@Inject(SERVICES.NATS_SERVICE) private readonly client: ClientProxy,
	) {}

	find() {
		return this.client.send("events.get.all", { msg: "ok" }).pipe(
			catchError((error) => {
				throw new RpcException(error);
			}),
		);
	}

	findUpcomingEvents() {
		return this.client.send("events.get.upcoming", { msg: "ok" }).pipe(
			catchError((error) => {
				throw new RpcException(error);
			}),
		);
	}

	findUpcomingEventsToday(date: string) {
		return this.client.send("events.get.upcoming.today", date).pipe(
			catchError((error) => {
				throw new RpcException(error);
			}),
		);
	}

	async findOne(id: string) {
		try {
			/*
			* NOTE:
			The client only resolves the promise if the value received through NATS is a primitive array or string.
			Therefore, on the backend we need to serialize the data before publishing it.
			See: https://nats-io.github.io/nats.js/core/index.html#publish-and-subscribe

			As a side effect, we need to parse the response from NATS to JSON.
			 */
			const response = await firstValueFrom(
				this.client.send("events.get.id", id),
			);

			return JSON.parse(response);
			// return response;
		} catch (error) {
			throw new RpcException(error);
		}
	}

	async create(createEventDto: CreateEventDto) {
		try {
			/*
			* NOTE:
			The client only resolves the promise if the value received through NATS is a primitive array or string.
			Therefore, on the backend we need to serialize the data before publishing it.
			See: https://nats-io.github.io/nats.js/core/index.html#publish-and-subscribe

			As a side effect, we need to parse the response from NATS to JSON.
			 */
			const response = await firstValueFrom(
				this.client.send("events.create", createEventDto),
			);
			return JSON.parse(response);
		} catch (error) {
			throw new RpcException(error);
		}
	}
}
