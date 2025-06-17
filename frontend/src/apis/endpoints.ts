import { API_BASE_URL } from "../constants/secrets";

const CART_ENDPOINT = '/cart';

export const API_ENDPOINTS = {
	cart: {
		getCartItems: `${ API_BASE_URL }${ CART_ENDPOINT }/get-cart-list`,
	}
};

/**
 * Generates Endpoints based on parameters
 * @param endpoint Url to point to
 * @param params query params to append to the url
 * @returns URL string
 */
export const getAPIEndpoint = ( endpoint: string, params?: Record<string, string> ) => {
	const url = new URL( endpoint );

	Object.entries( params || {} ).forEach( ( [ key, value ] ) => {
		url.searchParams.append( key, value );
	} );

	return url.toString();
};