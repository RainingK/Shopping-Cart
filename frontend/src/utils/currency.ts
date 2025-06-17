/**
 * Converts a number into a currency string
 * @param amount a number to currency
 * @returns a number in the currency format with comma separation and decimal points
 */
export const formatCurrency = ( amount: number ) => {
	return amount.toLocaleString( 'en-AE', {
		minimumFractionDigits: 2
	} );
};