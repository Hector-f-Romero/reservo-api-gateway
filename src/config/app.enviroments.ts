import "dotenv/config";
import * as Joi from "joi";

interface EnviromentVaraibles {
	PORT: number;
	NATS_SERVER: string;
}

const enviromentSchema = Joi.object({
	PORT: Joi.number().required(),
	NATS_SERVER: Joi.string().required(),
}).unknown();

// Leemos toda la información del process.env de forma síncrona y validamos si cumple con nuestro esquema.
// Toca usar si o sí dotenv para que lea el archivo antes de que monté el servidor web con NestJS 10
const { error, value } = enviromentSchema.validate({
	...process.env,
});

// Si hay un error con nuestras variables que definimos, lanza error
if (error) {
	throw new Error(`Enviroments error: ${error.message}`);
}

// Guardamos las variables leídas del process.env en un objeto con nuestro tipo. Este paso se hace únicamente para poder tener los tipos y el autocompletado, ya que value es de tipo any
const env: EnviromentVaraibles = value;

// Exportamos para toda nuestra aplicación, las variables de entorno propias
export const enviromentVariables = {
	port: env.PORT,
	natsSever: env.NATS_SERVER,
};
