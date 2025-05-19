import { IsArray, IsString, IsUUID } from "class-validator";
import { UUID } from "node:crypto";

export class CreateAllSeatsDto {
	@IsArray()
	@IsString({ each: true })
	seats: string[];

	@IsUUID("4")
	eventId: UUID;
}
