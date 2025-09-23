// Script para gerenciar o checkout
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se há itens no carrinho
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert('Seu carrinho está vazio. Adicione produtos antes de finalizar a compra.');
        window.location.href = 'cart.html';
        return;
    }

    // Inicializar checkout
    initializeCheckout();
    loadOrderSummary();
    setupEventListeners();
});

let currentStep = 1;
let orderData = {
    items: [],
    address: {},
    payment: {}
};

// Inicializar checkout
function initializeCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    orderData.items = cart;
    
    // Calcular totais
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal >= 399 ? 0 : 100;
    const total = subtotal + shipping;
    
    // Atualizar resumo
    document.getElementById('subtotal').textContent = formatPrice(subtotal);
    document.getElementById('shipping').textContent = formatPrice(shipping);
    document.getElementById('total').textContent = formatPrice(total);
    
    // Carregar opções de parcelamento
    loadInstallmentOptions(total);
}

// Carregar resumo do pedido
function loadOrderSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const container = document.getElementById('order-items');
    
    container.innerHTML = '';
    
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'order-item';
        itemElement.innerHTML = `
            <div class="item-image">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="item-details">
                <h4>${item.title}</h4>
                <div class="item-quantity">Qtd: ${item.quantity}</div>
                <div class="item-price">${formatPrice(item.price * item.quantity)}</div>
            </div>
        `;
        container.appendChild(itemElement);
    });
}

// Carregar opções de parcelamento
async function loadInstallmentOptions(amount) {
    try {
        const quote = await paymentManager.getQuote(amount);
        const container = document.getElementById('installment-options');
        
        container.innerHTML = '';
        
        quote.installments.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.className = 'installment-option';
            optionElement.innerHTML = `
                <label>
                    <input type="radio" name="installments" value="${option.installments}" 
                           ${option.installments === 1 ? 'checked' : ''}>
                    <div class="installment-info">
                        <span class="installments">${option.installments}x de ${formatPrice(option.installment_amount)}</span>
                        <span class="total">Total: ${formatPrice(option.total_with_interest)}</span>
                        ${option.total_interest > 0 ? `<span class="interest">Juros: ${formatPrice(option.total_interest)}</span>` : ''}
                    </div>
                </label>
            `;
            container.appendChild(optionElement);
        });
    } catch (error) {
        console.error('Erro ao carregar opções de parcelamento:', error);
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Buscar CEP
    document.getElementById('search-cep').addEventListener('click', searchCEP);
    document.getElementById('cep').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') searchCEP();
    });
    
    // Formatação do CEP
    document.getElementById('cep').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 5) {
            value = value.substring(0, 5) + '-' + value.substring(5, 8);
        }
        e.target.value = value;
    });
    
    // Formatação do cartão
    document.getElementById('card-number').addEventListener('input', formatCardNumber);
    document.getElementById('card-expiry').addEventListener('input', formatCardExpiry);
    document.getElementById('card-cvv').addEventListener('input', formatCardCVV);
    
    // Formatação CPF/CNPJ
    document.getElementById('payer-cpf').addEventListener('input', formatCPF);
    document.getElementById('payer-cnpj').addEventListener('input', formatCNPJ);
    
    // Navegação entre passos
    document.getElementById('continue-to-payment').addEventListener('click', goToPayment);
    document.getElementById('back-to-address').addEventListener('click', goToAddress);
    document.getElementById('process-payment').addEventListener('click', processPayment);
    
    // Tabs de pagamento
    document.querySelectorAll('.payment-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            switchPaymentMethod(this.dataset.method);
        });
    });
    
    // Copiar chave PIX
    document.getElementById('copy-pix-key').addEventListener('click', copyPixKey);
}

// Buscar CEP
async function searchCEP() {
    const cep = document.getElementById('cep').value.replace(/\D/g, '');
    
    if (cep.length !== 8) {
        alert('CEP deve ter 8 dígitos');
        return;
    }
    
    try {
        // Simulação de busca de CEP
        const address = await mockCepSearch(cep);
        
        document.getElementById('street').value = address.street;
        document.getElementById('neighborhood').value = address.neighborhood;
        document.getElementById('city').value = address.city;
        document.getElementById('state').value = address.state;
        
        // Habilitar campos
        document.getElementById('number').disabled = false;
        document.getElementById('complement').disabled = false;
        
    } catch (error) {
        alert('CEP não encontrado');
    }
}

// Simular busca de CEP
async function mockCepSearch(cep) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulação de endereços
            const mockAddresses = {
                '01310100': {
                    street: 'Avenida Paulista',
                    neighborhood: 'Bela Vista',
                    city: 'São Paulo',
                    state: 'SP'
                },
                '20040020': {
                    street: 'Rua Primeiro de Março',
                    neighborhood: 'Centro',
                    city: 'Rio de Janeiro',
                    state: 'RJ'
                },
                '40070110': {
                    street: 'Rua Chile',
                    neighborhood: 'Centro',
                    city: 'Salvador',
                    state: 'BA'
                }
            };
            
            if (mockAddresses[cep]) {
                resolve(mockAddresses[cep]);
            } else {
                reject(new Error('CEP não encontrado'));
            }
        }, 1000);
    });
}

// Ir para pagamento
function goToPayment() {
    // Validar endereço
    if (!validateAddress()) return;
    
    // Salvar endereço
    orderData.address = {
        cep: document.getElementById('cep').value,
        street: document.getElementById('street').value,
        number: document.getElementById('number').value,
        complement: document.getElementById('complement').value,
        neighborhood: document.getElementById('neighborhood').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        type: document.querySelector('input[name="address-type"]:checked').value
    };
    
    // Atualizar progresso
    updateProgress(2);
    showStep('step-payment');
}

// Voltar para endereço
function goToAddress() {
    updateProgress(1);
    showStep('step-address');
}

// Processar pagamento
async function processPayment() {
    const paymentMethod = document.querySelector('.payment-tab.active').dataset.method;
    
    try {
        if (paymentMethod === 'card') {
            await processCardPayment();
        } else if (paymentMethod === 'pix') {
            await processPixPayment();
        }
    } catch (error) {
        alert('Erro no pagamento: ' + error.message);
    }
}

// Processar pagamento com cartão
async function processCardPayment() {
    const cardData = {
        pan: document.getElementById('card-number').value,
        cvv: document.getElementById('card-cvv').value,
        expiry: document.getElementById('card-expiry').value,
        cardholderName: document.getElementById('card-holder').value
    };
    
    const installments = parseInt(document.querySelector('input[name="installments"]:checked').value);
    
    // Validar dados
    paymentManager.validateCardData(cardData);
    
    // Processar pagamento
    const result = await paymentManager.processCardPayment(null, cardData, installments);
    
    if (result.success) {
        // Criar pedido
        const order = orderManager.createOrder(orderData.items, orderData.address, {
            method: 'card',
            installments: installments,
            maskedCard: paymentManager.maskCardNumber(cardData.pan)
        });
        
        // Limpar carrinho
        localStorage.removeItem('cart');
        
        // Mostrar confirmação
        showConfirmation(order);
    }
}

// Processar pagamento PIX
async function processPixPayment() {
    const payerData = {
        cpf: document.getElementById('payer-cpf').value,
        cnpj: document.getElementById('payer-cnpj').value
    };
    
    // Validar dados
    if (!paymentManager.validatePixPayer(payerData)) {
        throw new Error('CPF ou CNPJ inválido');
    }
    
    // Gerar PIX
    const subtotal = orderData.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal >= 399 ? 0 : 100;
    const total = subtotal + shipping;
    
    const pixData = await paymentManager.processPixPayment(null, payerData);
    
    // Mostrar dados PIX
    document.getElementById('pix-qr-code').src = pixData.qr_code;
    document.getElementById('pix-key-value').textContent = pixData.pix_key;
    document.getElementById('pix-data').style.display = 'block';
    
    // Iniciar timer
    startPixTimer(pixData.expires_at);
    
    // Monitorar status
    monitorPixStatus(pixData.txid, total);
}

// Monitorar status PIX
async function monitorPixStatus(txid, total) {
    const interval = setInterval(async () => {
        try {
            const status = await paymentManager.checkPixStatus(txid);
            
            if (status.status === 'PAID') {
                clearInterval(interval);
                
                // Criar pedido
                const order = orderManager.createOrder(orderData.items, orderData.address, {
                    method: 'pix',
                    txid: txid
                });
                
                // Limpar carrinho
                localStorage.removeItem('cart');
                
                // Mostrar confirmação
                showConfirmation(order);
            } else if (status.status === 'EXPIRED') {
                clearInterval(interval);
                alert('PIX expirado. Tente novamente.');
            }
        } catch (error) {
            console.error('Erro ao verificar status PIX:', error);
        }
    }, 10000); // Verificar a cada 10 segundos
}

// Iniciar timer PIX
function startPixTimer(expiresAt) {
    const timerElement = document.getElementById('pix-timer');
    const expiryTime = new Date(expiresAt).getTime();
    
    const interval = setInterval(() => {
        const now = new Date().getTime();
        const timeLeft = expiryTime - now;
        
        if (timeLeft <= 0) {
            clearInterval(interval);
            timerElement.textContent = '00:00';
            return;
        }
        
        const minutes = Math.floor(timeLeft / 60000);
        const seconds = Math.floor((timeLeft % 60000) / 1000);
        
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

// Mostrar confirmação
function showConfirmation(order) {
    updateProgress(4);
    showStep('step-confirmation');
    
    document.getElementById('order-number').textContent = order.id;
    document.getElementById('order-total').textContent = formatPrice(order.total);
    document.getElementById('order-status').textContent = order.status;
}

// Validar endereço
function validateAddress() {
    const requiredFields = ['cep', 'street', 'number', 'neighborhood', 'city', 'state'];
    
    for (const field of requiredFields) {
        const element = document.getElementById(field);
        if (!element.value.trim()) {
            alert(`Campo ${element.previousElementSibling.textContent} é obrigatório`);
            element.focus();
            return false;
        }
    }
    
    return true;
}

// Alternar método de pagamento
function switchPaymentMethod(method) {
    // Atualizar tabs
    document.querySelectorAll('.payment-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-method="${method}"]`).classList.add('active');
    
    // Atualizar conteúdo
    document.querySelectorAll('.payment-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${method}-payment`).classList.add('active');
}

// Atualizar progresso
function updateProgress(step) {
    document.querySelectorAll('.step').forEach((stepEl, index) => {
        if (index < step) {
            stepEl.classList.add('completed');
        } else {
            stepEl.classList.remove('completed');
        }
        
        if (index === step - 1) {
            stepEl.classList.add('active');
        } else {
            stepEl.classList.remove('active');
        }
    });
}

// Mostrar passo
function showStep(stepId) {
    document.querySelectorAll('.checkout-step').forEach(step => {
        step.classList.remove('active');
    });
    document.getElementById(stepId).classList.add('active');
}

// Formatação de campos
function formatCardNumber(e) {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    e.target.value = value;
}

function formatCardExpiry(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    e.target.value = value;
}

function formatCardCVV(e) {
    e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
}

function formatCPF(e) {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    e.target.value = value;
}

function formatCNPJ(e) {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    e.target.value = value;
}

// Copiar chave PIX
function copyPixKey() {
    const keyElement = document.getElementById('pix-key-value');
    navigator.clipboard.writeText(keyElement.textContent).then(() => {
        alert('Chave PIX copiada!');
    });
}

// Formatar preço
function formatPrice(price) {
    return price.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}
