import { Module } from "@nestjs/common";
import { SeatsService } from "./seats.service";
import { SeatsController } from "./seats.controller";
import { TransportsModule } from "src/transports/transports.module";

@Module({
	imports: [TransportsModule],
	controllers: [SeatsController],
	providers: [SeatsService],
})
export class SeatsModule {}
