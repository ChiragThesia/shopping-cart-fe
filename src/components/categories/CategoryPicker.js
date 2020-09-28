import React from 'react';
const CategoryPicker = ({ categories, setCategorySearch }) => {
	return (
		<div
			style={{
				margin: '100px'
			}}
		>
			<div data-testid="optionWrapper" className="optionWrapper">
				<button
					className="categoryButton"
					onClick={() => {
						setCategorySearch('');
					}}
				>
					All
				</button>
				{categories &&
					categories.map((item) => {
						return (
							<button
								data-testid="categoryButton"
								className="categoryButton"
								onClick={() => {
									setCategorySearch(item.toLowerCase());
								}}
							>
								{item}
							</button>
						);
					})}
			</div>
		</div>
	);
};
export default CategoryPicker;
