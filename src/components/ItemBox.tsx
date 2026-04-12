"use client";

import { useQueries, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatPrice } from "../lib/helpers";
import { Product } from "../lib/types";

import "./ItemBox.css";

export const ItemBox = (item: Product) => {
  const discountedPrice = Math.max(item.price - item.discount, 0);
  return (
    <div id="ItemBox">
      <Link key={item.id} href={`/item/${item.id}`} className="link-card">
        <div className="img-thumbnail">
          <img src={item.img_hero_url} alt={item.name} />
        </div>
        <div className="description">
          <h3>{item.name}</h3>
          <p className="color-primary-light">{item.short_description}</p>
          <p>
            <s>{formatPrice(item.price ?? 0)}</s>{" "}
            <strong>{formatPrice(discountedPrice)}</strong>
          </p>
        </div>
      </Link>
    </div>
  );
};
