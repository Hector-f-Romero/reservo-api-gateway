import { IsString, IsUUID } from "class-validator";
import { UUID } from "node:crypto";

export class CreateSeatDto {
	@IsString()
	tag: string;

	@IsUUID()
	eventId: UUID;
}
