import React, {  useEffect } from 'react';

const Modal = ({
	text,
	autoCloseTime,
	isVisible,
	onClickClose,
}: {
	text: string;
	autoCloseTime?: number;
	isVisible: boolean;
	onClickClose: () => void
}) => {
	useEffect(() => {
		if (autoCloseTime && isVisible) {
			const timer = setTimeout(() => {
				onClickClose()
                console.log('close')
			}, autoCloseTime);

			return () => clearTimeout(timer); 
		}
	}, [isVisible]);

	// const handleClose = () => {
	// 	onClickClose()
	// };

	if (!isVisible) return null;

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
			<div className="bg-red-400 p-6 rounded shadow-lg">
				<div className='text-black text-base'>{text}</div>
			
			</div>
		</div>
	);
};

export default Modal;
