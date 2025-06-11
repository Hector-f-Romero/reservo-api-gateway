import { Injectable } from "@nestjs/common";
import { UUID } from "node:crypto";

import { CreateSeatDto } from "./dto/create-seat.dto";
import { UpdateSeatDto } from "./dto/update-seat.dto";
import { CreateAllSeatsDto } from "./dto/create-all-seats.dto";
import { NatsClientWrapper } from "src/transports/nats-client-wrapper.service";

@Injectable()
export class SeatsService {
	constructor(private readonly natsClient: NatsClientWrapper) {}

	async findOne(id: UUID) {
		return await this.natsClient.send("seats.get.id", id);
	}

	async create(createSeatDto: CreateSeatDto) {
		return await this.natsClient.send("seats.create", createSeatDto);
	}

	async createAll(createAllSeatsDto: CreateAllSeatsDto) {
		return await this.natsClient.send(
			"seats.create.all",
			createAllSeatsDto,
		);
	}

	async update(id: UUID, updateSeatDto: UpdateSeatDto) {
		return await this.natsClient.send("seats.update", {
			id,
			updateSeatRequestDto: updateSeatDto,
		});
	}
}
