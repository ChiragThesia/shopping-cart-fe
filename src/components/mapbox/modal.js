import React, { useState } from 'react';
import ReactMapGL, { Marker, NavigationControl, GeolocateControl, Popup } from 'react-map-gl';
import location from '../../images/location.svg';

const mapboxApiToken = 'pk.eyJ1IjoiYXJpdWthMTEiLCJhIjoiY2tjYjU4djRmMHE4azM0cWtsOWY0OXR4MSJ9.nXeE9BwATwbesLeJJxJTAw';

const Modal = ({ show, user, place }) => {
	const [ local ] = useState(JSON.parse(localStorage.getItem('response')) || [ 50, 50 ]);
	const [ selected, setSelected ] = useState(false);

	const [ viewPort, setViewPort ] = useState({
		latitude: local.lat,
		longitude: local.lng,
		width: '30vw',
		height: '20vh',
		zoom: 12
	});

	return (
		<div
			className="modal-wrapper"
			style={{
				transform: show ? 'translateY(0vh)' : 'translateY(-100vh)',
				opacity: show ? '1' : '0'
			}}
		>
			{place && (
				<div className="modal-header">
					<h3>
						{user.businessName} | {user.address}, {user.city} {user.state}, {user.zipcode}
					</h3>
					<p>Phone Number: {user.phone}</p>
					<p>Working Hours: {user.hours}</p>
					<p>Curb Hours: {user.curbHours}</p>
					<a
						href={`https://www.google.com/maps/search/?api=1&query=${place.geometry.location.lat},${place
							.geometry.location.lng}&query_place_id=${place.place_id}`}
					>
						Get Direction
					</a>
				</div>
			)}
			<div className="modal-body">
				{place ? (
					<div className="mapContainer">
						<ReactMapGL
							{...viewPort}
							mapboxApiAccessToken={mapboxApiToken}
							// mapStyle = "mapbox://styles/ariuka11/ckcgwlimk0ldc1iob71hc4s2h"
							mapStyle="mapbox://styles/ariuka11/ckcgwq30x0a8k1ip68ajqruoo"
							// mapStyle = "mapbox://styles/ariuka11/ckcb5g7ne3rbq1inu8kc7dqye"
							onViewportChange={(viewPort) => {
								setViewPort(viewPort);
							}}
						>
							<Marker
								latitude={place.geometry.location.lat}
								longitude={place.geometry.location.lng}
								offsetLeft={-20}
								className="marker"
							>
								<button
									onClick={(e) => {
										e.preventDefault();
										setSelected(true);
									}}
								>
									<img src={location} alt="marker" />
								</button>
							</Marker>
							{selected && (
								<Popup
									latitude={place.geometry.location.lat}
									longitude={place.geometry.location.lng}
									onClose={() => {
										setSelected(false);
									}}
								>
									<h3>{user.address},</h3>
									<p style={{ fontSize: '1.5rem' }}>
										{user.city} {user.state}, {user.zipcode}
									</p>
								</Popup>
							)}
							<div style={{ position: 'absolute', right: 0 }}>
								<NavigationControl />
							</div>
							<div style={{ position: 'absolute', left: 0 }}>
								<GeolocateControl
									positionOptions={{ enableHighAccuracy: true }}
									trackUserLocation={true}
								/>
							</div>
						</ReactMapGL>
					</div>
				) : (
					<div>No Map</div>
				)}
			</div>
		</div>
	);
};

export default Modal;
