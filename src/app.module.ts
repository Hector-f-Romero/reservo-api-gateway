import { Module } from "@nestjs/common";

import { TransportsModule } from "./transports/transports.module";

@Module({
	imports: [TransportsModule],
	controllers: [],
	providers: [],
})
export class AppModule {}
