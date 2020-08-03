import React, { useState, useEffect } from 'react';
import AxiosAuth from '../Auth/axiosWithAuth';
import Axios from 'axios';
import { TwitterPicker } from 'react-color';
import Message from '../Products/message';
const ProfileForm = ({ store }) => {
	const [ input, setInput ] = useState({
		businessName: store.businessName,
		ownerName: store.ownerName,
		address: store.address,
		secondAddress: store.secondAddress,
		city: store.city,
		state: store.state,
		zipcode: store.zipcode,
		hours: store.hours,
		curbHours: store.curbHours,
		logo: store.logo,
		color: store.color
	});
	const [ message, setMessage ] = useState();
	useEffect(() => {}, []);
	const uploadImage = (e) => {
		const files = e.target.files;
		const data = new FormData();
		data.append('file', files[0]);
		data.append('upload_preset', 'shopping-cart-logo');
		Axios.post('https://api.cloudinary.com/v1_1/dnsl4nbz4/image/upload', data)
			.then((res) => {
				setInput({
					...input,
					logo: res.data.secure_url
				});
			})
			.catch((err) => console.log(err.message));
	};

	const handleChange = (e) => {
		setInput({
			...input,
			[e.target.name]: e.target.value
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		AxiosAuth()
			.put(`https://shielded-journey-22349.herokuapp.com//api/store/`, input)
			.then((res) => {
				if (res.data) {
					setMessage('You’re Profile Was Updated Successfuly!');
					setTimeout(function() {
						window.location.reload();
					}, 2000);
				}
			})
			.catch((err) => {
				console.log(err.response.data);
				setMessage('Something Went Wrong!');
			});
	};

	return (
		<div className="profileViewWrapper" data-testid="profileFormMainDiv">
			<Message message={message} />
			<div className="firstWrapper">
				<div className="logoContainer">
					<h3>Logo</h3>
					<img src={input.logo} alt="logo" />
					<input type="file" onChange={uploadImage} />
				</div>
				<div className="colorContainer">
					<h3>Brand Color</h3>
					<TwitterPicker
						className="colorPicker"
						color={input.color}
						onChange={(color) => {
							setInput({
								...input,
								color: color.hex
							});
						}}
					/>
				</div>
			</div>
			<div className="formContainer">
				<h3>Basic Details:</h3>
				{store && (
					<form className="profileForm" onSubmit={handleSubmit}>
						<main>
							<section className="firstSection">
								<label>Business Name</label>
								<input value={input.businessName} name="businessName" onChange={handleChange} />
								<label>Owner Name</label>
								<input value={input.ownerName} name="ownerName" onChange={handleChange} />
								<label>Address</label>
								<input value={input.address} name="address" onChange={handleChange} />
							</section>
							<section className="secondSection">
								<label>City</label>
								<input value={input.city} name="city" onChange={handleChange} />
								<label>State</label>
								<input value={input.state} name="state" onChange={handleChange} />
								<label>Zipcode</label>
								<input value={input.zipcode} name="zipcode" onChange={handleChange} />
							</section>
						</main>
						<section className="thirdSection">
							<label>Working Hours</label>
							<input value={input.hours} name="hours" onChange={handleChange} />
							<label>Curbside Pick up Hours</label>
							<input value={input.curbHours} name="curbHours" onChange={handleChange} />
						</section>
						<button>Update Profile</button>
					</form>
				)}
			</div>
		</div>
	);
};

export default ProfileForm;
