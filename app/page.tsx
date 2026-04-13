import type { Metadata } from "next";
import { LandingClient } from "../src/components/pages/Landing";
import { resolveImageSrc } from "../src/lib/helpers";
import { DEFAULT_OG_IMAGE } from "../src/lib/seo";

export const metadata: Metadata = {
  title: "Survival Necessities",
  description:
    "Browse biohazard-grade weapons, medical gear, and tactical supplies designed for hostile outbreak zones.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Survival Necessities",
    description:
      "Browse biohazard-grade weapons, medical gear, and tactical supplies designed for hostile outbreak zones.",
    images: [DEFAULT_OG_IMAGE],
  },
};

const LandingPage = () => {
  return (
    <>
      <div className="landing-header">
        <div className="landing-header-text">
          <p className="color-primary-light">OPERATIONAL PROTOCOL: REQUIEM</p>
          <h1>SURVIVAL <span className="color-primary">NECESSITIES</span></h1>
          <p className="color-primary-light">
            Equip your containment unit with biohazard-grade biological and
            tactical countermeasures.
          </p>
        </div>
        <div className="landing-header-img">
          <img
            style={{ width: "1500px" }}
            src={resolveImageSrc("/backgrounds/lab_1.webp")}
            alt="landing_bg"
          />
        </div>
      </div>

      <div className="">
        <LandingClient />
      </div>
    </>
  );
};

export default LandingPage;
