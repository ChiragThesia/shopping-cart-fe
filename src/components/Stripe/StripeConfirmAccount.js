import React, { useState, useEffect } from 'react';
import axiosWithAuth from '../../components/Auth/axiosWithAuth';
import history from '../../history';

import checkIcon from '../../images/stripe/checkIcon.svg';
import connectingArrowIcon from '../../images/stripe/connectingArrowIcon.svg';
import errorIcon from '../../images/stripe/errorIcon.svg';
import pureRetailCircle from '../../images/stripe/pureRetailCircle.svg';
import stripeCircle from '../../images/stripe/stripeCircle.svg';

const StripeConfirmAccount = () => {
	//Grab code from the query string (Splitting the "equal sign" creates an array of two items. Index 1 holds the code)
	const code = window.location.href.split('=');
	//state to hold returned information
	const [ stripeInfo, setStripeInfo ] = useState(null);
	//State for the connection status (success / failure)
	const [ connectionStatus, setConnectionStatus ] = useState(null);

	useEffect(() => {
		axiosWithAuth()
			.get(`api/auth/stripe/token?code=${code[1]}`)
			.then((res) => {
				console.log('res 1', res);
				setStripeInfo(res.data.tokenRequest);
			})
			.catch((error) => {
				console.log('error 1', error);
			});
	}, []);

	console.log(code[1]);

	stripeInfo
		? axiosWithAuth()
				.put('/api/auth/stripeUpdate', stripeInfo)
				.then((res) => {
					console.log('res 2', res);
					setConnectionStatus('Connected! Redirecting to the Dashboard');
					setTimeout(() => {
						history.push('/dashboard');
					}, 2000);
					console.log(res);
				})
				.catch((err) => {
					setConnectionStatus('Failed: Redirecting To The Dashboard');
					console.log(err);
				})
		: console.log('_');

	return (
		<div>
			<div className="connectContainerMain">
				<h1> Connecting Accounts</h1>
				<h3> Take a sip of coffee, this might take a moment</h3>
				<div className="connectingGraphics">
					<img alt="stripeImage" src={pureRetailCircle} />
					<img alt="stripeImage" className="connectingArrowsIcon" src={connectingArrowIcon} />
					<img alt="stripeImage" src={stripeCircle} />
				</div>
				<div
					className={
						connectionStatus ? connectionStatus === 'Connected! Redirecting to the Dashboard' ? (
							'connectionStatus good'
						) : (
							'connectionStatus bad'
						) : (
							'hidden'
						)
					}
				>
					<img
						className="checkIcon"
						alt="StripeImage"
						src={connectionStatus === 'Connected! Redirecting to the Dashboard' ? checkIcon : errorIcon}
					/>
					<h3>{connectionStatus ? `${connectionStatus}` : ''} </h3>
				</div>
			</div>
		</div>
	);
};

export default StripeConfirmAccount;
