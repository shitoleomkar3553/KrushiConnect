// KrushiConnect — Scroll animations and counter effects

// Reveal elements on scroll
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

function observeReveals(root) {
  const scope = root || document;
  scope.querySelectorAll('.reveal:not(.visible)').forEach(el => revealObserver.observe(el));
}

observeReveals();

// Animated counter for hero stats
function animateCounter(el, target, duration = 1400) {
  const start = performance.now();
  const isNum = !isNaN(parseInt(target));
  const num   = parseInt(target);
  const suffix = target.replace(/[0-9]/g, '');

  if (!isNum) return;

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * num) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// Trigger counters when hero stats come into view
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.hero-stat-num[data-target]').forEach(el => {
        animateCounter(el, el.getAttribute('data-target'));
      });
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelector('.hero-stats') && statObserver.observe(document.querySelector('.hero-stats'));