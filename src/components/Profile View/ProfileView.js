import React, { useState, useEffect } from 'react';
import ProfileForm from './ProfileForm';
import Navbar from '../Navbar';
import AxiosAuth from '../Auth/axiosWithAuth';

const ProfileView = () => {
	const [ store, setStore ] = useState();

	useEffect(
		() => {
			AxiosAuth()
				.get('https://ecommerce-app-be.herokuapp.com//api/store/')
				.then((res) => {
					setStore(res.data);
				})
				.catch((err) => {
					console.log(err);
				});
		},
		[ setStore ]
	);

	return (
		<div className="profileViewContainer">
			<Navbar />
			<h1>Profile</h1>
			{store && <ProfileForm store={store} />}
		</div>
	);
};

export default ProfileView;
