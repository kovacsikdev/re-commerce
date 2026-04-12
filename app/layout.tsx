import type { Metadata } from "next";
import { StoreProvider } from "../src/components/StoreProvider";
import { AppQueryProvider } from "../src/components/AppQueryProvider";
import { Header } from "../src/components/Header";
import { Footer } from "../src/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "RE Commerce",
  description: "Mock e-commerce prototype",
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
