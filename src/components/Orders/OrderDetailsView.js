import React, { useState, useEffect } from 'react';
import axiosWithAuth from '../Auth/axiosWithAuth';
//Components
import OrderContents from './OrderContents';
import BuyerInfo from './BuyerInfo';
import Navbar from '../Navbar';

const OrderDetailsView = (props) => {
	const orderId = props.match.params.id;
	const [ order, setOrder ] = useState();
	const [ fullOrder, setFullOrder ] = useState(0);
	const [ orderCanceled, setOrderCanceled ] = useState(false);

	useEffect(
		() => {
			axiosWithAuth()
				.get(`https://shielded-journey-22349.herokuapp.com//api/store/order/${orderId}`)
				.then((res) => {
					console.log(res.data);
					setOrder(res.data.orderItem);
					setFullOrder(res.data);
				})
				.catch((error) => {
					console.log(error);
				});
		},
		[ setOrder ]
	);

	return (
		<div>
			<Navbar />
			<div className="OrderDetailsMaster">
				<BuyerInfo
					data-testid="orderDetailsViewWrapper"
					orderId={orderId}
					fullOrder={fullOrder}
					setOrderCanceled={setOrderCanceled}
				/>
				<OrderContents orderId={orderId} order={order} setOrder={setOrder} orderCanceled={orderCanceled} />
			</div>
		</div>
	);
};

export default OrderDetailsView;
