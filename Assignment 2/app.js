/* ==========================================================
   AURA.STUDIO — eCommerce Store Logic
   Handles catalog, search, filter, sort, cart & checkout
   ========================================================== */

const PRODUCTS = [
  {
    id: 1,
    title: "Heavyweight Navy Crewneck T-Shirt",
    category: "clothing",
    price: 38.00,
    originalPrice: 48.00,
    badge: "Sale",
    rating: 4.9,
    reviews: 142,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    title: "Minimalist Leather Low-Top Sneakers",
    category: "footwear",
    price: 110.00,
    originalPrice: 135.00,
    badge: "Popular",
    rating: 4.8,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    title: "Handcrafted Vegetable-Tanned Bifold Wallet",
    category: "accessories",
    price: 45.00,
    originalPrice: null,
    badge: "New",
    rating: 5.0,
    reviews: 64,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    title: "Classic Tortoise Polarized Sunglasses",
    category: "accessories",
    price: 68.00,
    originalPrice: 85.00,
    badge: "Sale",
    rating: 4.7,
    reviews: 82,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5,
    title: "Brushed Cotton Twill Cap — Sand Beige",
    category: "accessories",
    price: 28.00,
    originalPrice: null,
    badge: null,
    rating: 4.6,
    reviews: 39,
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    title: "Architectural Stainless Steel Chrono Watch",
    category: "accessories",
    price: 185.00,
    originalPrice: 220.00,
    badge: "Best Seller",
    rating: 4.9,
    reviews: 118,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 7,
    title: "Relaxed Fit Oxford Button-Down Shirt",
    category: "clothing",
    price: 54.00,
    originalPrice: 65.00,
    badge: "New",
    rating: 4.8,
    reviews: 73,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 8,
    title: "Chunky Suede Retro Running Trainers",
    category: "footwear",
    price: 95.00,
    originalPrice: null,
    badge: null,
    rating: 4.7,
    reviews: 51,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80"
  }
];

// App State
let state = {
  cart: [],
  activeCategory: "all",
  searchQuery: "",
  sortBy: "featured"
};

// DOM Elements
const productsGrid = document.getElementById("productsGrid");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const openCartBtn = document.getElementById("openCartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartCount = document.getElementById("cartCount");
const cartItemCount = document.getElementById("cartItemCount");
const cartItemsContainer = document.getElementById("cartItemsContainer");
const cartSubtotal = document.getElementById("cartSubtotal");
const cartTax = document.getElementById("cartTax");
const cartTotal = document.getElementById("cartTotal");
const shippingProgressText = document.getElementById("shippingProgressText");
const shippingBarFill = document.getElementById("shippingBarFill");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const categoryFilters = document.getElementById("categoryFilters");
const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutModal = document.getElementById("checkoutModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const toastContainer = document.getElementById("toastContainer");

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  setupEventListeners();
  loadCartFromStorage();
});

// Event Listeners
function setupEventListeners() {
  // Cart toggle
  openCartBtn.addEventListener("click", openCart);
  closeCartBtn.addEventListener("click", closeCart);
  cartOverlay.addEventListener("click", closeCart);

  // Search input
  searchInput.addEventListener("input", (e) => {
    state.searchQuery = e.target.value.toLowerCase().trim();
    renderProducts();
  });

  // Sort dropdown
  sortSelect.addEventListener("change", (e) => {
    state.sortBy = e.target.value;
    renderProducts();
  });

  // Category filters
  categoryFilters.addEventListener("click", (e) => {
    if (e.target.classList.contains("filter-chip")) {
      document.querySelectorAll(".filter-chip").forEach(btn => btn.classList.remove("active"));
      e.target.classList.add("active");
      state.activeCategory = e.target.dataset.category;
      renderProducts();
    }
  });

  // Checkout actions
  checkoutBtn.addEventListener("click", handleCheckout);
  closeModalBtn.addEventListener("click", () => {
    checkoutModal.classList.remove("active");
  });
}

// Render Products
function renderProducts() {
  let filtered = PRODUCTS.filter(p => {
    const matchesCategory = state.activeCategory === "all" || p.category === state.activeCategory;
    const matchesSearch = p.title.toLowerCase().includes(state.searchQuery) || p.category.toLowerCase().includes(state.searchQuery);
    return matchesCategory && matchesSearch;
  });

  // Sort logic
  if (state.sortBy === "price-low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (state.sortBy === "price-high") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (state.sortBy === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  if (filtered.length === 0) {
    productsGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
        <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 8px;">No products found</h3>
        <p style="color: var(--text-muted);">Try adjusting your search terms or category filters.</p>
      </div>
    `;
    return;
  }

  productsGrid.innerHTML = filtered.map(product => `
    <article class="product-card">
      <div class="product-thumb-wrapper">
        ${product.badge ? `<span class="product-badge ${product.badge.toLowerCase() === 'sale' ? 'sale' : 'new'}">${product.badge}</span>` : ''}
        <img src="${product.image}" alt="${product.title}" class="product-thumb" loading="lazy">
      </div>
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3 class="product-title">${product.title}</h3>
        <div class="product-rating">
          <span class="stars">★★★★★</span>
          <span>${product.rating} (${product.reviews})</span>
        </div>
        <div class="product-price-row">
          <div class="price-container">
            <span class="current-price">$${product.price.toFixed(2)}</span>
            ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
          </div>
          <button class="add-cart-btn" onclick="addToCart(${product.id})">
            + Add to Bag
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

// Cart Logic
window.addToCart = function(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existingItem = state.cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    state.cart.push({
      ...product,
      qty: 1
    });
  }

  saveCart();
  updateCartUI();
  showToast(`Added "${product.title}" to bag`);
  openCart();
};

window.updateQty = function(productId, delta) {
  const item = state.cart.find(i => i.id === productId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    state.cart = state.cart.filter(i => i.id !== productId);
  }

  saveCart();
  updateCartUI();
};

window.removeFromCart = function(productId) {
  state.cart = state.cart.filter(i => i.id !== productId);
  saveCart();
  updateCartUI();
  showToast("Item removed from bag");
};

function updateCartUI() {
  const totalCount = state.cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = totalCount;
  cartItemCount.textContent = totalCount;

  if (state.cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart-message">
        <div class="empty-icon">🛍️</div>
        <h4>Your bag is empty</h4>
        <p>Looks like you haven't added any items yet.</p>
      </div>
    `;
    cartSubtotal.textContent = "$0.00";
    cartTax.textContent = "$0.00";
    cartTotal.textContent = "$0.00";
    shippingProgressText.textContent = "Add $75.00 more to unlock Free Shipping!";
    shippingBarFill.style.width = "0%";
    checkoutBtn.disabled = true;
    return;
  }

  checkoutBtn.disabled = false;

  cartItemsContainer.innerHTML = state.cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.title}" class="cart-item-img">
      <div class="cart-item-info">
        <h5>${item.title}</h5>
        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="updateQty(${item.id}, -1)">−</button>
          <span class="qty-number">${item.qty}</span>
          <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
        </div>
      </div>
      <button class="remove-item-btn" onclick="removeFromCart(${item.id})" aria-label="Remove item">&times;</button>
    </div>
  `).join("");

  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
  cartTax.textContent = `$${tax.toFixed(2)}`;
  cartTotal.textContent = `$${total.toFixed(2)}`;

  // Shipping progress calculation
  const target = 75.00;
  if (subtotal >= target) {
    shippingProgressText.innerHTML = "🎉 <strong>Congratulations!</strong> You get Free Express Shipping!";
    shippingBarFill.style.width = "100%";
    shippingBarFill.style.background = "var(--success)";
  } else {
    const diff = (target - subtotal).toFixed(2);
    const pct = Math.min((subtotal / target) * 100, 100);
    shippingProgressText.textContent = `Add $${diff} more to unlock Free Shipping!`;
    shippingBarFill.style.width = `${pct}%`;
    shippingBarFill.style.background = "var(--primary)";
  }
}

function openCart() {
  cartDrawer.classList.add("active");
  cartOverlay.classList.add("active");
  cartDrawer.setAttribute("aria-hidden", "false");
}

function closeCart() {
  cartDrawer.classList.remove("active");
  cartOverlay.classList.remove("active");
  cartDrawer.setAttribute("aria-hidden", "true");
}

function handleCheckout() {
  if (state.cart.length === 0) return;
  closeCart();
  state.cart = [];
  saveCart();
  updateCartUI();
  checkoutModal.classList.add("active");
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<span>✓</span><span>${message}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 2400);
}

function saveCart() {
  try {
    localStorage.setItem("aura_cart", JSON.stringify(state.cart));
  } catch (e) {}
}

function loadCartFromStorage() {
  try {
    const saved = localStorage.getItem("aura_cart");
    if (saved) {
      state.cart = JSON.parse(saved);
      updateCartUI();
    }
  } catch (e) {}
}
