import React from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Form, Input, Icon, Button, message, Spin } from 'antd';
import Logo from '../elements/logo';
import * as creators from '../../state/actionCreators';
import image from '../../images/security.png';

const URL = 'https://ecommerce-app-be.herokuapp.com//api/auth/recover';

const ResetPassword = (props) => {
	const dispatch = useDispatch();
	const { isLoading } = useSelector((state) => state.user);

	const handleSubmit = (e) => {
		e.preventDefault();
		props.form.validateFieldsAndScroll((err, values) => {
			const payload = {
				phone: values.number
			};

			if (!err) {
				dispatch(creators.setLoading(true));
				axios
					.post(URL, payload)
					.then((res) => {
						message.success('Your password reset is on its way!');
						dispatch(creators.setLoading(false));
						dispatch(creators.clearErrors());
						props.history.push('/');
					})
					.catch((error) => {
						dispatch(creators.setLoading(false));
						dispatch(creators.setErrors(error.response.data));
						message.error(Object.values(error.response.data)[0]);
					});
			}
			else {
				message.error('Please enter a valid phone number to proceed.');
			}
		});
	};
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

	const resetPasswordForm = (
		<Spin spinning={isLoading}>
			<div className="cover">
				<div className="desktop-logo">
					<h2 className="reset-password-text">Reset Password</h2>
					<div className="desktop-logo-large">
						<img src={image} alt="PureRetail Logo" width="372" height="372" />
					</div>
				</div>
				<Logo />
				<div className="desktop-form-reset">
					<Form {...formItemLayout} onSubmit={handleSubmit}>
						<div id="header">
							<h2>Reset Password</h2>
						</div>
						<div id="instruction-text">
							<p>Enter your registered phone number to receive a password reset link via SMS:</p>
						</div>
						<Form.Item>
							{getFieldDecorator('number', {
								rules: [
									{
										message: 'Enter a valid phone number'
									},
									{
										required: true,
										message: 'Enter a valid phone number'
									}
								]
							})(
								<Input
									placeholder="Phone number"
									prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.70)' }} />}
								/>
							)}
						</Form.Item>
						<Form.Item {...tailFormItemLayout}>
							<Button type="primary" htmltype="submit">
								Get link
							</Button>
						</Form.Item>
					</Form>
					<div id="back-to-login">
						<Link to="/">Back to login</Link>
					</div>
					<div id="contact-support">
						<Link to="/support">Contact support</Link>
					</div>
				</div>
			</div>
		</Spin>
	);

	return resetPasswordForm;
};
const ResetPasswordForm = Form.create({ name: 'resetPassword' })(ResetPassword);

export default ResetPasswordForm;
