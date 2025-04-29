import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { Response } from "express";

@Catch(RpcException)
export class GlobalRpcExceptionFilter implements ExceptionFilter {
	catch(exception: RpcException, host: ArgumentsHost) {
		// 1. Obtenemos el contexto en forma HTTP, pues las excepciones de RPC no son compatibles de todo con el protocolo HTTP
		const ctx = host.switchToHttp();

		// 2. Vamos a devolver al usuario una response HTTP, así que la obtenemos para posteriormente, añadirle nuestro mensaje de error
		const response = ctx.getResponse<Response>();

		// 3. Obtenemos el error RPC del NATS
		const rpcError = exception.getError();

		if (rpcError.toString().includes("Empty response")) {
			// Esto es para devolver en http un mensaje cuando el nats responda "Empty response". Por lo que se entiende, el nats manda mensajes de error de esta forma y así podemos extraer información relevante.
			return response.status(500).json({
				status: 500,
				message: rpcError
					.toString()
					.substring(0, rpcError.toString().indexOf("(") - 1),
			});
		}

		// Si la excepción atrapa un objeto que posea las propiedades "status" y "message", le daremos un trato especial, pues este error puede venir tanto como objeto como string
		if (
			typeof rpcError === "object" &&
			"status" in rpcError &&
			"message" in rpcError
		) {
			// Verificamos si el status es un número, al tratar de convertirlo con el operador "+". Si no se puede convertir a un número, entonces lo tomaremos como un error 400 genérico
			const status = Number.isNaN(rpcError.status)
				? 400
				: +rpcError.status;

			return response.status(status).json(rpcError);
		}

		return response.status(400).json({
			status: 400,
			message: rpcError,
		});
	}
}
