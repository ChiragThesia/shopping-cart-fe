import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as creators from '../../state/actionCreators';
import AllProducts from './AllProducts';
import StoreNav from './StoreNav';
import CategoryPicker from '../categories/CategoryPicker';
function StoreView(props) {
	const sellerId = props.match.params.id.split('-').pop();
	const dispatch = useDispatch();
	const [ cat, setCat ] = useState('');
	const [ currentCat ] = useState();
	useEffect(
		() => {
			dispatch(creators.getCurrentUser());
			dispatch(creators.getStore(sellerId));
			dispatch(creators.setStoreUrl(window.location.href));
		},
		[ sellerId, dispatch ]
	);
	const inventory = useSelector((state) => state.store);
	const store = useSelector((state) => state.user);
	const categories = inventory.allUniqueCategories;
	const searchString = useSelector((state) => state.search);
	const [ categorySearch, setCategorySearch ] = useState('');
	const change = (e) => {
		setCategorySearch(e.target.value.toLowerCase());
	};
	let filteredProducts =
		inventory.products &&
		inventory.products.filter((item) => {
			return item.category.toLowerCase().includes(categorySearch);
		});
	return (
		<div>
			<div>
				<StoreNav match={props.match} change={change} store={store} />
				<CategoryPicker
					style={{
						margin: '100px'
					}}
					categorySearch={categorySearch}
					setCategorySearch={setCategorySearch}
					currentCat={currentCat}
					cat={cat}
					// storeCategories={storeCategories}
					setCat={setCat}
					categories={categories}
				/>
				<AllProducts
					filteredProducts={filteredProducts}
					searchString={searchString}
					inventory={inventory}
					categorySearch={categorySearch}
					setCategorySearch={setCategorySearch}
				/>
			</div>
		</div>
	);
}
export default StoreView;
