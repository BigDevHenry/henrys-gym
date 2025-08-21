// Preloader fade
window.addEventListener('load', () => {
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    preloader.style.opacity = '0';
    preloader.style.transition = 'opacity 0.5s';
    setTimeout(() => preloader.style.display = 'none', 500);
  }, 3000); // 3 seconds
});

let currentLang = 'en';

// Language toggle
const langBtn = document.getElementById('lang-toggle');
langBtn.addEventListener('click', () => {
  currentLang = currentLang === 'en' ? 'es' : 'en';
  langBtn.textContent = currentLang === 'en' ? 'Español' : 'English';

  document.querySelectorAll('.hero-content').forEach(el => {
    const texts = el.dataset[`${currentLang}Text`].split('|');
    el.querySelector('h2').textContent = texts[0];
    el.querySelector('p').textContent = texts[1];
  });

  document.querySelectorAll('.nav-links a').forEach(a => {
    a.textContent = a.dataset[currentLang];
  });

  document.querySelectorAll('[data-en]').forEach(el => {
    if(el.dataset.en) el.textContent = el.dataset[currentLang];
  });
});

// Modal
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-desc");
const closeBtn = document.querySelector(".close");

document.querySelectorAll('.class-card, .trainer-card').forEach(card => {
  card.addEventListener('click', () => {
    modal.style.display = "flex";
    modalImg.src = card.dataset.img || card.style.backgroundImage.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
    modalTitle.textContent = card.dataset[`${currentLang}Title`] || card.dataset[`${currentLang}Name`];
    modalDesc.textContent = card.dataset[`${currentLang}Desc`] || card.dataset[`${currentLang}Bio`];
  });
});

closeBtn.onclick = () => modal.style.display = "none";
window.onclick = e => { if(e.target == modal) modal.style.display = "none"; }

// Scroll fade in/out
const fadeSections = document.querySelectorAll('.fade-section');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      entry.target.classList.add('visible');
    } else {
      entry.target.classList.remove('visible');
    }
  });
}, { threshold: 0.1 });

fadeSections.forEach(section => observer.observe(section));
