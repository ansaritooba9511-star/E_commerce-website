/**
 * LAVENDER & CO. - Main Application Logic
 * State management, cart, wishlist, filtering, modals, checkout validation, and interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
  // App State
  const state = {
    cart: JSON.parse(localStorage.getItem('lavender_cart')) || [],
    wishlist: JSON.parse(localStorage.getItem('lavender_wishlist')) || [],
    category: 'all',
    searchQuery: '',
    priceFilter: 'all',
    sortBy: 'featured',
    appliedPromo: null,
    activeProductModalId: null,
    modalSelectedOption: null,
    modalQuantity: 1
  };

  // Promo Codes Database
  const PROMO_CODES = {
    'LAVENDER10': { discountPercent: 10, label: '10% OFF Special' },
    'WELCOME5': { discountPercent: 5, label: '5% Welcome Discount' }
  };

  // Thresholds
  const FREE_SHIPPING_THRESHOLD = 1999;
  const STANDARD_SHIPPING_FEE = 150;

  // DOM Elements
  const header = document.querySelector('.site-header');
  const cartCountBadges = document.querySelectorAll('.cart-count');
  const wishlistCountBadges = document.querySelectorAll('.wishlist-count');
  const productGrid = document.getElementById('product-grid');
  const productCountDisplay = document.getElementById('product-count-display');
  const categoryPillsContainer = document.getElementById('category-pills');
  const priceFilterSelect = document.getElementById('price-filter');
  const sortBySelect = document.getElementById('sort-by');
  const sectionSearchInput = document.getElementById('section-search');

  // Drawers & Modals
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const cartDrawer = document.getElementById('cart-drawer');
  const wishlistDrawer = document.getElementById('wishlist-drawer');
  const mobileNavDrawer = document.getElementById('mobile-nav');
  const searchModal = document.getElementById('search-modal');
  const productModalOverlay = document.getElementById('product-modal-overlay');
  const checkoutModalOverlay = document.getElementById('checkout-modal-overlay');
  const toastContainer = document.getElementById('toast-container');

  // ==========================================
  // Storage Helpers
  // ==========================================
  function saveCart() {
    localStorage.setItem('lavender_cart', JSON.stringify(state.cart));
    updateBadges();
    renderCart();
  }

  function saveWishlist() {
    localStorage.setItem('lavender_wishlist', JSON.stringify(state.wishlist));
    updateBadges();
    renderWishlist();
    renderProducts(); // Refresh heart states
  }

  function updateBadges() {
    const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountBadges.forEach(el => {
      el.textContent = totalItems;
      el.style.display = totalItems > 0 ? 'flex' : 'none';
    });

    const wishlistTotal = state.wishlist.length;
    wishlistCountBadges.forEach(el => {
      el.textContent = wishlistTotal;
      el.style.display = wishlistTotal > 0 ? 'flex' : 'none';
    });
  }

  // ==========================================
  // Toast Notifications
  // ==========================================
  window.showToast = function(message, type = 'success') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  };

  // ==========================================
  // Product Filtering & Rendering
  // ==========================================
  function getFilteredProducts() {
    let filtered = [...PRODUCTS_DATA];

    // Category Filter
    if (state.category !== 'all') {
      filtered = filtered.filter(p => p.category === state.category);
    }

    // Search Query
    if (state.searchQuery.trim() !== '') {
      const q = state.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // Price Filter
    if (state.priceFilter === 'under-1500') {
      filtered = filtered.filter(p => p.price < 1500);
    } else if (state.priceFilter === '1500-3000') {
      filtered = filtered.filter(p => p.price >= 1500 && p.price <= 3000);
    } else if (state.priceFilter === 'above-3000') {
      filtered = filtered.filter(p => p.price > 3000);
    }

    // Sorting
    if (state.sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (state.sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (state.sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (state.sortBy === 'newest') {
      filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }

    return filtered;
  }

  function renderProducts() {
    if (!productGrid) return;
    const products = getFilteredProducts();

    if (productCountDisplay) {
      productCountDisplay.textContent = `Showing ${products.length} refined piece${products.length === 1 ? '' : 's'}`;
    }

    if (products.length === 0) {
      productGrid.innerHTML = `
        <div class="empty-products-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color: var(--color-brown-mocha); margin-bottom: 14px;">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <h3 style="font-family: var(--font-serif); color: var(--color-brown-chocolate); margin-bottom: 6px;">No products match your criteria</h3>
          <p style="color: var(--color-text-muted); margin-bottom: 18px;">Try clearing filters or searching for another keyword.</p>
          <button class="btn btn-outline-brown btn-sm" id="reset-filters-btn">Reset Filters</button>
        </div>
      `;
      const resetBtn = document.getElementById('reset-filters-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          state.category = 'all';
          state.searchQuery = '';
          state.priceFilter = 'all';
          state.sortBy = 'featured';
          if (sectionSearchInput) sectionSearchInput.value = '';
          if (priceFilterSelect) priceFilterSelect.value = 'all';
          if (sortBySelect) sortBySelect.value = 'featured';
          updateActivePill();
          renderProducts();
        });
      }
      return;
    }

    productGrid.innerHTML = products.map(product => {
      const isWishlisted = state.wishlist.some(item => item.id === product.id);
      return `
        <div class="product-card" data-product-id="${product.id}">
          <div class="product-thumb-wrap">
            <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80';" />
            ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            <button class="wishlist-toggle-btn ${isWishlisted ? 'active' : ''}" data-id="${product.id}" title="${isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}" aria-label="Wishlist">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
            <button class="quick-view-overlay-btn" data-id="${product.id}">Quick View</button>
          </div>
          <div class="product-details">
            <span class="product-cat-name">${product.categoryLabel}</span>
            <h3 class="product-title" data-id="${product.id}">${product.name}</h3>
            <div class="product-rating">
              <span class="stars">★★★★★</span>
              <span>${product.rating.toFixed(1)} (${product.reviewsCount})</span>
            </div>
            <div class="product-price-row">
              <span class="current-price">₹${product.price.toLocaleString('en-IN')}</span>
              ${product.originalPrice ? `<span class="original-price">₹${product.originalPrice.toLocaleString('en-IN')}</span>` : ''}
            </div>
            <button class="add-to-cart-btn" data-id="${product.id}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-2z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span>Add to Bag</span>
            </button>
          </div>
        </div>
      `;
    }).join('');

    attachProductCardListeners();
  }

  function attachProductCardListeners() {
    // Add to cart buttons
    productGrid.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const productId = parseInt(btn.dataset.id, 10);
        const product = PRODUCTS_DATA.find(p => p.id === productId);
        if (!product) return;

        const defaultOption = product.options ? product.options.values[0] : null;
        addToCart(productId, defaultOption, 1);

        btn.classList.add('added');
        btn.querySelector('span').textContent = 'Added to Bag';
        setTimeout(() => {
          btn.classList.remove('added');
          btn.querySelector('span').textContent = 'Add to Bag';
        }, 1400);
      });
    });

    // Wishlist buttons
    productGrid.querySelectorAll('.wishlist-toggle-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const productId = parseInt(btn.dataset.id, 10);
        toggleWishlist(productId);
      });
    });

    // Quick view and title clicks
    productGrid.querySelectorAll('.quick-view-overlay-btn, .product-title').forEach(el => {
      el.addEventListener('click', () => {
        const productId = parseInt(el.dataset.id, 10);
        openProductModal(productId);
      });
    });
  }

  function updateActivePill() {
    if (!categoryPillsContainer) return;
    categoryPillsContainer.querySelectorAll('.pill-btn').forEach(pill => {
      if (pill.dataset.category === state.category) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });
  }

  // ==========================================
  // Categories Section Rendering
  // ==========================================
  function renderCategories() {
    const grid = document.getElementById('categories-grid');
    if (!grid) return;

    grid.innerHTML = CATEGORIES_DATA.map(cat => `
      <div class="category-card" data-category="${cat.id}">
        <img src="${cat.image}" alt="${cat.name}" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80';" />
        <div class="category-overlay">
          <span class="category-meta">${cat.itemCount} Curated Pieces</span>
          <h3 class="category-name">${cat.name}</h3>
          <span class="category-btn">Explore Category →</span>
        </div>
      </div>
    `).join('');

    grid.querySelectorAll('.category-card').forEach(card => {
      card.addEventListener('click', () => {
        const catId = card.dataset.category;
        state.category = catId;
        updateActivePill();
        renderProducts();
        const section = document.getElementById('shop');
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  window.filterByCategory = function(catId) {
    state.category = catId;
    updateActivePill();
    renderProducts();
    const section = document.getElementById('shop');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // ==========================================
  // Shopping Cart Logic
  // ==========================================
  window.addToCart = function(productId, optionValue, quantity = 1) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;

    const opt = optionValue || (product.options ? product.options.values[0] : 'Standard');
    const existingIndex = state.cart.findIndex(
      item => item.id === productId && item.option === opt
    );

    if (existingIndex > -1) {
      state.cart[existingIndex].quantity += quantity;
    } else {
      state.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.categoryLabel,
        option: opt,
        quantity: quantity
      });
    }

    saveCart();
    showToast(`Added "${product.name}" to your shopping bag.`);
  };

  window.updateCartQuantity = function(index, delta) {
    if (state.cart[index]) {
      state.cart[index].quantity += delta;
      if (state.cart[index].quantity <= 0) {
        state.cart.splice(index, 1);
      }
      saveCart();
    }
  };

  window.removeFromCart = function(index) {
    if (state.cart[index]) {
      const removedName = state.cart[index].name;
      state.cart.splice(index, 1);
      saveCart();
      showToast(`Removed "${removedName}" from your bag.`, 'info');
    }
  };

  function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartFooter = document.getElementById('cart-footer');
    const shippingProgressText = document.getElementById('shipping-progress-text');
    const shippingProgressBar = document.getElementById('shipping-progress-bar');
    if (!cartItemsContainer) return;

    if (state.cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="drawer-empty-state">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-2z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <h4>Your bag is empty</h4>
          <p>Discover our heirloom lifestyle pieces to bring refined calm to your sanctuary.</p>
          <button class="btn btn-primary btn-sm" id="empty-cart-shop-btn">Start Shopping</button>
        </div>
      `;
      if (cartFooter) cartFooter.style.display = 'none';

      const emptyShopBtn = document.getElementById('empty-cart-shop-btn');
      if (emptyShopBtn) {
        emptyShopBtn.addEventListener('click', () => {
          closeAllDrawers();
          const shop = document.getElementById('shop');
          if (shop) shop.scrollIntoView({ behavior: 'smooth' });
        });
      }

      if (shippingProgressText && shippingProgressBar) {
        shippingProgressText.textContent = `Complimentary shipping on orders over ₹${FREE_SHIPPING_THRESHOLD.toLocaleString('en-IN')}`;
        shippingProgressBar.style.width = '0%';
      }
      return;
    }

    if (cartFooter) cartFooter.style.display = 'block';

    // Calculate totals
    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
    let discountAmount = 0;
    if (state.appliedPromo) {
      discountAmount = Math.round(subtotal * (state.appliedPromo.discountPercent / 100));
    }
    const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

    // Update shipping progress bar
    if (shippingProgressText && shippingProgressBar) {
      if (subtotal >= FREE_SHIPPING_THRESHOLD) {
        shippingProgressText.innerHTML = `✨ <strong>You unlocked complimentary express delivery!</strong>`;
        shippingProgressBar.style.width = '100%';
      } else {
        const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
        const percent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
        shippingProgressText.innerHTML = `Add <strong>₹${remaining.toLocaleString('en-IN')}</strong> more for complimentary delivery`;
        shippingProgressBar.style.width = `${percent}%`;
      }
    }

    cartItemsContainer.innerHTML = state.cart.map((item, index) => `
      <div class="cart-item">
        <img class="cart-item-thumb" src="${item.image}" alt="${item.name}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80';" />
        <div class="cart-item-info">
          <h4 class="cart-item-title">${item.name}</h4>
          <span class="cart-item-opt">Variant: ${item.option}</span>
          <div class="cart-item-bottom">
            <div class="quantity-stepper">
              <button onclick="updateCartQuantity(${index}, -1)" aria-label="Decrease quantity">−</button>
              <span>${item.quantity}</span>
              <button onclick="updateCartQuantity(${index}, 1)" aria-label="Increase quantity">+</button>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="cart-item-price">₹${(item.price * item.quantity).toLocaleString('en-IN')}</span>
              <button class="item-remove-btn" onclick="removeFromCart(${index})" title="Remove item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    // Update Drawer Totals
    const subtotalEl = document.getElementById('drawer-subtotal');
    const shippingEl = document.getElementById('drawer-shipping');
    const discountRow = document.getElementById('drawer-discount-row');
    const discountEl = document.getElementById('drawer-discount');
    const grandTotalEl = document.getElementById('drawer-grand-total');

    if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    if (shippingEl) shippingEl.textContent = shippingFee === 0 ? 'Complimentary' : `₹${shippingFee}`;
    if (discountRow && discountEl) {
      if (discountAmount > 0) {
        discountRow.style.display = 'flex';
        discountEl.textContent = `-₹${discountAmount.toLocaleString('en-IN')} (${state.appliedPromo.label})`;
      } else {
        discountRow.style.display = 'none';
      }
    }
    if (grandTotalEl) grandTotalEl.textContent = `₹${grandTotal.toLocaleString('en-IN')}`;
  }

  // ==========================================
  // Wishlist Logic
  // ==========================================
  window.toggleWishlist = function(productId) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;

    const existingIdx = state.wishlist.findIndex(item => item.id === productId);
    if (existingIdx > -1) {
      state.wishlist.splice(existingIdx, 1);
      showToast(`Removed "${product.name}" from wishlist.`, 'info');
    } else {
      state.wishlist.push(product);
      showToast(`Saved "${product.name}" to wishlist.`);
    }
    saveWishlist();
  };

  window.moveToCartFromWishlist = function(productId) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;
    addToCart(productId, product.options ? product.options.values[0] : null, 1);
    const idx = state.wishlist.findIndex(p => p.id === productId);
    if (idx > -1) {
      state.wishlist.splice(idx, 1);
      saveWishlist();
    }
    openCartDrawer();
  };

  function renderWishlist() {
    const container = document.getElementById('wishlist-items-container');
    if (!container) return;

    if (state.wishlist.length === 0) {
      container.innerHTML = `
        <div class="drawer-empty-state">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          <h4>Your wishlist is empty</h4>
          <p>Tap the heart icon on any piece you love to save it for later.</p>
          <button class="btn btn-primary btn-sm" id="empty-wishlist-shop-btn">Explore Collection</button>
        </div>
      `;
      const btn = document.getElementById('empty-wishlist-shop-btn');
      if (btn) {
        btn.addEventListener('click', () => {
          closeAllDrawers();
          const shop = document.getElementById('shop');
          if (shop) shop.scrollIntoView({ behavior: 'smooth' });
        });
      }
      return;
    }

    container.innerHTML = state.wishlist.map(product => `
      <div class="cart-item">
        <img class="cart-item-thumb" src="${product.image}" alt="${product.name}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80';" />
        <div class="cart-item-info">
          <h4 class="cart-item-title">${product.name}</h4>
          <span class="cart-item-opt">${product.categoryLabel}</span>
          <div class="cart-item-bottom">
            <span class="cart-item-price">₹${product.price.toLocaleString('en-IN')}</span>
            <div style="display: flex; gap: 8px;">
              <button class="btn btn-outline-brown btn-sm" style="padding: 4px 12px; font-size: 0.78rem;" onclick="moveToCartFromWishlist(${product.id})">Move to Bag</button>
              <button class="item-remove-btn" onclick="toggleWishlist(${product.id})" title="Remove">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  // ==========================================
  // Product Detail Modal
  // ==========================================
  window.openProductModal = function(productId) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product || !productModalOverlay) return;

    state.activeProductModalId = productId;
    state.modalSelectedOption = product.options ? product.options.values[0] : null;
    state.modalQuantity = 1;

    const modalBody = document.getElementById('product-modal-content');
    const isWishlisted = state.wishlist.some(item => item.id === product.id);

    modalBody.innerHTML = `
      <div class="product-modal-grid">
        <div class="product-modal-image">
          <img src="${product.image}" alt="${product.name}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80';" />
        </div>
        <div class="product-modal-info">
          <span class="product-modal-category">${product.categoryLabel}</span>
          <h2 class="product-modal-title">${product.name}</h2>
          <div class="product-rating" style="margin-bottom: 12px;">
            <span class="stars">★★★★★</span>
            <span>${product.rating.toFixed(1)} (${product.reviewsCount} verified customer reviews)</span>
          </div>
          <div class="product-modal-price-wrap">
            <span class="product-modal-price">₹${product.price.toLocaleString('en-IN')}</span>
            ${product.originalPrice ? `<span class="product-modal-original">₹${product.originalPrice.toLocaleString('en-IN')}</span>` : ''}
            ${product.badge ? `<span class="product-badge" style="position: static; margin-left: 6px;">${product.badge}</span>` : ''}
          </div>
          <p class="product-modal-desc">${product.description}</p>

          ${product.options ? `
            <div class="options-group">
              <div class="options-group-title">Select ${product.options.type}: <span id="modal-option-label" style="font-weight: 700; color: var(--color-brown-chocolate);">${state.modalSelectedOption}</span></div>
              <div class="options-selector-list" id="modal-option-chips">
                ${product.options.values.map(val => `
                  <button type="button" class="option-chip ${val === state.modalSelectedOption ? 'active' : ''}" data-value="${val}">${val}</button>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <div class="modal-action-row">
            <div class="quantity-stepper" style="height: 44px;">
              <button id="modal-qty-minus" style="width: 36px; height: 100%; font-size: 1.1rem;">−</button>
              <span id="modal-qty-val" style="min-width: 32px; font-size: 1rem;">1</span>
              <button id="modal-qty-plus" style="width: 36px; height: 100%; font-size: 1.1rem;">+</button>
            </div>
            <button class="btn btn-primary" id="modal-add-to-cart-btn" style="flex: 1; height: 44px;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-2z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span>Add to Bag</span>
            </button>
            <button class="btn-icon action-btn ${isWishlisted ? 'active' : ''}" id="modal-wishlist-toggle-btn" title="Wishlist" style="width: 44px; height: 44px;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" style="${isWishlisted ? 'color: #c93b48;' : ''}">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>

          <ul class="modal-specs-list">
            ${product.specs.map(spec => `<li>${spec}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;

    // Modal option chips event listeners
    const optionChips = modalBody.querySelectorAll('.option-chip');
    optionChips.forEach(chip => {
      chip.addEventListener('click', () => {
        optionChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        state.modalSelectedOption = chip.dataset.value;
        const optLabel = document.getElementById('modal-option-label');
        if (optLabel) optLabel.textContent = state.modalSelectedOption;
      });
    });

    // Quantity stepper
    const minusBtn = document.getElementById('modal-qty-minus');
    const plusBtn = document.getElementById('modal-qty-plus');
    const qtyVal = document.getElementById('modal-qty-val');
    if (minusBtn && plusBtn && qtyVal) {
      minusBtn.addEventListener('click', () => {
        if (state.modalQuantity > 1) {
          state.modalQuantity--;
          qtyVal.textContent = state.modalQuantity;
        }
      });
      plusBtn.addEventListener('click', () => {
        state.modalQuantity++;
        qtyVal.textContent = state.modalQuantity;
      });
    }

    // Modal Add to Cart
    const addBtn = document.getElementById('modal-add-to-cart-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        addToCart(product.id, state.modalSelectedOption, state.modalQuantity);
        closeProductModal();
        openCartDrawer();
      });
    }

    // Modal Wishlist toggle
    const wishlistBtn = document.getElementById('modal-wishlist-toggle-btn');
    if (wishlistBtn) {
      wishlistBtn.addEventListener('click', () => {
        toggleWishlist(product.id);
        const nowWishlisted = state.wishlist.some(item => item.id === product.id);
        const svg = wishlistBtn.querySelector('svg');
        if (nowWishlisted) {
          svg.setAttribute('fill', 'currentColor');
          svg.style.color = '#c93b48';
        } else {
          svg.setAttribute('fill', 'none');
          svg.style.color = '';
        }
      });
    }

    productModalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeProductModal = function() {
    if (productModalOverlay) {
      productModalOverlay.classList.remove('open');
      document.body.style.overflow = '';
      state.activeProductModalId = null;
    }
  };

  // ==========================================
  // Checkout Modal & Validation Flow
  // ==========================================
  window.openCheckout = function() {
    if (state.cart.length === 0) {
      showToast('Your bag is empty! Add products before checking out.', 'error');
      return;
    }
    closeAllDrawers();
    renderCheckoutSummary();
    if (checkoutModalOverlay) {
      checkoutModalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeCheckout = function() {
    if (checkoutModalOverlay) {
      checkoutModalOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  function renderCheckoutSummary() {
    const summaryItems = document.getElementById('checkout-items-list');
    const subtotalEl = document.getElementById('checkout-subtotal');
    const shippingEl = document.getElementById('checkout-shipping');
    const discountRow = document.getElementById('checkout-discount-row');
    const discountEl = document.getElementById('checkout-discount');
    const totalEl = document.getElementById('checkout-grand-total');

    if (!summaryItems) return;

    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
    let discountAmount = 0;
    if (state.appliedPromo) {
      discountAmount = Math.round(subtotal * (state.appliedPromo.discountPercent / 100));
    }
    const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

    summaryItems.innerHTML = state.cart.map(item => `
      <div style="display: flex; gap: 12px; margin-bottom: 12px; align-items: center;">
        <img src="${item.image}" alt="${item.name}" style="width: 48px; height: 48px; border-radius: 6px; object-fit: cover;" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80';" />
        <div style="flex: 1;">
          <div style="font-size: 0.86rem; font-weight: 600; color: var(--color-brown-chocolate); line-height: 1.2;">${item.name}</div>
          <div style="font-size: 0.74rem; color: var(--color-text-muted);">Qty: ${item.quantity} • ${item.option}</div>
        </div>
        <div style="font-size: 0.88rem; font-weight: 700; color: var(--color-brown-chocolate);">₹${(item.price * item.quantity).toLocaleString('en-IN')}</div>
      </div>
    `).join('');

    if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    if (shippingEl) shippingEl.textContent = shippingFee === 0 ? 'Complimentary' : `₹${shippingFee}`;
    if (discountRow && discountEl) {
      if (discountAmount > 0) {
        discountRow.style.display = 'flex';
        discountEl.textContent = `-₹${discountAmount.toLocaleString('en-IN')} (${state.appliedPromo.label})`;
      } else {
        discountRow.style.display = 'none';
      }
    }
    if (totalEl) totalEl.textContent = `₹${grandTotal.toLocaleString('en-IN')}`;
    const btnTotal = document.getElementById('checkout-btn-total');
    if (btnTotal) btnTotal.textContent = grandTotal.toLocaleString('en-IN');
  }

  // Handle Checkout Form Submission
  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    // Payment method selector
    const paymentMethods = checkoutForm.querySelectorAll('.payment-option-card');
    paymentMethods.forEach(card => {
      card.addEventListener('click', () => {
        paymentMethods.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
      });
    });

    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Inputs
      const nameInput = document.getElementById('checkout-name');
      const emailInput = document.getElementById('checkout-email');
      const phoneInput = document.getElementById('checkout-phone');
      const addressInput = document.getElementById('checkout-address');
      const cityInput = document.getElementById('checkout-city');
      const pincodeInput = document.getElementById('checkout-pincode');

      // Clear existing errors
      checkoutForm.querySelectorAll('.form-control').forEach(input => input.classList.remove('error'));
      checkoutForm.querySelectorAll('.form-error-msg').forEach(msg => msg.textContent = '');

      function setError(input, message) {
        isValid = false;
        input.classList.add('error');
        const errSpan = input.parentElement.querySelector('.form-error-msg');
        if (errSpan) errSpan.textContent = message;
      }

      if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
        setError(nameInput, 'Please enter your full name (at least 2 letters)');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        setError(emailInput, 'Please enter a valid email address');
      }

      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneInput.value.trim() || !phoneRegex.test(phoneInput.value.trim().replace(/\D/g, ''))) {
        setError(phoneInput, 'Please enter a valid 10-digit Indian mobile number');
      }

      if (!addressInput.value.trim() || addressInput.value.trim().length < 6) {
        setError(addressInput, 'Please enter a complete street address');
      }

      if (!cityInput.value.trim()) {
        setError(cityInput, 'Please specify your city');
      }

      const pinRegex = /^[1-9][0-9]{5}$/;
      if (!pincodeInput.value.trim() || !pinRegex.test(pincodeInput.value.trim())) {
        setError(pincodeInput, 'Please enter a valid 6-digit Indian postal PIN code');
      }

      if (!isValid) return;

      // Submit Demo Order
      const submitBtn = checkoutForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 2a10 10 0 0 1 10 10"></path>
        </svg>
        <span>Processing Demo Order...</span>
      `;

      setTimeout(() => {
        const orderId = `LAV-${Math.floor(100000 + Math.random() * 900000)}`;
        const customerName = nameInput.value.trim();
        const customerEmail = emailInput.value.trim();
        const finalTotal = document.getElementById('checkout-grand-total').textContent;

        const checkoutContainer = document.querySelector('.checkout-modal-container');
        checkoutContainer.innerHTML = `
          <button class="modal-close-btn" onclick="closeCheckout()" aria-label="Close">✕</button>
          <div class="order-success-card">
            <div class="order-success-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <span class="section-tag" style="background: #E8F5E9; color: var(--color-success);">Demo Order Placed Successfully</span>
            <h2 class="section-title" style="margin-top: 10px;">Thank You, ${customerName}</h2>
            <p style="color: var(--color-text-muted); max-width: 520px; margin: 0 auto 16px;">
              Your order confirmation and tracking details have been simulated for <strong>${customerEmail}</strong>.
            </p>
            <div class="order-id-chip">Order Reference: ${orderId}</div>

            <div class="order-receipt-box">
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-weight: 600; color: var(--color-brown-chocolate); border-bottom: 1px solid var(--color-border); padding-bottom: 8px;">
                <span>Order Summary</span>
                <span>${finalTotal}</span>
              </div>
              <div style="font-size: 0.85rem; color: var(--color-text-muted); line-height: 1.6;">
                <div>• Delivery: Express Courier (Estimated 3-4 business days)</div>
                <div>• Payment: Demo Mode (No real charges incurred)</div>
                <div>• Scented Keepsake Packaging included</div>
              </div>
            </div>

            <button class="btn btn-primary" id="order-continue-shopping-btn">Continue Shopping</button>
          </div>
        `;

        // Clear cart and storage
        state.cart = [];
        state.appliedPromo = null;
        saveCart();

        const contBtn = document.getElementById('order-continue-shopping-btn');
        if (contBtn) {
          contBtn.addEventListener('click', () => {
            closeCheckout();
            location.reload(); // Reset view clean
          });
        }
      }, 900);
    });
  }

  // ==========================================
  // Drawers Controls (Open/Close)
  // ==========================================
  function closeAllDrawers() {
    if (cartDrawer) cartDrawer.classList.remove('open');
    if (wishlistDrawer) wishlistDrawer.classList.remove('open');
    if (mobileNavDrawer) mobileNavDrawer.classList.remove('open');
    if (drawerBackdrop) drawerBackdrop.classList.remove('open');
    if (searchModal) searchModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  window.openCartDrawer = function() {
    closeAllDrawers();
    if (cartDrawer && drawerBackdrop) {
      cartDrawer.classList.add('open');
      drawerBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
      renderCart();
    }
  };

  window.openWishlistDrawer = function() {
    closeAllDrawers();
    if (wishlistDrawer && drawerBackdrop) {
      wishlistDrawer.classList.add('open');
      drawerBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
      renderWishlist();
    }
  };

  window.openMobileNav = function() {
    closeAllDrawers();
    if (mobileNavDrawer && drawerBackdrop) {
      mobileNavDrawer.classList.add('open');
      drawerBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  };

  window.openSearchModal = function() {
    closeAllDrawers();
    if (searchModal) {
      searchModal.classList.add('open');
      const input = document.getElementById('header-search-input');
      if (input) {
        input.value = '';
        input.focus();
        renderHeaderSearchResults('');
      }
    }
  };

  window.closeSearchModal = function() {
    if (searchModal) searchModal.classList.remove('open');
  };

  // Header Search Live Filter
  function renderHeaderSearchResults(query) {
    const resultsContainer = document.getElementById('search-modal-results');
    if (!resultsContainer) return;

    if (!query.trim()) {
      resultsContainer.innerHTML = `
        <div style="font-size: 0.85rem; color: var(--color-text-muted); padding: 10px 0;">
          Popular searches: <em>Suede Loafers</em>, <em>Babouche Mules</em>, <em>Chelsea Boots</em>, <em>Silk Foulard</em>, <em>Lavender Candle</em>, <em>Eau de Parfum</em>
        </div>
      `;
      return;
    }

    const q = query.toLowerCase().trim();
    const matches = PRODUCTS_DATA.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.categoryLabel.toLowerCase().includes(q)
    );

    if (matches.length === 0) {
      resultsContainer.innerHTML = `
        <div style="font-size: 0.88rem; color: var(--color-text-muted); padding: 12px 0;">
          No items found matching "${query}". Try another keyword.
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = matches.map(p => `
      <div class="search-result-item" onclick="openProductModal(${p.id}); closeSearchModal();">
        <img class="search-result-img" src="${p.image}" alt="${p.name}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80';" />
        <div style="flex: 1;">
          <div style="font-family: var(--font-serif); font-size: 0.95rem; font-weight: 600; color: var(--color-brown-chocolate);">${p.name}</div>
          <div style="font-size: 0.78rem; color: var(--color-text-muted);">${p.categoryLabel}</div>
        </div>
        <div style="font-weight: 700; color: var(--color-brown-chocolate);">₹${p.price.toLocaleString('en-IN')}</div>
      </div>
    `).join('');
  }

  // ==========================================
  // Promo Code Application
  // ==========================================
  const applyPromoBtn = document.getElementById('apply-promo-btn');
  const promoInput = document.getElementById('cart-promo-input');
  if (applyPromoBtn && promoInput) {
    applyPromoBtn.addEventListener('click', () => {
      const code = promoInput.value.trim().toUpperCase();
      if (!code) return;

      if (PROMO_CODES[code]) {
        state.appliedPromo = PROMO_CODES[code];
        showToast(`Promo "${code}" applied! ${PROMO_CODES[code].label}`);
        renderCart();
      } else {
        showToast('Invalid promo code. Try "LAVENDER10" or "WELCOME5"', 'error');
      }
    });
  }

  // ==========================================
  // Event Listeners for Filters & Nav
  // ==========================================

  // Category filter pills
  if (categoryPillsContainer) {
    categoryPillsContainer.querySelectorAll('.pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.category = btn.dataset.category;
        updateActivePill();
        renderProducts();
      });
    });
  }

  // Price filter
  if (priceFilterSelect) {
    priceFilterSelect.addEventListener('change', (e) => {
      state.priceFilter = e.target.value;
      renderProducts();
    });
  }

  // Sort by
  if (sortBySelect) {
    sortBySelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      renderProducts();
    });
  }

  // Section search
  if (sectionSearchInput) {
    sectionSearchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      renderProducts();
    });
  }

  // Header search input
  const headerSearchInput = document.getElementById('header-search-input');
  if (headerSearchInput) {
    headerSearchInput.addEventListener('input', (e) => {
      renderHeaderSearchResults(e.target.value);
    });
  }

  // Drawer buttons in header
  const cartBtn = document.getElementById('cart-btn');
  if (cartBtn) cartBtn.addEventListener('click', openCartDrawer);

  const wishlistBtn = document.getElementById('wishlist-btn');
  if (wishlistBtn) wishlistBtn.addEventListener('click', openWishlistDrawer);

  const searchBtn = document.getElementById('search-btn');
  if (searchBtn) searchBtn.addEventListener('click', openSearchModal);

  const hamburgerBtn = document.getElementById('hamburger-btn');
  if (hamburgerBtn) hamburgerBtn.addEventListener('click', openMobileNav);

  // Close buttons
  const closeCartBtn = document.getElementById('close-cart-btn');
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeAllDrawers);

  const closeWishlistBtn = document.getElementById('close-wishlist-btn');
  if (closeWishlistBtn) closeWishlistBtn.addEventListener('click', closeAllDrawers);

  const closeMobileNavBtn = document.getElementById('close-mobile-nav-btn');
  if (closeMobileNavBtn) closeMobileNavBtn.addEventListener('click', closeAllDrawers);

  const closeSearchBtn = document.getElementById('close-search-btn');
  if (closeSearchBtn) closeSearchBtn.addEventListener('click', closeSearchModal);

  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeAllDrawers);

  // Modal overlays close on outer click
  if (productModalOverlay) {
    productModalOverlay.addEventListener('click', (e) => {
      if (e.target === productModalOverlay) closeProductModal();
    });
  }

  if (checkoutModalOverlay) {
    checkoutModalOverlay.addEventListener('click', (e) => {
      if (e.target === checkoutModalOverlay) closeCheckout();
    });
  }

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllDrawers();
      closeProductModal();
      closeCheckout();
    }
  });

  // Sticky header class toggle on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile nav links click closes drawer
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeAllDrawers);
  });

  // FAQ Accordion
  document.querySelectorAll('.faq-item').forEach(item => {
    const questionBtn = item.querySelector('.faq-question-btn');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(other => other.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // Newsletter Form
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('.newsletter-input');
      const val = input.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!val || !emailRegex.test(val)) {
        showToast('Please enter a valid email address.', 'error');
        return;
      }
      showToast(`Welcome to the sanctuary! 10% discount code sent to ${val}`);
      input.value = '';
    });
  }

  // ==========================================
  // Initial Render
  // ==========================================
  renderCategories();
  renderProducts();
  updateBadges();
  renderCart();
  renderWishlist();
});
