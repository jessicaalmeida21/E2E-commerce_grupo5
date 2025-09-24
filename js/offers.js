// Script para gerenciar a página de ofertas
document.addEventListener('DOMContentLoaded', function() {
    loadOffers();
});

// Carregar ofertas
async function loadOffers() {
    try {
        const products = await productsModule.getDiscountedProducts();
        displayOffers(products);
    } catch (error) {
        console.error('Erro ao carregar ofertas:', error);
        showEmptyOffers();
    }
}

// Exibir ofertas
function displayOffers(products) {
    const grid = document.getElementById('offers-grid');
    const emptyOffers = document.getElementById('empty-offers');
    
    if (products.length === 0) {
        grid.innerHTML = '';
        emptyOffers.style.display = 'block';
        return;
    }
    
    emptyOffers.style.display = 'none';
    grid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createOfferCard(product);
        grid.appendChild(productCard);
    });
}

// Criar card de oferta
function createOfferCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card offer-card';
    
    const discountBadge = `<div class="discount-badge">-${product.discount}%</div>`;
    
    const originalPrice = product.originalPrice && product.originalPrice > product.price ? 
        `<div class="original-price">${productsModule.formatPrice(product.originalPrice)}</div>` : '';
    
    const rating = product.rating ? 
        `<div class="product-rating">
            <span class="stars">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}</span>
            <span class="rating-count">(${product.ratingCount || 0})</span>
        </div>` : '';

    const savings = product.originalPrice ? 
        `<div class="savings">Você economiza ${productsModule.formatPrice(product.originalPrice - product.price)}</div>` : '';

    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.title}" loading="lazy">
            ${discountBadge}
        </div>
        <div class="product-info">
            <div class="product-price">
                ${originalPrice}
                <span class="current-price">${productsModule.formatPrice(product.price)}</span>
            </div>
            <h3 class="product-title">${product.title}</h3>
            <p class="product-brand">${product.brand || 'Marca'}</p>
            ${rating}
            ${savings}
            <div class="product-actions">
                <button class="add-to-cart" data-id="${product.id}">
                    <i class="fas fa-shopping-cart"></i> Adicionar
                </button>
                <button class="wishlist-btn" data-id="${product.id}">
                    <i class="far fa-heart"></i>
                </button>
            </div>
        </div>
    `;
    
    // Adicionar eventos
    const addToCartBtn = card.querySelector('.add-to-cart');
    addToCartBtn.addEventListener('click', function() {
        const productId = this.getAttribute('data-id');
        try {
            productsModule.addToCart(productId);
            showNotification('Produto adicionado ao carrinho!', 'success');
        } catch (error) {
            showNotification('Erro: ' + error.message, 'error');
        }
    });
    
    const wishlistBtn = card.querySelector('.wishlist-btn');
    wishlistBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        const icon = this.querySelector('i');
        if (this.classList.contains('active')) {
            icon.className = 'fas fa-heart';
            showNotification('Adicionado aos favoritos!', 'success');
        } else {
            icon.className = 'far fa-heart';
            showNotification('Removido dos favoritos!', 'info');
        }
    });
    
    return card;
}

// Mostrar ofertas vazias
function showEmptyOffers() {
    const grid = document.getElementById('offers-grid');
    const emptyOffers = document.getElementById('empty-offers');
    
    grid.innerHTML = '';
    emptyOffers.style.display = 'block';
}

// Mostrar notificação
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}
