import React from 'react';
import { message } from 'antd';
import { injectStripe } from 'react-stripe-elements';
import CardSection from './CardSection';
import history from '../../history';
import axios from 'axios';

const CheckoutForm = (props) => {
	const handleSubmit = (ev) => {
		// We don't want to let default form submission happen here, which would refresh the page.
		ev.preventDefault();

		// See our confirmCardPayment documentation for more:
		// https://stripe.com/docs/stripe-js/reference#stripe-confirm-card-payment
		props.stripe
			.confirmCardPayment(props.clientId, {
				payment_method: {
					card: props.elements.getElement('card'),
					billing_details: {
						name: 'Jenny Rosen'
					}
				}
			})
			.then((res) => {
				const payload = {
					amount: res.paymentIntent.amount,
					cartId: props.cartId
				};
				if (res.paymentIntent) {
					axios
						.put('https://ecommerce-app-be.herokuapp.com//api/payment/complete', payload)
						.then((res) => {
							history.push('/success');
						})
						.catch((err) => {
							message.error('An Error Occurred', err);
						});
				}
				else {
					message.error('Transaction failed');
				}
			})
			.catch((err) => {
				message.error(err.message);
			});
	};

	return (
		<form onSubmit={handleSubmit} data-testid="checkoutFormWrapper">
			<CardSection />
			<button>Confirm order</button>
		</form>
	);
};

export default injectStripe(CheckoutForm);
