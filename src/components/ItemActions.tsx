"use client";

import { useState, useEffect } from "react";
import { useCart } from "../context/cart-context";

import "./ItemActions.css";

type ItemActionsProps = {
  itemId: string;
  selectedPartIds?: string[];
  onQuantityChange?: (quantity: number) => void;
};

const arePartSelectionsEqual = (left: string[], right: string[]) => {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((partId, index) => partId === right[index]);
};

export const ItemActions = ({ itemId, selectedPartIds, onQuantityChange }: ItemActionsProps) => {
  const { setQuantity, removeFromCart, getQuantity, getSelectedPartIds } = useCart();
  const currentQuantity = getQuantity(itemId);
  const currentSelectedPartIds = getSelectedPartIds(itemId);
  const [quantity, setLocalQuantity] = useState<number>(currentQuantity || 0);

  useEffect(() => {
    setLocalQuantity(currentQuantity || 0);
  }, [currentQuantity]);

  useEffect(() => {
    onQuantityChange?.(quantity);
  }, [onQuantityChange, quantity]);

  const decrementQuantity = () => {
    setLocalQuantity((prev) => Math.max(0, prev - 1));
  };

  const incrementQuantity = () => {
    setLocalQuantity((prev) => Math.min(10, prev + 1));
  };

  const hasPartSelectionChanges = selectedPartIds
    ? !arePartSelectionsEqual(selectedPartIds, currentSelectedPartIds)
    : false;

  return (
    <div id="item-actions">
      <div className="quantity-control">
        <button
          disabled={quantity === 0}
          type="button"
          onClick={decrementQuantity}
          aria-label="Decrease quantity"
          className="btn-quantity btn-quantity-left"
        >
          {"<"}
        </button>
        <input
          id="quantity"
          type="number"
          min={0}
          max={10}
          value={quantity}
          readOnly
          onChange={(e) =>
            setLocalQuantity(
              Math.max(0, Math.min(10, Number(e.target.value || 0))),
            )
          }
        />
        <button
          disabled={quantity === 10}
          type="button"
          onClick={incrementQuantity}
          aria-label="Increase quantity"
          className="btn-quantity btn-quantity-right"
        >
          {">"}
        </button>
      </div>
      <div className="quantity-actions">
        <button
          disabled={quantity === currentQuantity && !hasPartSelectionChanges}
          className=""
          onClick={() => setQuantity(itemId, quantity, selectedPartIds)}
          type="button"
        >
          Update
        </button>
      </div>
    </div>
  );
};
