import * as types from './actionTypes';
import AxiosAuth from '../components/Auth/axiosWithAuth';
import axios from 'axios';
const getUserUrl = 'https://shielded-journey-22349.herokuapp.com//api/store/';
export const updateForm = (details) => ({
	type: types.UPDATE_FORM,
	payload: details
});
export const getCurrentUser = () => (dispatch) => {
	AxiosAuth()
		.get(getUserUrl)
		.then((res) => {
			dispatch({ type: types.GET_CURRENT_USER, payload: res.data });
			AxiosAuth()
				.get(`https://shielded-journey-22349.herokuapp.com//api/store/${res.data._id}/products`)
				.then((res) => {
					if (res.data) {
						const getAllCategories = res.data.map((cv) => {
							return cv.category;
						});
						const allUniqueCategories = [ ...new Set(getAllCategories) ];
						const products = [ ...res.data ];
						const inventory = {
							products: products,
							allUniqueCategories: allUniqueCategories
						};
						dispatch({ type: types.GET_INVENTORY, payload: inventory });
					}
				})
				.catch((error) => {
					console.log(error.response);
					setErrors(error.response);
				});
		})
		.catch((error) => {
			console.log(error.response);
			setErrors(error.response);
		});
};
export const getCart = (cartId) => (dispatch) => {
	axios
		.get(`https://shielded-journey-22349.herokuapp.com//api/store/cart/${cartId}`)
		.then((res) => {
			const savedCart = res.data;
			dispatch({ type: types.SAVE_CART, payload: savedCart });
		})
		.catch((error) => {
			console.log(error);
		});
};
export function increment(id) {
	return {
		type: types.INCREMENT,
		payload: id
	};
}
export function decrement(id) {
	return {
		type: types.DECREMENT,
		payload: id
	};
}
export const logout = () => {
	return {
		type: types.LOGOUT_USER
	};
};
export const setStore = (store) => {
	return {
		type: types.SET_STORE,
		payload: store
	};
};
export const setString = (str) => {
	return {
		type: types.SEARCHSTRING,
		payload: str
	};
};
export const addToCart = (item) => {
	return {
		type: types.ADD_TO_CART,
		payload: item
	};
};
export const updateCartQuantity = (id) => {
	return {
		type: types.UPDATE_CART_QUANTITY,
		payload: id
	};
};
export const subtractFromCart = (item) => {
	return {
		type: types.REMOVE_ITEM_FROM_CART,
		payload: item
	};
};
export const clearStore = () => {
	return {
		type: types.CLEAR_STORE
	};
};
export const setLoading = (isLoading) => {
	return {
		type: types.LOADING,
		payload: isLoading
	};
};
export const setErrors = (errors) => {
	return {
		type: types.SET_ERRORS,
		payload: errors
	};
};
export const clearErrors = () => {
	return {
		type: types.CLEAR_ERRORS
	};
};
export const clearUser = () => {
	return {
		type: types.CLEAR_USER
	};
};
export const deleteStore = () => (dispatch) => {
	AxiosAuth()
		.delete('https://shielded-journey-22349.herokuapp.com//api/store')
		.then((res) => {
			const message = res.data;
			setLoading(true);
			clearStore();
			dispatch({ type: types.DELETE_STORE, payload: message });
		})
		.catch((err) => {
			setErrors(err.response.data);
		});
};
export const deleteAccount = () => (dispatch) => {
	setLoading(true);
	AxiosAuth()
		.delete('https://shielded-journey-22349.herokuapp.com//api/auth/account')
		.then((res) => {
			logout();
			dispatch({ type: types.DELETE_ACCOUNT });
		})
		.catch((err) => {
			setErrors(err.response.data);
		});
};
export const getProducts = (sellerId, signal) => (dispatch) => {
	axios
		.get(`https://shielded-journey-22349.herokuapp.com//api/store/${sellerId}/products`)
		.then((res) => {
			const inventory = res.data;
			dispatch({ type: types.GET_INVENTORY, payload: inventory });
		})
		.catch((error) => {
			setErrors(error.response);
		});
};
export const getOneProduct = (productId) => (dispatch) => {
	axios
		.get(`http://localhost:4000/api/store/products/${productId}`)
		.then((res) => {
			console.log('RES', res);
			dispatch({ type: types.GET_ONE_PRODUCT, payload: res.data });
		})
		.catch((error) => {
			setErrors(error.response);
		});
};
export const getStore = (sellerId, signal) => (dispatch) => {
	axios
		.get(`https://shielded-journey-22349.herokuapp.com//api/store/${sellerId}`)
		.then((res) => {
			dispatch({ type: types.GET_CURRENT_USER, payload: res.data });
		})
		.catch((error) => {
			setErrors(error.response.data);
		});
};
//MINE
export const getOrders = (storeId) => (dispatch) => {
	axios
		.get(
			`https://shielded-journey-22349.herokuapp.com/
/api/store/${storeId}/products`
		)
		.then((res) => {
			const inventory = res.data;
			dispatch({ type: types.GET_INVENTORY, payload: inventory });
		})
		.catch((error) => {
			setErrors(error.response.data);
		});
};
export const getOneOrder = (orderId) => (dispatch) => {
	axios
		.get(`http://localhost:4000/api/store/order/${orderId}`)
		.then((res) => {
			dispatch({ type: types.GET_ONE_ORDER, payload: res.data });
		})
		.catch((error) => {
			setErrors(error.response);
		});
};
export const updateOrder = (details) => (dispatch) => {
	axios.put(`http://localhost:4000/api/store/order/5ebb470f0d20bf0b10ded8f5`);
};
export const deleteOrder = (orderId) => (dispatch) => {
	axios
		.delete(`http://localhost:4000/api/store/order/${orderId}`, orderId)
		.then((res) => {
			dispatch({ type: types.DELETE_ORDER });
			console.log(res);
		})
		.catch((err) => {
			setErrors(err.response.data);
		});
};
//DONE
export const setStoreUrl = () => {
	return {
		type: types.SET_STORE_URL,
		payload: window.location.pathname
	};
};
export const saveCart = (cart) => {
	return {
		type: types.SAVE_CART,
		payload: cart
	};
};
export const getSalesHistory = () => (dispatch) => {
	setLoading(true);
	AxiosAuth()
		.get('https://shielded-journey-22349.herokuapp.com//api/store/sales')
		.then((res) => {
			setLoading(false);
			dispatch({ type: types.GET_SALES_HISTORY, payload: res.data });
		})
		.catch((err) => {
			setLoading(false);
			console.log(err.response.data);
		});
};
// DELETE order
export const deleteOrderProduct = (order_id, orderItem_id) => (dispatch) => {
	dispatch({ type: types.DELETE_ORDER_PRODUCT });
	axios
		.delete(`http://localhost:4000/api/store/${order_id}/${orderItem_id}`)
		.then((res) => {
			console.log('res:', res);
		})
		.catch((err) => {
			console.log(err.response.data);
		});
};
export const getStoreOrders = (storeId) => (dispatch) => {
	AxiosAuth()
		.get(`https://shielded-journey-22349.herokuapp.com//api/store/${storeId}/order`)
		.then((res) => {
			dispatch({ type: types.GET_ORDERS, payload: res.data });
		})
		.catch((err) => {
			console.log(err.response.data);
		});
};
// PUT order
export const updateOrderProduct = (order_id, orderItem_id, payload) => (dispatch) => {
	dispatch({ type: types.UPDATE_ORDER_PRODUCT });
	axios
		.put(`http://localhost:4000/api/store/${order_id}/${orderItem_id}`, payload)
		.then((res) => {
			dispatch({ type: types.UPDATE_ORDER_PRODUCT, payload });
			console.log(res);
		})
		.catch((err) => {
			console.log(err.response.data);
			alert('Profile update failed, please try again!');
		});
	setLoading(true);
	AxiosAuth()
		.get('https://shielded-journey-22349.herokuapp.com//api/store/sales')
		.then((res) => {
			setLoading(false);
			dispatch({ type: types.GET_SALES_HISTORY, payload: res.data });
		})
		.catch((err) => {
			setLoading(false);
			console.log(err.response.data);
		});
};
// onboarding actions
export const postOnboard = (values) => (dispatch) => {
	dispatch({ type: types.ADD_ONBOARDING, payload: values });
};
export const profileUpdate = (userInfo) => (dispatch) => {
	dispatch({ type: types.UPDATE_PROFILE, payload: userInfo });
	AxiosAuth()
		.post('/api/store/', userInfo)
		.then((res) => {
			console.log('this has posted', res);
		})
		.catch((err) => {
			console.log(err);
		});
};
export const logoUpload = (logo) => (dispatch) => {
	dispatch({ type: types.UPLOAD_LOGO, payload: logo });
};
export const colorUpload = (color) => (dispatch) => {
	dispatch({ type: types.UPLOAD_COLOR, payload: color });
};
export const deleteSellerInfo = (values) => (dispatch) => {
	dispatch({ type: types.DELETE_SELLER_INFO });
	AxiosAuth()
		.delete('/api/store/', values)
		.then((res) => {
			console.log(res);
		})
		.catch((err) => {
			console.log(err.response.data);
		});
};
