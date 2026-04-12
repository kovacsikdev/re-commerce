import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type CartLineItem = {
  quantity: number;
  selectedPartIds: string[];
};

type CartState = {
  items: Record<string, CartLineItem>;
  isHydrated: boolean;
};

const initialState: CartState = {
  items: {},
  isHydrated: false,
};

export const normalizeCart = (value: unknown): Record<string, CartLineItem> => {
  if (!value || typeof value !== 'object') {
    return {};
  }

  return Object.entries(value as Record<string, unknown>).reduce<Record<string, CartLineItem>>(
    (acc, [itemId, cartValue]) => {
      if (typeof cartValue === 'number') {
        if (cartValue > 0) {
          acc[itemId] = { quantity: cartValue, selectedPartIds: [] };
        }
        return acc;
      }

      if (!cartValue || typeof cartValue !== 'object') {
        return acc;
      }

      const quantity = Number((cartValue as { quantity?: unknown }).quantity ?? 0);
      const rawSelectedPartIds = (cartValue as { selectedPartIds?: unknown }).selectedPartIds;
      const selectedPartIds = Array.isArray(rawSelectedPartIds)
        ? rawSelectedPartIds.filter((id): id is string => typeof id === 'string')
        : [];

      if (quantity > 0) {
        acc[itemId] = { quantity, selectedPartIds };
      }

      return acc;
    },
    {},
  );
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    hydrate(state, action: PayloadAction<Record<string, CartLineItem>>) {
      state.items = action.payload;
      state.isHydrated = true;
    },
    setQuantity(
      state,
      action: PayloadAction<{ itemId: string; quantity: number; selectedPartIds?: string[] }>,
    ) {
      const { itemId, quantity, selectedPartIds } = action.payload;
      if (quantity <= 0) {
        delete state.items[itemId];
      } else {
        const existing = state.items[itemId];
        state.items[itemId] = {
          quantity,
          selectedPartIds: selectedPartIds ?? existing?.selectedPartIds ?? [],
        };
      }
    },
    removeFromCart(state, action: PayloadAction<string>) {
      delete state.items[action.payload];
    },
    clearCart(state) {
      state.items = {};
    },
  },
});

export const { hydrate, setQuantity, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
