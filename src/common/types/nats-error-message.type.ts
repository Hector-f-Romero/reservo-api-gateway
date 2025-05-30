import { NatsMessage } from "./nats-message.type";

export type NatsErrorMessage = NatsMessage & {
	path: string;
};
