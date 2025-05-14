import { Module } from "@nestjs/common";
import { EventsService } from "./events.service";
import { EventsController } from "./events.controller";
import { TransportsModule } from "src/transports/transports.module";

@Module({
	imports: [TransportsModule],
	controllers: [EventsController],
	providers: [EventsService],
})
export class EventsModule {}
