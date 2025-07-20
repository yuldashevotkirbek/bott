import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import ProductCard from '../components/ProductCard';

const Spinner = () => <div className="border-4 border-t-blue-500 border-gray-200 rounded-full w-8 h-8 animate-spin"></div>;

const HomePage = ({ onProductSelect }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productsCollection = collection(db, 'products');
                const productSnapshot = await getDocs(productsCollection);
                const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setProducts(productList);
            } catch (error) {
                console.error("Mahsulotlarni yuklashda xatolik: ", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
    }

    return (
        <div>
            <header className="p-4">
                <h1 className="text-2xl font-bold text-gray-900">Moda Markazi</h1>
                <p className="text-gray-600">Eng so'nggi kolleksiyalar</p>
            </header>
            <main className="p-4 grid grid-cols-2 gap-4">
                {products.map(p => <ProductCard key={p.id} product={p} onSelect={onProductSelect} />)}
            </main>
        </div>
    );
};

export default HomePage;
