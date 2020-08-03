import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Input, Button, Radio, DatePicker, Modal } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import useCurrency from '../hooks/useCurrency';
import moment from 'moment';
import * as actionCreators from '../../state/actionCreators';
const SaveCart = (props) => {
	const dispatch = useDispatch();

	useEffect(
		() => {
			dispatch(actionCreators.getCurrentUser());
		},
		[ dispatch, props ]
	);

	const [ delivery, setDelivery ] = useState(true);
	const cartContents = useSelector((state) => state.cart);
	const sellerId = useSelector((state) => state.user.user._id);
	const storeDetails = useSelector((state) => state.user.user);
	const sign = useCurrency(storeDetails.currency);
	const checkoutCart = cartContents.filter((item) => {
		return item.quantity > 0;
	});
	const contents = cartContents.map((cart) => {
		return { product: cart.productId, quantity: cart.quantity };
	});
	const toggleAddyFalse = () => {
		setDelivery(false);
	};
	const toggleAddyTrue = () => {
		setDelivery(true);
	};
	const totalPrice = (arr) => {
		return arr.reduce((sum, item) => {
			return sum + item.price * item.quantity;
		}, 0);
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		props.form.validateFieldsAndScroll({ force: true }, (err, values) => {
			if (!err) {
				info(values);
			}
		});
	};
	const info = (values) => {
		Modal.info({
			title: 'Forwarding to WhatsApp',
			content:
				"When you click OK you'll be redirected to WhatsApp to contact the seller with your sales enquiry so they can confirm stock availability and delivery / collection details.",
			onOk() {
				const payload = {
					contents,
					deliveryOrCollection: values.delivery,
					checkoutDate: values.date,
					paymentPreference: values.payment,
					address: values.address ? values.address : 'no address',
					total: totalPrice(checkoutCart),
					agreedPrice: totalPrice(checkoutCart),
					email: 'no@email.com',
					storeId: sellerId
				};
				axios
					.post(`https://shielded-journey-22349.herokuapp.com//api/store/${sellerId}/cart/submit`, payload)
					.then((res) => {
						const { text, sellerPhone } = res.data;
						window.location = `https://api.whatsapp.com/send?phone=${sellerPhone}&text=${text}`;
					})
					.catch((e) => {
						console.log(e.response.data);
					});
			}
		});
	};

	const disabledDate = (current) =>
		// Can not select days before today
		current && current < moment().endOf('day').subtract(1, 'day');

	const { getFieldDecorator } = props.form;

	const formItemLayout = {
		labelCol: {
			xs: { span: 24 },
			sm: { span: 8 }
		},
		wrapperCol: {
			xs: { span: 24 },
			sm: { span: 16 }
		}
	};
	const tailFormItemLayout = {
		wrapperCol: {
			xs: {
				span: 24,
				offset: 0
			},
			sm: {
				span: 16,
				offset: 8
			}
		}
	};
	const config = {
		rules: [ { type: 'object', required: false, message: 'Please select time!' } ]
	};
	return (
		<div data-testid="saveCartWrapper" className="savecart-cover">
			<div data-testid="saveCartInner" id="inner">
				<div data-testid="saveCartCheckout" className="checkout">
					<div data-testid="saveCartOrder" className="order">
						<p>Order Summary</p>
						<div data-testid="saveCartSummary" className="summary">
							{checkoutCart.map((item) => (
								<div className="units" key={item.productId}>
									{item.name} ({item.quantity} unit
									{item.quantity > 1 ? 's' : ''}) - {sign}
									{item.price}
								</div>
							))}
						</div>
					</div>
				</div>
				<div data-testid="saveCartLower" className="lower">
					<Form data-testid="mainForm" {...formItemLayout} onSubmit={handleSubmit}>
						<div data-testid="LowerHeader" id="header">
							<p>Take a second to tell us your collection/delivery and payments preferences.</p>
						</div>
						<Form.Item data-testid="Form.Item-Delivery.Option" label="Delivery option">
							{getFieldDecorator('delivery')(
								<Radio.Group>
									<Radio onClick={toggleAddyTrue} value="Delivery">
										Delivery
									</Radio>
									<Radio onClick={toggleAddyFalse} value="Collection">
										Collection
									</Radio>
								</Radio.Group>
							)}
						</Form.Item>
						<span className={delivery ? 'addy' : 'info'}>
							Please wait for confirmation from the seller that your order is available and then collect
							it from: {storeDetails.address}
						</span>
						<span className={delivery ? 'info' : 'addy'}>
							Enter your delivery address in the field below if you opt for delivery. If you would rather
							collect the item in person, the seller will contact you with the Whatsapp number you
							provided above
						</span>
						<Form.Item
							data-testid="FormItem-Address"
							className={delivery ? 'ant-row ant-form-item' : 'addy'}
							label="Delivery Address"
						>
							{getFieldDecorator('address', {
								rules: [ { required: false, message: 'Please input your address!' } ]
							})(<Input />)}
						</Form.Item>
						<Form.Item data-testid="FormItem-Collection" label="Collection/Delivery date">
							{getFieldDecorator('date', config)(<DatePicker disabledDate={disabledDate} />)}
						</Form.Item>
						<Form.Item data-testid="FormItem-RadioGroup" label="Payment preference">
							{getFieldDecorator('payment')(
								<Radio.Group data-testid="RadioGroup">
									<Radio value="Cash">Pay with Cash</Radio>
									<Radio value="Card">Pay with Card</Radio>
									<Radio value="USSD">Pay with USSD</Radio>
								</Radio.Group>
							)}
						</Form.Item>
						<Form.Item data-testid="FormItemButton" className="primary" {...tailFormItemLayout}>
							<button htmltype="submit">Submit</button>
						</Form.Item>
					</Form>
				</div>
			</div>
		</div>
	);
};

const SaveCartForm = Form.create({ name: 'register' })(SaveCart);

export default SaveCartForm;
