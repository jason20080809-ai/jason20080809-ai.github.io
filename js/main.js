document.addEventListener("DOMContentLoaded", function () {
  var labels = {
    "fire.html": "\u6551\u707d\u7d00\u9304",
    "portrait.html": "\u8a13\u7df4\u7d00\u9304",
    "landscape.html": "\u6f14\u7fd2\u7d00\u9304"
  };
  document.querySelectorAll(".brand").forEach(function (brand) {
    brand.innerHTML = '<span class="flame">&#10022;</span> \u90ed\u4ec1\u5091 <span style="font-weight:400;color:var(--text-muted);font-size:.82rem">FIRE &amp; LENS</span>';
  });
  document.querySelectorAll(".nav-links a").forEach(function (link) {
    var href = (link.getAttribute("href") || "").split("#")[0];
    if (labels[href]) link.textContent = labels[href];
  });
  document.querySelectorAll(".card").forEach(function (card) {
    var href = (card.getAttribute("href") || "").split("#")[0];
    var heading = card.querySelector("h3");
    if (labels[href] && heading) heading.textContent = labels[href];
  });
  var activePath = window.location.pathname.split("/").pop() || "index.html";
  if (labels[activePath]) {
    var pageHeading = document.querySelector(".page-hero h1");
    if (pageHeading) pageHeading.textContent = labels[activePath];
    document.title = labels[activePath] + "\uff5c\u90ed\u4ec1\u5091";
  }
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () { links.classList.toggle("open"); });
    links.addEventListener("click", function (e) { if (e.target.tagName === "A") links.classList.remove("open"); });
  }
  document.querySelectorAll(".nav-links a").forEach(function (a) {
    var href = (a.getAttribute("href") || "").split("#")[0];
    if (href === activePath) a.classList.add("active");
  });
  document.querySelectorAll("[data-year]").forEach(function (el) {
    var base = parseInt(el.getAttribute("data-year"), 10) || new Date().getFullYear();
    el.textContent = base + " - " + new Date().getFullYear();
  });
  applyLightbox(document.querySelectorAll("[data-lightbox]"));
  applyFilter();
  applyHeroMotion();
  applyPortfolioReveal();
});

function applyHeroMotion() {
  var hero = document.querySelector(".home-hero");
  if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var ticking = false;
  function update() {
    hero.style.setProperty("--hero-shift", Math.min(window.scrollY * 0.12, 54) + "px");
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
}

function applyPortfolioReveal() {
  var portfolio = document.querySelector(".home-portfolio");
  if (!portfolio) return;
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    portfolio.classList.add("is-visible");
    return;
  }
  var observer = new IntersectionObserver(function (entries) {
    if (!entries[0].isIntersecting) return;
    portfolio.classList.add("is-visible");
    observer.disconnect();
  }, { threshold: 0.18 });
  observer.observe(portfolio);
}

function applyLightbox(items) {
  if (!items.length) return;
  var lb = document.getElementById("lightbox");
  if (!lb) return;
  var img = lb.querySelector("img"), cap = lb.querySelector(".cap"), prev = lb.querySelector(".prev"), next = lb.querySelector(".next"), close = lb.querySelector(".close"), idx = 0;
  function show(i, e) {
    if (e) e.preventDefault();
    idx = (i + items.length) % items.length;
    var item = items[idx];
    img.src = item.getAttribute("data-full") || item.querySelector("img").src;
    img.alt = item.querySelector("img").alt || "";
    cap.textContent = item.getAttribute("data-cap") || "";
    lb.classList.add("open"); document.body.style.overflow = "hidden";
  }
  function hide() { lb.classList.remove("open"); document.body.style.overflow = ""; }
  items.forEach(function (item, i) { item.addEventListener("click", function (e) { show(i, e); }); });
  if (close) close.addEventListener("click", hide);
  if (prev) prev.addEventListener("click", function (e) { e.stopPropagation(); show(idx - 1); });
  if (next) next.addEventListener("click", function (e) { e.stopPropagation(); show(idx + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) hide(); });
  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") hide();
    if (e.key === "ArrowLeft") show(idx - 1);
    if (e.key === "ArrowRight") show(idx + 1);
  });
}

function applyFilter() {
  var filters = document.querySelectorAll(".filter-btn"), items = document.querySelectorAll(".filter-item");
  if (!filters.length || !items.length) return;
  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filters.forEach(function (b) { b.classList.remove("active"); }); btn.classList.add("active");
      var key = btn.getAttribute("data-filter");
      items.forEach(function (item) { item.style.display = key === "all" || item.getAttribute("data-cat") === key ? "" : "none"; });
    });
  });
}
