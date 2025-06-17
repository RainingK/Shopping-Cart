import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { getCartList } from './apis/api.cart';
import './App.css';
import type { ICart } from './interfaces/interface.cart';
import { formatCurrency } from './utils/currency';

function App () {
	const [ cartItems, setCartItems ] = useState<ICart[]>( [] );
	const [ isLoading, setIsLoading ] = useState( true );

	useEffect( () => {
		fetchCartItems();
	}, [] );

	const fetchCartItems = async () => {
		setIsLoading( true );

		try {
			const res = await getCartList();
			setCartItems( res );
		} catch ( error ) {
			console.error( error );
			toast.error( 'Failed to fetch cart list!' );
		} finally {
			setIsLoading( false );
		}
	};

	const handleQuantityChange = ( id: string, newValue: string ) => {
		const newQuantity = Math.max( 1, Math.min( 999, Number( newValue ) ) );

		setCartItems( ( prev ) =>
			prev.map( ( item ) =>
				item.id === id
					? { ...item, quantity: newQuantity }
					: item
			)
		);
	};

	const calculateItemTotal = ( cartItem: ICart ) => {
		return formatCurrency( Number( cartItem.price ) * cartItem.quantity );
	};

	const calculateTotal = () => {
		return `${ formatCurrency( cartItems.map( item => Number( item.price ) * item.quantity ).reduce( ( pv, cv ) => pv + cv, 0 ) ) }`;
	};

	if ( isLoading ) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-gray-100 p-4'>
				<div className='bg-white rounded-2xl shadow-xl p-6 w-full max-w-3xl flex justify-center items-center'>
					<div
						className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
						role="status"
					>
					</div>
				</div>
			</div>
		);
	}

	if ( cartItems.length == 0 ) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-gray-100 p-4'>
				<div className='bg-white rounded-2xl shadow-xl p-6 w-full max-w-3xl'>
					<div className='flex flex-col justify-center items-center p-4'>
						<h2 className='text-2xl font-bold mb-2'>Your Cart is Empty.</h2>
						<h2 className='text-2xl'>You can add items to your cart from the django admin page.</h2>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-100 p-4'>
			<div className='bg-white rounded-2xl shadow-xl p-6 w-full max-w-3xl'>
				<h2 className='text-2xl font-bold mb-6 text-center'>Cart</h2>

				<div>
					<table className='w-full table-auto border border-collapse'>
						<thead>
							<tr className='text-left bg-black border text-white'>
								<th className='p-3 font-medium'>Product</th>
								<th className='p-3 font-medium text-right'>Quantity</th>
								<th className='p-3 font-medium text-right'>Price (AED)</th>
								<th className='p-3 font-medium text-right'>Subtotal (AED)</th>
							</tr>
						</thead>
						<tbody>
							{ cartItems.map( ( item ) => (
								<tr key={ item.id } className='border hover:bg-gray-50'>
									<td className='p-3'>{ item.product_name }</td>
									<td className='p-3 text-right'>
										<input
											type='number'
											min={ 1 }
											max={ 999 }
											maxLength={ 3 }
											value={ item.quantity }
											onChange={ ( e ) =>
												handleQuantityChange( item.id, e.target.value )
											}
											className='w-16 px-2 py-1 border rounded-lg text-center'
										/>
									</td>
									<td className='p-3 text-right'>{ formatCurrency( Number( item.price ) ) }</td>
									<td className='min-w-20 p-3 font-semibold text-right'>
										{ calculateItemTotal( item ) }
									</td>
								</tr>
							) ) }
						</tbody>
					</table>
				</div>

				<div className='flex justify-end items-center mt-6'>
					<p className='text-xl font-semibold mr-2'>Total:</p>
					<p className='text-xl font-bold text-blue-600'>
						{ calculateTotal() } AED
					</p>
				</div>

				<button
					onClick={ () => { } }
					className='mt-6 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition hover:cursor-pointer'
				>
					Buy
				</button>
			</div>

			<Toaster position='bottom-right' />
		</div>
	);
}

export default App;
