import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	ParseUUIDPipe,
	UseInterceptors,
} from "@nestjs/common";
import { UUID } from "node:crypto";

import { SeatsService } from "./seats.service";
import { CreateSeatDto } from "./dto/create-seat.dto";
import { UpdateSeatDto } from "./dto/update-seat.dto";
import { CreateAllSeatsDto } from "./dto/create-all-seats.dto";
import { NatsMessagesInterceptor } from "src/common/interceptors/natsMessages.interceptor";

@UseInterceptors(NatsMessagesInterceptor)
@Controller("seats")
export class SeatsController {
	constructor(private readonly seatsService: SeatsService) {}

	@Get(":id")
	findOne(@Param("id", ParseUUIDPipe) id: UUID) {
		return this.seatsService.findOne(id);
	}

	@Post()
	create(@Body() createSeatDto: CreateSeatDto) {
		return this.seatsService.create(createSeatDto);
	}

	@Post("/all")
	createAll(createAllSeatsDto: CreateAllSeatsDto) {
		return this.seatsService.createAll(createAllSeatsDto);
	}

	@Patch(":id")
	update(
		@Param("id", ParseUUIDPipe) id: UUID,
		@Body() updateSeatDto: UpdateSeatDto,
	) {
		return this.seatsService.update(id, updateSeatDto);
	}
}
