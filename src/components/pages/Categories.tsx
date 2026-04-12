"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { fetchCategory } from "../../lib/product-api";
import { type Category } from "../../lib/types";
import { formatPrice } from "../../lib/helpers";
import { ItemActions } from "../ItemActions";

import "./Categories.css";

type CategoriesPageClientProps = {
  category: Category;
};

export const CategoriesPageClient = ({
  category,
}: CategoriesPageClientProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [priceSort, setPriceSort] = useState<"desc" | "asc">("desc");

  const {
    data: items,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["category", category],
    queryFn: ({ signal }) => fetchCategory(category, signal),
  });

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
    
    // Hydration guard to prevent rendering on the server and triggering React Query fetches during SSR
    setIsMounted(true);
  }, []);

  const normalizedFilter = useMemo(
    () => filterText.trim().toLowerCase(),
    [filterText]
  );

  const filteredAndSortedItems = useMemo(() => {
    if (!items) {
      return [];
    }

    return [...items]
      .filter((item) => {
        if (normalizedFilter.length === 0) {
          return true;
        }

        return (
          item.name.toLowerCase().includes(normalizedFilter) ||
          item.description.toLowerCase().includes(normalizedFilter)
        );
      })
      .sort((a, b) => {
        if (priceSort === "asc") {
          return a.price - b.price;
        }

        return b.price - a.price;
      });
  }, [items, normalizedFilter, priceSort]);

  if (!isMounted) {
    return <p>Loading categories...</p>;
  }

  if (isLoading) {
    return <p>Loading categories...</p>;
  }

  if (isError) {
    return <p>Unable to load categories.</p>;
  }

  if (!items) {
    return (
      <section id="categories">
        <h1>Category not found</h1>
        <p>The category does not exist.</p>
      </section>
    );
  }

  return (
    <section id="categories">
      <h2>{category.toUpperCase()}</h2>
      <div className="categories-toolbar">
        <input
          type="text"
          value={filterText}
          onChange={(event) => setFilterText(event.target.value)}
          placeholder="Filter by name or description"
          aria-label="Filter items by name or description"
        />
        <select
          value={priceSort}
          onChange={(event) => setPriceSort(event.target.value as "desc" | "asc")}
          aria-label="Sort items by price"
        >
          <option value="desc">Price high to low</option>
          <option value="asc">Price low to high</option>
        </select>
      </div>

      <div className="categories-table-wrapper">
        <table className="categories-table">
          <thead>
            <tr>
              <th className="color-primary-light">Image</th>
              <th className="color-primary-light">Name</th>
              <th className="color-primary-light">Description</th>
              <th className="color-primary-light">Price</th>
              <th className="color-primary-light">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedItems.map((item) => (
              <tr key={item.id}>
                <td>
                  <img
                    className="img-hero-item"
                    src={item.img_hero_url}
                    alt={item.name}
                  />
                </td>
                <td>{item.name}
                  <p>
                    <Link href={`/item/${item.id}`} className="link">
                      View details
                    </Link>
                  </p>
                </td>
                <td className="color-primary-light">{item.description}</td>
                <td>{formatPrice(item.price ?? 0)}</td>
                <td><ItemActions itemId={item.id} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
