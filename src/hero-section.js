const navItems = ["Company", "Technology", "Solutions", "Our Edge", "Our Team", "Investors", "News"];

class EngineHero extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section class="hero" aria-labelledby="hero-title">
        <div class="hero__background" aria-hidden="true">
          <div class="hero__bg-layer hero__bg-layer--bottom"></div>
          <div class="hero__bg-layer hero__bg-layer--top"></div>
        </div>

        <header class="hero__nav">
          <a class="brand" href="/" aria-label="EngineTech home">
            <span class="brand__mark" aria-hidden="true">
              <span></span><span></span><span></span><span></span>
            </span>
            <span class="brand__name">EngineTech</span>
          </a>

          <nav class="hero__links" aria-label="Primary navigation">
            ${navItems.map((item) => `<a href="#${item.toLowerCase().replaceAll(" ", "-")}">${item}</a>`).join("")}
          </nav>

          <a class="hero__cta" href="#contact">Get in Touch</a>
        </header>

        <div class="hero__content">
          <h1 id="hero-title" class="hero__title" aria-label="Powering the World">
            <span class="hero__title-line hero__title-line--one">Powering</span>
            <span class="hero__title-line hero__title-line--two">the&nbsp;World</span>
          </h1>

          <div class="engine-visual" aria-hidden="true">
            <div class="engine-visual__rods">
              ${Array.from({ length: 10 }, (_, index) => `<span style="--i:${index}"></span>`).join("")}
            </div>
            <div class="engine-visual__collar"></div>
            <div class="engine-visual__core"></div>
            <div class="engine-visual__rim"></div>
          </div>
        </div>

        <p class="hero__caption">Custom Propulsion and Power Systems</p>
      </section>
    `;
  }
}

customElements.define("engine-hero", EngineHero);
