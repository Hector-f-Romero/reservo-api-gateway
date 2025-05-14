import { Module } from "@nestjs/common";

import { TransportsModule } from "./transports/transports.module";
import { EventsModule } from './events/events.module';

@Module({
	imports: [TransportsModule, EventsModule],
	controllers: [],
	providers: [],
})
export class AppModule {}
