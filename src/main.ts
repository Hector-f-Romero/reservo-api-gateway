import { NestFactory } from "@nestjs/core";
import { Logger, ValidationPipe } from "@nestjs/common";

import { AppModule } from "./app.module";
import { enviromentVariables } from "./config";
import { GlobalRpcExceptionFilter } from "./common/rpc-exception.filter";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const logger = new Logger("Gateway");

	// 1. Set the global prefix for all endpoints.
	app.setGlobalPrefix("/api/v1");

	// TODO: configure CORS.
	app.enableCors();

	// 2. Add the custom rpc error handler
	app.useGlobalFilters(new GlobalRpcExceptionFilter());

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		}),
	);

	await app.listen(enviromentVariables.port);

	logger.log(`Gateway is running on port ${enviromentVariables.port} 🚀`);
}
bootstrap();
