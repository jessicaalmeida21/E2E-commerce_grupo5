// Script para gerenciar o carrinho de compras - VERSÃO CORRIGIDA DEFINITIVA
console.log('=== INICIANDO CARRINHO CORRIGIDO DEFINITIVO ===');

// Funções para gerenciar carrinho específico por usuário
function getCurrentUserId() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser ? currentUser.id : 'guest';
}

function getUserCart() {
    const userId = getCurrentUserId();
    const cartKey = `cart_${userId}`;
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    
    // Limpar carrinho se o usuário mudou
    const lastUserId = localStorage.getItem('lastUserId');
    if (lastUserId && lastUserId !== userId) {
        console.log('Usuário mudou, limpando carrinho anterior');
        localStorage.removeItem(cartKey);
        localStorage.setItem('lastUserId', userId);
        return [];
    }
    
    localStorage.setItem('lastUserId', userId);
    return cart;
}

function saveUserCart(cart) {
    const userId = getCurrentUserId();
    const cartKey = `cart_${userId}`;
    localStorage.setItem(cartKey, JSON.stringify(cart));
    localStorage.setItem('lastUserId', userId);
    console.log(`Carrinho salvo para usuário ${userId}:`, cart);
}

function clearUserCart() {
    const userId = getCurrentUserId();
    const cartKey = `cart_${userId}`;
    localStorage.removeItem(cartKey);
    localStorage.setItem('lastUserId', userId);
    console.log(`Carrinho limpo para usuário ${userId}`);
}

function clearOtherUserCarts() {
    const currentUserId = getCurrentUserId();
    const allKeys = Object.keys(localStorage);
    
    allKeys.forEach(key => {
        if (key.startsWith('cart_') && key !== `cart_${currentUserId}`) {
            localStorage.removeItem(key);
            console.log(`Carrinho de outro usuário removido: ${key}`);
        }
    });
}

// Função para obter dados completos do produto
async function getProductData(productId) {
    console.log('Buscando dados completos para produto:', productId);
    
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
    
    console.log('❌ Produto não encontrado em nenhuma fonte:', productId);
    return null;
}

// Carregar itens do carrinho
async function loadCartItems() {
    console.log('=== CARREGANDO ITENS DO CARRINHO ===');
    
    const cart = getUserCart();
    console.log('Carrinho carregado:', cart);
    
    if (cart.length === 0) {
        console.log('Carrinho vazio');
        showEmptyCart();
        return;
    }
    
    // Carregar dados completos dos produtos
    const cartItems = [];
    for (const item of cart) {
        console.log(`\n--- Carregando produto ${item.id} ---`);
        console.log('Item do carrinho:', item);
        
        // Tentar obter dados completos do produto
        const productData = await getProductData(item.id);
        
        if (productData) {
            console.log('✅ Dados completos obtidos:', productData);
            
            // Usar dados do produto para garantir preço correto
            const completeItem = {
                ...item,
                title: productData.title || item.title,
                price: parseFloat(productData.price) || parseFloat(item.price) || 0,
                image: productData.image || item.image,
                description: productData.description || item.description,
                brand: productData.brand || item.brand,
                category: productData.category || item.category
            };
            
            console.log('✅ Item completo criado:', completeItem);
            cartItems.push(completeItem);
        } else {
            console.log('⚠️ Dados completos não encontrados, usando dados básicos');
            // Garantir que pelo menos o preço seja válido
            const fallbackItem = {
                ...item,
                price: parseFloat(item.price) || 0
            };
            cartItems.push(fallbackItem);
        }
    }
    
    console.log('✅ Todos os itens carregados:', cartItems);
    
    // Renderizar itens
    renderCartItems(cartItems);
    
    // Atualizar resumo
    updateCartSummary(cartItems);
}

// Renderizar itens do carrinho
function renderCartItems(items) {
    const container = document.getElementById('cart-items');
    if (!container) {
        console.error('Container de itens não encontrado');
        return;
    }
    
    container.innerHTML = '';
    
    items.forEach(item => {
        const cartItem = createCartItem(item);
        container.appendChild(cartItem);
    });
    
    // Atualizar contador de itens
    const itemCount = items.reduce((total, item) => total + (item.quantity || 1), 0);
    const itemCountElement = document.getElementById('item-count');
    if (itemCountElement) {
        itemCountElement.textContent = `${itemCount} ${itemCount === 1 ? 'item' : 'itens'}`;
    }
}

// Criar item do carrinho
function createCartItem(item) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    
    const price = parseFloat(item.price) || 0;
    const quantity = parseInt(item.quantity) || 1;
    const total = price * quantity;
    
    console.log(`Criando item: ${item.title} - Preço: R$ ${price}, Quantidade: ${quantity}, Total: R$ ${total}`);
    
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

// Mostrar carrinho vazio
function showEmptyCart() {
    const container = document.getElementById('cart-items');
    if (container) {
        container.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Seu carrinho está vazio</h3>
                <p>Que tal adicionar alguns produtos?</p>
                <a href="./catalog.html" class="btn btn-primary">Continuar Comprando</a>
            </div>
        `;
    }
    
    // Atualizar contador
    const itemCountElement = document.getElementById('item-count');
    if (itemCountElement) {
        itemCountElement.textContent = '0 itens';
    }
    
    // Zerar resumo
    updateCartSummary([]);
}

// Atualizar resumo do carrinho
function updateCartSummary(items) {
    console.log('=== ATUALIZANDO RESUMO DO CARRINHO ===');
    console.log('Itens para resumo:', items);
    
    let subtotal = 0;
    let validItems = 0;
    
    items.forEach((item, index) => {
        console.log(`\n--- Calculando item ${index} ---`);
        console.log('Dados do item:', item);
        
        // Garantir que os dados sejam válidos
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity) || 1;
        
        if (price > 0 && quantity > 0) {
            const itemTotal = price * quantity;
            subtotal += itemTotal;
            validItems++;
            
            console.log(`Item ${index} (${item.id}):`);
            console.log(`  - Preço: ${price}`);
            console.log(`  - Quantidade: ${quantity}`);
            console.log(`  - Total do item: ${itemTotal}`);
            console.log(`  - Subtotal acumulado: ${subtotal}`);
        } else {
            console.warn(`Item ${index} inválido - preço: ${price}, quantidade: ${quantity}`);
        }
    });
    
    if (validItems === 0) {
        console.warn('Nenhum item válido encontrado no carrinho');
        subtotal = 0;
    }
    
    const shipping = subtotal > 99 ? 0 : 15; // Frete grátis acima de R$ 99
    const total = subtotal + shipping;
    
    console.log('Totais calculados:', { 
        subtotal, 
        shipping, 
        total, 
        validItems,
        totalItems: items.length 
    });
    
    // Atualizar elementos
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const totalEl = document.getElementById('total');
    
    if (subtotalEl) {
        subtotalEl.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    }
    if (shippingEl) {
        shippingEl.textContent = `R$ ${shipping.toFixed(2).replace('.', ',')}`;
    }
    if (totalEl) {
        totalEl.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }
    
    console.log('✅ Resumo atualizado na interface');
}

// Atualizar contador do carrinho no header
function updateCartCounter() {
    console.log('=== ATUALIZANDO CONTADOR DO CARRINHO ===');
    
    const cart = getUserCart();
    const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    
    console.log('Total de itens no carrinho:', totalItems);
    
    // Atualizar todos os contadores encontrados
    const cartCounters = document.querySelectorAll('#cart-count, .cart-count, .cart-counter, .cart-badge');
    cartCounters.forEach(counter => {
        counter.textContent = totalItems;
        counter.style.display = totalItems > 0 ? 'flex' : 'none';
        console.log('Contador atualizado:', counter);
    });
    
    // Atualizar texto do botão do carrinho
    const cartButton = document.querySelector('.cart-button, #cart-button');
    if (cartButton) {
        const text = cartButton.querySelector('.cart-text');
        if (text) {
            text.textContent = totalItems > 0 ? `Carrinho (${totalItems})` : 'Carrinho';
        }
    }
    
    console.log('✅ Contador do carrinho atualizado');
}

// Atualizar quantidade
function updateQuantity(productId, newQuantity) {
    console.log(`=== ATUALIZANDO QUANTIDADE ===`);
    console.log('ProductId:', productId);
    console.log('Nova quantidade:', newQuantity);
    
    const cart = getUserCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
    if (newQuantity <= 0) {
            // Remover item se quantidade for 0 ou negativa
            const index = cart.indexOf(item);
            cart.splice(index, 1);
            console.log('Item removido do carrinho');
        } else {
            // Atualizar quantidade
            item.quantity = newQuantity;
            console.log('Quantidade atualizada:', item);
        }
        
        // Salvar carrinho atualizado
        saveUserCart(cart);
    
    // Recarregar itens
    loadCartItems();
        
        // Atualizar contador
    updateCartCounter();
        
        console.log('✅ Quantidade atualizada com sucesso');
    } else {
        console.error('Item não encontrado no carrinho:', productId);
    }
}

// Remover do carrinho
function removeFromCart(productId) {
    console.log(`=== REMOVENDO DO CARRINHO ===`);
    console.log('ProductId:', productId);
    
    const cart = getUserCart();
    const updatedCart = cart.filter(item => item.id !== productId);
    
    saveUserCart(updatedCart);
    
    // Recarregar itens
    loadCartItems();
    
    // Atualizar contador
    updateCartCounter();
    
    console.log('✅ Item removido do carrinho');
}

// Formatar preço
function formatPrice(price) {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
}

// Configurar event listeners
function setupEventListeners() {
    console.log('=== CONFIGURANDO EVENT LISTENERS ===');
    
    // Botões de quantidade
    document.addEventListener('click', function(e) {
        if (e.target.closest('.quantity-btn')) {
            const button = e.target.closest('.quantity-btn');
            const productId = button.getAttribute('data-id');
            const isPlus = button.classList.contains('plus');
            const quantitySpan = button.parentElement.querySelector('.quantity');
            const currentQuantity = parseInt(quantitySpan.textContent) || 1;
            
            const newQuantity = isPlus ? currentQuantity + 1 : Math.max(0, currentQuantity - 1);
            
            console.log(`Botão ${isPlus ? 'plus' : 'minus'} clicado para produto ${productId}`);
            console.log(`Quantidade atual: ${currentQuantity}, nova: ${newQuantity}`);
            
            updateQuantity(productId, newQuantity);
        }
        
        // Botão de remover
        if (e.target.closest('.remove-btn')) {
            const button = e.target.closest('.remove-btn');
            const productId = button.getAttribute('data-id');
            
            console.log(`Botão de remover clicado para produto ${productId}`);
            removeFromCart(productId);
        }
    });
    
    console.log('✅ Event listeners configurados');
}

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
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('savedEmail');
    
    // Limpar carrinho do usuário atual
    clearUserCart();
    
    // Redirecionar para página inicial
    window.location.href = '../index.html';
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== INICIANDO CARRINHO CORRIGIDO DEFINITIVO ===');
    clearOtherUserCarts();
    setupHeaderUserActions();
    loadCartItems();
    setupEventListeners();
});

// Exportar funções para uso global
window.getUserCart = getUserCart;
window.saveUserCart = saveUserCart;
window.updateCartCounter = updateCartCounter;
window.clearUserCart = clearUserCart;
window.clearOtherUserCarts = clearOtherUserCarts;

console.log('=== CARRINHO CORRIGIDO DEFINITIVO CARREGADO ===');