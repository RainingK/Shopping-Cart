import { isAxiosError } from 'axios';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { getCartList, placeOrder } from './apis/api.cart';
import './App.css';
import Modal from './components/Modal';
import type { ICart } from './interfaces/interface.cart';
import { formatCurrency } from './utils/currency';

function App () {
	const [ cartItems, setCartItems ] = useState<ICart[]>( [] );
	const [ errorMessages, setErrorMessages ] = useState<Record<string, string>>( {} );
	const [ isLoading, setIsLoading ] = useState( true );
	const [ showModal, setShowModal ] = useState( false );

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

	const submit = async () => {
		setIsLoading( true );

		try {
			await placeOrder( cartItems );
			resetQuantity();
			setErrorMessages( {} );
			setShowModal( true );
			// toast.success( 'Order placed Successfully!' );
		} catch ( error ) {
			console.error( error );

			const possibleErrors: Record<string, string> = {};

			if ( isAxiosError( error ) ) {
				const cartErrors = error.response?.data?.carts;
				for ( const cartError of cartErrors ) {
					if ( !cartError?.quantity ) continue;

					possibleErrors[ cartError.quantity[ 'id' ] ] = cartError.quantity[ 'message' ];
				}

				setErrorMessages( possibleErrors );
				toast.error( 'There are some issues with your order. Please correct them and order again.' );
			} else {
				toast.error( 'Failed to order.' );
			}
		} finally {
			setIsLoading( false );
		}
	};

	const resetQuantity = () => {
		const itemMap = {
			'Potatoes': 2,
			'Carrots': 1,
			'Onions': 1,
		};

		setCartItems( prev =>
			prev.map(
				item => ( {
					...item,
					quantity: itemMap[ item.product_name as keyof typeof itemMap ]
				} )
			)
		);
	};

	if ( isLoading ) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-gray-100 px-2 sm:px-4'>
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
			<div className='min-h-screen flex items-center justify-center bg-gray-100 px-2 sm:px-4'>
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
		<div className='min-h-screen flex items-center justify-center bg-gray-100 px-2 sm:px-4'>
			<div className='bg-white rounded-2xl shadow-xl p-6 w-full max-w-3xl'>
				<form action={ submit }>
					<h2 className='text-2xl font-bold mb-6 text-center'>Cart</h2>

					<div className='overflow-x-auto'>
						<table className='w-full table-auto border border-collapse'>
							<thead>
								<tr className='text-left bg-black border text-white'>
									<th className='p-2 sm:p-3 text-sm'>Product</th>
									<th className='p-2 sm:p-3 text-sm text-right'>Quantity (KG)</th>
									<th className='p-2 sm:p-3 text-sm text-right'>Price (AED)</th>
									<th className='p-2 sm:p-3 text-sm text-right'>Subtotal (AED)</th>
								</tr>
							</thead>
							<tbody>
								{ cartItems.map( ( item ) => (
									<tr key={ item.id } className='border hover:bg-gray-50 align-top'>
										<td className='p-3' colSpan={ 1 }>
											<div className='whitespace-pre-wrap'>
												<div>{ item.product_name }</div>

												{ errorMessages[ item.id ] && (
													<div className='mt-1 text-red-500 text-xs leading-snug'>
														{ errorMessages[ item.id ] }
													</div>
												) }
											</div>
										</td>

										<td className='p-3 text-right align-middle'>
											<input
												type='number'
												min={ 1 }
												max={ 999 }
												maxLength={ 3 }
												value={ item.quantity }
												onChange={ ( e ) => handleQuantityChange( item.id, e.target.value ) }
												className='w-16 sm:w-20 px-2 py-1 border rounded-lg text-right text-sm'
											/>
										</td>

										<td className='p-3 text-right align-middle'>{ formatCurrency( Number( item.price ) ) }</td>

										<td className='min-w-20 p-3 font-semibold text-right align-middle'>
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
						type='submit'
						className='mt-6 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition hover:cursor-pointer'
						disabled={ isLoading }
					>
						Buy
					</button>
				</form>
			</div>

			<Modal show={ showModal } onClose={ () => setShowModal( false ) } message='Successfully Placed Order!' />
			<Toaster position='bottom-right' />
		</div>
	);
}

export default App;
