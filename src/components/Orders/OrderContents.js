import React from 'react';
import axiosWithAuth from '../Auth/axiosWithAuth';
import OrderContentsCards from './OrderContentsCards';

const OrderContents = (props) => {
	const { order, setOrder, orderId } = props;
	const { orderCanceled } = props;

	function RemoveItem(arg) {
		const removeItem = order.filter((state) => {
			return state._id === arg;
		});
		axiosWithAuth()
			.delete(`https://ecommerce-app-be.herokuapp.com//api/store/${orderId}/${removeItem[0]._id}`)
			.then((res) => {})
			.catch((error) => {
				console.log(error);
			});

		const newState = order.filter((state) => {
			return state._id !== removeItem[0]._id;
		});

		return setOrder(newState);
	}

	return (
		<div className="orderContentsContainer" data-testid="orderContentsWrapper">
			<div className="contentsHeaderContainer">
				<h5>Quantity</h5>
				<h5>Products</h5>
			</div>
			<OrderContentsCards order={order} RemoveItem={RemoveItem} orderCanceled={orderCanceled} />
		</div>
	);
};

export default OrderContents;
