import React from 'react';
import { Switch } from 'react-router-dom';
import './less/index.less';
import WrappedRegistrationForm from './components/register';
import LoginForm from './components/login';
import ResetPasswordForm from './components/ResetPassword/resetPassword';
import SetNewPasswordForm from './components/ResetPassword/setNewPassword';
import CreateStoreForm from './components/createStore/firstView';
import AddLogoForm from './components/createStore/addLogo';
import UpdateItem from './components/Products/updateItem';
import PrivateRoute from './components/Auth/PrivateRoute';
import PublicRoute from './components/Auth/PublicRoute';
import Inventory from './components/inventory/inventory';
import Home from './components/DashboardHome';
import StoreView from './components/store/StoreView';
import CartView from './components/cart/CartView';
import Single from './components/singleProduct/index'; // buyerSingleProductView
import SaveCartMain from './components/saveCart';
import Account from './components/SellerAccount/SellerAccount';
import WelcomeScreenForm from './components/WelcomeScreen/WelcomeScreen';
import BrandView from './components/BrandView';
import ColorPicker from './components/ColorPicker';
import CreateProductView from './components/Products/createProductView';
import Update from './components/Update';
import ProfileView from './components/Profile View/ProfileView';
import OrderDetailsView from './components/Orders/OrderDetailsView';
import StripeConfirmAccount from './components/Stripe/StripeConfirmAccount';
import CheckoutSuccessView from './components/cart/checkoutSuccessView';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

function App() {
	window.addEventListener('load', () => {
		function handleNetworkChange(event) {
			// delete this comment
			if (navigator.onLine) {
				document.getElementById('offline-notification').style.display = 'none';
			}
			else {
				document.getElementById('offline-notification').style.display = 'flex';
			}
		}
		window.addEventListener('online', handleNetworkChange);
		window.addEventListener('offline', handleNetworkChange);
	});

	const stripePromise = loadStripe('pk_test_VHc4fOD3byWy85jOWOYLijhH00OmL57YuX', {
		stripeAccount: 'acct_1H6LilIrVDEEa5AF'
	});
	return (
		<div>
			<Switch>
				<Elements stripe={stripePromise}>
					<PublicRoute path="/register" component={WrappedRegistrationForm} />
					{/* {Import WelcomeScreen} */}
					<PublicRoute path="/welcome" component={WelcomeScreenForm} />
					<PublicRoute path="/brandview" component={BrandView} />
					<PublicRoute path="/colorpicker" component={ColorPicker} />
					{/* Onboarding reformatted Above */}
					<PublicRoute path="/update" component={Update} />
					<PublicRoute exact path="/" component={LoginForm} />
					<PrivateRoute path="/inventory" component={Inventory} />
					{/* Profile View */}
					<PrivateRoute path="/profileview" component={ProfileView} />
					<PublicRoute path="/resetpassword" component={ResetPasswordForm} />
					<PublicRoute path="/setnewpassword" component={SetNewPasswordForm} />
					<PublicRoute path="/store/:id" component={StoreView} />

					<PublicRoute path="/cart" component={CartView} />
					<PrivateRoute path="/api/auth/stripe/token" component={StripeConfirmAccount} />
					<PublicRoute path="/savecart" component={SaveCartMain} />
					<PrivateRoute path="/createstore" component={CreateStoreForm} />
					<PrivateRoute path="/addlogo" component={AddLogoForm} />
					<PrivateRoute path="/createitem" component={CreateProductView} />
					<PrivateRoute path="/dashboard" component={Home} />
					<PrivateRoute path="/updateitem/:id" component={UpdateItem} />
					<PrivateRoute path="/order/:id" component={OrderDetailsView} />
					<PublicRoute path="/product/:id" component={Single} />

					<PublicRoute path="/success/:id" component={CheckoutSuccessView} />
					<PrivateRoute path="/account" component={Account} />
				</Elements>
			</Switch>
			<div
				id="offline-notification"
				style={{
					position: 'fixed',
					bottom: '0px',
					width: '100vw',
					height: '4vh',
					textAlign: 'center',
					backgroundColor: '#ff6663',
					justifyContent: 'space-around',
					alignItems: 'center',
					color: 'white',
					fontSize: 'medium',
					display: 'none'
				}}
			>
				Offline Mode
			</div>
		</div>
	);
}

export default App;
