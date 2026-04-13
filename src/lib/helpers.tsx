import { Product } from "./types";

export const formatPrice = (value: number): string =>
  `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

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

const isAbsoluteImageUrl = (url: string): boolean =>
  /^(?:[a-z][a-z\d+\-.]*:)?\/\//i.test(url) ||
  url.startsWith("data:") ||
  url.startsWith("blob:");

export const resolveImageSrc = (src: string | null | undefined): string => {
  if (!src) {
    return "";
  }

  if (isAbsoluteImageUrl(src)) {
    return src;
  }

  const normalizedPath = src.startsWith("/") ? src : `/${src}`;

  if (process.env.NODE_ENV === "production") {
    return `${PROD_IMAGE_ORIGIN}${normalizedPath}`;
  }

  return normalizedPath;
};
