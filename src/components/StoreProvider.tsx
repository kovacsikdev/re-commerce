'use client';

import { type ReactNode, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { hydrate, normalizeCart } from '../store/cart-slice';

const CART_STORAGE_KEY = 're-commerce-cart';

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      const parsed = stored ? JSON.parse(stored) : {};
      store.dispatch(hydrate(normalizeCart(parsed)));
    } catch {
      store.dispatch(hydrate({}));
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
};
