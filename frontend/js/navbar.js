// KrushiConnect — Navbar interactions

const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
const navbar    = document.getElementById('navbar');

// ─── Hamburger Menu ───────────────────────────────────────────
hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

// Close menu when a link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger?.classList.remove('active');
    navLinks?.classList.remove('open');
  });
});

// ─── Scroll Shadow ────────────────────────────────────────────
window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ─── Active Nav Link on Scroll ────────────────────────────────
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 90;
  sections.forEach(section => {
    if (scrollY >= section.offsetTop && scrollY < section.offsetTop + section.offsetHeight) {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      document.querySelector(`.nav-link[href="#${section.id}"]`)?.classList.add('active');
    }
  });
}, { passive: true });

// ─── Auth State — Show User or Login Button ───────────────────
function updateNavAuth() {
  const token = localStorage.getItem('kc_token');
  const user  = JSON.parse(localStorage.getItem('kc_user') || 'null');

  // Find the login button — works for both index.html and pages/
  const loginBtn = document.getElementById('navLoginBtn')
    || document.querySelector('.btn-nav-login');

  if (!loginBtn) return;

  if (token && user) {
    // ── Logged in: show user name + dropdown ──
    const firstName = user.name ? user.name.split(' ')[0] : 'Account';
    const isAdmin   = user.role === 'admin'
      || user.role === 'owner_admin'
      || user.role === 'demo_admin';

    // Detect if we are in pages/ subfolder
    const inPages = window.location.pathname.includes('/pages/');
    const base    = inPages ? '' : 'pages/';

    // Build dropdown HTML
    loginBtn.outerHTML = `
      <div class="nav-user" id="navUser" style="position:relative;">
        <button class="nav-user-btn" id="navUserBtn"
          style="
            display:flex;align-items:center;gap:0.4rem;
            background:#1A3C2E;color:white;
            border:none;border-radius:50px;
            padding:0.45rem 1rem;
            font-size:0.875rem;font-weight:600;
            cursor:pointer;font-family:inherit;
          ">
          👤 ${firstName} ▾
        </button>
        <div class="nav-dropdown" id="navDropdown"
          style="
            display:none;position:absolute;right:0;top:calc(100% + 8px);
            background:white;border-radius:10px;min-width:160px;
            box-shadow:0 8px 24px rgba(0,0,0,0.12);
            border:1px solid rgba(26,60,46,0.08);
            overflow:hidden;z-index:999;
          ">
          ${isAdmin ? `
          <a href="${base}admin/dashboard.html"
            style="display:block;padding:0.7rem 1rem;font-size:0.875rem;
              color:#1A3C2E;text-decoration:none;font-weight:600;
              border-bottom:1px solid #f0f0f0;">
            🛠 Dashboard
          </a>` : `
          <a href="${base}profile.html"
            style="display:block;padding:0.7rem 1rem;font-size:0.875rem;
              color:#1A3C2E;text-decoration:none;
              border-bottom:1px solid #f0f0f0;">
            👤 My Profile
          </a>`}
          <button onclick="logoutUser()"
            style="
              display:block;width:100%;text-align:left;
              padding:0.7rem 1rem;font-size:0.875rem;
              color:#c62828;background:none;border:none;
              cursor:pointer;font-family:inherit;
            ">
            🚪 Logout
          </button>
        </div>
      </div>
    `;

    // Toggle dropdown on button click
    setTimeout(() => {
      const btn      = document.getElementById('navUserBtn');
      const dropdown = document.getElementById('navDropdown');
      if (btn && dropdown) {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const isOpen = dropdown.style.display === 'block';
          dropdown.style.display = isOpen ? 'none' : 'block';
        });
        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
          dropdown.style.display = 'none';
        });
      }
    }, 0);

  }
  // If not logged in — keep the Login button as is
}

// ─── Logout ───────────────────────────────────────────────────
function logoutUser() {
  localStorage.removeItem('kc_token');
  localStorage.removeItem('kc_user');
  // Redirect to home
  const inPages = window.location.pathname.includes('/pages/');
  window.location.href = inPages ? '../index.html' : 'index.html';
}

// ─── Run on DOM Ready ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', updateNavAuth);