const TABS = [
  {
    num: "01",
    label: "Precision Manufacturing",
    title: "Built to Sub-Micron<br>Tolerances",
    desc: "Every component is machined and inspected in our ISO-certified facility, achieving tolerances that exceed aerospace standards by a factor of four.",
  },
  {
    num: "02",
    label: "Advanced Materials",
    title: "Engineered for<br>Extreme Environments",
    desc: "Proprietary titanium and nickel superalloys withstand operating temperatures exceeding 1,600°C while maintaining structural integrity across millions of thermal cycles.",
  },
  {
    num: "03",
    label: "Thermal Testing",
    title: "10,000 Cycles<br>Before First Flight",
    desc: "Each engine variant undergoes a rigorous qualification program simulating the full range of flight conditions, from sea-level ignition to orbital thermal cycling.",
  },
  {
    num: "04",
    label: "Mission Certified",
    title: "Flight-Proven<br>Propulsion",
    desc: "Our engines have powered missions across low-Earth orbit, polar orbit, and deep-space trajectories — delivering zero in-flight anomalies across 47 consecutive launches.",
  },
];

const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

class ShowcaseSection {
  frame = 0;
  startRect = null;
  isStartLocked = false;
  expandStartScrollY = 0;

  constructor() {
    this.el = document.querySelector(".showcase");
    this.missionMedia = document.querySelector(".mission__media");
    if (!this.el) return;
    this.createFilm();
    this.renderUI();
    this.loop();
  }

  // Single fixed video layer. It follows the mission media slot, locks when the
  // slot reaches the viewport's vertical center, then expands to fullscreen.
  createFilm() {
    this.film = document.createElement("div");
    this.film.className = "showcase-film";
    this.film.innerHTML = `
      <video
        class="showcase-film__video"
        autoplay muted loop playsinline
        poster="https://res.cloudinary.com/dsdhxhhqh/image/upload/v1780405513/hero-engine_isebcf.png"
      >
        <source src="https://assets.mixkit.co/videos/6853/6853-720.mp4" type="video/mp4" />
      </video>
      <div class="showcase-film__overlay"></div>
    `;
    document.body.appendChild(this.film);
    this.filmOverlay = this.film.querySelector(".showcase-film__overlay");
  }

  renderUI() {
    this.el.innerHTML = `
      <div class="showcase__sticky">
        <div class="showcase__ui" aria-live="polite">
          <div class="showcase__panels">
            ${TABS.map(
              (t, i) => `
              <div
                class="showcase__panel${i === 0 ? " is-active" : ""}"
                data-index="${i}"
                aria-hidden="${i !== 0}"
              >
                <span class="showcase__panel-num">${t.num}</span>
                <h2 class="showcase__panel-title">${t.title}</h2>
                <p class="showcase__panel-desc">${t.desc}</p>
              </div>`
            ).join("")}
          </div>

          <nav class="showcase__tabs-nav" aria-label="Technology sections">
            ${TABS.map(
              (t, i) => `
              <div
                class="showcase__tab${i === 0 ? " is-active" : ""}"
                data-index="${i}"
                role="tab"
                aria-selected="${i === 0}"
              >
                <span class="showcase__tab-bar" aria-hidden="true"></span>
                <span class="showcase__tab-name">${t.label}</span>
                <span class="showcase__tab-num">${t.num}</span>
              </div>`
            ).join("")}
          </nav>
        </div>
      </div>
    `;

    this.ui = this.el.querySelector(".showcase__ui");
    this.panels = this.el.querySelectorAll(".showcase__panel");
    this.tabs = this.el.querySelectorAll(".showcase__tab");
  }

  cardToRect(mr) {
    return {
      top: mr.top,
      left: mr.left,
      width: mr.width,
      height: mr.height,
      radius: 0,
    };
  }

  applyRect(r) {
    this.film.style.top = `${r.top.toFixed(2)}px`;
    this.film.style.left = `${r.left.toFixed(2)}px`;
    this.film.style.width = `${r.width.toFixed(2)}px`;
    this.film.style.height = `${r.height.toFixed(2)}px`;
    this.film.style.borderRadius = `${r.radius.toFixed(2)}px`;
  }

  loop = () => {
    const { el, missionMedia, film, filmOverlay, ui, panels, tabs } = this;
    const vh = window.innerHeight;

    const rect = el.getBoundingClientRect();
    const scrolled = -rect.top;
    const totalScroll = Math.max(el.offsetHeight - vh, 1);
    let missionMediaVisible = false;
    let missionMediaPending = false;

    if (rect.bottom <= 0) {
      film.style.opacity = "0";
      filmOverlay.style.opacity = "0";
      ui.style.opacity = "0";
      this.frame = requestAnimationFrame(this.loop);
      return;
    }

    if (missionMedia) {
      const mr = missionMedia.getBoundingClientRect();
      missionMediaVisible = mr.width > 0 && mr.height > 0 && mr.bottom > 0 && mr.top < vh;
      missionMediaPending = mr.width > 0 && mr.height > 0 && mr.top >= vh;

      if (missionMediaVisible && scrolled <= 0) {
        const mediaCenterY = mr.top + mr.height / 2;

        if (mediaCenterY > vh / 2) {
          this.isStartLocked = false;
          this.expandStartScrollY = 0;
        }

        if (mediaCenterY <= vh / 2 || this.isStartLocked) {
          if (!this.isStartLocked) {
            this.expandStartScrollY = window.scrollY;
          }

          this.isStartLocked = true;
          this.startRect = this.cardToRect(mr);
        } else {
          this.startRect = this.cardToRect(mr);
        }
      }
    }

    if (!this.isStartLocked) {
      if (missionMediaPending) {
        this.startRect = null;
        this.expandStartScrollY = 0;
      }

      if (this.startRect) {
        this.applyRect(this.startRect);
      }

      film.style.opacity = this.startRect ? "1" : "0";
      filmOverlay.style.opacity = "0";
      ui.style.opacity = "0";
      this.frame = requestAnimationFrame(this.loop);
      return;
    }

    const expandP = clamp((window.scrollY - this.expandStartScrollY) / vh, 0, 1);
    const eased = easeOutCubic(expandP);

    film.style.opacity = "1";

    // Expand from the locked right-side mission slot to full viewport.
    const sr = this.startRect || {
      top: vh * 0.21,
      left: window.innerWidth * 0.38,
      width: window.innerWidth * 0.58,
      height: vh * 0.58,
      radius: 0,
    };
    this.applyRect({
      top: lerp(sr.top, 0, eased),
      left: lerp(sr.left, 0, eased),
      width: lerp(sr.width, window.innerWidth, eased),
      height: lerp(sr.height, vh, eased),
      radius: lerp(sr.radius, 0, eased),
    });

    // Dark overlay fades to 22%
    filmOverlay.style.opacity = String((eased * 0.22).toFixed(3));

    if (expandP < 1) {
      ui.style.opacity = "0";
      this.frame = requestAnimationFrame(this.loop);
      return;
    }

    const progress = clamp(scrolled / totalScroll, 0, 1);

    // UI fades in once the expanding video has become the pinned third block.
    const uiP = clamp(progress / 0.08, 0, 1);
    ui.style.opacity = String(easeInOutCubic(uiP).toFixed(3));

    // Tab cycling begins after the pinned third block is fully established.
    const TAB_START = 0.08;
    const tabP      = clamp((progress - TAB_START) / (1 - TAB_START), 0, 1);
    const activeTab = clamp(Math.floor(tabP * TABS.length), 0, TABS.length - 1);

    panels.forEach((p, i) => {
      const active = i === activeTab;
      p.classList.toggle("is-active", active);
      p.setAttribute("aria-hidden", String(!active));
    });
    tabs.forEach((t, i) => {
      const active = i === activeTab;
      t.classList.toggle("is-active", active);
      t.setAttribute("aria-selected", String(active));
    });

    this.frame = requestAnimationFrame(this.loop);
  };

  destroy() {
    cancelAnimationFrame(this.frame);
    this.film?.remove();
  }
}

new ShowcaseSection();
