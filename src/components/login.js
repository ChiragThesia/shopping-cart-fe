import React from 'react';
import axios from 'axios';
import withAuth from './Auth/axiosWithAuth';
import { Link } from 'react-router-dom';
import { Form, Input, Icon, message, Spin } from 'antd';

import history from '../history';
import { connect } from 'react-redux';
import { setLoading, setErrors, clearErrors } from '../state/actionCreators';

const loginURL = 'https://ecommerce-app-be.herokuapp.com//api/auth/login';
const storeURL = 'https://ecommerce-app-be.herokuapp.com//api/store';

const Login = (props) => {
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
					.post(loginURL, payload)
					.then((res) => {
						message.success('Login Successful');
						localStorage.setItem('token', res.data.token);
						props.dispatch(clearErrors());

						// check if user has store
						withAuth()
							.get(storeURL)
							.then((res) => {
								if (res.data._id) {
									history.push('/dashboard');
								}
								else {
									history.push('/welcome');
								}
							})
							.catch((error) => {
								if (error.response.data.message === 'No store found') {
									history.push('/welcome');
								}
								else {
									message.error(Object.values(error.response.data)[0]);
								}
							});
					})
					.catch((error) => {
						props.dispatch(setLoading(false));
						props.dispatch(setErrors(error.response.data));
						message.error(Object.values(error.response.data)[0]);
					});
			}
			else {
				message.error('Enter Required Fields');
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

	const loginForm = (
		<Spin spinning={props.isLoading}>
			<div data-testid="imageBackground" className="cover">
				<div className="desktop-logo">
					<div className="desktop-logo-large">
						<img
							src="https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"
							alt="Login"
							height="400"
							className="loginPicture"
						/>
					</div>
				</div>
				<div data-testid="loginFormWrapper" className="desktop-form">
					<Form {...formItemLayout} onSubmit={handleSubmit}>
						<img
							data-testid="loginLogo"
							className="pureRetailImage"
							src="pureRetail-2020-logo.svg"
							alt="pure retail logo"
						/>
						<h4 className="loginHeader">Login to your Store!</h4>
						<div id="header" data-testid="log-in" />
						<Form.Item>
							{getFieldDecorator('number', {
								rules: [
									{
										message: 'Enter valid phone number'
									},
									{
										required: true,
										message: 'Enter valid phone number'
									}
								]
							})(
								<Input
									className="form-input"
									placeholder="Phone number"
									data-testid="phoneNumberInput"
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
									}
								]
							})(
								<Input.Password
									data-testid="loginPasswordInput"
									className="form-input"
									placeholder="Password"
									prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.70)' }} />}
								/>
							)}
						</Form.Item>
						<Form.Item {...tailFormItemLayout}>
							<p className="forgotPassword">
								<Link to="/resetpassword">Forgot password?</Link>
							</p>
							<button
								data-testid="loginButton"
								className="loginButtons loginButton"
								type="primary"
								htmltype="submit"
							>
								Login
							</button>
							<div data-testid="createStoreButton" id="or_login">
								<Link className="createStoreLink" to="/register">
									<p className="loginButtons createStore">Create Store</p>
								</Link>
							</div>
						</Form.Item>
					</Form>
				</div>
			</div>
		</Spin>
	);

	return loginForm;
};
const LoginForm = Form.create({ name: 'register' })(Login);

const mapStateToProps = (state) => ({
	isLoading: state.user.isLoading,
	errors: state.user.errors
});

export default connect(mapStateToProps, null)(LoginForm);
