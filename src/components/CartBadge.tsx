'use client';

import Link from 'next/link';
import { useCart } from '../context/cart-context';

export const CartBadge = () => {
  const { totalItems } = useCart();

  return (
    <Link style={{color: "#FFF"}} href="/checkout" aria-label={`Checkout (${totalItems} item${totalItems === 1 ? '' : 's'})`}>
      <span>Cart</span>
      <span style={{ padding: '0 0.5rem' }}>{totalItems}</span>
    </Link>
  );
};