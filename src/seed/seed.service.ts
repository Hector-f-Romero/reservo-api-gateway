import { Injectable } from "@nestjs/common";

import { NatsClientWrapper } from "src/transports/nats-client-wrapper.service";

@Injectable()
export class SeedService {
	constructor(private readonly natsClient: NatsClientWrapper) {}

	async executeSeed() {
		await this.natsClient.send("seed.execute", { msg: "ok" });
	}
}
