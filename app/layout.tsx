import type { Metadata } from "next";
import { StoreProvider } from "../src/components/StoreProvider";
import { AppQueryProvider } from "../src/components/AppQueryProvider";
import { Header } from "../src/components/Header";
import { Footer } from "../src/components/Footer";
import { DEFAULT_OG_IMAGE, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "../src/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "resident evil store",
    "survival equipment",
    "tactical gear",
    "biohazard medical supplies",
    "re commerce",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "RE Commerce tactical survival equipment",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  robots: {
    index: process.env.NODE_ENV === "production",
    follow: process.env.NODE_ENV === "production",
  },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body>
        <AppQueryProvider>
          <StoreProvider>
            <Header />
            <div style={{minHeight: "500px"}}>
              {children}
            </div>
            <Footer />
          </StoreProvider>
        </AppQueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
