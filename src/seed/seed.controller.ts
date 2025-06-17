import { Controller, HttpCode, Post } from "@nestjs/common";
import { ApiNoContentResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { SeedService } from "./seed.service";
import { PublicRoute } from "src/common/decorators/public-route.decorator";

@Controller("seed")
export class SeedController {
	constructor(private readonly seedService: SeedService) {}

	@PublicRoute()
	@Post()
	@HttpCode(204)
	@ApiOperation({
		summary: "Run the initial data seed process",
		description: `
This endpoint triggers the seed process for the user microservice in the event system.
It creates test users such as \`test1\` and \`test2\` in the database.

After a successful execution, you must call the login endpoint to authenticate and obtain the session cookie named \`access-token\`.

- **Created users:** \`test1\` and \`test2\`.
- **Password:** value of the environment variable \`DEFAULT_PASSWORD_SEED_USERS\` defined in the \`.env\` file of the \`event-user-ms\` microservice. Check <a href="https://github.com/Hector-f-Romero/reservo-events-user-ms" target="_blank">Reservo Events User MS repository</a>.

Once authenticated, this \`access-token\` cookie will be required to access the system’s protected endpoints.
`,
	})
	@ApiNoContentResponse({
		description: "Seed executed successful. Please login with an test user",
	})
	async create(): Promise<void> {
		await this.seedService.executeSeed();
	}
}
