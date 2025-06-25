import { useEffect } from 'react';

interface ModalProps {
	show: boolean;
	onClose: () => void;
	message: string;
}

const Modal = ( { show, onClose, message }: ModalProps ) => {
	useEffect( () => {
		if ( show ) {
			const timer = setTimeout( () =>
				onClose(),
				3000
			);
			return () => clearTimeout( timer );
		}
	}, [ show, onClose ] );

	if ( !show ) return null;

	return (
		<div className='fixed inset-0 backdrop-blur-xs bg-black/20 flex items-center justify-center z-50'>
			<div className='bg-white p-6 rounded-xl shadow-lg w-full max-w-md text-center'>
				<h2 className='text-2xl font-semibold text-green-600 mb-2'>Success!</h2>
				<p className=''>{ message }</p>

				<button
					onClick={ onClose }
					className='mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition hover:cursor-pointer'
				>
					Close
				</button>

				<div className='h-1 w-full bg-gray-200 rounded overflow-hidden mt-6'>
					<div className='h-full bg-blue-500 animate-progress' />
				</div>
			</div>
		</div>
	);
};

export default Modal;
