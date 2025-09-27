// Script para gerenciar o carrinho de compras
document.addEventListener('DOMContentLoaded', function() {
    // Configurar cabeçalho do usuário
    setupHeaderUserActions();
    
    // Carregar itens do carrinho
    loadCartItems();
    updateCartSummary();
    setupEventListeners();
});

// Função para configurar as ações do usuário no cabeçalho
function setupHeaderUserActions() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const loggedOutActions = document.getElementById('logged-out-actions');
    const loggedInActions = document.getElementById('logged-in-actions');
    const userNameHeader = document.getElementById('user-name-header');
    const adminLink = document.getElementById('admin-link');
    const logoutBtn = document.getElementById('logout-btn-header');
    
    if (currentUser) {
        // Usuário logado
        if (loggedOutActions) loggedOutActions.style.display = 'none';
        if (loggedInActions) loggedInActions.style.display = 'flex';
        if (userNameHeader) userNameHeader.textContent = currentUser.name;
        
        // Mostrar link de gestão se for vendedor
        if (adminLink && currentUser.profile === 'seller') {
            adminLink.style.display = 'inline-block';
        }
        
        // Configurar logout
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function() {
                localStorage.removeItem('currentUser');
                localStorage.removeItem('sessionTimeout');
                window.location.reload();
            });
        }
    } else {
        // Usuário não logado
        if (loggedOutActions) loggedOutActions.style.display = 'block';
        if (loggedInActions) loggedInActions.style.display = 'none';
    }
}

// Carregar itens do carrinho
async function loadCartItems() {
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
    
    // Carregar dados completos dos produtos
    for (const item of cart) {
        try {
            let product = null;
            
            // Tentar carregar do productsModule primeiro
            try {
                product = await productsModule.getProductById(item.id);
            } catch (error) {
                console.log('Erro no productsModule, tentando database.js...');
            }
            
            // Se não encontrou, tentar database.js diretamente
            if (!product && typeof getAllProducts === 'function') {
                const allProducts = getAllProducts();
                product = allProducts.find(p => p.id === item.id);
            }
            
            if (product) {
                // Atualizar dados do item com informações do produto
                item.title = product.title || item.title;
                item.price = parseFloat(product.price) || parseFloat(item.price) || 0;
                item.image = product.image || item.image;
                item.stock = product.stock || item.stock;
                item.description = product.description || item.description;
                console.log(`Produto ${item.id} atualizado:`, {
                    title: item.title,
                    price: item.price,
                    image: item.image
                });
            } else {
                console.warn('Produto não encontrado:', item.id);
                // Manter dados originais do item
                item.price = parseFloat(item.price) || 0;
                console.log(`Mantendo dados originais para ${item.id}:`, {
                    title: item.title,
                    price: item.price
                });
            }
        } catch (error) {
            console.error('Erro ao carregar produto:', error);
            // Garantir que o preço seja numérico
            item.price = parseFloat(item.price) || 0;
        }
        
        const cartItem = createCartItem(item);
        cartItemsContainer.appendChild(cartItem);
    }
    
    updateCartSummary();
}

// Criar item do carrinho
function createCartItem(item) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.setAttribute('data-id', item.id);
    
    cartItem.innerHTML = `
        <div class="item-image">
            <img src="${item.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center&auto=format&q=80'}" alt="${item.title || 'Produto'}" onerror="this.src='https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center&auto=format&q=80'">
        </div>
        <div class="item-details">
            <h3 class="item-title">${item.title || 'Produto'}</h3>
            <p class="item-description">${item.description || ''}</p>
            <div class="item-price">${formatPrice(item.price || 0)}</div>
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
            ${formatPrice((item.price || 0) * (item.quantity || 1))}
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
            const productId = btn.getAttribute('data-id');
            const isPlus = btn.classList.contains('plus');
            
            updateQuantity(productId, isPlus ? 1 : -1);
        }
        
        // Botão de remover
        if (e.target.closest('.remove-btn')) {
            const btn = e.target.closest('.remove-btn');
            const productId = btn.getAttribute('data-id');
            removeFromCart(productId);
        }
    });
    
    // Botão de finalizar compra - redireciona para checkout
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function(e) {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (cart.length === 0) {
                e.preventDefault();
                alert('Seu carrinho está vazio. Adicione produtos antes de finalizar a compra.');
                return;
            }
            // Redireciona para checkout.html
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
    const itemsCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    const subtotal = cart.reduce((total, item) => {
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity) || 1;
        const itemTotal = price * quantity;
        console.log(`Carrinho - Item ${item.id}: preço=${price}, qtd=${quantity}, total=${itemTotal}`);
        return total + itemTotal;
    }, 0);
    const shipping = subtotal > 99 ? 0 : 15; // Frete grátis acima de R$ 99
    const total = subtotal + shipping;
    
    console.log('Carrinho - Totais calculados:', { itemsCount, subtotal, shipping, total });
    
    // Atualizar contadores
    const itemsCountEl = document.getElementById('cart-items-count');
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const totalEl = document.getElementById('total');
    
    if (itemsCountEl) itemsCountEl.textContent = `${itemsCount} ${itemsCount === 1 ? 'item' : 'itens'}`;
    if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
    if (shippingEl) shippingEl.textContent = formatPrice(shipping);
    if (totalEl) totalEl.textContent = formatPrice(total);
    
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
