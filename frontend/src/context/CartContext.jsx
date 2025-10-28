import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

const getLocalCart = () => {
    try {
        const localCart = localStorage.getItem('cart');
        return localCart ? JSON.parse(localCart) : [];
    } catch (error) {
        console.error("Could not parse cart from localStorage", error);
        return [];
    }
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(getLocalCart);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity = 1) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item._id === product._id);
            if (existingItem) {
                return prevItems.map(item =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                return [...prevItems, { ...product, quantity }];
            }
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item._id === productId
                    ? { ...item, quantity: Math.max(1, quantity) }
                    : item
            )
        );
    };
    
    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cart');
    };

    const placeOrder = async (shippingAddress) => {
        if (!isAuthenticated) {
            throw new Error("You must be logged in to place an order.");
        }
        if (cartItems.length === 0) {
            throw new Error("Your cart is empty.");
        }

        const orderData = {
            items: cartItems.map(item => ({
                product: item.id,
                quantity: item.quantity,
            })),
            shippingAddress,
            payment: {
                method: 'credit_card'
            }
        };

        const response = await api.post('/orders', orderData);
        clearCart();
        return response.data;
    };

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        placeOrder,
        cartCount: cartItems.reduce((acc, item) => acc + item.quantity, 0),
        cartTotal: cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

