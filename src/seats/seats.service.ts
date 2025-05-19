import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
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
		try {
			const response = await firstValueFrom(
				this.client.send("seats.get.id", id),
			);

			return response;
		} catch (error) {
			throw new RpcException(error);
		}
	}

	async create(createSeatDto: CreateSeatDto) {
		try {
			const response = await firstValueFrom(
				this.client.send("seats.create", createSeatDto),
			);

			return JSON.parse(response);
		} catch (error) {
			throw new RpcException(error);
		}
	}

	async createAll(createAllSeatsDto: CreateAllSeatsDto) {
		try {
			const response = await firstValueFrom(
				this.client.send("seats.create.all", createAllSeatsDto),
			);

			return JSON.parse(response);
		} catch (error) {
			throw new RpcException(error);
		}
	}

	async update(id: UUID, updateSeatDto: UpdateSeatDto) {
		try {
			const response = await firstValueFrom(
				this.client.send("seats.update", {
					id,
					updateSeatRequestDto: updateSeatDto,
				}),
			);

			return JSON.parse(response);
		} catch (error) {
			throw new RpcException(error);
		}
	}
}
