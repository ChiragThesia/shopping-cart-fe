import React from 'react';
import history from '../../history';

const CheckoutSuccessView = (props) => {
	const orderNumber = window.location.href.split('/');
	const storeURL = localStorage.getItem('storeUrl');
	console.log(storeURL);
	return (
		<div>
			<div className="cardContainer">
				<img alt="cardImage" src="" />
				<h1> Order Made </h1>
				<h3>You’ll recieve a text between you and the seller with more information</h3>
				<div className="infoContainer">
					<h3>
						<span>Order Number:</span> {orderNumber[orderNumber.length - 1].substr(-8).toUpperCase()}
					</h3>
					<h3>
						<span>Number Sent To:</span> 123 - 345 - 6789
					</h3>
				</div>

				<button
					onClick={() => {
						history.push(storeURL);
					}}
				>
					Back To Store
				</button>
			</div>
		</div>
	);
};

export default CheckoutSuccessView;
