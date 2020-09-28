import React, { useState, useEffect } from 'react';
import axiosWithAuth from '../Auth/axiosWithAuth';
import moment from 'moment';

const BuyerInfo = ({ fullOrder, setOrderCanceled, orderId }) => {
	const { _id, orderCreated, orderStatus, orderCompleted } = fullOrder;
	//Instead of using the full 10+ long ID shorten it to the last 5 digits
	const orderNumber = _id ? _id.substr(_id.length - 5) : 0;
	//Status State
	const [ currentStatus, setCurrentStatus ] = useState();
	const [ buttonStatus, setButtonStatus ] = useState();
	const allStatuses = [ 'Not Ready', 'Prepaired', 'Complete' ];
	//Date State
	const createdTimeFormated = moment(orderCreated).format('MMM DD YYYY');
	const [ completedTime, setCompletedTime ] = useState('-');

	useEffect(
		() => {
			setCurrentStatus(orderStatus);
			NextButtonStatus(orderStatus);
			!orderCompleted ? setCompletedTime('-') : setCompletedTime(orderCompleted);
			orderStatus === 'Canceled' ? setOrderCanceled(true) : setOrderCanceled(false);
		},
		[ orderStatus, setCurrentStatus, orderCompleted, setOrderCanceled ]
	);

	function NextButtonStatus(arg) {
		const foundStatus = allStatuses.indexOf(arg);
		const newStatus = foundStatus + 1;
		setButtonStatus(allStatuses[newStatus]);
	}

	function nextStatus(arg) {
		const foundStatus = allStatuses.indexOf(arg);
		const newStatus = foundStatus + 1;

		if (currentStatus === 'Prepaired') {
			const payload = {
				orderStatus: allStatuses[newStatus],
				orderCompleted: Date.now()
			};

			return axiosWithAuth()
				.put(`https://ecommerce-app-be.herokuapp.com//api/store/order/${orderId}`, payload)
				.then((res) => {
					setCurrentStatus(res.data.orderStatus);
					NextButtonStatus(res.data.orderStatus);
					setCompletedTime(res.data.orderCompleted);
				})
				.catch((error) => {
					console.log(error);
				});
		}

		const payload = {
			orderStatus: allStatuses[newStatus]
		};

		axiosWithAuth()
			.put(`https://ecommerce-app-be.herokuapp.com//api/store/order/${orderId}`, payload)
			.then((res) => {
				setCurrentStatus(res.data.orderStatus);
				NextButtonStatus(res.data.orderStatus);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	function cancelOrder() {
		setCurrentStatus('Canceled');
		setOrderCanceled(true);

		axiosWithAuth()
			.put(`https://ecommerce-app-be.herokuapp.com//api/store/order/${orderId}`, {
				orderStatus: 'Canceled'
			})
			.then((res) => {
				setCurrentStatus(res.data.orderStatus);
				NextButtonStatus(res.data.orderStatus);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	return (
		<div className="buyerInfoContainer" data-testid="buyerInfoWrapper">
			<div className="buyerInfoCard">
				<section className="topSection">
					<div className="OrderNumber">
						<h4>Order:</h4>
						<h3 className="number"> {orderNumber} </h3>
					</div>
					<div className={`orderStatus ${currentStatus}`}> {currentStatus} </div>
				</section>
				<div className="divider" />
				<section className="bottomSection">
					<div className="startDataContainer">
						<h4>Order Made</h4>
						<h3> {createdTimeFormated}</h3>
					</div>
					<div className="startDataContainer">
						<h4>Order Complete</h4>
						<h3> {completedTime === '-' ? '-' : moment(completedTime).format('MMM DD YYYY')}</h3>
					</div>
				</section>
			</div>
			<div className="actionContainer">
				{currentStatus === 'Complete' || currentStatus === 'Canceled' ? (
					''
				) : (
					<div>
						<button
							className={buttonStatus === 'Complete Order' ? 'completeBTN' : 'ReadyBTN'}
							onClick={() => {
								nextStatus(currentStatus);
							}}
						>
							Order {buttonStatus}
						</button>
						<button
							onClick={() => {
								cancelOrder();
							}}
							className="cancelBTN"
						>
							Cancel Order
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default BuyerInfo;
