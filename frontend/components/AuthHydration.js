"use client";

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '@/store/authSlice';
import { fetchCart } from '@/store/slices/cartSlice';

export default function AuthHydration({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      dispatch(setUser(user));
      dispatch(fetchCart());
    }
  }, [dispatch]);

  return <>{children}</>;
}

