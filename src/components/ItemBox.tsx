"use client";

import Link from "next/link";
import { resolveImageSrc, displayPrice } from "../lib/helpers";
import { Product } from "../lib/types";

import "./ItemBox.css";

export const ItemBox = (item: Product) => {
  return (
    <div id="ItemBox">
      <Link key={item.id} href={`/item/${item.id}`} className="link-card">
        {item.discount_description && <div className="item-discount-badge">{item.discount_description}</div>}
        <div className="img-thumbnail">
          <img src={resolveImageSrc(item.img_hero_url)} alt={item.name} />
        </div>
        <div className="description">
          <h3>{item.name}</h3>
          <p className="color-primary-light">{item.short_description}</p>
          <div>{displayPrice(item)}</div>
        </div>
      </Link>
    </div>
  );
};