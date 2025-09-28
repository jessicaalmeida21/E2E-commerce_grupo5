// Script para gerenciar o checkout - VERSÃO CORRIGIDA DEFINITIVA

let cartItems = [];

document.addEventListener('DOMContentLoaded', function() {
    console.log('=== INICIANDO CHECKOUT CORRIGIDO DEFINITIVO ===');
    
    // Verificar se há usuário logado
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        console.log('Usuário não logado, redirecionando para login...');
        alert('Você precisa estar logado para finalizar a compra.');
        window.location.href = './login.html';
        return;
    }
    
    console.log('Usuário logado:', currentUser.name);
    
    // Carregar itens do carrinho
    loadCartItems();
    
    // Configurar event listeners
    setupEventListeners();
    
    // Carregar dados do usuário se disponível
    loadUserData();
    
    // Configurar busca de CEP
    setupCEPValidation();
    
    console.log('=== CHECKOUT INICIALIZADO ===');
});

// Função para obter carrinho do usuário atual
function getUserCart() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userId = currentUser ? currentUser.id : 'guest';
    const cartKey = `cart_${userId}`;
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    
    console.log(`Carregando carrinho do usuário ${userId}:`, cart);
    return cart;
}

// Função para salvar carrinho do usuário atual
function saveUserCart(cart) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userId = currentUser ? currentUser.id : 'guest';
    const cartKey = `cart_${userId}`;
    localStorage.setItem(cartKey, JSON.stringify(cart));
    console.log(`Carrinho salvo para usuário ${userId}:`, cart);
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
        console.log('Dados originais do item:', item);
        
        try {
            // Tentar carregar produto de todas as fontes possíveis
            let product = await findProductById(item.id);
            
            if (product) {
                // Atualizar dados do item com informações do produto
                const updatedItem = {
                    ...item,
                    title: product.title || item.title,
                    price: parseFloat(product.price) || 0,
                    image: product.image || item.image,
                    stock: product.stock || item.stock,
                    description: product.description || item.description,
                    brand: product.brand || item.brand
                };
                
                cartItems.push(updatedItem);
                console.log(`✅ Produto ${item.id} carregado:`, {
                    title: updatedItem.title,
                    price: updatedItem.price,
                    quantity: updatedItem.quantity
                });
            } else {
                console.warn('❌ Produto não encontrado:', item.id);
                // Manter dados originais, mas garantir que o preço seja numérico
                const fallbackItem = {
                    ...item,
                    price: parseFloat(item.price) || 0
                };
                cartItems.push(fallbackItem);
                console.log(`Usando dados originais para ${item.id}:`, fallbackItem);
            }
        } catch (error) {
            console.error('Erro ao carregar produto:', error);
            // Garantir que o preço seja numérico
            const fallbackItem = {
                ...item,
                price: parseFloat(item.price) || 0
            };
            cartItems.push(fallbackItem);
        }
    }
    
    console.log('Itens do carrinho carregados:', cartItems);
    
    // Atualizar carrinho salvo com preços corretos
    saveUserCart(cartItems);
    
    // Calcular totais
    calculateTotals();
    
    // Exibir itens
    displayCartItems();
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
    
    console.log('❌ Produto não encontrado em nenhuma fonte:', productId);
    return null;
}

// Exibir itens do carrinho
function displayCartItems() {
    console.log('=== EXIBINDO ITENS DO CARRINHO ===');
    const cartItemsContainer = document.getElementById('cart-items');
    
    if (!cartItemsContainer) {
        console.error('Container de itens do carrinho não encontrado');
        return;
    }
    
    cartItemsContainer.innerHTML = '';
    
    cartItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'checkout-item';
        
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity) || 1;
        const total = price * quantity;
        
        itemElement.innerHTML = `
            <div class="item-image">
                <img src="${item.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center&auto=format&q=80'}" 
                     alt="${item.title || 'Produto'}" 
                     onerror="this.src='https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center&auto=format&q=80'">
            </div>
            <div class="item-details">
                <h4 class="item-title">${item.title || 'Produto'}</h4>
                <p class="item-description">${item.description || ''}</p>
                <div class="item-price">${formatPrice(price)}</div>
                <div class="item-quantity">Qtd: ${quantity}</div>
            </div>
            <div class="item-total">
                ${formatPrice(total)}
            </div>
        `;
        
        cartItemsContainer.appendChild(itemElement);
    });
    
    console.log(`${cartItems.length} itens exibidos no checkout`);
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
    
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const totalEl = document.getElementById('total');
    
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
    
    // Carregar opções de parcelas se houver total
    if (total > 0) {
        loadInstallmentOptions();
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Busca de CEP
    const cepButton = document.getElementById('search-cep');
    if (cepButton) {
        cepButton.addEventListener('click', searchCEP);
    }
    
    // Métodos de pagamento
    const paymentTabs = document.querySelectorAll('.payment-tab');
    paymentTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const method = this.getAttribute('data-method');
            switchPaymentMethod(method);
        });
    });
    
    // Formulário de checkout
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckout);
    }
    
    // Validação de campos em tempo real
    const requiredFields = document.querySelectorAll('input[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', validateField);
    });
}

// Carregar dados do usuário
function loadUserData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        // Preencher campos se disponível
        const nameField = document.getElementById('full-name');
        if (nameField && currentUser.name) {
            nameField.value = currentUser.name;
        }
        
        const emailField = document.getElementById('email');
        if (emailField && currentUser.email) {
            emailField.value = currentUser.email;
        }
        
        console.log('Dados do usuário carregados');
    }
}

// Configurar validação de CEP
function setupCEPValidation() {
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 5) {
                value = value.substring(0, 5) + '-' + value.substring(5, 8);
            }
            e.target.value = value;
        });
    }
}

// Buscar CEP
async function searchCEP() {
    const cepInput = document.getElementById('cep');
    const cep = cepInput.value.replace(/\D/g, '');
    
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
        
        // Preencher campos
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

// Validar campo
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    if (field.hasAttribute('required') && !value) {
        field.classList.add('error');
        return false;
    }
    
    field.classList.remove('error');
    return true;
}

// Lidar com checkout
async function handleCheckout(e) {
    e.preventDefault();
    console.log('=== INICIANDO FINALIZAÇÃO DO PEDIDO ===');
    
    // Validar formulário
    if (!validateCheckoutForm()) {
        return;
    }
    
    // Obter dados do formulário
    const orderData = getOrderData();
    
    try {
        // Criar pedido
        const order = await createOrder(orderData);
        
        // Limpar carrinho
        clearCart();
        
        // Redirecionar para página de sucesso
        alert('Pedido realizado com sucesso!');
        window.location.href = './orders.html';
        
    } catch (error) {
        console.error('Erro ao finalizar pedido:', error);
        alert('Erro ao finalizar pedido. Tente novamente.');
    }
}

// Validar formulário de checkout
function validateCheckoutForm() {
    const requiredFields = document.querySelectorAll('input[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('error');
            isValid = false;
        } else {
            field.classList.remove('error');
        }
    });
    
    // Validar método de pagamento
    const selectedPaymentMethod = document.querySelector('.payment-tab.active');
    if (!selectedPaymentMethod) {
        alert('Selecione um método de pagamento');
        isValid = false;
    }
    
    return isValid;
}

// Obter dados do pedido
function getOrderData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const selectedPaymentMethod = document.querySelector('.payment-tab.active');
    const paymentMethod = selectedPaymentMethod ? selectedPaymentMethod.getAttribute('data-method') : '';
    
    return {
        id: Date.now().toString(),
        userId: currentUser.id,
        items: cartItems.map(item => ({
            id: item.id,
            title: item.title,
            price: parseFloat(item.price),
            quantity: parseInt(item.quantity),
            image: item.image
        })),
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
        paymentMethod: paymentMethod,
        subtotal: calculateTotals().subtotal,
        shipping: calculateTotals().shipping,
        total: calculateTotals().total,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
}

// Criar pedido
async function createOrder(orderData) {
    console.log('Criando pedido:', orderData);
    
    // Salvar pedido no localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    console.log('Pedido criado com sucesso:', orderData.id);
    return orderData;
}

// Limpar carrinho
function clearCart() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userId = currentUser ? currentUser.id : 'guest';
    const cartKey = `cart_${userId}`;
    
    localStorage.removeItem(cartKey);
    console.log('Carrinho limpo após finalização do pedido');
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