// Script para gerenciar o checkout - VERSÃO CORRIGIDA DEFINITIVA
console.log('=== INICIANDO CHECKOUT CORRIGIDO DEFINITIVO ===');

// Variáveis globais
let cartItems = [];
let currentStep = 1;
let currentUser = null;

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
    console.log('=== CARREGANDO ITENS DO CARRINHO NO CHECKOUT ===');
    
    const cart = getUserCart();
    console.log('Carrinho carregado:', cart);
    
    if (cart.length === 0) {
        console.log('Carrinho vazio - redirecionando para catálogo...');
        alert('Seu carrinho está vazio. Adicione produtos antes de finalizar a compra.');
        window.location.href = './catalog.html';
        return;
    }
    
    // Carregar dados completos dos produtos
    cartItems = [];
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
    
    // Exibir itens
    displayCartItems();
    
    // Calcular totais
    calculateTotals();
}

// Exibir itens do carrinho
function displayCartItems() {
    console.log('=== EXIBINDO ITENS DO CARRINHO ===');
    
    // Tentar encontrar o container de itens
    let cartItemsContainer = document.getElementById('cart-items') || 
                            document.querySelector('.cart-items') || 
                            document.querySelector('.items-container') ||
                            document.querySelector('.checkout-items');
    
    if (!cartItemsContainer) {
        console.error('Container de itens do carrinho não encontrado');
        console.log('Elementos disponíveis:', document.querySelectorAll('[id*="cart"], [class*="cart"], [id*="item"], [class*="item"]'));
        
        // Criar container se não existir
        const mainContent = document.querySelector('.main-content') || document.querySelector('.checkout-content') || document.body;
        if (mainContent) {
            cartItemsContainer = document.createElement('div');
            cartItemsContainer.id = 'cart-items';
            cartItemsContainer.className = 'cart-items';
            mainContent.appendChild(cartItemsContainer);
            console.log('✅ Container de itens criado automaticamente');
        } else {
            console.error('Não foi possível criar container de itens');
            return;
        }
    }
    
    cartItemsContainer.innerHTML = '';
    
    cartItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'checkout-item';
        
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity) || 1;
        const total = price * quantity;
        
        console.log(`Exibindo item: ${item.title} - Preço: R$ ${price}, Quantidade: ${quantity}, Total: R$ ${total}`);
        
        itemElement.innerHTML = `
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
                <span class="quantity">Qtd: ${quantity}</span>
            </div>
            <div class="item-total">
                ${formatPrice(total)}
            </div>
        `;
        
        cartItemsContainer.appendChild(itemElement);
    });
    
    console.log('✅ Itens exibidos no checkout');
}

// Calcular totais
function calculateTotals() {
    console.log('=== CALCULANDO TOTAIS NO CHECKOUT ===');
    console.log('Itens do carrinho para cálculo:', cartItems);
    console.log('Tipo de cartItems:', typeof cartItems);
    console.log('É array?', Array.isArray(cartItems));
    
    if (!cartItems || cartItems.length === 0) {
        console.log('Carrinho vazio, definindo totais como zero');
        updateTotalsDisplay(0, 0, 0);
        return { subtotal: 0, shipping: 0, total: 0 };
    }
    
    let subtotal = 0;
    let validItems = 0;
    
    cartItems.forEach((item, index) => {
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
        updateTotalsDisplay(0, 0, 0);
        return { subtotal: 0, shipping: 0, total: 0 };
    }
    
    const shipping = subtotal > 99 ? 0 : 15; // Frete grátis acima de R$ 99
    const total = subtotal + shipping;
    
    console.log('Totais calculados no checkout:', { 
        subtotal, 
        shipping, 
        total, 
        validItems,
        totalItems: cartItems.length 
    });
    
    // Atualizar elementos
    updateTotalsDisplay(subtotal, shipping, total);
    
    return { subtotal, shipping, total };
}

// Atualizar exibição dos totais
function updateTotalsDisplay(subtotal, shipping, total) {
    console.log('Atualizando exibição dos totais:', { subtotal, shipping, total });
    
    // Tentar encontrar elementos por ID primeiro
    let subtotalEl = document.getElementById('subtotal') || document.querySelector('.subtotal');
    let shippingEl = document.getElementById('shipping') || document.querySelector('.shipping') || document.querySelector('.frete');
    let totalEl = document.getElementById('total') || document.querySelector('.total');
    
    // Se não encontrar por ID, tentar por texto
    if (!subtotalEl) {
        const elements = document.querySelectorAll('*');
        for (let el of elements) {
            if (el.textContent && el.textContent.includes('Subtotal')) {
                subtotalEl = el.nextElementSibling || el.parentElement.querySelector('.value');
                break;
            }
        }
    }
    
    if (!shippingEl) {
        const elements = document.querySelectorAll('*');
        for (let el of elements) {
            if (el.textContent && el.textContent.includes('Frete')) {
                shippingEl = el.nextElementSibling || el.parentElement.querySelector('.value');
                break;
            }
        }
    }
    
    if (!totalEl) {
        const elements = document.querySelectorAll('*');
        for (let el of elements) {
            if (el.textContent && el.textContent.includes('Total')) {
                totalEl = el.nextElementSibling || el.parentElement.querySelector('.value');
                break;
            }
        }
    }
    
    // Atualizar elementos encontrados
    if (subtotalEl) {
        subtotalEl.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        console.log('Subtotal atualizado:', subtotalEl.textContent);
    } else {
        console.warn('Elemento de subtotal não encontrado');
    }
    
    if (shippingEl) {
        shippingEl.textContent = `R$ ${shipping.toFixed(2).replace('.', ',')}`;
        console.log('Frete atualizado:', shippingEl.textContent);
    } else {
        console.warn('Elemento de frete não encontrado');
    }
    
    if (totalEl) {
        totalEl.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
        console.log('Total atualizado:', totalEl.textContent);
    } else {
        console.warn('Elemento de total não encontrado');
    }
    
    console.log('=== FIM ATUALIZAÇÃO TOTAIS ===');
}

// Formatar preço
function formatPrice(price) {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
}

// Buscar CEP
async function searchCEP() {
    const cep = document.getElementById('cep').value.replace(/\D/g, '');
    
    if (cep.length !== 8) {
        alert('CEP deve ter 8 dígitos');
        return;
    }
    
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        
        if (data.erro) {
            alert('CEP não encontrado');
            return;
        }
        
        document.getElementById('street').value = data.logradouro;
        document.getElementById('neighborhood').value = data.bairro;
        document.getElementById('city').value = data.localidade;
        document.getElementById('state').value = data.uf;
        
        console.log('CEP encontrado:', data);
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        alert('Erro ao buscar CEP');
    }
}

// Alterar método de pagamento
function switchPaymentMethod(method) {
    console.log('=== ALTERANDO MÉTODO DE PAGAMENTO ===');
    console.log('Método selecionado:', method);
    
    // Remover classe active de todas as abas
    document.querySelectorAll('.payment-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Esconder todos os formulários
    document.querySelectorAll('.payment-form').forEach(form => {
        form.style.display = 'none';
    });
    
    // Ativar aba selecionada
    const selectedTab = document.querySelector(`[data-method="${method}"]`);
    if (selectedTab) {
        selectedTab.classList.add('active');
        console.log('Aba ativada:', selectedTab);
    }
    
    // Mostrar formulário correspondente
    const formId = method === 'pix' ? 'pix-form' : 'card-form';
    const formElement = document.getElementById(formId);
    if (formElement) {
        formElement.style.display = 'block';
        console.log('Formulário exibido:', formId);
    }
    
    // Carregar opções de parcelas se for cartão
    if (method === 'credit' || method === 'debit') {
        loadInstallmentOptions();
    }
    
    console.log('Método de pagamento alterado para:', method);
}

// Carregar opções de parcelas
function loadInstallmentOptions() {
    console.log('=== CARREGANDO OPÇÕES DE PARCELAS ===');
    
    const installmentsSelect = document.getElementById('installments');
    if (!installmentsSelect) {
        console.error('Elemento de parcelas não encontrado');
        return;
    }
    
    // Limpar opções existentes (exceto a primeira)
    while (installmentsSelect.children.length > 1) {
        installmentsSelect.removeChild(installmentsSelect.lastChild);
    }
    
    // Obter total do pedido
    const totalEl = document.getElementById('total');
    let total = 0;
    
    if (totalEl && totalEl.textContent) {
        const totalText = totalEl.textContent.replace(/[^\d,]/g, '');
        total = parseFloat(totalText.replace(',', '.')) || 0;
    }
    
    console.log('Total para parcelas:', total);
    
    if (total > 0) {
        // Definir número máximo de parcelas baseado no valor
        let maxInstallments = 12;
        if (total < 100) maxInstallments = 3;
        else if (total < 500) maxInstallments = 6;
        
        // Adicionar opções de parcelas
        for (let i = 1; i <= maxInstallments; i++) {
            const option = document.createElement('option');
            option.value = i;
            
            if (i === 1) {
                option.textContent = `1x de ${formatPrice(total)} à vista`;
            } else {
                const installmentValue = total / i;
                option.textContent = `${i}x de ${formatPrice(installmentValue)} sem juros`;
            }
            
            installmentsSelect.appendChild(option);
        }
        
        console.log(`${maxInstallments} opções de parcelas carregadas`);
    } else {
        console.log('Total zerado, não carregando parcelas');
    }
}
                
                // Criar pedido
async function createOrder() {
    console.log('=== CRIANDO PEDIDO ===');
    
    const totals = calculateTotals();
    
    if (totals.subtotal === 0) {
        alert('Não é possível finalizar um pedido sem itens válidos');
        return;
    }
    
    const order = {
        id: `ORDER-${Date.now()}`,
        userId: currentUser ? currentUser.id : 'guest',
        items: cartItems,
        totals: totals,
        shippingAddress: {
            fullName: document.getElementById('full-name').value,
            phone: document.getElementById('phone').value,
            cep: document.getElementById('cep').value,
            street: document.getElementById('street').value,
            number: document.getElementById('number').value,
            complement: document.getElementById('complement').value,
            neighborhood: document.getElementById('neighborhood').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value
        },
        paymentMethod: document.querySelector('.payment-tab.active')?.getAttribute('data-method') || 'credit',
        createdAt: new Date().toISOString()
    };
    
    console.log('Pedido criado:', order);
    
    // Salvar pedido no localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Limpar carrinho
    const userId = getCurrentUserId();
    const cartKey = `cart_${userId}`;
    localStorage.removeItem(cartKey);
    
    // Redirecionar para confirmação
    alert('Pedido realizado com sucesso!');
    window.location.href = './confirmation.html';
}

// Configurar event listeners
function setupEventListeners() {
    console.log('=== CONFIGURANDO EVENT LISTENERS DO CHECKOUT ===');
    
    // Buscar CEP
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('blur', searchCEP);
    }
    
    // Métodos de pagamento
    document.querySelectorAll('.payment-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const method = tab.getAttribute('data-method');
            switchPaymentMethod(method);
        });
    });
    
    // Finalizar pedido
    const checkoutBtn = document.getElementById('checkout-btn') || document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', createOrder);
    }
    
    console.log('✅ Event listeners configurados');
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== INICIALIZANDO CHECKOUT CORRIGIDO DEFINITIVO ===');
    
    // Verificar usuário logado
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Carregar itens do carrinho
    loadCartItems();
    
    // Configurar event listeners
    setupEventListeners();
    
    console.log('=== CHECKOUT INICIALIZADO ===');
});

console.log('=== CHECKOUT CORRIGIDO DEFINITIVO CARREGADO ===');