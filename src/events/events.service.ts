import { Injectable } from "@nestjs/common";

import { CreateEventDto } from "./dto/create-event.dto";
import { NatsClientWrapper } from "src/transports/nats-client-wrapper.service";

@Injectable()
export class EventsService {
	constructor(private readonly natsClient: NatsClientWrapper) {}

	async find() {
		return await this.natsClient.send("events.get.all", { msg: "ok" });
	}

	async findUpcomingEvents() {
		return await this.natsClient.send("events.get.upcoming", { msg: "ok" });
	}

	async findUpcomingEventsByDate(date: string) {
		return await this.natsClient.send("events.get.upcoming.date", date);
	}

	async findOne(id: string) {
		return await this.natsClient.send("events.get.id", id);
	}

	async create(createEventDto: CreateEventDto) {
		return await this.natsClient.send("events.create", createEventDto);
	}
}
