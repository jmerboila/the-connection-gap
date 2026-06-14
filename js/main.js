/* ============================================================
   THE CONNECTION GAP — shared interactions
   Every feature is guarded so one file works across all pages.
   ============================================================ */
(function () {
  "use strict";
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Mobile nav ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* ---------- Scroll reveal ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length && "IntersectionObserver" in window && !prefersReduced) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((r) => io.observe(r));
  } else {
    reveals.forEach((r) => r.classList.add("in"));
  }

  /* ---------- Animated counters ---------- */
  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const decimals = (el.dataset.count.split(".")[1] || "").length;
    const suffix = el.dataset.suffix || "";
    if (prefersReduced) { el.textContent = target.toFixed(decimals) + suffix; return; }
    const dur = 1500;
    const start = performance.now();
    function step(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toFixed(decimals) + suffix;
    }
    requestAnimationFrame(step);
  }
  const counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((c) => cio.observe(c));
  } else {
    counters.forEach((c) => (c.textContent = c.dataset.count + (c.dataset.suffix || "")));
  }

  /* ---------- Three-level divide accordion ---------- */
  document.querySelectorAll(".level").forEach((lv) => {
    lv.setAttribute("tabindex", "0");
    lv.setAttribute("role", "button");
    const open = () => {
      const wasActive = lv.classList.contains("active");
      document.querySelectorAll(".level").forEach((x) => {
        x.classList.remove("active");
        x.setAttribute("aria-expanded", "false");
      });
      if (!wasActive) { lv.classList.add("active"); lv.setAttribute("aria-expanded", "true"); }
    };
    lv.addEventListener("click", open);
    lv.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
    });
  });

  /* ---------- Quintile gap chart ---------- */
  const chart = document.querySelector("[data-chart='quintile']");
  if (chart) {
    const data = {
      2019: { rich: 43, poor: 2 },
      2022: { rich: 60, poor: 5 },
    };
    const richFill = chart.querySelector("[data-bar='rich']");
    const poorFill = chart.querySelector("[data-bar='poor']");
    const gapOut = chart.querySelector("[data-gap]");
    function render(year) {
      const d = data[year];
      richFill.style.width = d.rich + "%";
      richFill.textContent = d.rich + "%";
      poorFill.style.width = d.poor + "%";
      poorFill.textContent = d.poor + "%";
      if (gapOut) gapOut.textContent = (d.rich - d.poor) + " points";
    }
    let shown = false;
    const vio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !shown) { shown = true; render(2019); }
      });
    }, { threshold: 0.4 });
    vio.observe(chart);
    chart.querySelectorAll(".viz-controls button").forEach((b) => {
      b.addEventListener("click", () => {
        chart.querySelectorAll(".viz-controls button").forEach((x) => x.setAttribute("aria-pressed", "false"));
        b.setAttribute("aria-pressed", "true");
        render(b.dataset.year);
      });
    });
  }

  /* ---------- Timeline (static; content always visible) ---------- */

  /* ---------- Knowledge-check quiz ---------- */
  const quiz = document.querySelector("[data-quiz]");
  if (quiz) {
    let answered = 0, correct = 0;
    const total = quiz.querySelectorAll(".quiz-q").length;
    const scoreEl = quiz.querySelector("[data-score]");
    quiz.querySelectorAll(".quiz-q").forEach((q) => {
      const fb = q.querySelector(".quiz-feedback");
      const opts = q.querySelectorAll(".quiz-opt");
      opts.forEach((opt) => {
        opt.addEventListener("click", () => {
          if (q.dataset.done) return;
          q.dataset.done = "1";
          answered++;
          const right = opt.dataset.correct === "true";
          if (right) { correct++; opt.classList.add("correct"); }
          else {
            opt.classList.add("wrong");
            opts.forEach((o) => { if (o.dataset.correct === "true") o.classList.add("correct"); });
          }
          fb.textContent = opt.dataset.feedback || (right ? "Correct." : "Not quite.");
          opts.forEach((o) => (o.disabled = true));
          if (scoreEl) {
            scoreEl.textContent = `Score: ${correct} / ${total}`;
            if (answered === total) {
              scoreEl.textContent += correct === total ? "  — full signal." : "  — keep exploring.";
            }
          }
        });
      });
    });
  }

  /* ---------- Scroll progress bar ---------- */
  (function () {
    const bar = document.createElement("div");
    bar.className = "scroll-progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);
    function update() {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
    }
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  })();

  /* ---------- Theme toggle (light / dark) ---------- */
  (function () {
    const root = document.documentElement;
    const KEY = "tcg-theme";
    if (!root.getAttribute("data-theme")) root.setAttribute("data-theme", "light");
    const toggles = document.querySelectorAll("[data-theme-toggle]");
    function sync() {
      const dark = root.getAttribute("data-theme") === "dark";
      toggles.forEach((b) => {
        b.setAttribute("aria-pressed", String(dark));
        b.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
      });
    }
    sync();
    toggles.forEach((b) =>
      b.addEventListener("click", () => {
        const dark = root.getAttribute("data-theme") === "dark";
        root.setAttribute("data-theme", dark ? "light" : "dark");
        try { localStorage.setItem(KEY, root.getAttribute("data-theme")); } catch (e) {}
        sync();
      })
    );
  })();

  /* ---------- Video facade (load embed on demand) ---------- */
  document.querySelectorAll(".video-lite").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.yt;
      const frame = btn.closest(".video-frame");
      if (!frame || !id) return;
      const iframe = document.createElement("iframe");
      iframe.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
      iframe.title = "Insight: How did the Philippines become one of Asia\u2019s most unequal countries?";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.setAttribute("allowfullscreen", "");
      frame.innerHTML = "";
      frame.appendChild(iframe);
    });
  });

  /* ---------- Footer year ---------- */
  const yr = document.querySelector("[data-current-year]");
  if (yr) yr.textContent = new Date().getFullYear();
})();
