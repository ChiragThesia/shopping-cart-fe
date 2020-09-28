import React, { useState, useCallback, useEffect } from 'react';
import * as creators from '../../state/actionCreators';
import { useDispatch } from 'react-redux';
import times_icon from '../../images/times-icon.svg';
import equals_icon from '../../images/equals-icon.svg';
import delete_icon from '../../images/delete-icon.svg';
import add_icon from '../../images/add-icon.svg';
import subtract_icon from '../../images/subtract-icon.svg';
import emptyCartGraphic from '../../images/emptyCartGraphic.svg';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import history from '../../history';
import axios from 'axios';
import { motion } from 'framer-motion';
import Message from '../Products/message';
const CartTable = ({ cartContents, totalPrice, store }) => {
	// Hooks for Redux & Stripe
	const dispatch = useDispatch();
	const stripe = useStripe();
	const elements = useElements();

	// Getting the Store ID to get their Stripe Client ID
	// Ternary is used for Jest tests
	const getStoreID = localStorage.getItem('storeUrl')
		? localStorage.getItem('storeUrl').split('-')
		: '5f1645a717a4730004f569c3';

	// State for holding the Name & Phone
	const [ userInfo, setUserInfo ] = useState({
		fullName: '',
		phoneNumber: ''
	});

	//State for holding the Store Info (Grabbed from redux through props)
	const [ storeInfo, setStoreInfo ] = useState({
		storeColor: '',
		storeLogo: ''
	});

	useEffect(
		() => {
			setStoreInfo({
				...storeInfo,
				storeLogo: store.logo,
				storeColor: store.color
			});
		},
		[ store ]
	);

	//Payload that will be sent to stripe (Stores Owners Client ID)
	const [ paymentPayload, setPaymentPayload ] = useState({
		price: totalPrice(cartContents),
		clientID: ''
	});

	//State to toggle the checkout
	const [ toggleCheckout, setToggleCheckout ] = useState(false);

	// Framer Motion Variants (Used for animating the Checkout Card)
	const variants = {
		hidden: { opacity: 0, bottom: -500 },
		visible: { opacity: 1, bottom: 0 }
	};

	//Making a request to get the store ID
	useEffect(() => {
		axios
			.get(`https://ecommerce-app-be.herokuapp.com//api/auth/pk/${getStoreID[1]}`)
			.then((res) => {
				console.log('super res', res);
				setPaymentPayload({ ...paymentPayload, clientID: res.data });
			})
			.catch((error) => console.log(error));
	}, []);

	//Order payload only works for one item without a variant -- Needs fixing
	const orderPayload = {
		orderItem: [
			{
				product: cartContents.length > 0 ? cartContents[0].productId : '',
				quantity: cartContents.length > 0 ? cartContents[0].quantity : '',
				chosenVariant: {
					price: cartContents.length > 0 ? cartContents[0].price : ''
				}
			}
		]
	};

	setTimeout(() => {
		console.log('cartContents', cartContents);
	}, 1000);

	const [ message, setMessage ] = useState();

	// On submit -> Takes the payload object and POSTs it to the server.
	// If sent properly the server will return a secret. This is used below to varify the transaction
	const submitHandler = async (event) => {
		console.log('payment Payload', paymentPayload);
		event.preventDefault();

		// ensure stripe & elements are loaded
		if (!stripe || !elements) {
			return;
		}

		//Make a payment-intent POST request
		axios
			.post('https://ecommerce-app-be.herokuapp.com//api/stripe/payment/create-payment-intent', paymentPayload)
			.then((res) => {
				console.log('orderPayload', orderPayload);
				axios
					.post(`https://ecommerce-app-be.herokuapp.com//api/store/${getStoreID[1]}/order`, orderPayload)
					.then((res) => {
						setMessage('Payment Confirmed!');
						console.log(orderPayload);
						console.log(res.data);
						setTimeout(() => {
							history.push(`/success/${res.data._id}`);
						}, 2000);
					})
					.catch((error) => console.log(error));

				stripe.confirmCardPayment(res.data.clientSecret, {
					payment_method: {
						card: elements.getElement(CardElement),
						billing_details: {
							name: userInfo.fullName,
							phone: userInfo.phoneNumber
						}
					}
				});
				//Creates order for our database
			})
			.catch((error) => console.log(error));
	};

	const increment = (id) => {
		dispatch(creators.increment(id));
	};

	const decrement = (id) => {
		console.log('isDispatching --', id);
		dispatch(creators.decrement(id));
	};

	const removeItem = (item) => {
		console.log('isDispatching item', item);
		dispatch(creators.subtractFromCart(item));
	};
	const arr = cartContents.map((cart) =>
		cart.variantDetails.reduce((sum, item) => {
			return sum + item.price;
		}, 0)
	);
	const numbers = cartContents.reduce((sum, item) => {
		return sum + item.quantity;
	}, 0);

	function changeHandler(e) {
		e.preventDefault();
		setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
	}

	//Style for the Stripe Elements
	const CARD_ELEMENT_OPTIONS = {
		style: {
			base: {
				color: '#32325d',
				fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
				fontSmoothing: 'antialiased',
				fontSize: '16px',
				'::placeholder': {
					color: '#aab7c4'
				}
			},
			invalid: {
				color: '#fa755a',
				iconColor: '#fa755a'
			}
		}
	};

	return (
		<div className="cartMasterContainer">
			{cartContents.length > 0 ? (
				<div>
					<div className="tableHeader">
						<p className="productTitle" data-testid="CartTable">
							Product
						</p>
						<p className="priceTitle"> Price</p>
						<p className="quantityTitle"> Quantity</p>
						<p className="totalTitle"> Total</p>
					</div>
					<div />
				</div>
			) : (
				<div className="emptyCart">
					<img src={emptyCartGraphic} alt="cartImage" />
					<h1>This is awkward... </h1>
					<h2>You don’t have’t any items in your cart </h2>
				</div>
			)}

			{cartContents ? (
				cartContents.map((cv) => {
					return (
						<div>
							<div className="cartProductCard">
								<div className="productSection">
									<img className="cartImage" src={cv.images[0]} alt="cartImage" />
									<div className="productInfo">
										<h3 data-testid="productName"> {cv.productName} </h3>
										<p>{cv.variantDetails[0].option}</p>
									</div>
								</div>
								{cv.variantDetails[0].price ? (
									<h3 data-testid="price">${cv.variantDetails[0].price}</h3>
								) : (
									<h3 data-testid="price">${cv.price}</h3>
								)}
								<img src={times_icon} alt="cartImage" />
								<div className="quantityContainer">
									<img
										style={{ background: `${storeInfo.storeColor}` }}
										className="quantityBTN"
										alt="cartImage"
										src={subtract_icon}
										onClick={() => {
											decrement(cv.productId);
										}}
									/>
									<div className="quantityCounter">
										<h3>{cv.quantity}</h3>
									</div>
									<img
										className="quantityBTN"
										style={{ background: `${storeInfo.storeColor}` }}
										src={add_icon}
										alt="cartImage"
										onClick={() => {
											increment(cv.productId);
										}}
									/>
								</div>

								<img className="equalsIcon" alt="cartImage" src={equals_icon} />
								{cv.variantDetails[0].option ? (
									<h3>
										$
										{Number.parseFloat(cv.variantDetails[0].price * cv.quantity).toFixed(2)}
									</h3>
								) : (
									<h3>${Number.parseFloat(cv.price * cv.quantity).toFixed(2)}</h3>
								)}

								<img
									className="deleteIcon"
									src={delete_icon}
									alt="cartImage"
									onClick={() => {
										console.log('click fired', cv);
										removeItem(cv);
									}}
								/>
							</div>
						</div>
					);
				})
			) : (
				''
			)}
			{cartContents.length > 0 ? (
				<div className="totalPrice">
					<div className="total" data-testid="total">
						Total: ${totalPrice(cartContents)}
					</div>
					<button
						style={{ background: `${storeInfo.storeColor}` }}
						onClick={() => {
							setToggleCheckout(!toggleCheckout);
						}}
					>
						Checkout
					</button>
					<motion.div
						initial={'hidden'}
						animate={toggleCheckout ? 'visible' : 'hidden'}
						variants={variants}
						className="checkoutCard"
					>
						<img className="checkoutLogo" src={storeInfo.storeLogo} />
						<h2> Store Checkout </h2>
						<h3>
							All transactions are secured through Stripe! Once payment is confirmed you will be directed
							to a confirmation screen
						</h3>
						<div className="checkoutElements">
							<form onSubmit={submitHandler}>
								<div className="inputContainer">
									<input
										name="fullName"
										type="text"
										placeholder="Enter Full Name"
										value={userInfo.fullName}
										onChange={changeHandler}
									/>
									<input
										name="phoneNumber"
										type="number"
										min="9"
										placeholder="Enter Phone Number"
										value={userInfo.phoneNumber}
										onChange={changeHandler}
									/>
								</div>
								<div className="elementContainer">
									<CardElement options={CARD_ELEMENT_OPTIONS} />
								</div>
								<button
									style={
										!userInfo.fullName || !userInfo.phoneNumber ? (
											{ background: `#d1d1d1` }
										) : (
											{ background: `${storeInfo.storeColor}` }
										)
									}
									disabled={!userInfo.fullName || !userInfo.phoneNumber}
									type="submit"
								>
									Submit Payment: ${totalPrice(cartContents)}{' '}
								</button>
							</form>
						</div>
						<Message message={message} />
					</motion.div>
				</div>
			) : (
				''
			)}
		</div>
	);
};

export default CartTable;
