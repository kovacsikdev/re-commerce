import { LandingClient } from "../src/components/pages/Landing";

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
            src="/backgrounds/lab_1.webp"
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
