import { Global, Module } from "@nestjs/common";
import { ClientProxy, ClientsModule, Transport } from "@nestjs/microservices";

import { enviromentVariables, SERVICES } from "src/config";
import { NatsClientWrapper } from "./nats-client-wrapper.service";

@Global()
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
	providers: [
		{
			/**
			 * This provider makes NatsClientWrapper globally available with a configured NATS client.
			 *
			 * We define a factory that receives a configured ClientProxy (set up in ClientsModule above),
			 * and returns an instance of NatsClientWrapper.
			 *
			 * This way, the wrapper always uses the same centralized ClientProxy instance for NATS communication,
			 * keeping the logic clean and consistent across services.
			 */
			provide: NatsClientWrapper,
			useFactory: (client: ClientProxy) => new NatsClientWrapper(client),
			inject: [{ token: SERVICES.NATS_SERVICE, optional: false }],
		},
	],
	exports: [NatsClientWrapper],
})
export class TransportsModule {}
