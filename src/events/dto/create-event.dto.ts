import {
	IsPositive,
	IsNumber,
	IsString,
	IsUUID,
	IsISO8601,
	IsOptional,
	ValidateNested,
	IsArray,
	ArrayNotEmpty,
	IsEnum,
} from "class-validator";

// TODO: PUT THIS IN ITS RESPECTIVE MODULE
class UserDto {
	@IsUUID("4")
	id: string;

	@IsString()
	name: string;

	@IsString()
	username: string;

	@IsString()
	email: string;
}

// TODO: PUT THIS IN ITS RESPECTIVE MODULE
enum SeatState {
	AVAILABLE = "AVAILABLE",
	PENDING = "PENDING",
	OCCUPIED = "OCCUPIED",
}

// TODO: PUT THIS IN ITS RESPECTIVE MODULE
class SeatSummaryDto {
	@IsUUID()
	id: string;

	@IsString()
	tag: string;

	@IsEnum(SeatState)
	state: SeatState;
}

export class CreateEventDto {
	@IsUUID()
	id: string;

	@IsString()
	name: string;

	@IsString()
	description: string;

	@IsString()
	@IsISO8601()
	date: string;

	@IsNumber()
	@IsPositive()
	capacity: number;

	@IsOptional()
	@ValidateNested()
	organizedBy: UserDto | null;

	@IsArray()
	@ArrayNotEmpty()
	@ValidateNested()
	seats: SeatSummaryDto[];
}
