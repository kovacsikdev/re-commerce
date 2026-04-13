"use client";

import Link from "next/link";
import { formatPrice, resolveImageSrc, displayPrice } from "../lib/helpers";
import { Product } from "../lib/types";

import "./ItemBox.css";

export const ItemBox = (item: Product) => {
  return (
    <div id="ItemBox">
      <Link key={item.id} href={`/item/${item.id}`} className="link-card">
        <div className="img-thumbnail">
          <img src={resolveImageSrc(item.img_hero_url)} alt={item.name} />
        </div>
        <div className="description">
          <h3>{item.name}</h3>
          <p className="color-primary-light">{item.short_description}</p>
          <p>{displayPrice(item)}</p>
        </div>
      </Link>
    </div>
  );
};