import { SetMetadata } from "@nestjs/common";

export const IS_PUBLIC_ROUTE = "is-public-route";

/*
 * This decorator sets a metadata flag (`is-public-route: true') that can be read by guards using
 * the "Reflector" utility to determine whether a route shoulds skip authentication.
 */
export function PublicRoute() {
	return SetMetadata(IS_PUBLIC_ROUTE, true);
}
