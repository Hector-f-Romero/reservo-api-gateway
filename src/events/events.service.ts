import { Inject, Injectable } from "@nestjs/common";
import { SERVICES } from "src/config";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { catchError } from "rxjs/internal/operators/catchError";

@Injectable()
export class EventsService {
	constructor(
		@Inject(SERVICES.NATS_SERVICE) private readonly client: ClientProxy,
	) {}

	getUpcomingEventsToday(date: string) {
		return this.client.send("events.get.upcoming", date).pipe(
			// Estamos manejando los errores que vengan del servidor de NATS
			catchError((error) => {
				throw new RpcException(error);
			}),
		);
	}

	// create(createEventDto: CreateEventDto) {
	//   return 'This action adds a new event';
	// }

	// findAll() {
	//   return `This action returns all events`;
	// }

	// findOne(id: number) {
	//   return `This action returns a #${id} event`;
	// }

	// update(id: number, updateEventDto: UpdateEventDto) {
	//   return `This action updates a #${id} event`;
	// }

	// remove(id: number) {
	//   return `This action removes a #${id} event`;
	// }
}
