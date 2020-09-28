import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Form, Input, Icon, message, Spin } from 'antd';
import Logo from './elements/logo';

import history from '../history';
import { setLoading, setErrors, clearErrors } from '../state/actionCreators';
import { connect } from 'react-redux';

const signupURL = 'https://ecommerce-app-be.herokuapp.com//api/auth/register';
const RegistrationForm = (props) => {
	const [ confirmDirty, setConfirmDirty ] = useState(false);
	const handleSubmit = (e) => {
		e.preventDefault();
		props.form.validateFieldsAndScroll((err, values) => {
			const payload = {
				phone: values.number.trim(),
				password: values.password
			};
			if (!err) {
				props.dispatch(setLoading(true));
				axios
					.post(signupURL, payload)
					.then((res) => {
						message.success('Signed Up');
						localStorage.setItem('token', res.data.token);
						props.dispatch(clearErrors());
						history.push('/welcome');
					})
					.catch((error) => {
						props.dispatch(setErrors(error.response.data));
						props.dispatch(setLoading(false));
						message.error(Object.values(error.response.data)[0]);
					});
			}
			else {
				message.error('Enter Required Fields');
			}
		});
	};
	const handleConfirmBlur = (e) => {
		const { value } = e.target;
		setConfirmDirty(!!value);
	};
	const compareToFirstPassword = (rule, value, callback) => {
		const { form } = props;
		if (value && value !== form.getFieldValue('password')) {
			callback('Passwords do not match!');
		}
		else {
			callback();
		}
	};
	const validateToNextPassword = (rule, value, callback) => {
		const { form } = props;

		if (value && confirmDirty) {
			form.validateFields([ 'confirm' ], { force: true });
		}
		callback();
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

	const registerForm = (
		<Spin spinning={props.isLoading}>
			<div className="cover" data-testid="imageBackground">
				<div className="desktop-logo" data-testid="desktopLogoDiv">
					<div className="desktop-logo-large">
						<img
							src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"
							alt="Registration"
							height="400"
							className="loginPicture"
						/>
					</div>
				</div>

				<Logo />

				<div className="desktop-form" data-testid="registrationFormDiv">
					<Form {...formItemLayout} onSubmit={handleSubmit}>
						<Form.Item>
							<img
								className="pureRetailImage registrationHeader"
								src="pureRetail-2020-logo.svg"
								alt="pure retail logo"
							/>
							{getFieldDecorator('number', {
								rules: [
									{
										message: 'Enter valid Whatsapp number'
									},
									{
										required: true,
										message: 'Enter valid Whatsapp number'
									}
								]
							})(
								<Input
									className="input"
									placeholder="e.g. 2348000001231"
									prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.70)' }} />}
								/>
							)}
						</Form.Item>
						<Form.Item hasFeedback>
							{getFieldDecorator('password', {
								rules: [
									{
										required: true,
										message: 'Please input your password!'
									},
									{
										validator: validateToNextPassword
									}
								]
							})(
								<Input.Password
									className="input"
									placeholder="Password"
									prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.70)' }} />}
								/>
							)}
						</Form.Item>
						<Form.Item hasFeedback>
							{getFieldDecorator('confirm', {
								rules: [
									{
										required: true,
										message: 'Please confirm your password!'
									},
									{
										validator: compareToFirstPassword
									}
								]
							})(
								<Input.Password
									className="input"
									onBlur={handleConfirmBlur}
									placeholder="Confirm Password"
									prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.70)' }} />}
								/>
							)}
						</Form.Item>
						<Form.Item {...tailFormItemLayout}>
							<button type="primary" htmltype="submit" className="loginButtons loginButton createStore">
								Register
							</button>
						</Form.Item>
					</Form>
					<div id="or_login" data-testid="loginLinkWrapper">
						<p>
							or <Link to="/">login</Link> instead
						</p>
					</div>
				</div>
			</div>
		</Spin>
	);

	return registerForm;
};

const WrappedRegistrationForm = Form.create({ name: 'register' })(RegistrationForm);

const mapStateToProps = (state) => ({
	isLoading: state.user.isLoading,
	errors: state.user.errors
});

export default connect(mapStateToProps, null)(WrappedRegistrationForm);
