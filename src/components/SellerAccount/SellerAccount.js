import React, { useState, useEffect } from 'react';
import axiosWithAuth from '../Auth/axiosWithAuth';
import stripeLogo from '../../images/stripeLogo.svg';
import Navbar from '../Navbar';

function Account() {
	//State for the information obtained by the axios request below
	const [ stripeAccount, setStripeAccount ] = useState(null);

	//Makes a request to the DB to get stripe info
	useEffect(() => {
		axiosWithAuth()
			.get('/api/auth/getseller')
			.then((res) => {
				res.data.access_token ? setStripeAccount(res.data) : console.log('_');
			})
			.catch((err) => console.log(err));
	}, []);

	//Redirect to start the Stripe Experince (Signing Up)
	function startStripe() {
		window.location.href = 'https://ecommerce-app-be.herokuapp.com//api/auth/stripe/authorize';
	}

	//When ran nulls the user's Stripe information on DB
	function disconnectStripe() {
		const payload = {
			access_token: '',
			refresh_token: '',
			register_date: '',
			stripe_publishable_key: '',
			stripe_user_id: ''
		};
		axiosWithAuth()
			.put('/api/auth/stripeUpdate', payload)
			.then((res) => {
				setStripeAccount(null);
			})
			.catch((err) => console.log(err));
	}

	return (
		<div data-testid="main">
			<Navbar />
			<div className="accountContainer">
				<h1> Account</h1>
				{stripeAccount ? (
					<div className="accountInfocontainer">
						<div className="stripeId">
							<h3>Stripe ID: {stripeAccount.stripe_user_id.toUpperCase()} </h3>
						</div>
						<div className="connectionStatus">
							<h3 className="goodStatus"> Stripe Account Connected!</h3>
						</div>
					</div>
				) : (
					<div className="accountInfocontainer">
						<div className="stripeId">
							<h3>Stripe ID: </h3>
						</div>
						<div className="connectionStatus">
							<h3 className="badStatus"> Your Stripe account is not connected </h3>
						</div>
					</div>
				)}

				{stripeAccount ? (
					<button
						onClick={() => {
							disconnectStripe();
						}}
						className="stripeButton disconnect"
					>
						<img src={stripeLogo} />
						<h3> Disconnect Stripe </h3>
					</button>
				) : (
					<button
						onClick={() => {
							startStripe();
						}}
						className="stripeButton"
					>
						<img src={stripeLogo} />
						<h3> Connect To Stripe </h3>
					</button>
				)}
			</div>
		</div>
	);
}

export default Account;
