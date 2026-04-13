"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ItemImageGallery } from "../ItemImageGallery";
import { ItemActions } from "../ItemActions";
import { useCart } from "../../context/cart-context";
import { fetchItemById } from "../../lib/product-api";
import { formatPrice, displayPrice } from "../../lib/helpers";

import "./Item.css";

type ItemPageClientProps = {
  itemId: string;
};

export const ItemPageClient = ({ itemId }: ItemPageClientProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedPartIds, setSelectedPartIds] = useState<string[]>([]);
  const [selectedQuantity, setSelectedQuantity] = useState(0);
  const { getQuantity, getSelectedPartIds } = useCart();

  const {
    data: item,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["item", itemId],
    queryFn: ({ signal }) => fetchItemById(itemId, signal),
  });

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);

    // Hydration guard to prevent rendering on the server and triggering React Query fetches during SSR
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setSelectedPartIds(getSelectedPartIds(itemId));
  }, [getSelectedPartIds, itemId]);

  useEffect(() => {
    setSelectedQuantity(getQuantity(itemId));
  }, [getQuantity, itemId]);

  if (!isMounted) {
    return <p>Loading item...</p>;
  }

  if (isLoading) {
    return <p>Loading item...</p>;
  }

  if (isError) {
    return <p>Unable to load item.</p>;
  }

  if (!item) {
    return (
      <section id="item-page">
        <h1>Item not found</h1>
        <p>The item does not exist.</p>
      </section>
    );
  }

  const renderDescription = (text: string) => {
    const parts = text.split(/\*([^*]+)\*/);
    return parts.map((part, index) =>
      index % 2 === 1 ? (
        <span key={index} className="color-green">{part}</span>
      ) : (
        part
      ),
    );
  };

  const togglePartSelection = (partId: string) => {
    setSelectedPartIds((prev) => {
      if (prev.includes(partId)) {
        return prev.filter((id) => id !== partId);
      }

      return [...prev, partId];
    });
  };

  return (
    <section id="item-page">
      <div className="product-wrapper">
        <ItemImageGallery
          itemId={item.id}
          itemName={item.name}
          heroImageUrl={item.img_hero_url}
          galleryImageUrls={item.img_gallery_urls}
          modelUrl={item.img_3d_url}
        />
        <div className="product-details">
          <h1 className="product-name">{item.name}</h1>
          <div className="product-price-wrapper">
            <div className="product-price">
              {displayPrice(item)}
            </div>
            <div style={{textAlign: "center"}}>
              <div>Quantity</div>
              <ItemActions
                itemId={item.id}
                selectedPartIds={selectedPartIds}
                onQuantityChange={setSelectedQuantity}
              />
            </div>
          </div>
          <p className="color-primary-light">{item.description}</p>
          {item.parts && item.parts.length > 0 ? (
        <div className="product-parts">
          <h2>Available upgrades</h2>
          <div className="parts-list">
            {item.parts.map((part) => {
              const isSelected = selectedPartIds.includes(part.id);

              return (
                <div key={part.id} className="part-card">
                  <input
                    id={`part-${part.id}`}
                    type="checkbox"
                    disabled={selectedQuantity === 0}
                    checked={isSelected}
                    onChange={() => togglePartSelection(part.id)}
                  />
                  <div className="part-card-content">
                    <div className="part-card-header">
                      <h3 className="color-primary-light">{part.name}</h3>
                      <strong>{formatPrice(part.price)}</strong>
                    </div>
                    <p className="color-primary-light">{renderDescription(part.description)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
        </div>
      </div>
    </section>
  );
};
