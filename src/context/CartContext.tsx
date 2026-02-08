"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase/firebase";
import { doc, onSnapshot, setDoc, getDoc } from "firebase/firestore";

export interface CartItem {
    id: string; // Product ID
    name: string;
    price: number;
    image: string;
    quantity: number;
    slug: string;
}

interface CartProductInput {
    id: string;
    name: string;
    price: number;
    image: string;
    slug: string;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: CartProductInput) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
    decreaseQuantity: (productId: string) => Promise<void>;
    clearCart: () => Promise<void>;
    cartCount: number;
    cartTotal: number;
    isCartOpen: boolean;
    toggleCart: () => void;
}

const CartContext = createContext<CartContextType>({
    cart: [],
    addToCart: async () => { },
    removeFromCart: async () => { },
    decreaseQuantity: async () => { },
    clearCart: async () => { },
    cartCount: 0,
    cartTotal: 0,
    isCartOpen: false,
    toggleCart: () => { },
});

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { user } = useAuth();
    const [initializing, setInitializing] = useState(true);

    // Effect for Storage Logic (Auth vs Local)
    useEffect(() => {
        let unsubscribe: () => void;

        const syncCart = async () => {
            if (user) {
                // USER MODE: Sync with Firestore
                const userCartRef = doc(db, "users", user.uid);

                // Real-time listener for cart changes in DB
                unsubscribe = onSnapshot(userCartRef, (docSnap) => {
                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        if (userData.cart) {
                            setCart(userData.cart);
                        } else {
                            // If doc exists but no cart, explicit empty
                            setCart([]);
                        }
                    } else {
                        setCart([]);
                    }
                });

                // Check for local cart merge (simple merge: send local items to cloud then clear local)
                const localCartJson = localStorage.getItem('sareine_cart');
                if (localCartJson) {
                    try {
                        const localCart: CartItem[] = JSON.parse(localCartJson);
                        if (localCart.length > 0) {
                            console.log("Merging local cart to cloud...");
                            // Fetch current cloud cart to merge intelligently could be better, 
                            // but simpler: read doc once, merge logic, update doc.
                            // For simplicity/robustness here: We will just push local items 
                            // via the `addToCart` logic or manual merge.
                            // Let's do a manual merge here efficiently.
                            const userDoc = await getDoc(userCartRef);
                            let currentCloudCart: CartItem[] = [];
                            if (userDoc.exists() && userDoc.data().cart) {
                                currentCloudCart = userDoc.data().cart;
                            }

                            // Merge Logic
                            const newCart = [...currentCloudCart];
                            localCart.forEach(localItem => {
                                const existingIndex = newCart.findIndex(i => i.id === localItem.id);
                                if (existingIndex > -1) {
                                    newCart[existingIndex].quantity += localItem.quantity;
                                } else {
                                    newCart.push(localItem);
                                }
                            });

                            // Update Cloud
                            await setDoc(
                                userCartRef,
                                {
                                    uid: user.uid,
                                    email: user.email ?? null,
                                    displayName: user.displayName ?? null,
                                    photoURL: user.photoURL ?? null,
                                    cart: newCart,
                                },
                                { merge: true }
                            );

                            // Clear Local
                            localStorage.removeItem('sareine_cart');
                        }
                    } catch (e) {
                        console.error("Local cart merge error", e);
                    }
                }
            } else {
                // GUEST MODE: Read from LocalStorage
                const storedCart = localStorage.getItem('sareine_cart');
                if (storedCart) {
                    try {
                        setCart(JSON.parse(storedCart));
                    } catch (error) {
                        console.error("Failed to parse cart", error);
                    }
                } else {
                    setCart([]);
                }
            }
            setInitializing(false);
        };

        syncCart();

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [user]);

    // Save to LocalStorage ONLY if Guest (User mode saves directly to DB in handlers)
    useEffect(() => {
        if (!user && !initializing) {
            localStorage.setItem('sareine_cart', JSON.stringify(cart));
        }
    }, [cart, user, initializing]);


    const updateCloudCart = async (newCart: CartItem[]) => {
        if (!user) return;
        const userRef = doc(db, "users", user.uid);
        try {
            await setDoc(
                userRef,
                {
                    uid: user.uid,
                    email: user.email ?? null,
                    displayName: user.displayName ?? null,
                    photoURL: user.photoURL ?? null,
                    cart: newCart,
                },
                { merge: true }
            );
        } catch (error) {
            console.error("Error updating cloud cart", error);
        }
    }

    const addToCart = async (product: CartProductInput) => {
        const newCart = [...cart];
        const existingIndex = newCart.findIndex(item => item.id === product.id);

        if (existingIndex > -1) {
            newCart[existingIndex].quantity += 1;
        } else {
            newCart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                slug: product.slug,
                quantity: 1
            });
        }

        setCart(newCart); // Optimistic Update
        setIsCartOpen(true);

        if (user) {
            await updateCloudCart(newCart);
        }
    };

    const removeFromCart = async (productId: string) => {
        const newCart = cart.filter(item => item.id !== productId);
        setCart(newCart);

        if (user) {
            await updateCloudCart(newCart);
        }
    };

    const decreaseQuantity = async (productId: string) => {
        const existing = cart.find(item => item.id === productId);
        if (!existing) return;
        if (existing.quantity <= 1) {
            await removeFromCart(productId);
            return;
        }
        const newCart = cart.map(item =>
            item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
        setCart(newCart);

        if (user) {
            await updateCloudCart(newCart);
        }
    };

    const clearCart = async () => {
        setCart([]); // Optimistic Update
        if (user) {
            await updateCloudCart([]);
        }
    };

    const toggleCart = () => setIsCartOpen(prev => !prev);

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            decreaseQuantity,
            clearCart,
            cartCount,
            cartTotal,
            isCartOpen,
            toggleCart
        }}>
            {children}
        </CartContext.Provider>
    );
};
