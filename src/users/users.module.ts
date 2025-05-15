import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { TransportsModule } from "src/transports/transports.module";

@Module({
	imports: [TransportsModule],
	controllers: [UsersController],
	providers: [UsersService],
})
export class UsersModule {}
