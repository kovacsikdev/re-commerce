"use client";

import { useQueries, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchItemById, fetchSpecials } from "../../lib/product-api";
import { formatPrice } from "../../lib/helpers";
import { ItemBox } from "../ItemBox";

import "./Landing.css";
import { Item } from "three/examples/jsm/inspector/ui/Item.js";

const RECOMMENDED_IDS = [
  "R3JlZW4gSGVyYg==",
  "SGFuZGd1biBBbW1v",
  "QWxsaWdhdG9yIFNuYXBwZXI=",
  "SGF0Y2hldA==",
] as const;

export const LandingClient = () => {
  const [isMounted, setIsMounted] = useState(false);

  const recommendedResults = useQueries({
    queries: RECOMMENDED_IDS.map((itemId) => ({
      queryKey: ["item", itemId],
      queryFn: ({ signal }: { signal: AbortSignal }) =>
        fetchItemById(itemId, signal),
    })),
  });

  const specialsQuery = useQuery({
    queryKey: ["specials"],
    queryFn: ({ signal }: { signal: AbortSignal }) => fetchSpecials(signal),
  });

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);

    // Hydration guard to prevent rendering on the server and triggering React Query fetches during SSR
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <p>Loading recommended items...</p>;
  }

  const isLoading = recommendedResults.some((result) => result.isLoading);
  const hasError = recommendedResults.some((result) => result.isError);

  if (isLoading) {
    return <p>Loading recommended items...</p>;
  }

  if (hasError) {
    return <p>Unable to load recommended items.</p>;
  }

  const items = recommendedResults
    .map((r) => r.data)
    .filter((item) => item !== null && item !== undefined);

  const specialItems = (specialsQuery.data ?? []).filter(
    (item) => item.discount > 0,
  );

  if (items.length === 0) {
    return <p>No recommended items available.</p>;
  }

  return (
    <section id="landing-page">
      <h2>Recommended</h2>
      <div className="recommended">
        {items.map((item) => (
          <ItemBox key={item.id} {...item} />
        ))}
      </div>
      <h2>Specials</h2>
      {specialsQuery.isLoading ? <p>Loading specials...</p> : null}
      {specialsQuery.isError ? <p>Unable to load specials.</p> : null}
      {!specialsQuery.isLoading && !specialsQuery.isError ? (
        specialItems.length > 0 ? (
          <div className="specials">
            {specialItems.map((item) => (
              <ItemBox key={item.id} {...item} />
            ))}
          </div>
        ) : (
          <p>No discounted specials available.</p>
        )
      ) : null}
    </section>
  );
};
