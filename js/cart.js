// Script para gerenciar o carrinho de compras
document.addEventListener('DOMContentLoaded', function() {
    loadCartItems();
    updateCartSummary();
    setupEventListeners();
});

// Carregar itens do carrinho
function loadCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCart = document.getElementById('empty-cart');
    const cartContent = document.querySelector('.cart-content');
    
    if (cart.length === 0) {
        cartContent.style.display = 'none';
        emptyCart.style.display = 'block';
        return;
    }
    
    cartContent.style.display = 'flex';
    emptyCart.style.display = 'none';
    
    cartItemsContainer.innerHTML = '';
    
    cart.forEach(item => {
        const cartItem = createCartItem(item);
        cartItemsContainer.appendChild(cartItem);
    });
    
    updateCartSummary();
}

// Criar item do carrinho
function createCartItem(item) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.setAttribute('data-id', item.id);
    
    cartItem.innerHTML = `
        <div class="item-image">
            <img src="${item.image}" alt="${item.title}">
        </div>
        <div class="item-details">
            <h3 class="item-title">${item.title}</h3>
            <div class="item-price">${formatPrice(item.price)}</div>
        </div>
        <div class="item-quantity">
            <button class="quantity-btn minus" data-id="${item.id}">
                <i class="fas fa-minus"></i>
            </button>
            <span class="quantity">${item.quantity}</span>
            <button class="quantity-btn plus" data-id="${item.id}">
                <i class="fas fa-plus"></i>
            </button>
        </div>
        <div class="item-total">
            ${formatPrice(item.price * item.quantity)}
        </div>
        <div class="item-actions">
            <button class="remove-btn" data-id="${item.id}">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    return cartItem;
}

// Configurar event listeners
function setupEventListeners() {
    // Botões de quantidade
    document.addEventListener('click', function(e) {
        if (e.target.closest('.quantity-btn')) {
            const btn = e.target.closest('.quantity-btn');
            const productId = parseInt(btn.getAttribute('data-id'));
            const isPlus = btn.classList.contains('plus');
            
            updateQuantity(productId, isPlus ? 1 : -1);
        }
        
        // Botão de remover
        if (e.target.closest('.remove-btn')) {
            const btn = e.target.closest('.remove-btn');
            const productId = parseInt(btn.getAttribute('data-id'));
            removeFromCart(productId);
        }
    });
    
    // Botão de finalizar compra
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (this.disabled) return;
            
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (cart.length === 0) return;
            
            // Simular finalização de compra
            alert('Compra finalizada com sucesso! (Simulação)');
            
            // Limpar carrinho
            localStorage.removeItem('cart');
            loadCartItems();
            updateCartCounter();
        });
    }
}

// Atualizar quantidade
function updateQuantity(productId, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex === -1) return;
    
    cart[itemIndex].quantity += change;
    
    if (cart[itemIndex].quantity <= 0) {
        cart.splice(itemIndex, 1);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCartItems();
    updateCartCounter();
}

// Remover do carrinho
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);
    
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCartItems();
    updateCartCounter();
}

// Atualizar resumo do carrinho
function updateCartSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemsCount = cart.reduce((total, item) => total + item.quantity, 0);
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 99 ? 0 : 15; // Frete grátis acima de R$ 99
    const total = subtotal + shipping;
    
    // Atualizar contadores
    document.getElementById('cart-items-count').textContent = `${itemsCount} ${itemsCount === 1 ? 'item' : 'itens'}`;
    document.getElementById('subtotal').textContent = formatPrice(subtotal);
    document.getElementById('shipping').textContent = formatPrice(shipping);
    document.getElementById('total').textContent = formatPrice(total);
    
    // Habilitar/desabilitar botão de checkout
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.disabled = itemsCount === 0;
    }
    
    // Atualizar contador do header
    updateCartCounter();
}

// Formatar preço
function formatPrice(price) {
    return price.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

// Atualizar contador do carrinho (compatibilidade com main.js)
function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartCounters = document.querySelectorAll('#cart-count, .cart-count, .cart-counter');
    cartCounters.forEach(counter => {
        counter.textContent = totalItems;
        counter.style.display = totalItems > 0 ? 'flex' : 'none';
    });
}
