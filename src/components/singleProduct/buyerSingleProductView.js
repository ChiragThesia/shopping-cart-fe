import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import * as creators from '../../state/actionCreators';

function SingleProductView(props) {
	//productState is used only for the values that is submitted to the cart
	const [ fullProduct, setFullProduct ] = useState([]);
	const [ productState, setProductState ] = useState([
		{
			productName: '',
			price: null,
			productId: '',
			quantity: 1,
			images: [],
			variantDetails: []
		}
	]);

	//Full Product is used to populate the interface
	const itemId = props.productId;
	const dispatch = useDispatch();

	const cartContents = useSelector((state) => state.cart);

	function changeHandler(e) {
		e.preventDefault();
		setProductState({
			...productState,
			[e.target.name]: parseInt(e.target.value)
		});
	}

	const variandChangeHandler = (e) => {
		const foundVar = fullProduct.variantDetails.filter((value) => {
			return value.option === e.target.value;
		});

		setProductState({
			...productState,
			variantDetails: foundVar
		});
	};

	const addToCart = (arg) => {
		if (arg.variantDetails.length > 2) {
			const productIdexists = cartContents.some((cart) => {
				return cart.productId === arg.productId;
			});
			if (!productIdexists) {
				dispatchItem(arg);
			}
		}
		else {
			const productIdexists = cartContents.some((cart) => {
				return cart.variantDetails[0]._id === arg.variantDetails[0]._id;
			});
			if (!productIdexists) {
				dispatchItem(arg);
			}
		}
	};

	useEffect(
		() => {
			axios
				.get(`https://shielded-journey-22349.herokuapp.com//api/store/products/${itemId}`)
				.then((res) => {
					setFullProduct(res.data);
					setProductState({
						productName: res.data.productName,
						price: res.data.price,
						productId: res.data._id,
						quantity: 1,
						images: [ res.data.images ],
						variantDetails: [ res.data.variantDetails ]
					});
				})
				.catch((err) => {
					console.log(err);
				});
		},
		[ itemId ]
	);

	const dispatchItem = (item) => {
		if (item) {
			dispatch(creators.addToCart(item));
		}
	};
	console.log('ProductState', productState);

	return (
		<div className="singleProductContainer" data-testid="singleProductViewWrapper">
			<div className="photoSection">
				<div className="allPhotos">
					{fullProduct.images ? (
						fullProduct.images.map((cv) => {
							return <img src={cv} alt="cart" />;
						})
					) : (
						''
					)}
				</div>
			</div>
			<div className="productInfoContatiner">
				<h2>{productState.productName}</h2>
				{fullProduct.variantDetails && fullProduct.variantDetails.length > 1 ? (
					<h1>
						$
						{productState.variantDetails && productState.variantDetails[0].price}
					</h1>
				) : (
					<h1> ${productState.price}</h1>
				)}

				<div className="divider" />
				<h3 className="description"> Description</h3>
				<p>{fullProduct.description}</p>
				<div className="productOptions">
					<div className="quantity">
						<label htmlFor="productQuantity">Quantity</label>
						<select name="quantity" onChange={changeHandler}>
							<option disabled selected value>
								select an quantity
							</option>
							<option value="1">1</option>
							<option value="2">2</option>
							<option value="3">3</option>
							<option value="4">4</option>
							<option value="5">5</option>
							<option value="6">6</option>
							<option value="7">7</option>
							<option value="8">8</option>
							<option value="9">9</option>
							<option value="10">10</option>
						</select>
					</div>

					{fullProduct.variantDetails && fullProduct.variantDetails.length > 0 ? (
						<div className="variant">
							<label htmlFor="">Chosen Name</label>
							<select onChange={variandChangeHandler}>
								<option disabled selected value>
									select an option
								</option>
								{fullProduct.variantDetails &&
									fullProduct.variantDetails.map((v) => <option value={v.option}>{v.option}</option>)}
							</select>
						</div>
					) : (
						''
					)}
				</div>

				<button className="addToCart" onClick={() => addToCart(productState)}>
					Add To Cart
				</button>
			</div>
		</div>
	);
}

export default SingleProductView;
