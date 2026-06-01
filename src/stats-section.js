const DATASETS = {
  cities: {
    title: "Cities & Infrastructure",
    summary:
      "Distributed aerospace infrastructure needs engines that can test, relight, and recover across dense launch corridors and remote operating bases.",
    bars: [
      { label: "Mobile integration bays", value: 82, target: 88, rangeStart: 58, rangeEnd: 91, unit: "%", note: "deployment coverage", trace: [28, 42, 57, 63, 74, 82] },
      { label: "Airport-adjacent service cells", value: 68, target: 74, rangeStart: 44, rangeEnd: 79, unit: "%", note: "qualified workflows", trace: [18, 36, 41, 55, 61, 68] },
      { label: "Remote launch support", value: 54, target: 63, rangeStart: 30, rangeEnd: 70, unit: "%", note: "field readiness", trace: [14, 24, 39, 43, 48, 54] },
      { label: "Thermal recovery loops", value: 76, target: 81, rangeStart: 50, rangeEnd: 84, unit: "%", note: "heat reuse potential", trace: [26, 38, 49, 66, 72, 76] },
    ],
  },
  materials: {
    title: "Materials & Manufacturing",
    summary:
      "EngineTech combines high-temperature alloys, additive tooling, and inspection data to compress the path from design lock to certified hardware.",
    bars: [
      { label: "Nickel superalloy margin", value: 91, target: 94, rangeStart: 68, rangeEnd: 96, unit: "%", note: "thermal headroom", trace: [44, 61, 70, 79, 86, 91] },
      { label: "Additive chamber tooling", value: 72, target: 80, rangeStart: 48, rangeEnd: 86, unit: "%", note: "lead-time reduction", trace: [19, 34, 48, 53, 67, 72] },
      { label: "Sub-micron inspection yield", value: 96, target: 97, rangeStart: 82, rangeEnd: 99, unit: "%", note: "accepted components", trace: [71, 77, 84, 89, 94, 96] },
      { label: "Reusable test article cycles", value: 84, target: 88, rangeStart: 62, rangeEnd: 91, unit: "%", note: "qualification depth", trace: [36, 52, 64, 71, 79, 84] },
    ],
  },
  fuels: {
    title: "Fuels & Upstream",
    summary:
      "Fuel-path analysis links propellant availability, storage constraints, and injector behavior before a program commits to flight architecture.",
    bars: [
      { label: "Methane supply compatibility", value: 78, target: 83, rangeStart: 52, rangeEnd: 88, unit: "%", note: "regional availability", trace: [22, 31, 46, 58, 69, 78] },
      { label: "Kerosene retrofit readiness", value: 64, target: 70, rangeStart: 40, rangeEnd: 74, unit: "%", note: "legacy platforms", trace: [28, 35, 39, 52, 57, 64] },
      { label: "Cryogenic storage stability", value: 88, target: 92, rangeStart: 66, rangeEnd: 95, unit: "%", note: "validated envelopes", trace: [45, 56, 68, 74, 83, 88] },
      { label: "Injector response confidence", value: 92, target: 94, rangeStart: 70, rangeEnd: 97, unit: "%", note: "hot-fire data", trace: [48, 62, 73, 85, 89, 92] },
    ],
  },
  hydrogen: {
    title: "H2 Hydrogen",
    summary:
      "Hydrogen programs require tight coordination between tankage, feed systems, ignition stability, and ultra-low-temperature operations.",
    bars: [
      { label: "Hydrogen-ready turbopumps", value: 86, target: 90, rangeStart: 62, rangeEnd: 93, unit: "%", note: "design maturity", trace: [30, 46, 60, 71, 79, 86] },
      { label: "LH2 feedline conditioning", value: 74, target: 82, rangeStart: 47, rangeEnd: 86, unit: "%", note: "ground systems", trace: [18, 29, 44, 58, 66, 74] },
      { label: "Ignition stability range", value: 93, target: 95, rangeStart: 72, rangeEnd: 98, unit: "%", note: "transient control", trace: [54, 68, 75, 84, 90, 93] },
      { label: "Zero-carbon flight pathway", value: 81, target: 87, rangeStart: 56, rangeEnd: 90, unit: "%", note: "program fit", trace: [24, 39, 55, 68, 76, 81] },
    ],
  },
};

class StatsSection {
  activeKey = "cities";

  constructor() {
    this.el = document.querySelector(".stats");
    if (!this.el) return;

    this.tabs = this.el.querySelectorAll("[data-stats-tab]");
    this.summary = this.el.querySelector("[data-stats-summary]");
    this.chart = this.el.querySelector("[data-stats-chart]");

    this.tabs.forEach((tab) => {
      tab.addEventListener("click", () => this.setActive(tab.dataset.statsTab));
    });

    this.render();
  }

  setActive(key) {
    if (!DATASETS[key] || key === this.activeKey) return;
    this.activeKey = key;

    this.tabs.forEach((tab) => {
      const active = tab.dataset.statsTab === key;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
    });

    this.render();
  }

  render() {
    const data = DATASETS[this.activeKey];
    this.summary.classList.remove("is-visible");
    this.chart.classList.remove("is-ready");

    window.setTimeout(() => {
      this.summary.textContent = data.summary;
      this.chart.innerHTML = `
        <div class="stats__chart-head">
          <span>${data.title}</span>
          <strong>Operating envelope</strong>
        </div>
        <div class="stats__bars">
          ${data.bars
            .map(
              (bar, index) => `
                <article
                  class="stats__bar-row"
                  style="
                    --bar-value: ${bar.value}%;
                    --range-start: ${bar.rangeStart}%;
                    --range-width: ${bar.rangeEnd - bar.rangeStart}%;
                    --bar-delay: ${index * 90}ms;
                  "
                >
                  <div class="stats__bar-label">
                    <strong>${bar.label}</strong>
                    <span>${bar.note}</span>
                  </div>
                  <div class="stats__track" aria-hidden="true">
                    <div class="stats__range"></div>
                    <div class="stats__bar"></div>
                    <span class="stats__value">${bar.value}${bar.unit}</span>
                    <div class="stats__trace">
                      ${bar.trace
                        .map((point, pointIndex) => `<i class="stats__spark stats__spark--${pointIndex % 3}" style="--point-x: ${Math.min(point, bar.value - 3)}%; --point-y: ${pointIndex % 2 === 0 ? 34 : 62}%; --point-delay: ${pointIndex * 70}ms"></i>`)
                        .join("")}
                    </div>
                  </div>
                </article>
              `
            )
            .join("")}
        </div>
        <div class="stats__axis" aria-hidden="true">
          <span></span>
          <div>
            ${Array.from({ length: 11 }, (_, i) => `<span>${i * 10}</span>`).join("")}
          </div>
        </div>
      `;

      requestAnimationFrame(() => {
        this.summary.classList.add("is-visible");
        this.chart.classList.add("is-ready");
      });
    }, 140);
  }
}

new StatsSection();
