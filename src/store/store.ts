import { configureStore, type Middleware } from '@reduxjs/toolkit';
import cartReducer from './cart-slice';

const CART_STORAGE_KEY = 're-commerce-cart';

const localStorageMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  const actionType = (action as { type?: string }).type ?? '';
  if (actionType.startsWith('cart/') && actionType !== 'cart/hydrate') {
    try {
      const state = store.getState() as ReturnType<typeof store.getState>;
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cart.items));
    } catch {
      // Ignore write failures (e.g. private browsing storage quota)
    }
  }
  return result;
};

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
