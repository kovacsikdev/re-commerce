import { Suspense } from "react";
import type { Metadata } from "next";
import { CheckoutClient } from "../../src/components/pages/Checkout";
import { resolveImageSrc } from "../../src/lib/helpers";

export const metadata: Metadata = {
  title: "Checkout Protocol",
  description: "Complete your order and schedule secure delivery coordinates.",
  alternates: {
    canonical: "/checkout",
  },
  robots: {
    index: false,
    follow: false,
  },
};

const CheckoutPage = () => {
  return (
    <main className="">
      <Suspense fallback={<p>Loading...</p>}>
        <div className="landing-header">
          <div className="landing-header-text">
            <p className="color-primary-light">SECURITY LEVEL: ALPHA</p>
            <h1>
              CHECKOUT <span className="color-primary">PROTOCOL</span>
            </h1>
          </div>
          <div className="landing-header-img">
            <img
              style={{ width: "1500px" }}
              src={resolveImageSrc("/backgrounds/shipping_3.webp")}
              alt="landing_bg"
            />
          </div>
        </div>
        <CheckoutClient />
      </Suspense>
    </main>
  );
};

export default CheckoutPage;
