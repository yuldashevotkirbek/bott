import React from 'react';

const ProductCard = ({ product, onSelect }) => (
    <div onClick={() => onSelect(product)} className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform hover:-translate-y-1 transition-all">
        <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
        <div className="p-4">
            <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
            <p className="text-blue-600 font-bold mt-1">{product.price.toLocaleString()} so'm</p>
        </div>
    </div>
);

export default ProductCard;