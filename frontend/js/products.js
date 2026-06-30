// ─── Local Image Fallback Map ────────────────────────────────
// Used when DB image is missing or unreachable (e.g. Render free tier
// wipes uploaded files on restart). Matches known product names to
// bundled local images so the homepage always looks good.
const localImgs = {
  'NPK 19:19:19':    'assets/images/npk-191919.jpg',
  'Cannon':          'assets/images/cannon.jpg',
  'Coragen':         'assets/images/coragen.jpg',
  'Coriander Seeds': 'assets/images/coriander.jpg',
  'Coriander':       'assets/images/coriander.jpg',
};

// ─── Fetch & Render Featured Products ────────────────────────
async function loadFeaturedProducts() {
  const grid = document.getElementById("featuredProductsGrid");
  if (!grid) return;

  try {
    grid.innerHTML = `<p style="color:#666;padding:20px;">Loading products...</p>`;

    const response = await fetch(`${API_BASE_URL}/products`);

    if (!response.ok) {
      restoreStaticCards(grid);
      return;
    }

    const data = await response.json();
    const products = data.products || data.data || [];

    if (!products.length) {
      restoreStaticCards(grid);
      return;
    }

    const featured = products.slice(0, 5);
    grid.innerHTML = "";

    featured.forEach(product => {
      const card = document.createElement("div");
      card.className = "product-card reveal";

      // ── Image resolution order ──
      // 1. DB image (live uploaded image, e.g. from Cloudinary)
      // 2. Local bundled image (matched by product name)
      // 3. Category emoji fallback
      let imgSrc = null;
      if (product.image) {
        imgSrc = product.image.startsWith("http")
          ? product.image
          : `${API_BASE_URL.replace('/api', '')}/uploads/${product.image}`;
      } else if (localImgs[product.name]) {
        imgSrc = localImgs[product.name];
      }

      const emoji = getCategoryEmoji(product.category);

      card.innerHTML = `
        <div class="product-card-img">
          ${imgSrc
            ? `<img
                src="${imgSrc}"
                alt="${product.name}"
                loading="lazy"
                onerror="this.onerror=null;this.parentElement.innerHTML='<div style=display:flex;align-items:center;justify-content:center;height:180px;font-size:3.5rem;background:#f0f7f0;border-radius:8px;>${emoji}</div>'"
              />`
            : `<div style="display:flex;align-items:center;justify-content:center;height:180px;font-size:3.5rem;background:#f0f7f0;border-radius:8px;">${emoji}</div>`
          }
          ${product.isFeatured ? `<span class="product-badge"><span class="badge badge-green">Featured</span></span>` : ""}
        </div>
        <div class="product-body">
          <div class="product-category">${product.category || ""}</div>
          <div class="product-name">${product.name}</div>
          <div class="product-company">${product.company || ""}</div>
          <div class="product-footer">
            <div class="product-price">
              ₹${Number(product.price).toLocaleString("en-IN")} <span>/ ${product.unit || ""}</span>
            </div>
            <a href="pages/product-detail.html?id=${product._id}" class="btn-card-view">
              View
            </a>
          </div>
        </div>
      `;

      grid.appendChild(card);
    });

  } catch (error) {
    console.warn("Backend not reachable, keeping static cards:", error.message);
    restoreStaticCards(grid);
  }
}

// ─── Restore Static Hardcoded Cards ──────────────────────────
function restoreStaticCards(grid) {
  grid.innerHTML = `
    <div class="product-card reveal">
      <div class="product-card-img">
        <img src="assets/images/npk-191919.jpg" alt="NPK 19:19:19" loading="lazy" />
        <span class="product-badge"><span class="badge badge-green">Popular</span></span>
      </div>
      <div class="product-body">
        <div class="product-category">Water Soluble Fertilizer</div>
        <div class="product-name">NPK 19:19:19</div>
        <div class="product-company">Jai Kisaan</div>
        <div class="product-footer">
          <div class="product-price">₹200 <span>/ kg</span></div>
          <a href="pages/product-detail.html" class="btn-card-view">View</a>
        </div>
      </div>
    </div>

    <div class="product-card reveal reveal-delay-1">
      <div class="product-card-img">
        <img src="assets/images/cannon.jpg" alt="Cannon" loading="lazy" />
      </div>
      <div class="product-body">
        <div class="product-category">Insecticide</div>
        <div class="product-name">Cannon</div>
        <div class="product-company">NACL Industries Limited</div>
        <div class="product-footer">
          <div class="product-price">₹700 <span>/ ltr</span></div>
          <a href="pages/product-detail.html" class="btn-card-view">View</a>
        </div>
      </div>
    </div>

    <div class="product-card reveal reveal-delay-2">
      <div class="product-card-img">
        <img src="assets/images/coragen.jpg" alt="Coragen" loading="lazy" />
        <span class="product-badge"><span class="badge badge-gold">Premium</span></span>
      </div>
      <div class="product-body">
        <div class="product-category">Pesticide</div>
        <div class="product-name">Coragen</div>
        <div class="product-company">FMC</div>
        <div class="product-footer">
          <div class="product-price">₹2,250 <span>/ ltr</span></div>
          <a href="pages/product-detail.html" class="btn-card-view">View</a>
        </div>
      </div>
    </div>

    <div class="product-card reveal reveal-delay-3">
      <div class="product-card-img">
        <img src="assets/images/coriander.jpg" alt="Coriander Seeds" loading="lazy" />
      </div>
      <div class="product-body">
        <div class="product-category">Seeds</div>
        <div class="product-name">Coriander Seeds</div>
        <div class="product-company">Ashoka</div>
        <div class="product-footer">
          <div class="product-price">₹425 <span>/ kg</span></div>
          <a href="pages/product-detail.html" class="btn-card-view">View</a>
        </div>
      </div>
    </div>
  `;
}

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

// ─── Run after DOM is fully ready ────────────────────────────
document.addEventListener("DOMContentLoaded", function () {
  loadFeaturedProducts();
});