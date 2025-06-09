import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";

import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { TransportsModule } from "src/transports/transports.module";
import { AuthGuard } from "./guards/auth.guard";

@Module({
	imports: [TransportsModule],
	controllers: [AuthController],
	providers: [
		AuthService,
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		},
	],
})
export class AuthModule {}
