const navItems = ["Company", "Technology", "Solutions", "Our Edge", "Our Team", "Investors", "News"];

class EngineHero extends HTMLElement {
  scrollFrame = 0;
  lastScrollY = 0;

  connectedCallback() {
    this.innerHTML = `
      <section class="hero" id="heroScroll" aria-labelledby="hero-title">
        <div class="hero__background" aria-hidden="true">
          <div class="hero__bg-layer hero__bg-layer--bottom"></div>
          <div class="hero__stars"></div>
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

          <a class="hero__cta" href="#contact">Get In Touch</a>
        </header>

        <div class="hero__content">
          <h1 id="hero-title" class="hero__title" aria-label="Powering the Ship">
            <span class="hero__title-line hero__title-line--one">Powering</span>
          </h1>

          <div class="hero__title-row" aria-hidden="true">
            <span class="hero__title-line hero__title-line--two">the</span>
            <span class="hero__title-line hero__title-line--three">Ship</span>
          </div>

          <div class="engine-visual" aria-hidden="true">
            <img class="engine-visual__asset" src="https://res.cloudinary.com/dsdhxhhqh/image/upload/v1780405513/hero-engine_isebcf.png" alt="" />
          </div>
        </div>

        <p class="hero__caption">
          Precision engines for orbital-class vehicles.
        </p>
      </section>
    `;

    this.initScrollHero();
  }

  initScrollHero() {
    const hero = this.querySelector(".hero");
    const bg = this.querySelector(".hero__background");
    const title = this.querySelector(".hero__title");
    const titleRow = this.querySelector(".hero__title-row");
    const caption = this.querySelector(".hero__caption");
    const object = this.querySelector(".engine-visual");
    if (!hero || !bg || !title || !titleRow || !caption || !object) return;

    const lerp = (a, b, progress) => a + (b - a) * progress;
    const colors = {
      start: {
        top: [113, 145, 208],
        mid: [170, 184, 213],
        bottom: [236, 233, 230],
      },
      end: {
        top: [240, 232, 220],
        mid: [238, 229, 216],
        bottom: [236, 226, 210],
      },
    };

    const mixColor = (from, to, progress) => {
      const r = Math.round(lerp(from[0], to[0], progress));
      const g = Math.round(lerp(from[1], to[1], progress));
      const b = Math.round(lerp(from[2], to[2], progress));
      return `rgb(${r}, ${g}, ${b})`;
    };

    const animate = () => {
      const rect = hero.getBoundingClientRect();
      const scrollLength = Math.max(hero.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(Math.max(Math.abs(rect.top) / scrollLength, 0), 1);
      const scrollProgress = Math.max(Math.abs(rect.top) / scrollLength, 0);
      
      const scrollY = Math.abs(rect.top);
      const fadeStart = 0.9 * window.innerHeight;
      const fadeEnd = 1.35 * window.innerHeight;
      let fade = 1;
      if (scrollY > fadeStart) {
        fade = 1 - Math.min((scrollY - fadeStart) / (fadeEnd - fadeStart), 1);
      }

      // Scroll direction and header states
      const nav = this.querySelector(".hero__nav");
      if (nav) {
        if (scrollY === 0) {
          nav.classList.add("nav--at-top");
          nav.classList.remove("nav--scroll-down", "nav--scroll-up");
        } else if (scrollY > this.lastScrollY) {
          // Scrolling down
          nav.classList.add("nav--scroll-down");
          nav.classList.remove("nav--at-top", "nav--scroll-up");
        } else if (scrollY < this.lastScrollY) {
          // Scrolling up
          nav.classList.add("nav--scroll-up");
          nav.classList.remove("nav--at-top", "nav--scroll-down");
        }
      }
      this.lastScrollY = scrollY;

      bg.style.setProperty("--hero-top", mixColor(colors.start.top, colors.end.top, progress));
      bg.style.setProperty("--hero-mid", mixColor(colors.start.mid, colors.end.mid, progress));
      bg.style.setProperty("--hero-bottom", mixColor(colors.start.bottom, colors.end.bottom, progress));

      title.style.setProperty("--scroll-y", `${(scrollProgress * -120).toFixed(2)}px`);
      titleRow.style.setProperty("--scroll-y", `${(scrollProgress * -120).toFixed(2)}px`);
      caption.style.setProperty("--scroll-y", `${(scrollProgress * -60).toFixed(2)}px`);
      object.style.setProperty("--scroll-y", `${(scrollProgress * -250).toFixed(2)}px`);

      title.style.opacity = fade;
      titleRow.style.opacity = fade;
      caption.style.opacity = fade;
      object.style.opacity = fade;

      hero.classList.toggle("is-past", rect.bottom <= 0);

      this.scrollFrame = requestAnimationFrame(animate);
    };

    animate();
  }

  disconnectedCallback() {
    cancelAnimationFrame(this.scrollFrame);
  }
}

customElements.define("engine-hero", EngineHero);
