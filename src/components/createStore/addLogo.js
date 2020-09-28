import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Input, Icon, Button, message, Upload, Spin } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import AxiosAuth from '../Auth/axiosWithAuth';
import * as creators from '../../state/actionCreators';
import history from '../../history';

function getBase64(img, callback) {
	const reader = new FileReader();
	reader.addEventListener('load', () => callback(reader.result));
	reader.readAsDataURL(img);
}

function beforeUpload(file) {
	const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
	if (!isJpgOrPng) {
		message.error('You can only upload JPG/PNG file!');
	}
	const isLt2M = file.size / 1024 / 1024 < 2;
	if (!isLt2M) {
		message.error('Image must smaller than 2MB!');
	}
	return isJpgOrPng && isLt2M;
}
const createStoreUrl = 'https://ecommerce-app-be.herokuapp.com//api/store';

const AddLogo = (props) => {
	const dispatch = useDispatch();
	const [ imageUrl, setImageUrl ] = useState('');
	const [ loading, setLoading ] = useState(false);

	const formState = useSelector((state) => state.form);
	const userState = useSelector((state) => state.user);

	const handleChange = (info) => {
		if (info.file.status === 'uploading') {
			setLoading(true);
			return;
		}
		if (info.file.status === 'done') {
			// Get this url from response in real world.
			getBase64(info.file.originFileObj, (imageUrl) => setImageUrl(imageUrl), setLoading(false));
		}
	};

	const dummyRequest = ({ file, onSuccess }) => {
		const image = new FormData();
		image.append('upload_preset', 'pure-retail');
		image.append('file', file);
		const config = {
			headers: { 'X-Requested-With': 'XMLHttpRequest' }
		};
		axios.post('https://api.cloudinary.com/v1_1/pureretail/upload', image, config).then((res) => {
			const secureUrl = res.data.secure_url;
			setImageUrl(secureUrl);
		});
		setTimeout(() => {
			onSuccess('ok');
		}, 0);
	};

	useEffect(
		() => {
			dispatch(creators.setLoading(false));
		},
		[ dispatch ]
	);

	const handleSubmit = (e) => {
		e.preventDefault();
		props.form.validateFieldsAndScroll((err, values) => {
			const payload = {
				ownerName: formState.name,
				currency: formState.currency,
				imageUrl: imageUrl,
				storeName: values.store,
				address: values.address
			};
			if (!err) {
				dispatch(creators.setLoading(true));
				AxiosAuth()
					.post(createStoreUrl, payload)
					.then((res) => {
						dispatch(creators.setStore(res.data.saved));
						message.success('store created');
						dispatch(creators.setLoading(false));
						dispatch(creators.clearErrors());
						history.push('/dashboard');
					})
					.catch((error) => {
						dispatch(creators.setLoading(false));
						dispatch(creators.setErrors(error.response.data));
						message.error(Object.values(error.response.data)[0]);
					});
			}
			else {
				message.error('Enter Required Fields');
			}
		});
	};

	const uploadButton = (
		<div id="upload-button">
			<Icon type={loading ? 'loading' : 'plus'} />
			<div className="ant-upload-text">Upload</div>
		</div>
	);

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

	const addLogoForm = (
		<Spin spinning={userState.isLoading}>
			<div className="cover" id="create-store">
				<div id="header">
					<h2 id="get-started">
						Upload store
						<br />
						logo
					</h2>
				</div>
				<div id="add-logo-image">
					<Upload
						name="avatar"
						customRequest={dummyRequest}
						listType="picture-card"
						className="avatar-uploader"
						showUploadList={false}
						beforeUpload={beforeUpload}
						onChange={handleChange}
					>
						{imageUrl ? (
							<img src={imageUrl} alt="avatar" style={{ width: '100%', height: '100%' }} />
						) : (
							uploadButton
						)}
					</Upload>
					<div id="upload-text">
						<p>
							Click to upload
							<br />
							store logo (optional)
						</p>
					</div>
				</div>
				<Form {...formItemLayout} onSubmit={handleSubmit}>
					<div id="header">
						<h2 id="get-started">
							Give your store
							<br />a name and an address!
						</h2>
					</div>
					<Form.Item>
						{getFieldDecorator('store', {
							rules: [
								{
									message: 'Enter your store name'
								},
								{
									required: true,
									message: 'Enter your store name'
								}
							]
						})(<Input placeholder="My store's name is..." />)}
					</Form.Item>
					<Form.Item>
						{getFieldDecorator('address', {
							rules: [
								{
									message: 'Enter your store address'
								},
								{
									required: true,
									message: 'Enter your store address'
								}
							]
						})(<Input placeholder="My store's address is..." />)}
					</Form.Item>
					<Form.Item {...tailFormItemLayout}>
						<Button type="primary" htmltype="submit">
							Done
						</Button>
					</Form.Item>
				</Form>
			</div>
		</Spin>
	);

	return addLogoForm;
};

const AddLogoForm = Form.create({ name: 'register' })(AddLogo);

export default AddLogoForm;
