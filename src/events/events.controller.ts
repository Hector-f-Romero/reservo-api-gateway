import { Controller, Get, Query } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { EventsService } from "./events.service";

@Controller("events")
export class EventsController {
	constructor(private readonly eventsService: EventsService) {}

	@Get("/upcoming/today")
	getUpcomingEventsToday(@Query("date") date: string) {
		return this.eventsService.getUpcomingEventsToday(date);
	}

	// @MessagePattern('findAllEvents')
	// findAll() {
	//   return this.eventsService.findAll();
	// }

	// @MessagePattern('findOneEvent')
	// findOne(@Payload() id: number) {
	//   return this.eventsService.findOne(id);
	// }

	// @MessagePattern('updateEvent')
	// update(@Payload() updateEventDto: UpdateEventDto) {
	//   return this.eventsService.update(updateEventDto.id, updateEventDto);
	// }

	// @MessagePattern('removeEvent')
	// remove(@Payload() id: number) {
	//   return this.eventsService.remove(id);
	// }
}
