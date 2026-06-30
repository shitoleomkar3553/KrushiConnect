// ─── Local Image Fallback Map ────────────────────────────────
const localImgs = {
  'NPK 19:19:19':    'assets/images/npk-191919.jpg',
  'Cannon':          'assets/images/cannon.jpg',
  'Coragen':         'assets/images/coragen.jpg',
  'Coriander Seeds': 'assets/images/coriander.jpg',
  'Coriander':       'assets/images/coriander.jpg',
};

// ─── Category Emoji Helper ────────────────────────────────────
function getCategoryEmoji(category) {
  if (!category) return "🌿";
  const c = category.toLowerCase();
  if (c.includes("fertilizer") || c.includes("water")) return "💧";
  if (c.includes("insecticide"))                        return "🐛";
  if (c.includes("pesticide"))                          return "🌾";
  if (c.includes("herbicide"))                          return "🍃";
  if (c.includes("seed"))                               return "🌱";
  return "🌿";
}

// ─── Fetch & Render Featured Products ────────────────────────
async function loadFeaturedProducts() {
  const grid = document.getElementById("featuredProductsGrid");
  if (!grid) return;

  const apiUrl = typeof API_BASE_URL !== 'undefined' ? API_BASE_URL : 'https://krushiconnect.onrender.com/api';

  try {
    grid.innerHTML = '<p style="color:#666;padding:20px;">Loading products...</p>';

    // Prefer featured products; fall back to all if none marked featured
    let response = await fetch(apiUrl + '/products?featured=true');
    if (!response.ok) { restoreStaticCards(grid); return; }

    let data = await response.json();
    let products = data.products || data.data || [];

    if (!products.length) {
      response = await fetch(apiUrl + '/products');
      if (!response.ok) { restoreStaticCards(grid); return; }
      data = await response.json();
      products = (data.products || data.data || []).filter(p => p.isFeatured);
      if (!products.length) products = (data.products || data.data || []).slice(0, 5);
    }

    if (!products.length) { restoreStaticCards(grid); return; }

    grid.innerHTML = "";

    products.forEach((product, i) => {
      const card = document.createElement("div");
      card.className = "product-card reveal" + (i > 0 ? " reveal-delay-" + Math.min(i, 4) : "");

      const emoji = getCategoryEmoji(product.category);
      const imgSrc = resolveProductImage(product, apiUrl);

      card.innerHTML =
        '<div class="product-card-img">' +
          (imgSrc
            ? '<img src="' + imgSrc + '" alt="' + product.name + '" loading="lazy" onerror="this.onerror=null;this.replaceWith(Object.assign(document.createElement(\'div\'),{style:\'display:flex;align-items:center;justify-content:center;height:180px;font-size:3.5rem;background:#f0f7f0;border-radius:8px;\',textContent:\'' + emoji + '\'}))" />'
            : '<div style="display:flex;align-items:center;justify-content:center;height:180px;font-size:3.5rem;background:#f0f7f0;border-radius:8px;">' + emoji + '</div>'
          ) +
          (product.isFeatured ? '<span class="product-badge"><span class="badge badge-green">Featured</span></span>' : '') +
        '</div>' +
        '<div class="product-body">' +
          '<div class="product-category">' + (product.category || '') + '</div>' +
          '<div class="product-name">' + product.name + '</div>' +
          '<div class="product-company">' + (product.company || '') + '</div>' +
          '<div class="product-footer">' +
            '<div class="product-price">' + String.fromCharCode(8377) + Number(product.price).toLocaleString('en-IN') + ' <span>/ ' + (product.unit || '') + '</span></div>' +
            '<a href="pages/product-detail.html?id=' + product._id + '" class="btn-card-view">View</a>' +
          '</div>' +
        '</div>';

      grid.appendChild(card);
    });

    if (typeof observeReveals === 'function') observeReveals(grid);

  } catch (error) {
    console.warn("Backend not reachable, keeping static cards:", error.message);
    restoreStaticCards(grid);
    if (typeof observeReveals === 'function') observeReveals(grid);
  }
}

// Resolve image URL — Cloudinary/local assets only; skip broken /uploads filenames
function resolveProductImage(product, apiUrl) {
  if (product.image && product.image.startsWith('http')) return product.image;
  if (localImgs[product.name]) return localImgs[product.name];
  return null;
}

// ─── Restore Static Hardcoded Cards (grid layout) ─────────────
function restoreStaticCards(grid) {
  grid.innerHTML =
    '<div class="product-card reveal">' +
      '<div class="product-card-img">' +
        '<img src="assets/images/npk-191919.jpg" alt="NPK 19:19:19" loading="lazy" />' +
        '<span class="product-badge"><span class="badge badge-green">Popular</span></span>' +
      '</div>' +
      '<div class="product-body">' +
        '<div class="product-category">Water Soluble Fertilizer</div>' +
        '<div class="product-name">NPK 19:19:19</div>' +
        '<div class="product-company">Jai Kisaan</div>' +
        '<div class="product-footer">' +
          '<div class="product-price">' + String.fromCharCode(8377) + '200 <span>/ kg</span></div>' +
          '<a href="pages/product-detail.html" class="btn-card-view">View</a>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="product-card reveal reveal-delay-1">' +
      '<div class="product-card-img">' +
        '<img src="assets/images/cannon.jpg" alt="Cannon" loading="lazy" />' +
      '</div>' +
      '<div class="product-body">' +
        '<div class="product-category">Insecticide</div>' +
        '<div class="product-name">Cannon</div>' +
        '<div class="product-company">NACL Industries Limited</div>' +
        '<div class="product-footer">' +
          '<div class="product-price">' + String.fromCharCode(8377) + '700 <span>/ ltr</span></div>' +
          '<a href="pages/product-detail.html" class="btn-card-view">View</a>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="product-card reveal reveal-delay-2">' +
      '<div class="product-card-img">' +
        '<img src="assets/images/coragen.jpg" alt="Coragen" loading="lazy" />' +
        '<span class="product-badge"><span class="badge badge-gold">Premium</span></span>' +
      '</div>' +
      '<div class="product-body">' +
        '<div class="product-category">Pesticide</div>' +
        '<div class="product-name">Coragen</div>' +
        '<div class="product-company">FMC</div>' +
        '<div class="product-footer">' +
          '<div class="product-price">' + String.fromCharCode(8377) + '2,250 <span>/ ltr</span></div>' +
          '<a href="pages/product-detail.html" class="btn-card-view">View</a>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="product-card reveal reveal-delay-3">' +
      '<div class="product-card-img">' +
        '<img src="assets/images/coriander.jpg" alt="Coriander Seeds" loading="lazy" />' +
      '</div>' +
      '<div class="product-body">' +
        '<div class="product-category">Seeds</div>' +
        '<div class="product-name">Coriander Seeds</div>' +
        '<div class="product-company">Ashoka</div>' +
        '<div class="product-footer">' +
          '<div class="product-price">' + String.fromCharCode(8377) + '425 <span>/ kg</span></div>' +
          '<a href="pages/product-detail.html" class="btn-card-view">View</a>' +
        '</div>' +
      '</div>' +
    '</div>';
  if (typeof observeReveals === 'function') observeReveals(grid);
}

// ─── Run after DOM is fully ready ────────────────────────────
document.addEventListener("DOMContentLoaded", loadFeaturedProducts);