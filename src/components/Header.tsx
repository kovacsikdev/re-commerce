import Link from "next/link";
import { CartBadge } from "./CartBadge";

import "./Header.css";

export const Header = () => {
  return (
    <header className="header">
      <Link href="/" className="link color-primary" aria-label="Home">
        UMBRELLA CORP
      </Link>
      <div className="header-categories-links">
        <Link href="/category/weapons" className="sub-text" aria-label="weapons">
        WEAPONS
      </Link>
      <Link
        href="/category/ammunition"
        className="sub-text"
        aria-label="ammunition"
      >
        AMMUNITION
      </Link>
      <Link href="/category/melee" className="sub-text" aria-label="melee">
        MELEE
      </Link>
      <Link href="/category/medical" className="sub-text" aria-label="medical">
        MEDICAL
      </Link>
      </div>
      <CartBadge />
    </header>
  );
};
