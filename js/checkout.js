// Script para gerenciar o checkout
document.addEventListener('DOMContentLoaded', function() {
    checkUserPermissions();
    loadCartItems();
    setupEventListeners();
    setupHeader();
    loadQuote();
});

let currentUser = null;
let cartItems = [];
let quoteData = null;
let selectedPaymentMethod = 'credit';
let pixTimer = null;

// Verificar permissões do usuário
function checkUserPermissions() {
    const currentUserData = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUserData) {
        alert('Você precisa estar logado para finalizar a compra.');
        window.location.href = './login.html';
        return;
    }
    
    currentUser = currentUserData;
}

// Configurar header
function setupHeader() {
    const userNameHeader = document.getElementById('user-name-header');
    const logoutBtn = document.getElementById('logout-btn-header');
    
    if (userNameHeader) {
        userNameHeader.textContent = currentUser.name;
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}

// Logout
function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('sessionTimeout');
    window.location.href = './login.html';
}

// Carregar itens do carrinho
async function loadCartItems() {
    cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cartItems.length === 0) {
        alert('Seu carrinho está vazio.');
        window.location.href = './catalog.html';
        return;
    }
    
    // Carregar dados completos dos produtos
    for (const item of cartItems) {
        try {
            let product = null;
            
            // Tentar carregar do productsModule primeiro
            try {
                if (typeof productsModule !== 'undefined') {
                    product = await productsModule.getProductById(item.id);
                }
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
                item.brand = product.brand || item.brand;
                console.log(`Produto ${item.id} atualizado no checkout:`, {
                    title: item.title,
                    price: item.price,
                    brand: item.brand
                });
            } else {
                console.warn('Produto não encontrado no checkout:', item.id);
                // Garantir que o preço seja numérico
                item.price = parseFloat(item.price) || 0;
                item.brand = item.brand || 'Marca';
            }
        } catch (error) {
            console.error('Erro ao carregar produto no checkout:', error);
            // Garantir que o preço seja numérico
            item.price = parseFloat(item.price) || 0;
            item.brand = item.brand || 'Marca';
        }
    }
    
    displayCartItems();
    calculateTotals();
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
        
        console.log(`Exibindo item ${item.id}:`, {
            title: item.title,
            price: price,
            quantity: quantity,
            total: itemTotal
        });
        
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
    const subtotal = cartItems.reduce((total, item) => {
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity) || 1;
        const itemTotal = price * quantity;
        console.log(`Item ${item.id}: preço=${price}, qtd=${quantity}, total=${itemTotal}`);
        return total + itemTotal;
    }, 0);
    
    console.log('Subtotal calculado:', subtotal);
    
    // Usar serviço de logística para calcular frete
    const shipping = window.logisticsService ? 
        window.logisticsService.calculateShipping(subtotal) : 
        (subtotal >= 399 ? 0 : 100);
    
    const total = subtotal + shipping;
    
    console.log('Totais finais:', { subtotal, shipping, total });
    
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const totalEl = document.getElementById('total');
    
    if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
    if (shippingEl) shippingEl.textContent = formatPrice(shipping);
    if (totalEl) totalEl.textContent = formatPrice(total);
    
    return { subtotal, shipping, total };
}

// Carregar cotação de parcelas
async function loadQuote() {
    const totals = calculateTotals();
    
    try {
        quoteData = await paymentService.getQuote(totals.total);
        displayInstallmentOptions();
    } catch (error) {
        console.error('Erro ao carregar cotação:', error);
    }
}

// Exibir opções de parcelamento
function displayInstallmentOptions() {
    const installmentsSelect = document.getElementById('installments');
    installmentsSelect.innerHTML = '<option value="">Selecione</option>';
    
    quoteData.installments.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.installments;
        
        if (option.installments === 1) {
            optionElement.textContent = `1x de ${formatPrice(option.installment_amount)} (à vista)`;
        } else {
            optionElement.textContent = `${option.installments}x de ${formatPrice(option.installment_amount)} (Total: ${formatPrice(option.total_with_interest)})`;
        }
        
        installmentsSelect.appendChild(optionElement);
    });
}

// Configurar event listeners
function setupEventListeners() {
    // CEP
    document.getElementById('search-cep').addEventListener('click', searchCEP);
    document.getElementById('cep').addEventListener('input', formatCEP);
    
    // Métodos de pagamento
    document.querySelectorAll('.payment-tab').forEach(tab => {
        tab.addEventListener('click', () => switchPaymentMethod(tab.dataset.method));
    });
    
    // Formatação de campos
    document.getElementById('card-number').addEventListener('input', formatCardNumber);
    document.getElementById('card-cvv').addEventListener('input', formatCVV);
    document.getElementById('card-expiry').addEventListener('input', formatExpiry);
    document.getElementById('pix-cpf').addEventListener('input', formatCPF);
    
    // Parcelas
    document.getElementById('installments').addEventListener('change', updateInstallmentInfo);
    
    // PIX
    document.getElementById('copy-pix-key').addEventListener('click', copyPixKey);
    
    // Finalizar pedido
    document.getElementById('finalize-order').addEventListener('click', finalizeOrder);
    
    // Modais
    document.getElementById('view-orders').addEventListener('click', () => {
        window.location.href = './orders.html';
    });
    
    document.getElementById('continue-shopping').addEventListener('click', () => {
        window.location.href = './catalog.html';
    });
}

// Buscar CEP
async function searchCEP() {
    const cep = document.getElementById('cep').value.replace(/\D/g, '');
    
    if (cep.length !== 8) {
        alert('CEP deve ter 8 dígitos');
        return;
    }
    
    try {
        // Simular busca de CEP (usando ViaCEP ou similar)
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
        
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        alert('Erro ao buscar CEP. Tente novamente.');
    }
}

// Formatar CEP
function formatCEP(e) {
    e.target.value = PaymentUtils.formatCEP(e.target.value);
}

// Formatar número do cartão
function formatCardNumber(e) {
    e.target.value = PaymentUtils.formatCardNumber(e.target.value);
}

// Formatar CVV
function formatCVV(e) {
    e.target.value = PaymentUtils.formatCVV(e.target.value);
}

// Formatar validade
function formatExpiry(e) {
    e.target.value = PaymentUtils.formatExpiry(e.target.value);
}

// Formatar CPF/CNPJ
function formatCPF(e) {
    e.target.value = PaymentUtils.formatCPF(e.target.value);
}

// Trocar método de pagamento
function switchPaymentMethod(method) {
    selectedPaymentMethod = method;
    
    // Atualizar tabs
    document.querySelectorAll('.payment-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-method="${method}"]`).classList.add('active');
    
    // Mostrar formulário correspondente
    document.getElementById('card-form').style.display = method === 'pix' ? 'none' : 'block';
    document.getElementById('pix-form').style.display = method === 'pix' ? 'block' : 'none';
    
    // Limpar campos
    if (method !== 'pix') {
        document.getElementById('installments').required = true;
    } else {
        document.getElementById('installments').required = false;
    }
}

// Atualizar informações de parcelamento
function updateInstallmentInfo() {
    const installments = parseInt(document.getElementById('installments').value);
    const installmentInfo = document.getElementById('installment-info');
    const installmentDetails = document.getElementById('installment-details');
    
    if (installments && quoteData) {
        const option = quoteData.installments.find(opt => opt.installments === installments);
        
        if (option) {
            installmentDetails.innerHTML = `
                <div class="installment-option selected">
                    <span>${installments}x de ${formatPrice(option.installment_amount)}</span>
                    <span>Total: ${formatPrice(option.total_with_interest)}</span>
                </div>
                ${option.total_interest > 0 ? `<p class="interest-info">Juros: ${formatPrice(option.total_interest)}</p>` : ''}
            `;
            installmentInfo.style.display = 'block';
        }
    } else {
        installmentInfo.style.display = 'none';
    }
}

// Copiar chave PIX
function copyPixKey() {
    const pixKey = document.getElementById('pix-key-value').textContent;
    navigator.clipboard.writeText(pixKey).then(() => {
        showNotification('Chave PIX copiada!', 'success');
    });
}

// Finalizar pedido
async function finalizeOrder() {
    if (!validateForm()) {
        return;
    }
    
    const totals = calculateTotals();
    const orderData = {
        items: cartItems,
        totals,
        address: getAddressData(),
        payment: getPaymentData()
    };
    
    try {
        showLoading(true);
        
        if (selectedPaymentMethod === 'pix') {
            await processPixPayment(orderData);
        } else {
            await processCardPayment(orderData);
        }
        
    } catch (error) {
        console.error('Erro ao processar pagamento:', error);
        showNotification(error.message || 'Erro ao processar pagamento', 'error');
    } finally {
        showLoading(false);
    }
}

// Validar formulário
function validateForm() {
    const requiredFields = ['cep', 'street', 'number', 'neighborhood', 'city', 'state'];
    
    for (const field of requiredFields) {
        const element = document.getElementById(field);
        if (!element.value.trim()) {
            showNotification(`Campo ${element.previousElementSibling.textContent} é obrigatório`, 'error');
            element.focus();
            return false;
        }
    }
    
    if (selectedPaymentMethod !== 'pix') {
        const cardFields = ['card-number', 'card-name', 'card-cvv', 'card-expiry', 'installments'];
        for (const field of cardFields) {
            const element = document.getElementById(field);
            if (!element.value.trim()) {
                showNotification(`Campo ${element.previousElementSibling.textContent} é obrigatório`, 'error');
                element.focus();
                return false;
            }
        }
    } else {
        const pixCpf = document.getElementById('pix-cpf').value;
        if (!PaymentUtils.validateCPF(pixCpf)) {
            showNotification('CPF/CNPJ inválido', 'error');
            return false;
        }
    }
    
    return true;
}

// Obter dados do endereço
function getAddressData() {
    return {
        type: document.getElementById('address-type').value,
        cep: document.getElementById('cep').value,
        street: document.getElementById('street').value,
        number: document.getElementById('number').value,
        complement: document.getElementById('complement').value,
        neighborhood: document.getElementById('neighborhood').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value
    };
}

// Obter dados do pagamento
function getPaymentData() {
    const totals = calculateTotals();
    const installments = parseInt(document.getElementById('installments').value) || 1;
    const option = quoteData.installments.find(opt => opt.installments === installments);
    
    return {
        method: selectedPaymentMethod,
        amount: option ? option.total_with_interest : totals.total,
        installments,
        card: selectedPaymentMethod !== 'pix' ? {
            number: document.getElementById('card-number').value,
            name: document.getElementById('card-name').value,
            cvv: document.getElementById('card-cvv').value,
            expiry: document.getElementById('card-expiry').value
        } : null,
        pix: selectedPaymentMethod === 'pix' ? {
            cpf: document.getElementById('pix-cpf').value
        } : null
    };
}

// Processar pagamento com cartão
async function processCardPayment(orderData) {
    const paymentData = {
        cardNumber: orderData.payment.card.number,
        cardName: orderData.payment.card.name,
        cvv: orderData.payment.card.cvv,
        expiry: orderData.payment.card.expiry,
        cardType: orderData.payment.method,
        amount: orderData.payment.amount,
        installments: orderData.payment.installments
    };
    
    const result = await paymentService.processCardPayment(paymentData);
    
    // Criar pedido
    const order = await createOrder(orderData, result);
    
    // Limpar carrinho
    localStorage.removeItem('cart');
    
    // Mostrar confirmação
    showOrderConfirmation(order);
}

// Processar pagamento PIX
async function processPixPayment(orderData) {
    const paymentData = {
        amount: orderData.payment.amount,
        cpf: orderData.payment.pix.cpf
    };
    
    const result = await paymentService.processPixPayment(paymentData);
    
    // Mostrar informações PIX
    showPixPayment(result);
    
    // Monitorar status
    monitorPixStatus(result.txid, orderData);
}

// Mostrar pagamento PIX
function showPixPayment(pixData) {
    document.getElementById('pix-key-value').textContent = pixData.pix_key;
    document.getElementById('pix-qr-container').innerHTML = `<img src="${pixData.qr_code}" alt="QR Code PIX">`;
    document.getElementById('pix-payment-info').style.display = 'block';
    
    // Iniciar timer
    startPixTimer();
}

// Iniciar timer PIX
function startPixTimer() {
    let timeLeft = 30 * 60; // 30 minutos em segundos
    
    pixTimer = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.getElementById('pix-timer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            clearInterval(pixTimer);
            showNotification('PIX expirado. Tente novamente.', 'error');
        }
        
        timeLeft--;
    }, 1000);
}

// Monitorar status PIX
async function monitorPixStatus(txid, orderData) {
    const checkStatus = async () => {
        try {
            const status = await paymentService.checkPixStatus(txid);
            
            if (status.status === 'PAID') {
                clearInterval(pixTimer);
                
                // Criar pedido
                const order = await createOrder(orderData, { transaction_id: txid, status: 'PAID' });
                
                // Limpar carrinho
                localStorage.removeItem('cart');
                
                // Mostrar confirmação
                showOrderConfirmation(order);
            } else if (status.status === 'EXPIRED') {
                clearInterval(pixTimer);
                showNotification('PIX expirado. Tente novamente.', 'error');
            }
        } catch (error) {
            console.error('Erro ao verificar status PIX:', error);
        }
    };
    
    // Verificar a cada 10 segundos
    const statusInterval = setInterval(checkStatus, 10000);
    
    // Parar após 30 minutos
    setTimeout(() => {
        clearInterval(statusInterval);
        clearInterval(pixTimer);
    }, 30 * 60 * 1000);
}

// Criar pedido
async function createOrder(orderData, paymentResult) {
    // Garantir que os totais sejam calculados corretamente
    const totals = calculateTotals();
    
    const order = {
        id: 'ORD_' + Date.now(),
        user_id: currentUser.id,
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
        address: orderData.address,
        payment: {
            ...orderData.payment,
            transaction_id: paymentResult.transaction_id,
            status: paymentResult.status
        },
        status: 'aguardando-pagamento',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };
    
    console.log('Pedido criado:', order);
    
    // Salvar pedido
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Inicializar logística se pagamento aprovado
    if (paymentResult.status === 'APPROVED' || paymentResult.status === 'PAID') {
        order.status = 'pago';
        if (window.logisticsService) {
            window.logisticsService.initializeLogistics(order.id);
        }
    }
    
    return order;
}

// Mostrar confirmação do pedido
function showOrderConfirmation(order) {
    const orderNumberEl = document.getElementById('order-number');
    const orderTotalEl = document.getElementById('order-total');
    const orderStatusEl = document.getElementById('order-status');
    
    if (orderNumberEl) orderNumberEl.textContent = order.id;
    if (orderTotalEl) {
        const total = order.totals ? order.totals.total : order.total || 0;
        orderTotalEl.textContent = formatPrice(total);
    }
    if (orderStatusEl) orderStatusEl.textContent = 'Aguardando Pagamento';
    
    const modal = document.getElementById('confirmation-modal');
    if (modal) modal.classList.add('show');
    
    console.log('Confirmação do pedido:', order);
}

// Mostrar loading
function showLoading(show) {
    const button = document.getElementById('finalize-order');
    if (show) {
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
    } else {
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-lock"></i> Finalizar Pedido';
    }
}

// Formatar preço
function formatPrice(price) {
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) {
        console.error('Preço inválido para formatação:', price);
        return 'R$ 0,00';
    }
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(numPrice);
}

// Mostrar notificação
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 1001;
        opacity: 0;
        transition: opacity 0.3s ease;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 100);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

        if (selectedPaymentMethod === 'pix') {

            await processPixPayment(orderData);

        } else {

            await processCardPayment(orderData);

        }

        

    } catch (error) {

        console.error('Erro ao processar pagamento:', error);

        showNotification(error.message || 'Erro ao processar pagamento', 'error');

    } finally {

        showLoading(false);

    }

}



// Validar formulário

function validateForm() {

    const requiredFields = ['cep', 'street', 'number', 'neighborhood', 'city', 'state'];

    

    for (const field of requiredFields) {

        const element = document.getElementById(field);

        if (!element.value.trim()) {

            showNotification(`Campo ${element.previousElementSibling.textContent} é obrigatório`, 'error');

            element.focus();

            return false;

        }

    }

    

    if (selectedPaymentMethod !== 'pix') {

        const cardFields = ['card-number', 'card-name', 'card-cvv', 'card-expiry', 'installments'];

        for (const field of cardFields) {

            const element = document.getElementById(field);

            if (!element.value.trim()) {

                showNotification(`Campo ${element.previousElementSibling.textContent} é obrigatório`, 'error');

                element.focus();

                return false;

            }

        }

    } else {

        const pixCpf = document.getElementById('pix-cpf').value;

        if (!PaymentUtils.validateCPF(pixCpf)) {

            showNotification('CPF/CNPJ inválido', 'error');

            return false;

        }

    }

    

    return true;

}



// Obter dados do endereço

function getAddressData() {

    return {

        type: document.getElementById('address-type').value,

        cep: document.getElementById('cep').value,

        street: document.getElementById('street').value,

        number: document.getElementById('number').value,

        complement: document.getElementById('complement').value,

        neighborhood: document.getElementById('neighborhood').value,

        city: document.getElementById('city').value,

        state: document.getElementById('state').value

    };

}



// Obter dados do pagamento

function getPaymentData() {

    const totals = calculateTotals();

    const installments = parseInt(document.getElementById('installments').value) || 1;

    const option = quoteData.installments.find(opt => opt.installments === installments);

    

    return {

        method: selectedPaymentMethod,

        amount: option ? option.total_with_interest : totals.total,

        installments,

        card: selectedPaymentMethod !== 'pix' ? {

            number: document.getElementById('card-number').value,

            name: document.getElementById('card-name').value,

            cvv: document.getElementById('card-cvv').value,

            expiry: document.getElementById('card-expiry').value

        } : null,

        pix: selectedPaymentMethod === 'pix' ? {

            cpf: document.getElementById('pix-cpf').value

        } : null

    };

}



// Processar pagamento com cartão

async function processCardPayment(orderData) {

    const paymentData = {

        cardNumber: orderData.payment.card.number,

        cardName: orderData.payment.card.name,

        cvv: orderData.payment.card.cvv,

        expiry: orderData.payment.card.expiry,

        cardType: orderData.payment.method,

        amount: orderData.payment.amount,

        installments: orderData.payment.installments

    };

    

    const result = await paymentService.processCardPayment(paymentData);

    

    // Criar pedido

    const order = await createOrder(orderData, result);

    

    // Limpar carrinho

    localStorage.removeItem('cart');

    

    // Mostrar confirmação

    showOrderConfirmation(order);

}



// Processar pagamento PIX

async function processPixPayment(orderData) {

    const paymentData = {

        amount: orderData.payment.amount,

        cpf: orderData.payment.pix.cpf

    };

    

    const result = await paymentService.processPixPayment(paymentData);

    

    // Mostrar informações PIX

    showPixPayment(result);

    

    // Monitorar status

    monitorPixStatus(result.txid, orderData);

}



// Mostrar pagamento PIX

function showPixPayment(pixData) {

    document.getElementById('pix-key-value').textContent = pixData.pix_key;

    document.getElementById('pix-qr-container').innerHTML = `<img src="${pixData.qr_code}" alt="QR Code PIX">`;

    document.getElementById('pix-payment-info').style.display = 'block';

    

    // Iniciar timer

    startPixTimer();

}



// Iniciar timer PIX

function startPixTimer() {

    let timeLeft = 30 * 60; // 30 minutos em segundos

    

    pixTimer = setInterval(() => {

        const minutes = Math.floor(timeLeft / 60);

        const seconds = timeLeft % 60;

        document.getElementById('pix-timer').textContent = 

            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        

        if (timeLeft <= 0) {

            clearInterval(pixTimer);

            showNotification('PIX expirado. Tente novamente.', 'error');

        }

        

        timeLeft--;

    }, 1000);

}



// Monitorar status PIX

async function monitorPixStatus(txid, orderData) {

    const checkStatus = async () => {

        try {

            const status = await paymentService.checkPixStatus(txid);

            

            if (status.status === 'PAID') {

                clearInterval(pixTimer);

                

                // Criar pedido

                const order = await createOrder(orderData, { transaction_id: txid, status: 'PAID' });

                

                // Limpar carrinho

                localStorage.removeItem('cart');

                

                // Mostrar confirmação

                showOrderConfirmation(order);

            } else if (status.status === 'EXPIRED') {

                clearInterval(pixTimer);

                showNotification('PIX expirado. Tente novamente.', 'error');

            }

        } catch (error) {

            console.error('Erro ao verificar status PIX:', error);

        }

    };

    

    // Verificar a cada 10 segundos

    const statusInterval = setInterval(checkStatus, 10000);

    

    // Parar após 30 minutos

    setTimeout(() => {

        clearInterval(statusInterval);

        clearInterval(pixTimer);

    }, 30 * 60 * 1000);

}



// Criar pedido

async function createOrder(orderData, paymentResult) {

    const order = {

        id: 'ORD_' + Date.now(),

        user_id: currentUser.id,

        items: orderData.items,

        totals: orderData.totals,

        address: orderData.address,

        payment: {

            ...orderData.payment,

            transaction_id: paymentResult.transaction_id,

            status: paymentResult.status

        },

        status: 'aguardando-pagamento',

        created_at: new Date().toISOString(),

        updated_at: new Date().toISOString()

    };

    

    // Salvar pedido

    const orders = JSON.parse(localStorage.getItem('orders')) || [];

    orders.push(order);

    localStorage.setItem('orders', JSON.stringify(orders));

    

    // Inicializar logística se pagamento aprovado

    if (paymentResult.status === 'APPROVED' || paymentResult.status === 'PAID') {

        order.status = 'pago';

        if (window.logisticsService) {

            window.logisticsService.initializeLogistics(order.id);

        }

    }

    

    return order;

}



// Mostrar confirmação do pedido

function showOrderConfirmation(order) {

    document.getElementById('order-number').textContent = order.id;

    document.getElementById('order-total').textContent = formatPrice(order.totals.total);

    document.getElementById('order-status').textContent = 'Aguardando Pagamento';

    

    document.getElementById('confirmation-modal').classList.add('show');

}



// Mostrar loading

function showLoading(show) {

    const button = document.getElementById('finalize-order');

    if (show) {

        button.disabled = true;

        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';

    } else {

        button.disabled = false;

        button.innerHTML = '<i class="fas fa-lock"></i> Finalizar Pedido';

    }

}



// Formatar preço (função duplicada removida)



// Mostrar notificação

function showNotification(message, type = 'info') {

    const notification = document.createElement('div');

    notification.className = `notification notification-${type}`;

    notification.innerHTML = `

        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>

        <span>${message}</span>

    `;

    

    notification.style.cssText = `

        position: fixed;

        top: 20px;

        right: 20px;

        padding: 15px 20px;

        border-radius: 5px;

        color: white;

        font-weight: bold;

        z-index: 1001;

        opacity: 0;

        transition: opacity 0.3s ease;

        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};

        box-shadow: 0 4px 12px rgba(0,0,0,0.15);

    `;

    

    document.body.appendChild(notification);

    

    setTimeout(() => {

        notification.style.opacity = '1';

    }, 100);

    

    setTimeout(() => {

        notification.style.opacity = '0';

        setTimeout(() => {

            if (notification.parentNode) {

                notification.parentNode.removeChild(notification);

            }

        }, 300);

    }, 4000);

}
