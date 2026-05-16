import HeroHeading from "./HeroHeading";
import HeroSubtitle from "./HeroSubtitle";
import HeroActions from "./HeroActions";
import Stars from "./Stars";
import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <Stars />
      <div className="hero-background"></div>
      <div className="hero-container">
        <HeroHeading />
        <HeroSubtitle />
        <HeroActions />
      </div>
    </section>
  );
}
