'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  setQuantity as setQuantityAction,
  removeFromCart as removeFromCartAction,
  clearCart as clearCartAction,
} from '../store/cart-slice';
import type { CartLineItem } from '../store/cart-slice';

export type { CartLineItem };

export const useCart = () => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart.items);
  const isHydrated = useAppSelector((state) => state.cart.isHydrated);
  const totalItems = useAppSelector((state) => Object.values(state.cart.items).length);

  const setQuantity = useCallback(
    (itemId: string, quantity: number, selectedPartIds?: string[]) => {
      dispatch(setQuantityAction({ itemId, quantity, selectedPartIds }));
    },
    [dispatch],
  );

  const removeFromCart = useCallback(
    (itemId: string) => {
      dispatch(removeFromCartAction(itemId));
    },
    [dispatch],
  );

  const clearCart = useCallback(() => {
    dispatch(clearCartAction());
  }, [dispatch]);

  const getQuantity = useCallback(
    (itemId: string) => {
      return cart[itemId]?.quantity ?? 0;
    },
    [cart],
  );

  const getSelectedPartIds = useCallback(
    (itemId: string) => {
      return cart[itemId]?.selectedPartIds ?? [];
    },
    [cart],
  );

  return {
    cart,
    isHydrated,
    setQuantity,
    removeFromCart,
    clearCart,
    getQuantity,
    getSelectedPartIds,
    totalItems,
  };
};