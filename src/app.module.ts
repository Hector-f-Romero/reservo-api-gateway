import { Module } from "@nestjs/common";

import { TransportsModule } from "./transports/transports.module";
import { EventsModule } from "./events/events.module";
import { UsersModule } from "./users/users.module";
import { SeatsModule } from './seats/seats.module';

@Module({
	imports: [TransportsModule, EventsModule, UsersModule, SeatsModule],
	controllers: [],
	providers: [],
})
export class AppModule {}
