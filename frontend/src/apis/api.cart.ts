import axios from 'axios';
import type { ICart } from '../interfaces/interface.cart';
import { API_ENDPOINTS, getAPIEndpoint } from './endpoints';

/**
 * Fetches the cart list from the backend
 * @returns all the cart items from the backend
 */
export const getCartList = async (): Promise<ICart[]> => {
	const url = getAPIEndpoint( API_ENDPOINTS.cart.getCartItems );

	return ( await axios.get<ICart[]>( url ) ).data;
};