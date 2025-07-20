import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const sampleProducts = [
    {
        name: "Nike Air Max 270",
        price: 850000,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
        description: "Zamonaviy dizayn va qulaylik",
        sizes: ["S", "M", "L", "XL"],
        category: "shoes"
    },
    {
        name: "Adidas Ultraboost 21",
        price: 1200000,
        image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop",
        description: "Professional yugurish krossovkasi",
        sizes: ["S", "M", "L", "XL"],
        category: "shoes"
    },
    {
        name: "Levi's 501 Jeans",
        price: 450000,
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop",
        description: "Klassik dizayn",
        sizes: ["S", "M", "L", "XL"],
        category: "clothes"
    },
    {
        name: "Zara Cotton T-Shirt",
        price: 120000,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
        description: "100% paxta material",
        sizes: ["S", "M", "L", "XL"],
        category: "clothes"
    },
    {
        name: "Apple Watch Series 7",
        price: 2500000,
        image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop",
        description: "Smart soat",
        sizes: ["40mm", "44mm"],
        category: "electronics"
    },
    {
        name: "Samsung Galaxy Buds Pro",
        price: 800000,
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop",
        description: "Wireless quloqchinlar",
        sizes: ["One Size"],
        category: "electronics"
    }
];

export const addSampleProducts = async () => {
    try {
        const productsCollection = collection(db, 'products');
        
        for (const product of sampleProducts) {
            await addDoc(productsCollection, {
                ...product,
                createdAt: new Date()
            });
            console.log(`✅ ${product.name} qo'shildi`);
        }
        
        console.log('🎉 Barcha mahsulotlar muvaffaqiyatli qoshildi!');
    } catch (error) {
        console.error('❌ Mahsulotlarni qoshishda xatolik:', error);
    }
};

// Test uchun ishlatish
// addSampleProducts(); 