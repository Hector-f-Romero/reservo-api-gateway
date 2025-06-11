export interface MicroserviceResponse<T> {
	status: string;
	code: number;
	message: T;
}
