"use client";

import { useQueries } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "../../context/cart-context";
import { fetchItemById } from "../../lib/product-api";
import { formatPrice, resolveImageSrc } from "../../lib/helpers";
import { ItemActions } from "../ItemActions";
import { Map } from "../Map";

import "./Checkout.css";

const SHIPPING_RATE = 0.0725;
const COORDS_STORAGE_KEY = "re-commerce-shipping-coords";

const getEffectivePrice = (price: number, discount: number) =>
  discount > 0 ? discount : price;

export const CheckoutClient = () => {
  const { cart, isHydrated } = useCart();
  const [latitude, setLatitude] = useState<number>();
  const [longitude, setLongitude] = useState<number>();
  const [giftCard, setGiftCard] = useState("");
  const cartEntries = Object.entries(cart);

  const queryResults = useQueries({
    queries: cartEntries.map(([id]) => ({
      queryKey: ["item", id],
      queryFn: () => fetchItemById(id),
    })),
  });

  const isLoading = queryResults.some((result) => result.isLoading);
  const hasError = queryResults.some((result) => result.isError);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(COORDS_STORAGE_KEY);
      if (stored) {
        const { lat, lng } = JSON.parse(stored) as {
          lat: unknown;
          lng: unknown;
        };
        if (typeof lat === "number" && typeof lng === "number") {
          setLatitude(lat);
          setLongitude(lng);
        }
      }
    } catch {
      // ignore malformed storage
    }
  }, []);

  useEffect(() => {
    if (latitude !== undefined && longitude !== undefined) {
      localStorage.setItem(
        COORDS_STORAGE_KEY,
        JSON.stringify({ lat: latitude, lng: longitude }),
      );
    } else {
      localStorage.removeItem(COORDS_STORAGE_KEY);
    }
  }, [latitude, longitude]);

  if (!isHydrated) {
    return (
      <section className="">
        <h1>Checkout</h1>
        <p>Loading cart...</p>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="">
        <h1>Checkout</h1>
        <p>Loading cart...</p>
      </section>
    );
  }

  if (hasError) {
    return (
      <section className="">
        <h1>Checkout</h1>
        <p>Unable to load cart items.</p>
      </section>
    );
  }

  const entries = cartEntries
    .map(([id, cartEntry], index) => ({
      id,
      quantity: cartEntry.quantity,
      selectedPartIds: cartEntry.selectedPartIds,
      product: queryResults[index]?.data ?? null,
    }))
    .filter((entry) => Boolean(entry.product) && entry.quantity > 0);

  const total = entries.reduce((sum, entry) => {
    const selectedParts = (entry.product?.parts ?? []).filter((part) =>
      entry.selectedPartIds.includes(part.id),
    );
    const partsTotal = selectedParts.reduce(
      (partsSum, part) =>
        partsSum + getEffectivePrice(part.price, part.discount),
      0,
    );

    const itemPrice = getEffectivePrice(
      entry.product?.price ?? 0,
      entry.product?.discount ?? 0,
    );
    return sum + (itemPrice + partsTotal) * entry.quantity;
  }, 0);

  const originalTotal = entries.reduce((sum, entry) => {
    const selectedParts = (entry.product?.parts ?? []).filter((part) =>
      entry.selectedPartIds.includes(part.id),
    );
    const partsTotal = selectedParts.reduce(
      (partsSum, part) => partsSum + part.price,
      0,
    );

    return sum + ((entry.product?.price ?? 0) + partsTotal) * entry.quantity;
  }, 0);

  const totalDiscount = Math.max(originalTotal - total, 0);

  const shippingFee = total * SHIPPING_RATE;
  const grandTotal = total + shippingFee;

  const isGiftCardValid = /^[0-9]{16}$/.test(giftCard);
  const isLatValid =
    latitude !== undefined && latitude >= -90 && latitude <= 90;
  const isLngValid =
    longitude !== undefined && longitude >= -180 && longitude <= 180;
  const isFormValid = isGiftCardValid && isLatValid && isLngValid;

  if (entries.length === 0) {
    return (
      <section style={{ padding: "2rem 0", textAlign: "center" }}>
        <h1>Add items to securely receive your equipment.</h1>
      </section>
    );
  }

  return (
    <section id="checkout-page">
      <form
        className="checkout-form"
        onSubmit={(event) => {
          event.preventDefault();
          alert("Order complete");
        }}
      >
        <section className="checkout-section">
          <h2>Cart Items ({entries.length})</h2>
          <div className="cart-table-wrapper">
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price Per Item</th>
                  <th>Subtotal</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => {
                  const selectedParts = (entry.product?.parts ?? []).filter(
                    (part) => entry.selectedPartIds.includes(part.id),
                  );
                  const partsTotal = selectedParts.reduce(
                    (partsSum, part) =>
                      partsSum + getEffectivePrice(part.price, part.discount),
                    0,
                  );
                  const partsOriginalTotal = selectedParts.reduce(
                    (partsSum, part) => partsSum + part.price,
                    0,
                  );
                  const productOriginalPrice = entry.product?.price ?? 0;
                  const itemPrice = getEffectivePrice(
                    entry.product?.price ?? 0,
                    entry.product?.discount ?? 0,
                  );
                  const originalUnitPrice =
                    productOriginalPrice + partsOriginalTotal;
                  const unitPrice = itemPrice + partsTotal;
                  const itemSubtotal = unitPrice * entry.quantity;
                  const hasDiscount = unitPrice < originalUnitPrice;

                  return (
                    <tr key={entry.id}>
                      <td>
                        <img
                          className="cart-thumb"
                          src={resolveImageSrc(entry.product?.img_hero_url)}
                          alt={entry.product?.name}
                        />
                      </td>
                      <td>
                        {entry.product?.name}
                        {selectedParts.length > 0 ? (
                          <ul className="selected-parts-list">
                            {selectedParts.map((part) => (
                              <li key={part.id}>
                                {part.name} (
                                {formatPrice(
                                  getEffectivePrice(part.price, part.discount),
                                )}
                                )
                              </li>
                            ))}
                          </ul>
                        ) : null}
                        <p>
                          <Link href={`/item/${entry.id}`}>View item</Link>
                        </p>
                      </td>
                      <td>
                        <div className="line-item-pricing">
                          <strong>{formatPrice(unitPrice)}</strong>
                          {hasDiscount ? (
                            <s className="line-item-original-price">
                              {formatPrice(originalUnitPrice)}
                            </s>
                          ) : null}
                        </div>
                        <span>x {entry.quantity}</span>
                      </td>
                      <td>{formatPrice(itemSubtotal)}</td>
                      <td>
                        <ItemActions itemId={entry.id} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <br />
          <h2>Shipping Info</h2>
          <p className="color-primary-light">
            SELECT A COORDINATE FOR YOUR EQUIPMENT TO BE AIR DROPPED WITHIN 1-2
            DAYS.
          </p>
          <Map
            latitude={latitude}
            longitude={longitude}
            onLocationSelect={(lat, lng) => {
              setLatitude(lat);
              setLongitude(lng);
            }}
          />
          <div className="shipping-fields">
            <div className="shipping-field">
              <p>Latitude</p>
              <input
                type="number"
                step="any"
                name="latitude"
                value={latitude ?? ""}
                onChange={(e) =>
                  setLatitude(
                    e.target.value ? parseFloat(e.target.value) : undefined,
                  )
                }
                required
                placeholder="e.g. 34.0522"
              />
            </div>
            <div className="shipping-field">
              <p>Longitude</p>
              <input
                type="number"
                step="any"
                name="longitude"
                value={longitude ?? ""}
                onChange={(e) =>
                  setLongitude(
                    e.target.value ? parseFloat(e.target.value) : undefined,
                  )
                }
                required
                placeholder="e.g. -118.2437"
              />
            </div>
          </div>
        </section>

        <section className="checkout-section">
          <h2>Payment & Submission</h2>
          <div className="gift-card-field">
            <p className="color-primary-light">
              Umbrella Corporation Gift Card
            </p>
            <input
              type="text"
              name="giftCardNumber"
              required
              inputMode="numeric"
              pattern="[0-9]{16}"
              maxLength={16}
              minLength={16}
              placeholder="XXXX-XXXX-XXXX-XXXX"
              title="Gift card number must be exactly 16 digits"
              value={giftCard}
              onChange={(e) =>
                setGiftCard(e.target.value.replace(/\D/g, "").slice(0, 16))
              }
            />
            <p className="color-primary-light">
              WARNING: ONLY OFFICIAL UMBRELLA CORP ISSUED CREDITS ACCEPTED.
              EXTERNAL CURRENCY IS PROHIBITED BY DIRECTIVE 91-C.
            </p>
          </div>

          <div className="order-summary">
            <p>
              <span>Subtotal</span>
              <strong>{formatPrice(originalTotal)}</strong>
            </p>
            {totalDiscount > 0 && (
              <p>
                <span>Discounts</span>
                <strong>-{formatPrice(totalDiscount)}</strong>
              </p>
            )}
            <p>
              <span>Shipping Fee (7.25%)</span>
              <strong>{formatPrice(shippingFee)}</strong>
            </p>
            <p className="grand-total">
              <span>Grand Total</span>
              <strong>{formatPrice(grandTotal)}</strong>
            </p>
          </div>

          <button
            className="submit-order"
            type="submit"
            disabled={!isFormValid}
          >
            Submit Order
          </button>
        </section>
      </form>
    </section>
  );
};
