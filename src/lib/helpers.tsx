import { Product } from "./types";

export const formatPrice = (value: number): string =>
  `${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CR`;

export const displayPrice = (item: Product) => {
  return item.discount ? (
    <>
      <strong>{formatPrice(item.discount)}</strong>
      <div className="product-discount">
        <s>{formatPrice(item.price)}</s>
      </div>
    </>
  ) : (
    <strong>{formatPrice(item.price)}</strong>
  );
};

const PROD_IMAGE_ORIGIN = "https://d9267l1bum1dd.cloudfront.net";

export const resolveImageSrc = (src: string | null | undefined): string => {
  if (!src) {
    return "";
  }

  const normalizedPath = src.startsWith("/") ? src : `/${src}`;

  if (process.env.NODE_ENV === "production") {
    return `${PROD_IMAGE_ORIGIN}${normalizedPath}`;
  }

  return normalizedPath;
};
