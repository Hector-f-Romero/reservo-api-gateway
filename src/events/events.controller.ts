import {
	Body,
	Controller,
	Get,
	Param,
	ParseUUIDPipe,
	Post,
	Query,
} from "@nestjs/common";
import {
	ApiCookieAuth,
	ApiOperation,
	ApiQuery,
	ApiResponse,
} from "@nestjs/swagger";

import { EventsService } from "./events.service";
import { CreateEventDto } from "./dto/create-event.dto";

@Controller("events")
@ApiCookieAuth("cookie-auth")
export class EventsController {
	constructor(private readonly eventsService: EventsService) {}

	@Get()
	@ApiOperation({ summary: "Get all events" })
	@ApiResponse({
		status: 200,
		description: "Return all events in the system",
	})
	find() {
		return this.eventsService.find();
	}
	@Get("/upcoming-detailed")
	@ApiOperation({
		summary: "Get all upcoming events with detailed information",
	})
	@ApiResponse({
		status: 200,
		description: "Return all upcoming events with their details",
	})
	findUpcomingvents() {
		return this.eventsService.findUpcomingEvents();
	}

	@Get("/upcoming")
	@ApiOperation({ summary: "Get upcoming events for a specific date" })
	@ApiQuery({
		name: "date",
		description:
			"ISO 8601 timestamp used to determine which calendar day to query",
		example: "2025-05-30T12:30:00.000Z",
	})
	@ApiResponse({
		status: 200,
		description: "Return upcoming events for the specified date",
		example: ["2025-05-30T14:00:00Z", "2025-05-30T20:00:00Z"],
	})
	findUpcomingEventsToday(@Query("date") date: string) {
		return this.eventsService.findUpcomingEventsByDate(date);
	}

	@Get(":id")
	@ApiOperation({ summary: "Get an event by ID" })
	@ApiResponse({ status: 200, description: "Return the event if found" })
	@ApiResponse({ status: 404, description: "Event not found" })
	findOne(@Param("id", ParseUUIDPipe) id: string) {
		return this.eventsService.findOne(id);
	}

	@Post()
	@ApiOperation({ summary: "Create a new event" })
	@ApiResponse({ status: 201, description: "Event successfully created" })
	@ApiResponse({ status: 400, description: "Invalid event data provided" })
	create(@Body() createEventDto: CreateEventDto) {
		return this.eventsService.create(createEventDto);
	}
}
