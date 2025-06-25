import { InputAdornment, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, TextField } from '@mui/material';
import { useState } from 'react';
import type { ICart } from '../interfaces/interface.cart';
import { formatCurrency } from '../utils/currency';

type Order = 'asc' | 'desc';

interface Props {
	cartItems: ICart[];
	handleQuantityChange: ( id: string, newValue: string ) => void;
	errorMessages: Record<string, string>;
}

const CartTable = ( { cartItems, handleQuantityChange, errorMessages }: Props ) => {
	const [ order, setOrder ] = useState<Order>( 'asc' );
	const [ orderBy, setOrderBy ] = useState<keyof ICart>( 'product_name' );

	const handleSort = ( property: keyof ICart ) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder( isAsc ? 'desc' : 'asc' );
		setOrderBy( property );
	};

	const sortedItems = [ ...cartItems ].sort( ( a, b ) => {
		if ( a[ orderBy ]! < b[ orderBy ]! ) return order === 'asc' ? -1 : 1;
		if ( a[ orderBy ]! > b[ orderBy ]! ) return order === 'asc' ? 1 : -1;
		return 0;
	} );

	const calculateItemTotal = ( cartItem: ICart ) => {
		return formatCurrency( Number( cartItem.price ) * cartItem.quantity );
	};

	return (
		<TableContainer component={ Paper }>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>
							<TableSortLabel
								active={ orderBy === 'product_name' }
								direction={ order }
								onClick={ () => handleSort( 'product_name' ) }
							>
								Product
							</TableSortLabel>
						</TableCell>

						<TableCell align='right'>Quantity (KG)</TableCell>

						<TableCell align='right'>
							<TableSortLabel
								active={ orderBy === 'price' }
								direction={ order }
								onClick={ () => handleSort( 'price' ) }
							>
								Price (AED)
							</TableSortLabel>
						</TableCell>

						<TableCell align='right'>Subtotal (AED)</TableCell>
					</TableRow>
				</TableHead>

				<TableBody>
					{ sortedItems.map( item => (
						<TableRow key={ item.id } hover>
							<TableCell>
								<div style={ { whiteSpace: 'pre-wrap' } }>
									<div>{ item.product_name }</div>
									{ errorMessages[ item.id ] && (
										<div style={ { color: 'red', fontSize: 12, marginTop: 4 } }>
											{ errorMessages[ item.id ] }
										</div>
									) }
								</div>
							</TableCell>

							<TableCell align='right'>
								<TextField
									type='number'
									size='small'
									slotProps={ {
										htmlInput: {
											min: 1,
											max: 999,
											style: { textAlign: 'right' }
										},
										input: {
											endAdornment: <InputAdornment position='end'>KG</InputAdornment>,
										},
									} }
									value={ item.quantity }
									onChange={ ( e ) =>
										handleQuantityChange( item.id, e.target.value )
									}
									style={ { width: 100 } }
								/>
							</TableCell>

							<TableCell align='right'>{ formatCurrency( Number( item.price ) ) }</TableCell>

							<TableCell align='right'><strong>{ calculateItemTotal( item ) }</strong></TableCell>
						</TableRow>
					) ) }
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default CartTable;
