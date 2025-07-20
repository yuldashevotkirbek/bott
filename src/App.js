import React, { useState, useEffect, useCallback } from 'react';
import { db } from './firebase/config'; // Firebase config faylini import qilish
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import HomePage from './pages/HomePage';
import { addSampleProducts } from './utils/addSampleProducts';

// --- Ikonkalar (o'zgarishsiz) ---
const HomeIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const CartIcon = ({ count }) => <div className="relative"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>{count > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{count}</span>}</div>;
const ProfileIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const BackIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;
const Spinner = () => <div className="border-4 border-t-blue-500 border-gray-200 rounded-full w-8 h-8 animate-spin"></div>;
export default function App() {
    const [page, setPage] = useState('home');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [cart, setCart] = useState([]);
    const [user, setUser] = useState({ first_name: 'Mijoz' });
    const [loading, setLoading] = useState(false);
    
    // Telegram WebApp API'sini xavfsiz olish
    const tg = window.Telegram?.WebApp;

    useEffect(() => {
        if (tg) {
            tg.ready();
            if (tg.initDataUnsafe?.user) {
                setUser(tg.initDataUnsafe.user);
            }
        }
        // Kelajakda bu yerda foydalanuvchining savatini Firestore'dan yuklash logikasi bo'ladi.
    }, [tg]);

    const handleProductSelect = (product) => {
        setSelectedProduct(product);
        setPage('product');
    };

    const handleAddToCart = (product, size) => {
        setCart(prevCart => {
            const cartId = `${product.id}_${size}`;
            const existingItem = prevCart.find(item => item.cartId === cartId);
            if (existingItem) {
                return prevCart.map(item => item.cartId === cartId ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prevCart, { ...product, size, quantity: 1, cartId }];
        });
        if (tg?.HapticFeedback) {
            tg.HapticFeedback.notificationOccurred('success');
        }
        setPage('cart');
    };
    
    const handleUpdateCart = (cartId, quantity) => {
        if (quantity <= 0) {
            setCart(prevCart => prevCart.filter(item => item.cartId !== cartId));
        } else {
            setCart(prevCart => prevCart.map(item => item.cartId === cartId ? { ...item, quantity } : item));
        }
    };
    
    const handleCheckout = async () => {
        if (cart.length === 0) return;
        setLoading(true);
        try {
            const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            const orderData = {
                userId: user.id,
                userInfo: user,
                items: cart,
                totalPrice: total,
                status: 'Jarayonda',
                createdAt: serverTimestamp()
            };

            // Buyurtmani Firestore'ga saqlash
            const orderRef = await addDoc(collection(db, "orders"), orderData);
            const orderId = orderRef.id;

            // Botga xabar yuborish (orderId bilan)
            if (tg?.sendData) {
                tg.sendData(JSON.stringify({ 
                    type: 'new_order', 
                    orderId: orderId,
                    ...orderData 
                }));
            }
            
            if (tg?.HapticFeedback) {
                tg.HapticFeedback.notificationOccurred('success');
            }
            alert('Buyurtmangiz muvaffaqiyatli qabul qilindi!');
            setCart([]);
            setPage('profile');

        } catch (error) {
            console.error("Buyurtma yaratishda xatolik: ", error);
            alert('Buyurtma berishda xatolik yuz berdi.');
        } finally {
            setLoading(false);
        }
    };

    // Bu funksiyalar avvalgi kodda mavjud edi, ularni shu yerga ko'chiramiz
    const ProductDetailPage = ({ product, onAddToCart, onBack }) => {
        const [selectedSize, setSelectedSize] = useState(null);
        const sizes = product.sizes || ['S', 'M', 'L', 'XL']; // Agar mahsulotda o'lchamlar bo'lmasa

        return (
            <div className="animate-slide-in">
                <header className="p-4 flex items-center gap-4 sticky top-0 bg-white/80 backdrop-blur-sm z-10">
                    <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200"><BackIcon /></button>
                    <h1 className="text-xl font-bold">Mahsulot</h1>
                </header>
                <img src={product.image} alt={product.name} className="w-full h-72 object-cover" />
                <div className="p-4">
                    <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
                    <p className="text-3xl font-bold text-blue-600 mb-4">{product.price.toLocaleString()} so'm</p>
                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-700 mb-2">O'lchamni tanlang:</h3>
                        <div className="flex flex-wrap gap-2">
                            {sizes.map(size => (
                                <button key={size} onClick={() => setSelectedSize(size)} className={`border-2 rounded-md px-5 py-2 transition-all ${selectedSize === size ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300'}`}>{size}</button>
                            ))}
                        </div>
                    </div>
                    <button onClick={() => selectedSize && onAddToCart(product, selectedSize)} disabled={!selectedSize} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed">Savatga qo'shish</button>
                </div>
            </div>
        );
    };

    const CartPage = ({ cart, onUpdateCart, onCheckout, loading }) => {
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        if (cart.length === 0) return <div className="p-8 text-center text-gray-500">Savatingiz bo'sh.</div>;
        return (
            <div className="p-4">
                 <h1 className="text-2xl font-bold mb-4">Savat</h1>
                 <div className="space-y-4 mb-6">
                    {cart.map(item => (
                        <div key={item.cartId} className="flex items-center bg-white p-3 rounded-lg shadow-sm">
                            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md mr-4" />
                            <div className="flex-grow">
                                <p className="font-semibold">{item.name}</p>
                                <p className="text-sm text-gray-500">O'lcham: {item.size}</p>
                                <p className="font-bold text-blue-600 mt-1">{(item.price * item.quantity).toLocaleString()} so'm</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button onClick={() => onUpdateCart(item.cartId, item.quantity - 1)} className="w-8 h-8 rounded-full bg-gray-200">-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => onUpdateCart(item.cartId, item.quantity + 1)} className="w-8 h-8 rounded-full bg-gray-200">+</button>
                            </div>
                        </div>
                    ))}
                 </div>
                 <div className="p-4 bg-white rounded-lg shadow-sm sticky bottom-20">
                    <div className="flex justify-between items-center font-bold text-xl mb-4">
                        <span>Jami:</span>
                        <span>{total.toLocaleString()} so'm</span>
                    </div>
                    <button onClick={onCheckout} disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center disabled:bg-gray-400">
                        {loading ? <Spinner /> : 'Buyurtma berish'}
                    </button>
                 </div>
            </div>
        );
    };
    
    const ProfilePage = ({ user }) => {
        // Bu yerda foydalanuvchining buyurtmalarini Firestore'dan yuklash logikasi bo'lishi kerak
        return (
            <div className="p-4">
                <div className="flex items-center gap-4 mb-8 bg-white p-4 rounded-lg shadow-sm">
                    <div className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center text-3xl font-bold">{user.first_name?.[0]}</div>
                    <div>
                        <h1 className="text-2xl font-bold">{user.first_name} {user.last_name || ''}</h1>
                        <p className="text-gray-500">@{user.username}</p>
                    </div>
                </div>
                <h2 className="text-xl font-bold mb-4">Mening buyurtmalarim</h2>
                <p className="text-gray-500">Hozircha buyurtmalar yo'q.</p>
                {/* Buyurtmalar ro'yxati shu yerda ko'rsatiladi */}
            </div>
        );
    };

    const renderPage = () => {
        switch (page) {
            case 'product': return <ProductDetailPage product={selectedProduct} onAddToCart={handleAddToCart} onBack={() => setPage('home')} />;
            case 'cart': return <CartPage cart={cart} onUpdateCart={handleUpdateCart} onCheckout={handleCheckout} loading={loading} />;
            case 'profile': return <ProfilePage user={user} />;
            case 'home': default: return <HomePage onProductSelect={handleProductSelect} />;
        }
    };
    
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="bg-gray-100 min-h-screen font-sans pb-20">
            <div className="max-w-md mx-auto bg-white">
                {renderPage()}
                {/* Test uchun mahsulot qo'shish tugmasi */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="fixed top-4 right-4 z-50">
                        <button 
                            onClick={addSampleProducts}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm"
                        >
                            + Test mahsulotlar
                        </button>
                    </div>
                )}
            </div>
            <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-t max-w-md mx-auto border-t">
                <div className="flex justify-around items-center h-16">
                    <button onClick={() => setPage('home')} className={`p-2 rounded-lg ${page === 'home' ? 'text-blue-600' : 'text-gray-500'}`}><HomeIcon /></button>
                    <button onClick={() => setPage('cart')} className={`p-2 rounded-lg ${page === 'cart' ? 'text-blue-600' : 'text-gray-500'}`}><CartIcon count={cartCount} /></button>
                    <button onClick={() => setPage('profile')} className={`p-2 rounded-lg ${page === 'profile' ? 'text-blue-600' : 'text-gray-500'}`}><ProfileIcon /></button>
                </div>
            </nav>
        </div>
    );
}
