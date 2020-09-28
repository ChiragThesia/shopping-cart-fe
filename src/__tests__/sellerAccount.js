import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import renderWithProviders from '../utlities/renderWithProviders';

import Seller from '../components/SellerAccount/SellerAccount';

describe('View of the seller account, it displays stripe connection', () => {
	test('renders main wrapper', () => {
		const { getByTestId } = renderWithProviders(<Seller />);
		const element = getByTestId('main');
		expect(element).toHaveTextContent('Account');
	});
	test("renders the component with 'Your Stripe ID' title", () => {
		const { getByText } = renderWithProviders(<Seller />);
		const element = getByText(/stripe id/i);
		expect(element).toBeVisible();
	});
});
