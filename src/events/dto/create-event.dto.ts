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

export class CreateEventDto {
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

	@IsUUID("4")
	organizedBy: string;

	@IsArray()
	@ArrayNotEmpty()
	@IsString({ each: true })
	seats: string[];
}
