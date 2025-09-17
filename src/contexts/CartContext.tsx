import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
  inStock: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  savedForLater: CartItem[];
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'id'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'SET_CART_OPEN'; payload: boolean }
  | { type: 'SAVE_FOR_LATER'; payload: string }
  | { type: 'MOVE_TO_CART'; payload: string }
  | { type: 'APPLY_COUPON'; payload: { code: string; discount: number } };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(
        item => 
          item.productId === action.payload.productId && 
          item.size === action.payload.size && 
          item.color === action.payload.color
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + action.payload.quantity;
        if (newQuantity <= existingItem.inStock) {
          return {
            ...state,
            items: state.items.map(item =>
              item.id === existingItem.id
                ? { ...item, quantity: newQuantity }
                : item
            ),
          };
        } else {
          toast({
            title: "Stock limit reached",
            description: `Only ${existingItem.inStock} items available`,
            variant: "destructive"
          });
          return state;
        }
      }

      return {
        ...state,
        items: [...state.items, { ...action.payload, id: Date.now().toString() }],
      };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };

    case 'UPDATE_QUANTITY': {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item && action.payload.quantity > item.inStock) {
        toast({
          title: "Stock limit reached",
          description: `Only ${item.inStock} items available`,
          variant: "destructive"
        });
        return state;
      }

      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(1, action.payload.quantity) }
            : item
        ),
      };
    }

    case 'CLEAR_CART':
      return { ...state, items: [] };

    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };

    case 'SET_CART_OPEN':
      return { ...state, isOpen: action.payload };

    case 'SAVE_FOR_LATER': {
      const item = state.items.find(item => item.id === action.payload);
      if (!item) return state;

      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        savedForLater: [...state.savedForLater, item],
      };
    }

    case 'MOVE_TO_CART': {
      const item = state.savedForLater.find(item => item.id === action.payload);
      if (!item) return state;

      return {
        ...state,
        items: [...state.items, item],
        savedForLater: state.savedForLater.filter(item => item.id !== action.payload),
      };
    }

    default:
      return state;
  }
};

const initialState: CartState = {
  items: [],
  isOpen: false,
  savedForLater: [],
};

interface CartContextType {
  state: CartState;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  saveForLater: (id: string) => void;
  moveToCart: (id: string) => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  getShippingThreshold: () => { current: number; needed: number; progress: number };
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      parsedCart.items.forEach((item: CartItem) => {
        dispatch({ type: 'ADD_ITEM', payload: item });
      });
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  const addItem = (item: Omit<CartItem, 'id'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
    toast({
      title: "Added to cart!",
      description: `${item.name} (${item.size}, ${item.color}) × ${item.quantity}`,
    });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
    toast({
      title: "Item removed",
      description: "Item has been removed from cart",
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    toast({
      title: "Cart cleared",
      description: "All items have been removed from cart",
    });
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const setCartOpen = (open: boolean) => {
    dispatch({ type: 'SET_CART_OPEN', payload: open });
  };

  const saveForLater = (id: string) => {
    dispatch({ type: 'SAVE_FOR_LATER', payload: id });
    toast({
      title: "Saved for later",
      description: "Item moved to saved for later",
    });
  };

  const moveToCart = (id: string) => {
    dispatch({ type: 'MOVE_TO_CART', payload: id });
    toast({
      title: "Moved to cart",
      description: "Item moved back to cart",
    });
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  const getShippingThreshold = () => {
    const current = getCartTotal();
    const threshold = 75; // Free shipping over $75
    const needed = Math.max(0, threshold - current);
    const progress = Math.min(100, (current / threshold) * 100);
    
    return { current, needed, progress };
  };

  return (
    <CartContext.Provider value={{
      state,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      toggleCart,
      setCartOpen,
      saveForLater,
      moveToCart,
      getCartTotal,
      getCartCount,
      getShippingThreshold,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};