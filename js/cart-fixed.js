// Script para gerenciar o carrinho de compras - VERSÃO CORRIGIDA
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== INICIANDO CARRINHO CORRIGIDO ===');
    
    // Configurar cabeçalho do usuário
    setupHeaderUserActions();
    
    // Carregar itens do carrinho
    loadCartItems();
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
        
        // Mostrar link de admin apenas para vendedores
        if (adminLink) {
            adminLink.style.display = currentUser.profile === 'seller' ? 'block' : 'none';
        }
        
        // Configurar logout
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                logout();
            });
        }
    } else {
        // Usuário não logado
        if (loggedOutActions) loggedOutActions.style.display = 'flex';
        if (loggedInActions) loggedInActions.style.display = 'none';
    }
}

// Função de logout
function logout() {
    console.log('Fazendo logout...');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('sessionStartTime');
    window.location.href = './login.html';
}

// Carregar itens do carrinho
async function loadCartItems() {
    console.log('=== CARREGANDO ITENS DO CARRINHO ===');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCart = document.getElementById('empty-cart');
    const cartContent = document.querySelector('.cart-content');
    
    console.log('Carrinho atual:', cart);
    
    if (cart.length === 0) {
        if (cartContent) cartContent.style.display = 'none';
        if (emptyCart) emptyCart.style.display = 'block';
        updateCartSummary();
        return;
    }
    
    if (cartContent) cartContent.style.display = 'flex';
    if (emptyCart) emptyCart.style.display = 'none';
    
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = '';
    }
    
    // Carregar dados completos dos produtos
    for (const item of cart) {
        console.log(`\n--- Processando item ${item.id} ---`);
        console.log('Dados originais do item:', item);
        
        try {
            // Tentar carregar produto de todas as fontes possíveis
            let product = await findProductById(item.id);
            
            if (product) {
                // Atualizar dados do item com informações do produto
                const oldPrice = item.price;
                item.title = product.title || item.title;
                item.price = parseFloat(product.price) || 0;
                item.image = product.image || item.image;
                item.stock = product.stock || item.stock;
                item.description = product.description || item.description;
                item.brand = product.brand || item.brand;
                
                console.log(`✅ Produto ${item.id} atualizado:`, {
                    title: item.title,
                    price: item.price,
                    oldPrice: oldPrice,
                    image: item.image
                });
            } else {
                console.warn('❌ Produto não encontrado:', item.id);
                // Manter dados originais do item, mas garantir que o preço seja numérico
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
        
        console.log(`Dados finais do item ${item.id}:`, {
            title: item.title,
            price: item.price,
            quantity: item.quantity
        });
        
        if (cartItemsContainer) {
            const cartItem = createCartItem(item);
            cartItemsContainer.appendChild(cartItem);
        }
    }
    
    // Salvar carrinho atualizado com preços corretos
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('Carrinho salvo com preços atualizados:', cart);
    
    // Atualizar resumo
    updateCartSummary();
}

// Função para encontrar produto por ID em todas as fontes possíveis
async function findProductById(productId) {
    console.log(`Procurando produto ${productId}...`);
    
    // 1. Tentar productsModule
    if (typeof productsModule !== 'undefined' && productsModule.getProductById) {
        try {
            console.log('Tentando productsModule...');
            const product = await productsModule.getProductById(productId);
            if (product) {
                console.log('✅ Produto encontrado no productsModule:', product);
                return product;
            }
        } catch (error) {
            console.log('Erro no productsModule:', error);
        }
    }
    
    // 2. Tentar database.js - getAllProducts
    if (typeof getAllProducts === 'function') {
        try {
            console.log('Tentando database.js - getAllProducts...');
            const allProducts = getAllProducts();
            const product = allProducts.find(p => p.id === productId);
            if (product) {
                console.log('✅ Produto encontrado no database.js:', product);
                return product;
            }
        } catch (error) {
            console.log('Erro no database.js - getAllProducts:', error);
        }
    }
    
    // 3. Tentar database.js - productsDatabase diretamente
    if (typeof productsDatabase !== 'undefined') {
        try {
            console.log('Tentando database.js - productsDatabase...');
            const allProducts = [];
            Object.values(productsDatabase).forEach(category => {
                if (Array.isArray(category)) {
                    allProducts.push(...category);
                }
            });
            const product = allProducts.find(p => p.id === productId);
            if (product) {
                console.log('✅ Produto encontrado no productsDatabase:', product);
                return product;
            }
        } catch (error) {
            console.log('Erro no productsDatabase:', error);
        }
    }
    
    // 4. Tentar API service
    if (typeof apiService !== 'undefined' && apiService.getProductById) {
        try {
            console.log('Tentando apiService...');
            const product = await apiService.getProductById(productId);
            if (product) {
                console.log('✅ Produto encontrado no apiService:', product);
                return product;
            }
        } catch (error) {
            console.log('Erro no apiService:', error);
        }
    }
    
    console.log('❌ Produto não encontrado em nenhuma fonte:', productId);
    return null;
}

// Criar item do carrinho
function createCartItem(item) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    
    const price = parseFloat(item.price) || 0;
    const quantity = parseInt(item.quantity) || 1;
    const total = price * quantity;
    
    cartItem.innerHTML = `
        <div class="item-image">
            <img src="${item.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center&auto=format&q=80'}" 
                 alt="${item.title || 'Produto'}" 
                 onerror="this.src='https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center&auto=format&q=80'">
        </div>
        <div class="item-details">
            <h3 class="item-title">${item.title || 'Produto'}</h3>
            <p class="item-description">${item.description || ''}</p>
            <div class="item-price">${formatPrice(price)}</div>
        </div>
        <div class="item-quantity">
            <button class="quantity-btn minus" data-id="${item.id}">
                <i class="fas fa-minus"></i>
            </button>
            <span class="quantity">${quantity}</span>
            <button class="quantity-btn plus" data-id="${item.id}">
                <i class="fas fa-plus"></i>
            </button>
        </div>
        <div class="item-total">
            ${formatPrice(total)}
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
    console.log(`Atualizando quantidade para ${productId}: ${change}`);
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(item => item.id === productId);
    
    if (!item) {
        console.error('Item não encontrado no carrinho:', productId);
        return;
    }
    
    const newQuantity = item.quantity + change;
    
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    item.quantity = newQuantity;
    localStorage.setItem('cart', JSON.stringify(cart));
    
    console.log('Quantidade atualizada:', item);
    
    // Recarregar itens
    loadCartItems();
    updateCartCounter();
}

// Remover do carrinho
function removeFromCart(productId) {
    console.log(`Removendo item ${productId} do carrinho`);
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const filteredCart = cart.filter(item => item.id !== productId);
    
    localStorage.setItem('cart', JSON.stringify(filteredCart));
    
    console.log('Item removido. Carrinho atual:', filteredCart);
    
    // Recarregar itens
    loadCartItems();
    updateCartCounter();
}

// Atualizar resumo do carrinho
function updateCartSummary() {
    console.log('=== ATUALIZANDO RESUMO DO CARRINHO ===');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log('Carrinho atual para cálculo:', cart);
    
    const itemsCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    console.log('Total de itens:', itemsCount);
    
    const subtotal = cart.reduce((total, item) => {
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity) || 1;
        const itemTotal = price * quantity;
        console.log(`Item ${item.id}: preço=${price}, qtd=${quantity}, total=${itemTotal}`);
        return total + itemTotal;
    }, 0);
    
    const shipping = subtotal > 99 ? 0 : 15; // Frete grátis acima de R$ 99
    const total = subtotal + shipping;
    
    console.log('Totais calculados:', { itemsCount, subtotal, shipping, total });
    
    // Atualizar contadores
    const itemsCountEl = document.getElementById('cart-items-count');
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const totalEl = document.getElementById('total');
    
    console.log('Elementos encontrados:', {
        itemsCountEl: !!itemsCountEl,
        subtotalEl: !!subtotalEl,
        shippingEl: !!shippingEl,
        totalEl: !!totalEl
    });
    
    if (itemsCountEl) {
        itemsCountEl.textContent = `${itemsCount} ${itemsCount === 1 ? 'item' : 'itens'}`;
        console.log('Contador de itens atualizado:', itemsCountEl.textContent);
    }
    
    if (subtotalEl) {
        subtotalEl.textContent = formatPrice(subtotal);
        console.log('Subtotal atualizado:', subtotalEl.textContent);
    }
    
    if (shippingEl) {
        shippingEl.textContent = formatPrice(shipping);
        console.log('Frete atualizado:', shippingEl.textContent);
    }
    
    if (totalEl) {
        totalEl.textContent = formatPrice(total);
        console.log('Total atualizado:', totalEl.textContent);
    }
    
    // Habilitar/desabilitar botão de checkout
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.disabled = itemsCount === 0;
        console.log('Botão checkout habilitado:', !checkoutBtn.disabled);
    }
    
    // Atualizar contador do header
    updateCartCounter();
    
    console.log('=== FIM ATUALIZAÇÃO RESUMO ===');
}

// Formatar preço
function formatPrice(price) {
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) {
        console.error('Preço inválido para formatação:', price);
        return 'R$ 0,00';
    }
    return numPrice.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

// Atualizar contador do carrinho (compatibilidade com main.js)
function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    
    const cartCounters = document.querySelectorAll('#cart-count, .cart-count, .cart-counter');
    cartCounters.forEach(counter => {
        counter.textContent = totalItems;
        counter.style.display = totalItems > 0 ? 'flex' : 'none';
    });
    
    console.log('Contador do carrinho atualizado:', totalItems);
}
