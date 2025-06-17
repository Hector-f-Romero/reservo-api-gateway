import { Module } from "@nestjs/common";

import { TransportsModule } from "./transports/transports.module";
import { EventsModule } from "./events/events.module";
import { UsersModule } from "./users/users.module";
import { SeatsModule } from "./seats/seats.module";
import { AuthModule } from "./auth/auth.module";
import { SeedModule } from "./seed/seed.module";

@Module({
	imports: [
		TransportsModule,
		EventsModule,
		UsersModule,
		SeatsModule,
		AuthModule,
		SeedModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
