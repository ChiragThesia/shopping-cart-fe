import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AxiosAuth from '../Auth/axiosWithAuth';
import history from '../../history';
import * as creators from '../../state/actionCreators';
//components
import Addphoto from './addPhoto';
import BasicDetails from './basicDetails';
import AddVariants from './addVariants';
import Navbar from '../Navbar';
import Message from './message';

function UpdateItem(props) {
	const dispatch = useDispatch();
	const itemId = props.match.params.id;
	const sellerId = localStorage.getItem('sellerId');
	const [ message, setMessage ] = useState();

	useEffect(
		() => {
			dispatch(creators.getProducts(sellerId));
			//Ensure the window always loads at the top
			window.scrollTo(0, 0);
		},
		[ sellerId, dispatch ]
	);

	useEffect(
		() => {
			AxiosAuth().get(`https://ecommerce-app-be.herokuapp.com//api/store/products/${itemId}`).then((res) => {
				setProductData(res.data);
			});
		},
		[ itemId ]
	);

	// inventory gets all of the products from the redux store (redux store is calling the db)
	const inventory = useSelector((state) => state.store);

	//Keeps track of what field is empty
	const [ errorState, setErrorState ] = useState();
	// The object that is posted
	const [ productData, setProductData ] = useState({
		productName: '',
		price: '',
		category: '',
		description: '',
		images: [],
		variantName: '',
		variantDetails: []
	});

	//The state that holds the "addVaraint" component info (onClick creates an obj that is added to the Variants array
	const [ formData, setFormData ] = useState({
		option: '',
		price: ''
	});

	function submitHandler() {
		if (!productData.productName) {
			return setErrorState('productName');
		}

		if (!productData.price) {
			return setErrorState('price');
		}

		if (!productData.category) {
			return setErrorState('category');
		}

		if (productData.images.length < 1) {
			return setErrorState('images');
		}

		AxiosAuth()
			.put(`https://ecommerce-app-be.herokuapp.com//api/store/products/${itemId}`, productData)
			.then((res) => {
				if (res.status === 200) {
					setMessage('You’re Product Was Updated Successfuly!');
					setTimeout(function() {
						setMessage();
					}, 3000);
				}
			})
			.catch((error) => {
				console.log(error);
				if (error.status === 404) {
					setMessage('Something Went Wrong!');
				}
			});
	}

	function removeProduct() {
		AxiosAuth()
			.delete(`https://ecommerce-app-be.herokuapp.com//api/store/products/${itemId}`)
			.then((res) => {
				if (res.status === 200) {
					setMessage('You’re Product Was Deleted Successfuly!');
					setTimeout(function() {
						history.push('/dashboard');
					}, 3000);
				}
			})
			.catch((error) => {
				console.log(error);
				if (error.status === 404) {
					setMessage('Something Went Wrong!');
				}
			});
	}
	return (
		<div>
			<Navbar data-testid="updateItemNav" />
			<Message message={message} />
			<div className="createProductView">
				<div className="createProductHeader">
					<h1>Edit Product</h1>
					<div className="actionContainer">
						<button onClick={removeProduct} className="removeProduct">
							Remove Product
						</button>

						<button onClick={submitHandler} className="createProduct">
							Save Product
						</button>
					</div>
				</div>
				<div className="basicDetailsVariantsContainer">
					<div className="leftContainer">
						<Addphoto
							productData={productData}
							setProductData={setProductData}
							errorState={errorState}
							setErrorState={setErrorState}
						/>
					</div>
					<div className="rightContainer">
						<BasicDetails
							inventory={inventory}
							productData={productData}
							setProductData={setProductData}
							setErrorState={setErrorState}
							errorState={errorState}
						/>
						<AddVariants
							setFormData={setFormData}
							formData={formData}
							productData={productData}
							setProductData={setProductData}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default UpdateItem;
