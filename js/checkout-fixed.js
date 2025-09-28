// Script para gerenciar o checkout - VERSÃO CORRIGIDA
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== INICIANDO CHECKOUT CORRIGIDO ===');
    
    checkUserPermissions();
    setupEventListeners();
    setupHeader();
    loadQuote();
    
    // Aguardar um pouco para garantir que os módulos sejam carregados
    setTimeout(() => {
        loadCartItems();
    }, 500);
});

// Verificar permissões do usuário
function checkUserPermissions() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = './login.html';
        return;
    }
    
    console.log('Usuário logado:', currentUser.name);
}

// Carregar itens do carrinho
async function loadCartItems() {
    console.log('=== CARREGANDO ITENS DO CARRINHO NO CHECKOUT ===');
    cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    
    console.log('Carrinho atual no checkout:', cartItems);
    
    if (cartItems.length === 0) {
        alert('Seu carrinho está vazio.');
        window.location.href = './catalog.html';
        return;
    }
    
    // Carregar dados completos dos produtos
    for (const item of cartItems) {
        console.log(`\n--- Processando item ${item.id} no checkout ---`);
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
                
                console.log(`✅ Produto ${item.id} atualizado no checkout:`, {
                    title: item.title,
                    price: item.price,
                    oldPrice: oldPrice,
                    brand: item.brand
                });
            } else {
                console.warn('❌ Produto não encontrado no checkout:', item.id);
                // Garantir que o preço seja numérico
                item.price = parseFloat(item.price) || 0;
                item.brand = item.brand || 'Marca';
                console.log(`Mantendo dados originais para ${item.id} no checkout:`, {
                    title: item.title,
                    price: item.price,
                    brand: item.brand
                });
            }
        } catch (error) {
            console.error('Erro ao carregar produto no checkout:', error);
            // Garantir que o preço seja numérico
            item.price = parseFloat(item.price) || 0;
            item.brand = item.brand || 'Marca';
        }
        
        console.log(`Dados finais do item ${item.id} no checkout:`, {
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            brand: item.brand
        });
    }
    
    console.log('=== EXIBINDO ITENS E CALCULANDO TOTAIS ===');
    displayCartItems();
    calculateTotals();
}

// Função para encontrar produto por ID em todas as fontes possíveis
async function findProductById(productId) {
    console.log(`Procurando produto ${productId} no checkout...`);
    
    // 1. Tentar productsModule
    if (typeof productsModule !== 'undefined' && productsModule.getProductById) {
        try {
            console.log('Tentando productsModule no checkout...');
            const product = await productsModule.getProductById(productId);
            if (product) {
                console.log('✅ Produto encontrado no productsModule (checkout):', product);
                return product;
            }
        } catch (error) {
            console.log('Erro no productsModule (checkout):', error);
        }
    }
    
    // 2. Tentar database.js - getAllProducts
    if (typeof getAllProducts === 'function') {
        try {
            console.log('Tentando database.js - getAllProducts no checkout...');
            const allProducts = getAllProducts();
            const product = allProducts.find(p => p.id === productId);
            if (product) {
                console.log('✅ Produto encontrado no database.js (checkout):', product);
                return product;
            }
        } catch (error) {
            console.log('Erro no database.js - getAllProducts (checkout):', error);
        }
    }
    
    // 3. Tentar database.js - productsDatabase diretamente
    if (typeof productsDatabase !== 'undefined') {
        try {
            console.log('Tentando database.js - productsDatabase no checkout...');
            const allProducts = [];
            Object.values(productsDatabase).forEach(category => {
                if (Array.isArray(category)) {
                    allProducts.push(...category);
                }
            });
            const product = allProducts.find(p => p.id === productId);
            if (product) {
                console.log('✅ Produto encontrado no productsDatabase (checkout):', product);
                return product;
            }
        } catch (error) {
            console.log('Erro no productsDatabase (checkout):', error);
        }
    }
    
    // 4. Tentar API service
    if (typeof apiService !== 'undefined' && apiService.getProductById) {
        try {
            console.log('Tentando apiService no checkout...');
            const product = await apiService.getProductById(productId);
            if (product) {
                console.log('✅ Produto encontrado no apiService (checkout):', product);
                return product;
            }
        } catch (error) {
            console.log('Erro no apiService (checkout):', error);
        }
    }
    
    console.log('❌ Produto não encontrado em nenhuma fonte (checkout):', productId);
    return null;
}

// Exibir itens do carrinho
function displayCartItems() {
    const summaryItems = document.getElementById('summary-items');
    if (!summaryItems) return;
    
    summaryItems.innerHTML = '';
    
    cartItems.forEach(item => {
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity) || 1;
        const itemTotal = price * quantity;
        
        console.log(`Exibindo item ${item.id}: preço=${price}, qtd=${quantity}, total=${itemTotal}`);
        
        const itemElement = document.createElement('div');
        itemElement.className = 'summary-item';
        itemElement.innerHTML = `
            <div class="summary-item-info">
                <div class="summary-item-name">${item.title || 'Produto'}</div>
                <div class="summary-item-details">Qtd: ${quantity} | ${item.brand || 'Marca'}</div>
            </div>
            <div class="summary-item-price">${formatPrice(itemTotal)}</div>
        `;
        
        summaryItems.appendChild(itemElement);
    });
}

// Calcular totais
function calculateTotals() {
    console.log('=== CALCULANDO TOTAIS NO CHECKOUT ===');
    
    const subtotal = cartItems.reduce((total, item) => {
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity) || 1;
        const itemTotal = price * quantity;
        console.log(`Item ${item.id}: preço=${price}, qtd=${quantity}, total=${itemTotal}`);
        return total + itemTotal;
    }, 0);
    
    const shipping = subtotal > 99 ? 0 : 15; // Frete grátis acima de R$ 99
    const total = subtotal + shipping;
    
    console.log('Totais calculados no checkout:', { subtotal, shipping, total });
    
    // Atualizar elementos
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const totalEl = document.getElementById('total');
    
    if (subtotalEl) {
        subtotalEl.textContent = formatPrice(subtotal);
        console.log('Subtotal atualizado no checkout:', subtotalEl.textContent);
    }
    
    if (shippingEl) {
        shippingEl.textContent = formatPrice(shipping);
        console.log('Frete atualizado no checkout:', shippingEl.textContent);
    }
    
    if (totalEl) {
        totalEl.textContent = formatPrice(total);
        console.log('Total atualizado no checkout:', totalEl.textContent);
    }
    
    return { subtotal, shipping, total };
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

// Configurar event listeners
function setupEventListeners() {
    // CEP
    const searchCepBtn = document.getElementById('search-cep');
    if (searchCepBtn) {
        searchCepBtn.addEventListener('click', searchCEP);
    }
    
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', formatCEP);
    }
    
    // Métodos de pagamento
    document.querySelectorAll('.payment-tab').forEach(tab => {
        tab.addEventListener('click', () => switchPaymentMethod(tab.dataset.method));
    });
    
    // Formatação de campos
    const cardNumberInput = document.getElementById('card-number');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', formatCardNumber);
    }
    
    const cardCvvInput = document.getElementById('card-cvv');
    if (cardCvvInput) {
        cardCvvInput.addEventListener('input', formatCVV);
    }
    
    const cardExpiryInput = document.getElementById('card-expiry');
    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', formatExpiry);
    }
    
    const pixCpfInput = document.getElementById('pix-cpf');
    if (pixCpfInput) {
        pixCpfInput.addEventListener('input', formatCPF);
    }
    
    // Parcelas
    const installmentsSelect = document.getElementById('installments');
    if (installmentsSelect) {
        installmentsSelect.addEventListener('change', updateInstallmentInfo);
    }
    
    // PIX
    const copyPixBtn = document.getElementById('copy-pix-key');
    if (copyPixBtn) {
        copyPixBtn.addEventListener('click', copyPixKey);
    }
    
    // Finalizar pedido
    const finalizeBtn = document.getElementById('finalize-order');
    if (finalizeBtn) {
        finalizeBtn.addEventListener('click', finalizeOrder);
    }
    
    // Modais
    const viewOrdersBtn = document.getElementById('view-orders');
    if (viewOrdersBtn) {
        viewOrdersBtn.addEventListener('click', () => {
            window.location.href = './orders.html';
        });
    }
    
    const continueShoppingBtn = document.getElementById('continue-shopping');
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', () => {
            window.location.href = './catalog.html';
        });
    }
}

// Configurar header
function setupHeader() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userNameEl = document.getElementById('user-name');
    const logoutBtn = document.getElementById('logout-btn');
    
    if (userNameEl && currentUser) {
        userNameEl.textContent = currentUser.name;
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}

// Função de logout
function logout() {
    console.log('Fazendo logout...');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('sessionStartTime');
    window.location.href = './login.html';
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
        
        document.getElementById('address').value = data.logradouro;
        document.getElementById('neighborhood').value = data.bairro;
        document.getElementById('city').value = data.localidade;
        document.getElementById('state').value = data.uf;
        
        console.log('CEP encontrado:', data);
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        alert('Erro ao buscar CEP');
    }
}

// Formatar CEP
function formatCEP(e) {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{5})(\d)/, '$1-$2');
    e.target.value = value;
}

// Formatar número do cartão
function formatCardNumber(e) {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    e.target.value = value;
}

// Formatar CVV
function formatCVV(e) {
    let value = e.target.value.replace(/\D/g, '');
    e.target.value = value.slice(0, 3);
}

// Formatar validade
function formatExpiry(e) {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{2})(\d)/, '$1/$2');
    e.target.value = value;
}

// Formatar CPF
function formatCPF(e) {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    e.target.value = value;
}

// Alternar método de pagamento
function switchPaymentMethod(method) {
    document.querySelectorAll('.payment-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.payment-content').forEach(content => {
        content.classList.remove('active');
    });
    
    document.querySelector(`[data-method="${method}"]`).classList.add('active');
    document.getElementById(`${method}-content`).classList.add('active');
    
    console.log('Método de pagamento alterado para:', method);
}

// Atualizar informações de parcelamento
function updateInstallmentInfo() {
    const installments = document.getElementById('installments').value;
    const installmentInfo = document.getElementById('installment-info');
    
    if (installments && installmentInfo) {
        const total = calculateTotals().total;
        const installmentValue = total / installments;
        
        installmentInfo.innerHTML = `
            <p>${installments}x de ${formatPrice(installmentValue)} sem juros</p>
        `;
    }
}

// Copiar chave PIX
function copyPixKey() {
    const pixKey = 'pix@e2ecommerce.com.br';
    navigator.clipboard.writeText(pixKey).then(() => {
        alert('Chave PIX copiada!');
    });
}

// Finalizar pedido
function finalizeOrder() {
    console.log('=== FINALIZANDO PEDIDO ===');
    
    const order = createOrder();
    
    if (order) {
        // Salvar pedido
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Limpar carrinho
        localStorage.removeItem('cart');
        
        // Mostrar confirmação
        showOrderConfirmation(order);
        
        console.log('Pedido finalizado:', order);
    }
}

// Criar pedido
function createOrder() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const totals = calculateTotals();
    
    if (!currentUser) {
        alert('Usuário não encontrado');
        return null;
    }
    
    const order = {
        id: 'ORDER-' + Date.now(),
        userId: currentUser.id,
        userName: currentUser.name,
        items: cartItems.map(item => ({
            id: item.id,
            title: item.title,
            price: parseFloat(item.price) || 0,
            quantity: parseInt(item.quantity) || 1,
            brand: item.brand || 'Marca'
        })),
        totals: {
            subtotal: totals.subtotal,
            shipping: totals.shipping,
            total: totals.total
        },
        status: 'pending',
        createdAt: new Date().toISOString(),
        shippingAddress: {
            cep: document.getElementById('cep').value,
            address: document.getElementById('address').value,
            number: document.getElementById('number').value,
            neighborhood: document.getElementById('neighborhood').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value
        },
        paymentMethod: getSelectedPaymentMethod()
    };
    
    return order;
}

// Obter método de pagamento selecionado
function getSelectedPaymentMethod() {
    const activeTab = document.querySelector('.payment-tab.active');
    return activeTab ? activeTab.dataset.method : 'credit';
}

// Mostrar confirmação do pedido
function showOrderConfirmation(order) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Pedido Realizado com Sucesso!</h2>
            <p>Número do pedido: <strong>${order.id}</strong></p>
            <p>Total: <strong>${formatPrice(order.totals ? order.totals.total : 0)}</strong></p>
            <p>Status: <strong>Pendente</strong></p>
            <div class="modal-actions">
                <button id="view-orders" class="btn primary">Ver Meus Pedidos</button>
                <button id="continue-shopping" class="btn secondary">Continuar Comprando</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Event listeners para os botões
    document.getElementById('view-orders').addEventListener('click', () => {
        window.location.href = './orders.html';
    });
    
    document.getElementById('continue-shopping').addEventListener('click', () => {
        window.location.href = './catalog.html';
    });
}

// Carregar cotação (placeholder)
function loadQuote() {
    console.log('Carregando cotação...');
    // Implementar lógica de cotação se necessário
}

// Variáveis globais
let cartItems = [];
