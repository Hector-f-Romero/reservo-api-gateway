import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

import { SERVICES } from "src/config";
import { CreateEventDto } from "./dto/create-event.dto";

@Injectable()
export class EventsService {
	constructor(
		@Inject(SERVICES.NATS_SERVICE) private readonly client: ClientProxy,
	) {}

	async find() {
		/*
			* NOTE:
			The client only resolves the promise if the value received through NATS is a primitive array or string.
			Therefore, on the backend we need to serialize the data before publishing it.
			See: https://nats-io.github.io/nats.js/core/index.html#publish-and-subscribe

			As a side effect, we need to parse the response from NATS to JSON.
			 */

		const response = await firstValueFrom(
			this.client.send("events.get.all", { msg: "ok" }),
		);

		return response;
	}

	async findUpcomingEvents() {
		const response = await firstValueFrom(
			this.client.send("events.get.upcoming", { msg: "ok" }),
		);

		return response;
	}

	async findUpcomingEventsByDate(date: string) {
		const response = await firstValueFrom(
			this.client.send("events.get.upcoming.today", date),
		);

		return response;
	}

	async findOne(id: string) {
		const response = await firstValueFrom(
			this.client.send("events.get.id", id),
		);

		return response;
	}

	async create(createEventDto: CreateEventDto) {
		return await firstValueFrom(
			this.client.send("events.create", createEventDto),
		);
	}
}
