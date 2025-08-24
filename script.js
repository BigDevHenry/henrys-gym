// ----- Helpers -----
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];

// Year in footer
$("#year").textContent = new Date().getFullYear();

// ----- Preloader -----
// Hides after images decode OR 1500ms, whichever comes first
const preloader = $("#preloader");
const minimum = new Promise(res => setTimeout(res, 1500));
const imagesReady = Promise.allSettled(
  $$("img").map(img => (img.complete ? Promise.resolve() : new Promise(r => (img.onload = img.onerror = r))))
);
Promise.race([Promise.all([minimum, imagesReady]), minimum]).then(() => {
  preloader.style.opacity = "0";
  preloader.style.transition = "opacity .45s ease";
  setTimeout(() => { preloader.style.display = "none"; }, 450);
});

// Safety: never stick forever
setTimeout(() => {
  if (getComputedStyle(preloader).display !== "none") {
    preloader.style.opacity = "0";
    preloader.style.transition = "opacity .45s ease";
    setTimeout(() => (preloader.style.display = "none"), 450);
  }
}, 4000);

// ----- Language Toggle -----
let currentLang = "en";
const langBtn = $("#lang-toggle");

function applyLanguage(lang) {
  // Hero
  $$(".hero-content").forEach(el => {
    const texts = el.dataset[`${lang}Text`]?.split("|");
    if (texts?.length >= 2) {
      el.querySelector("h1").textContent = texts[0];
      el.querySelector("p").textContent = texts[1];
    }
  });
  // Nav + buttons + headings
  $$("[data-en]").forEach(el => {
    const val = el.dataset[lang];
    if (val) el.textContent = val;
  });
  // Cards
  $$(".class-card").forEach(card => {
    const title = card.dataset[`${lang}Title`];
    const desc = card.dataset[`${lang}Desc`];
    if (title) card.querySelector("h3").textContent = title;
    if (desc) card.querySelector("p").textContent = desc.split(". ").slice(0,1)[0] + ".";
  });
  $$(".trainer-card").forEach(card => {
    const name = card.dataset[`${lang}Name`];
    const bio = card.dataset[`${lang}Bio`];
    if (name) card.querySelector("h3").textContent = name;
    if (bio) card.querySelector("p").textContent = bio.split(". ").slice(0,1)[0] + ".";
  });
}

langBtn.addEventListener("click", () => {
  currentLang = currentLang === "en" ? "es" : "en";
  langBtn.textContent = currentLang === "en" ? "Español" : "English";
  applyLanguage(currentLang);
});

// ----- Intersection reveal -----
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add("visible");
  });
}, { threshold: 0.15 });
$$(".fade-section").forEach(sec => io.observe(sec));

// ----- Modal -----
const modal = $("#modal");
const modalImg = $("#modal-img");
const modalTitle = $("#modal-title");
const modalDesc = $("#modal-desc");
const closeBtn = $(".close");

function openModal({ img, title, desc }) {
  modalImg.src = img || "";
  modalImg.alt = title || "";
  modalTitle.textContent = title || "";
  modalDesc.textContent = desc || "";
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}
function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  modalImg.src = "";
}
closeBtn.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
});

// Open modal from cards
$$(".class-card, .trainer-card").forEach(card => {
  card.addEventListener("click", () => {
    const img = card.dataset.img || getComputedStyle(card.querySelector(".card-media")).backgroundImage.replace(/^url\(["']?/, "").replace(/["']?\)$/, "");
    const title = card.dataset[`${currentLang}Title`] || card.dataset[`${currentLang}Name`] || card.querySelector("h3")?.textContent;
    const desc = card.dataset[`${currentLang}Desc`] || card.dataset[`${currentLang}Bio`] || "";
    openModal({ img, title, desc });
  });
});

// Initial language application (ensure content matches labels)
applyLanguage(currentLang);
