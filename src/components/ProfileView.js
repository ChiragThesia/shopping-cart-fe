import React, { useState, useEffect } from 'react';
import AxiosAuth from '../components/Auth/axiosWithAuth';
import Navbar from './Navbar';
const ProfileView = () => {
	const [ logo, setLogo ] = useState();
	const [ address, setAddress ] = useState();
	const [ secondAddress, setSecondAddress ] = useState();
	const [ businessName, setBusinessName ] = useState();
	const [ city, setCity ] = useState();
	const [ color, setColor ] = useState();
	const [ curbHours, setCurbHours ] = useState();
	const [ hours, setHours ] = useState();
	const [ ownerName, setOwnerName ] = useState();
	const [ phone, setPhone ] = useState();
	const [ state, setState ] = useState();
	const [ zipcode, setZipcode ] = useState();

	useEffect(() => {
		AxiosAuth()
			.get('https://shielded-journey-22349.herokuapp.com//api/store/')
			.then((res) => {
				setLogo(res.data.logo);
				setAddress(res.data.address);
				setZipcode(res.data.zipcode);
				setSecondAddress(res.data.secondAddress);
				setBusinessName(res.data.businessName);
				setCity(res.data.city);
				setColor(res.data.color);
				setCurbHours(res.data.curbHours);
				setHours(res.data.hours);
				setOwnerName(res.data.ownerName);
				setPhone(res.data.phone);
				setState(res.data.state);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);
	return (
		<div data-testid="profileViewWrapper">
			<Navbar />
			<h1 data-testid="profileViewHeader">Profile</h1>
			<div
				data-testid="profileViewColorWrapper"
				style={{
					marginTop: '90px',
					border: '2px solid',
					borderColor: color
				}}
				className="profileViewWrapper"
			>
				<section className="logoColor" data-testid="profileViewSection">
					<h3 className="labels logoColorlabels">Logo</h3>
					<img data-testid="profileViewLogo" className="profileViewLogo" src={logo} alt="logo" />
					<h3 className="labels logoColorlabels">Brand Color</h3>
					<div
						data-testid="profileViewColorDiv"
						className="profileViewColor"
						style={{
							height: '100px',
							width: '200px',
							backgroundColor: color
						}}
					/>
				</section>

				<div className="profileView" data-testid="profileViewSecondaryWrapper">
					<h3 className="labels mainLabel">Basic Details</h3>

					<div className="profileLeftRight" data-testid="profileViewLeftRight">
						<div className="profileViewLeft" data-testid="profileViewLeft">
							<h3 className="labels">Business Name</h3>
							<p className="profileInfo" data-testid="profileBusinessName">
								{businessName}
							</p>
							<h3 className="labels">Owner Name</h3>
							<p className="profileInfo" data-testid="profileOwner">
								{ownerName}
							</p>
							<h3 className="labels">Building / Unit / Suite</h3>
							<p className="profileInfo" data-testid="profileSecondaryAddress">
								{secondAddress}
							</p>
							<h3 className="labels">State</h3>
							<p className="profileInfo" data-testid="profileState">
								{state}
							</p>
						</div>

						<div className="profileViewRight">
							<h3 className="labels">Phone Number</h3>
							<p className="profileInfo" data-testid="profilePhoneNumber">
								{phone}
							</p>
							<h3 className="labels">Address</h3>
							<p className="profileInfo" data-testid="profileAddress">
								{address}
							</p>
							<h3 className="labels">City</h3>
							<p className="profileInfo" data-testid="profileCity">
								{city}
							</p>

							<h3 className="labels">Zip Code</h3>
							<p className="profileInfo" data-testid="profileZipCode">
								{zipcode}
							</p>
						</div>
					</div>

					<div className="profileViewHours">
						<h3 className="labels">Hours</h3>
						<p className="profileInfo" data-testid="profileBusinessHours">
							{hours}
						</p>
						<h3 className="labels">Curbside Hours</h3>
						<p className="profileInfo" data-testid="profileCurbHours">
							{curbHours}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfileView;
