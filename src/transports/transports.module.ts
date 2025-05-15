import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";

import { enviromentVariables, SERVICES } from "src/config";

@Module({
	imports: [
		ClientsModule.register([
			{
				name: SERVICES.NATS_SERVICE,
				transport: Transport.NATS,
				options: {
					servers: enviromentVariables.natsSever,
					debug: true,
					timeout: 10000,
				},
			},
		]),
	],
	exports: [
		ClientsModule.register([
			{
				name: SERVICES.NATS_SERVICE,
				transport: Transport.NATS,
				options: {
					servers: enviromentVariables.natsSever,
					debug: true,
					timeout: 10000,
				},
			},
		]),
	],
})
export class TransportsModule {}
