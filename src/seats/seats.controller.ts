import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	ParseUUIDPipe,
} from "@nestjs/common";
import {
	ApiCookieAuth,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger";
import { UUID } from "node:crypto";

import { SeatsService } from "./seats.service";
import { CreateSeatDto } from "./dto/create-seat.dto";
import { UpdateSeatDto } from "./dto/update-seat.dto";
import { CreateAllSeatsDto } from "./dto/create-all-seats.dto";

@Controller("seats")
@ApiCookieAuth("cookie-auth")
export class SeatsController {
	constructor(private readonly seatsService: SeatsService) {}

	@Get(":id")
	@ApiOperation({ summary: "Get a seat by ID" })
	@ApiParam({
		name: "id",
		type: "string",
		description: "Seat UUID v4",
		example: "03634755-5055-4b9f-a9a9-5de014214b5e",
	})
	@ApiResponse({ status: 200, description: "Return a seat if found" })
	@ApiResponse({ status: 404, description: "Seat not found" })
	findOne(@Param("id", ParseUUIDPipe) id: UUID) {
		return this.seatsService.findOne(id);
	}

	@Post()
	@ApiOperation({ summary: "Create a single seat" })
	@ApiResponse({ status: 201, description: "Seat successfully created" })
	@ApiResponse({ status: 400, description: "Invalid seat data provided" })
	create(@Body() createSeatDto: CreateSeatDto) {
		return this.seatsService.create(createSeatDto);
	}

	@Post("/all")
	@ApiOperation({ summary: "Create multiple seats for an event" })
	@ApiResponse({ status: 201, description: "Seats successfully created" })
	@ApiResponse({ status: 400, description: "Invalid seats data provided" })
	createAll(@Body() createAllSeatsDto: CreateAllSeatsDto) {
		return this.seatsService.createAll(createAllSeatsDto);
	}

	@Patch(":id")
	@ApiOperation({ summary: "Update seat information" })
	@ApiParam({
		name: "id",
		type: "string",
		description: "Seat UUID v4",
		example: "03634755-5055-4b9f-a9a9-5de014214b5e",
	})
	@ApiResponse({ status: 200, description: "Seat successfully updated" })
	@ApiResponse({ status: 400, description: "Invalid update data provided" })
	@ApiResponse({ status: 404, description: "Seat not found" })
	update(
		@Param("id", ParseUUIDPipe) id: UUID,
		@Body() updateSeatDto: UpdateSeatDto,
	) {
		return this.seatsService.update(id, updateSeatDto);
	}
}
