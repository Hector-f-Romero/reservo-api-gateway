import { UUID } from "node:crypto";
import { PartialType } from "@nestjs/mapped-types";
import { IsEnum, IsUUID } from "class-validator";

import { CreateSeatDto } from "./create-seat.dto";
import { SeatState } from "../types/SeatState.enum";

export class UpdateSeatDto extends PartialType(CreateSeatDto) {
	@IsEnum(SeatState)
	state?: SeatState;

	@IsUUID()
	userId?: UUID;
}
