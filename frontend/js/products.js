// ─── Fetch & Render Featured Products ────────────────────────
async function loadFeaturedProducts() {
  const grid = document.getElementById("featuredProductsGrid");
 
  // If grid not found on this page, do nothing
  if (!grid) return;
 
  try {
    // Show loading text temporarily
    grid.innerHTML = `<p style="color:#666;padding:20px;">Loading products...</p>`;
 
    const response = await fetch(`${API_BASE_URL}/products`);
 
    // If server returns error status
    if (!response.ok) {
      restoreStaticCards(grid);
      return;
    }
 
    const data = await response.json();
 
    // Support both response shapes
    const products = data.products || data.data || [];
 
    // If no products in DB, restore static cards
    if (!products || products.length === 0) {
      restoreStaticCards(grid);
      return;
    }
 
    // Show only first 5 products on homepage
    const featured = products.slice(0, 5);
    grid.innerHTML = "";
 
    featured.forEach(product => {
      const card = document.createElement("div");
      card.className = "product-card reveal visible";
 
      // Determine image source
      const imgSrc = product.image
        ? (product.image.startsWith("http")
            ? product.image
            : `http://localhost:5000/uploads/${product.image}`)
        : null;
 
      const emoji = getCategoryEmoji(product.category);
 
      card.innerHTML = `
        <div class="product-card-img">
          ${imgSrc
            ? `<img
                src="${imgSrc}"
                alt="${product.name}"
                loading="lazy"
                onerror="this.parentElement.innerHTML='<div style=display:flex;align-items:center;justify-content:center;height:180px;font-size:3.5rem;background:#f0f7f0;border-radius:8px;>${emoji}</div>'"
              />`
            : `<div style="display:flex;align-items:center;justify-content:center;height:180px;font-size:3.5rem;background:#f0f7f0;border-radius:8px;">${emoji}</div>`
          }
          ${product.isFeatured
            ? `<span class="product-badge"><span class="badge badge-green">Featured</span></span>`
            : ""}
        </div>
        <div class="product-body">
          <div class="product-category">${product.category || ""}</div>
          <div class="product-name">${product.name}</div>
          <div class="product-company">${product.company || ""}</div>
          <div class="product-footer">
            <div class="product-price">
              ₹${Number(product.price).toLocaleString("en-IN")}
              <span>/ ${product.unit || ""}</span>
            </div>
            <a href="pages/product-detail.html?id=${product._id}"
               class="btn-card-view">View</a>
          </div>
        </div>
      `;
 
      grid.appendChild(card);
    });
 
  } catch (error) {
    // Server is off — silently restore static cards
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