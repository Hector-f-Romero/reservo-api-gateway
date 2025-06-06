import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { UUID } from "node:crypto";

import { SERVICES } from "src/config";
import { CreateSeatDto } from "./dto/create-seat.dto";
import { UpdateSeatDto } from "./dto/update-seat.dto";
import { CreateAllSeatsDto } from "./dto/create-all-seats.dto";

@Injectable()
export class SeatsService {
	constructor(@Inject(SERVICES.NATS_SERVICE) readonly client: ClientProxy) {}

	async findOne(id: UUID) {
		const response = await firstValueFrom(
			this.client.send("seats.get.id", id),
		);

		return response;
	}

	async create(createSeatDto: CreateSeatDto) {
		const response = await firstValueFrom(
			this.client.send("seats.create", createSeatDto),
		);

		return response;
	}

	async createAll(createAllSeatsDto: CreateAllSeatsDto) {
		const response = await firstValueFrom(
			this.client.send("seats.create.all", createAllSeatsDto),
		);

		return response;
	}

	async update(id: UUID, updateSeatDto: UpdateSeatDto) {
		const response = await firstValueFrom(
			this.client.send("seats.update", {
				id,
				updateSeatRequestDto: updateSeatDto,
			}),
		);

		return response;
	}
}
