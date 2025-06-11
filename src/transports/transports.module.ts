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
			/*
			 * ESPECIFICAMOS QUE CUANDO ALGUIEN QUIERA INYECTAR ESTE PROVIDER (NatsClientWrapper),
			 * DEBA SEGUIR ESTA CONFIGURACIÓN. ESTO PERMITE, QUE SIEMPRE USE EL MISMO CLIENT PROXY,
			 * PERO ANTERIORMENTE DEBE CONFIGURARSE.
			 * INYECTAMOS EL CLIENTE NATS CONFIGURADO ARRIBA.
			 */

			provide: NatsClientWrapper, // VAMOS A EXPORTAR UNA ÚNICA CLASE QUE MANEJA LAS CONEXIONES DE NATS. PARA ESO, CREAMOS EL PROVIDER A NIVEL DE MÓDULO Y LE ESPECIFICAMOS AQUÍ QUE DEPENDENCIA NECESITA, PARA NO DEFINIRLA DENTRO DEL SERVICIO
			useFactory: (client: ClientProxy) => new NatsClientWrapper(client), // CUANDO NEST NECESITE CREAR LA INSTANCIA, HACE EL NEW
			inject: [{ token: SERVICES.NATS_SERVICE, optional: false }],
		},
	],
	exports: [NatsClientWrapper],
})
export class TransportsModule {}
