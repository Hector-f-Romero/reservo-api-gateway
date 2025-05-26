import { Module } from "@nestjs/common";

import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { TransportsModule } from "src/transports/transports.module";

@Module({
	imports: [TransportsModule],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}
