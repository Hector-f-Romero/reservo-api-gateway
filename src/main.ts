import { NestFactory } from "@nestjs/core";
import { Logger, ValidationPipe, VersioningType } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as cookieParser from "cookie-parser";

import { AppModule } from "./app.module";
import { enviromentVariables } from "./config";
import { GlobalRpcExceptionFilter } from "./common/rpc-exception.filter";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const logger = new Logger("Gateway");

	// TODO: configure CORS.
	app.enableCors({
		origin: ["http://localhost:4321"],
		credentials: true,
	});

	// 1. Set the global prefix for all endpoints.
	app.setGlobalPrefix("api");

	// 2. Enable URI versioning.
	app.enableVersioning({
		type: VersioningType.URI,
		prefix: "v",
		defaultVersion: "1",
	});

	// 3. Configure cookies.
	app.use(cookieParser());

	// 4. Configure Swagger
	const swaggerConfig = new DocumentBuilder()
		.setTitle("Reservo Gateway API")
		.setVersion("1.0.0")
		.setDescription(
			"This documentation describes an API Gateway for Reservo app built with NestJS communicating via NATS with three microservices. More information in my GitHub profile: `Hector-f-Romero`.",
		)
		.addServer("http://localhost:3000/api", "Local enviroment")
		.addCookieAuth(
			"access-token",
			{
				type: "apiKey",
				in: "cookie",
				name: "access-token",
				description: "Authentication JWT cookie",
			},
			"cookie-auth",
		)

		.build();

	const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig, {
		ignoreGlobalPrefix: true,
	});

	SwaggerModule.setup("api", app, swaggerDocument, {
		swaggerOptions: {
			persistAuthorization: true,
		},
	});

	// 5. Add the custom rpc error handler
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
