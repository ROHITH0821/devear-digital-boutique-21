import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  gender?: string;
  dateOfBirth?: string;
  addresses: Address[];
  isLoggedIn: boolean;
}

interface UserState {
  profile: UserProfile;
  isGuestCheckout: boolean;
}

type UserAction =
  | { type: 'LOGIN'; payload: Partial<UserProfile> }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_PROFILE'; payload: Partial<UserProfile> }
  | { type: 'ADD_ADDRESS'; payload: Address }
  | { type: 'UPDATE_ADDRESS'; payload: Address }
  | { type: 'REMOVE_ADDRESS'; payload: string }
  | { type: 'SET_DEFAULT_ADDRESS'; payload: string }
  | { type: 'SET_GUEST_CHECKOUT'; payload: boolean };

const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        profile: {
          ...state.profile,
          ...action.payload,
          isLoggedIn: true,
        },
        isGuestCheckout: false,
      };

    case 'LOGOUT':
      return {
        ...state,
        profile: {
          name: '',
          email: '',
          phone: '',
          addresses: [],
          isLoggedIn: false,
        },
        isGuestCheckout: false,
      };

    case 'UPDATE_PROFILE':
      return {
        ...state,
        profile: {
          ...state.profile,
          ...action.payload,
        },
      };

    case 'ADD_ADDRESS':
      const newAddresses = state.profile.addresses.map(addr => ({
        ...addr,
        isDefault: action.payload.isDefault ? false : addr.isDefault
      }));
      return {
        ...state,
        profile: {
          ...state.profile,
          addresses: [...newAddresses, action.payload],
        },
      };

    case 'UPDATE_ADDRESS':
      return {
        ...state,
        profile: {
          ...state.profile,
          addresses: state.profile.addresses.map(addr =>
            addr.id === action.payload.id ? action.payload : addr
          ),
        },
      };

    case 'REMOVE_ADDRESS':
      return {
        ...state,
        profile: {
          ...state.profile,
          addresses: state.profile.addresses.filter(addr => addr.id !== action.payload),
        },
      };

    case 'SET_DEFAULT_ADDRESS':
      return {
        ...state,
        profile: {
          ...state.profile,
          addresses: state.profile.addresses.map(addr => ({
            ...addr,
            isDefault: addr.id === action.payload
          })),
        },
      };

    case 'SET_GUEST_CHECKOUT':
      return {
        ...state,
        isGuestCheckout: action.payload,
      };

    default:
      return state;
  }
};

const initialState: UserState = {
  profile: {
    name: '',
    email: '',
    phone: '',
    addresses: [],
    isLoggedIn: false,
  },
  isGuestCheckout: false,
};

interface UserContextType {
  state: UserState;
  login: (userData: Partial<UserProfile>) => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (address: Address) => void;
  removeAddress: (addressId: string) => void;
  setDefaultAddress: (addressId: string) => void;
  setGuestCheckout: (isGuest: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('userProfile');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      if (parsedUser.profile.isLoggedIn) {
        dispatch({ type: 'LOGIN', payload: parsedUser.profile });
      }
    }
  }, []);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(state));
  }, [state]);

  const login = (userData: Partial<UserProfile>) => {
    dispatch({ type: 'LOGIN', payload: userData });
    toast({
      title: "Welcome back!",
      description: `Hello ${userData.name || 'User'}!`,
    });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    dispatch({ type: 'UPDATE_PROFILE', payload: updates });
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated",
    });
  };

  const addAddress = (address: Omit<Address, 'id'>) => {
    const newAddress: Address = {
      ...address,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD_ADDRESS', payload: newAddress });
    toast({
      title: "Address added",
      description: "New address has been added to your profile",
    });
  };

  const updateAddress = (address: Address) => {
    dispatch({ type: 'UPDATE_ADDRESS', payload: address });
    toast({
      title: "Address updated",
      description: "Address has been successfully updated",
    });
  };

  const removeAddress = (addressId: string) => {
    dispatch({ type: 'REMOVE_ADDRESS', payload: addressId });
    toast({
      title: "Address removed",
      description: "Address has been removed from your profile",
    });
  };

  const setDefaultAddress = (addressId: string) => {
    dispatch({ type: 'SET_DEFAULT_ADDRESS', payload: addressId });
    toast({
      title: "Default address updated",
      description: "Your default address has been updated",
    });
  };

  const setGuestCheckout = (isGuest: boolean) => {
    dispatch({ type: 'SET_GUEST_CHECKOUT', payload: isGuest });
  };

  return (
    <UserContext.Provider value={{
      state,
      login,
      logout,
      updateProfile,
      addAddress,
      updateAddress,
      removeAddress,
      setDefaultAddress,
      setGuestCheckout,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};