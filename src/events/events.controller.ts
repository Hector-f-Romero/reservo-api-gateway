import {
	Body,
	Controller,
	Get,
	Param,
	ParseUUIDPipe,
	Post,
	Query,
	UseInterceptors,
} from "@nestjs/common";

import { EventsService } from "./events.service";
import { CreateEventDto } from "./dto/create-event.dto";
import { NatsMessagesInterceptor } from "src/common/interceptors/natsMessages.interceptor";

@UseInterceptors(NatsMessagesInterceptor)
@Controller("events")
export class EventsController {
	constructor(private readonly eventsService: EventsService) {}

	@Get()
	find() {
		return this.eventsService.find();
	}

	@Get("/upcoming-detailed")
	findUpcomingvents() {
		return this.eventsService.findUpcomingEvents();
	}

	@Get("/upcoming")
	findUpcomingEventsToday(@Query("date") date: string) {
		return this.eventsService.findUpcomingEventsByDate(date);
	}

	@Get(":id")
	findOne(@Param("id", ParseUUIDPipe) id: string) {
		return this.eventsService.findOne(id);
	}

	@Post()
	create(@Body() createEventDto: CreateEventDto) {
		return this.eventsService.create(createEventDto);
	}
}
