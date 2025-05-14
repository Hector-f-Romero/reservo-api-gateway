import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { catchError } from "rxjs/internal/operators/catchError";

import { SERVICES } from "src/config";
import { CreateEventDto } from "./dto/create-event.dto";

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

	findOne(id: string) {
		return this.client.send("events.get.id", id).pipe(
			catchError((error) => {
				throw new RpcException(error);
			}),
		);
	}

	create(createEventDto: CreateEventDto) {
		return this.client.send("events.create", createEventDto).pipe(
			catchError((error) => {
				throw new RpcException(error);
			}),
		);
	}
}
