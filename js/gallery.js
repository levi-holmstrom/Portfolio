/** Mark frames as placeholder when media file is missing */
function initMediaPlaceholders() {
  document.querySelectorAll("[data-media]").forEach((frame) => {
    const src = frame.dataset.media;
    if (!src) {
      frame.classList.add("is-placeholder");
      return;
    }

    const img = frame.querySelector("img");
    const video = frame.querySelector("video");
    const audio = frame.querySelector("audio");
    const el = img || video || audio;

    if (!el) {
      frame.classList.add("is-placeholder");
      return;
    }

    const markPlaceholder = () => frame.classList.add("is-placeholder");
    const markLoaded = () => frame.classList.remove("is-placeholder");

    el.addEventListener("error", markPlaceholder);

    if (el.tagName === "IMG") {
      if (el.complete && el.naturalWidth > 0) markLoaded();
      else if (el.complete) markPlaceholder();
      else {
        frame.classList.add("is-placeholder");
        el.addEventListener("load", markLoaded, { once: true });
      }
    }

    if (el.tagName === "VIDEO") {
      const checkVideo = () => {
        if (el.readyState >= 2) markLoaded();
      };
      frame.classList.add("is-placeholder");
      el.addEventListener("loadeddata", markLoaded, { once: true });
      el.addEventListener("canplay", markLoaded, { once: true });
      el.addEventListener("error", markPlaceholder);
      checkVideo();
      if (el.readyState < 2) el.load();
    }

    if (el.tagName === "AUDIO") {
      frame.classList.add("is-placeholder");
      el.addEventListener("loadedmetadata", markLoaded, { once: true });
      el.addEventListener("canplay", markLoaded, { once: true });
      el.addEventListener("error", markPlaceholder);
      if (el.readyState >= 1) markLoaded();
    }
  });
}

/** Sidebar active section on scroll */
function initScrollSpy() {
  const links = document.querySelectorAll(".nav a[href^='#']");
  const sections = [...links]
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        links.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
        });
      });
    },
    { rootMargin: "-30% 0px -55% 0px", threshold: 0 }
  );

  sections.forEach((s) => observer.observe(s));
}

/** Full-size image lightbox (click image, backdrop, close button, or Escape) */
function initImageLightbox() {
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.hidden = true;

  const backdrop = document.createElement("div");
  backdrop.className = "lightbox__backdrop";
  backdrop.dataset.lightboxClose = "";

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "lightbox__close";
  closeBtn.dataset.lightboxClose = "";
  closeBtn.setAttribute("aria-label", "Close preview");
  closeBtn.innerHTML =
    '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill="currentColor" d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12l-4.89 4.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4z"/></svg>';

  const stage = document.createElement("div");
  stage.className = "lightbox__stage";
  stage.setAttribute("role", "dialog");
  stage.setAttribute("aria-modal", "true");
  stage.setAttribute("aria-label", "Image preview");

  const previewImg = document.createElement("img");
  previewImg.className = "lightbox__img";
  previewImg.alt = "";

  stage.appendChild(previewImg);
  lightbox.append(backdrop, closeBtn, stage);
  document.body.appendChild(lightbox);

  function open(src, alt) {
    previewImg.src = src;
    previewImg.alt = alt || "Preview";
    lightbox.hidden = false;
    document.body.classList.add("lightbox-open");
    closeBtn.focus();
  }

  function close() {
    lightbox.hidden = true;
    previewImg.removeAttribute("src");
    previewImg.alt = "";
    document.body.classList.remove("lightbox-open");
  }

  lightbox.querySelectorAll("[data-lightbox-close]").forEach((el) => {
    el.addEventListener("click", close);
  });

  stage.addEventListener("click", (e) => e.stopPropagation());

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !lightbox.hidden) close();
  });

  document.querySelectorAll(".media-frame img").forEach((img) => {
    const frame = img.closest(".media-frame");
    if (!frame || frame.classList.contains("audio-frame")) return;

    img.addEventListener("click", () => {
      if (frame.classList.contains("is-placeholder")) return;
      const src = img.currentSrc || img.src;
      if (!src) return;
      open(src, img.alt);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initMediaPlaceholders();
  initScrollSpy();
  initImageLightbox();
});
