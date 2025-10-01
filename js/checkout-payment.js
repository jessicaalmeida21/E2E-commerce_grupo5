// Sistema de Pagamento no Checkout
class CheckoutPayment {
    constructor() {
        this.currentMethod = 'credit';
        this.currentQuote = null;
        this.pixTransaction = null;
        this.pixTimer = null;
        this.pixPolling = null;
        this.orderTotal = 0;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.loadOrderTotal();
        this.loadInstallmentOptions();
    }
    
    bindEvents() {
        // Tabs de método de pagamento
        document.querySelectorAll('.payment-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchPaymentMethod(e.target.dataset.method);
            });
        });
        
        // Validação de cartão em tempo real
        const cardNumber = document.getElementById('card-number');
        if (cardNumber) {
            cardNumber.addEventListener('input', (e) => {
                this.formatCardNumber(e.target);
                this.validateCard();
            });
        }
        
        const cardCvv = document.getElementById('card-cvv');
        if (cardCvv) {
            cardCvv.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3);
                this.validateCard();
            });
        }
        
        const cardExpiry = document.getElementById('card-expiry');
        if (cardExpiry) {
            cardExpiry.addEventListener('input', (e) => {
                this.formatExpiry(e.target);
                this.validateCard();
            });
        }
        
        const cardName = document.getElementById('card-name');
        if (cardName) {
            cardName.addEventListener('input', () => {
                this.validateCard();
            });
        }
        
        // Seleção de parcelas
        const installments = document.getElementById('installments');
        if (installments) {
            installments.addEventListener('change', (e) => {
                this.updateInstallmentInfo(parseInt(e.target.value));
            });
        }
        
        // PIX CPF/CNPJ
        const pixCpf = document.getElementById('pix-cpf');
        if (pixCpf) {
            pixCpf.addEventListener('input', (e) => {
                this.formatCpfCnpj(e.target);
            });
        }
        
        // Botões de ação
        const processPayment = document.getElementById('process-payment');
        if (processPayment) {
            processPayment.addEventListener('click', () => {
                this.processPayment();
            });
        }
        
        const copyPixKey = document.getElementById('copy-pix-key');
        if (copyPixKey) {
            copyPixKey.addEventListener('click', () => {
                this.copyPixKey();
            });
        }
        
        const simulatePix = document.getElementById('simulate-pix');
        if (simulatePix) {
            simulatePix.addEventListener('click', () => {
                this.simulatePixPayment();
            });
        }
    }
    
    loadOrderTotal() {
        // Carrega o total do pedido do localStorage ou calcula
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        let subtotal = 0;
        
        cart.forEach(item => {
            subtotal += item.price * item.quantity;
        });
        
        // Calcula frete (regra: grátis acima de R$ 399, senão R$ 100)
        const shipping = subtotal >= 399 ? 0 : 100;
        this.orderTotal = subtotal + shipping;
        
        // Atualiza interface
        document.getElementById('subtotal').textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        document.getElementById('shipping').textContent = shipping === 0 ? 'Grátis' : `R$ ${shipping.toFixed(2).replace('.', ',')}`;
        document.getElementById('total').textContent = `R$ ${this.orderTotal.toFixed(2).replace('.', ',')}`;
    }
    
    async loadInstallmentOptions() {
        try {
            if (this.orderTotal <= 0) {
                console.log('Total do pedido é zero, não carregando parcelas');
                return;
            }

            console.log('Carregando opções de parcelamento para:', this.orderTotal);
            
            const quote = await window.paymentService.getInstallmentQuote(this.orderTotal);
            
            if (quote && quote.success && quote.installment_options) {
                this.renderInstallmentTable(quote.installment_options);
                this.populateInstallmentSelect(quote.installment_options);
                this.currentQuote = quote;
            } else {
                console.error('Erro na cotação:', quote);
                this.showNotification('Erro ao carregar opções de parcelamento', 'error');
            }
        } catch (error) {
            console.error('Erro ao carregar opções de parcelamento:', error);
            this.showNotification('Erro ao carregar parcelamento', 'error');
        }
    }
    
    renderInstallmentTable(installments) {
        const container = document.getElementById('installments-options');
        const table = document.getElementById('installments-table');
        
        if (!container || !table) return;
        
        container.innerHTML = '';
        
        installments.forEach(installment => {
            const option = document.createElement('div');
            option.className = 'installment-option';
            option.dataset.installments = installment.installments;
            
            const isInterestFree = installment.installments === 1;
            const jurosClass = isInterestFree ? 'sem-juros' : '';
            
            option.innerHTML = `
                <div class="installment-cell parcelas">${installment.installments}x</div>
                <div class="installment-cell valor-parcela">R$ ${installment.installment_amount.toFixed(2).replace('.', ',')}</div>
                <div class="installment-cell total-com-juros">R$ ${installment.total_with_interest.toFixed(2).replace('.', ',')}</div>
                <div class="installment-cell total-juros ${jurosClass}">
                    ${isInterestFree ? 'Sem juros' : `R$ ${installment.total_interest.toFixed(2).replace('.', ',')}`}
                </div>
            `;
            
            option.addEventListener('click', () => {
                this.selectInstallment(installment.installments);
            });
            
            container.appendChild(option);
        });
        
        table.style.display = 'block';
    }
    
    populateInstallmentSelect(installments) {
        const select = document.getElementById('installments');
        if (!select) return;
        
        select.innerHTML = '<option value="">Selecione</option>';
        
        installments.forEach(installment => {
            const option = document.createElement('option');
            option.value = installment.installments;
            
            const isInterestFree = installment.installments === 1;
            const jurosText = isInterestFree ? ' (sem juros)' : ` (R$ ${installment.total_interest.toFixed(2).replace('.', ',')} de juros)`;
            
            option.textContent = `${installment.installments}x de R$ ${installment.installment_amount.toFixed(2).replace('.', ',')}${jurosText}`;
            
            select.appendChild(option);
        });
    }
    
    selectInstallment(installments) {
        // Remove seleção anterior
        document.querySelectorAll('.installment-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Seleciona nova opção
        const option = document.querySelector(`[data-installments="${installments}"]`);
        if (option) {
            option.classList.add('selected');
        }
        
        // Atualiza select
        const select = document.getElementById('installments');
        if (select) {
            select.value = installments;
        }
        
        this.updateInstallmentInfo(installments);
    }
    
    updateInstallmentInfo(installments) {
        const installmentInfo = document.getElementById('installment-info');
        const installmentDetails = document.getElementById('installment-details');
        
        if (!installmentInfo || !installmentDetails || !this.currentQuote) return;
        
        const selectedInstallment = this.currentQuote.installments.find(i => i.installments === installments);
        if (!selectedInstallment) {
            installmentInfo.style.display = 'none';
            return;
        }
        
        const isInterestFree = installments === 1;
        
        installmentDetails.innerHTML = `
            <div class="detail-line">
                <span>Parcelas:</span>
                <span>${installments}x</span>
            </div>
            <div class="detail-line">
                <span>Valor da parcela:</span>
                <span>R$ ${selectedInstallment.installment_amount.toFixed(2).replace('.', ',')}</span>
            </div>
            <div class="detail-line">
                <span>Total com juros:</span>
                <span>R$ ${selectedInstallment.total_with_interest.toFixed(2).replace('.', ',')}</span>
            </div>
            <div class="detail-line">
                <span>Juros:</span>
                <span>${isInterestFree ? 'Sem juros' : `R$ ${selectedInstallment.total_interest.toFixed(2).replace('.', ',')}`}</span>
            </div>
        `;
        
        installmentInfo.style.display = 'block';
    }
    
    switchPaymentMethod(method) {
        this.currentMethod = method;
        
        // Atualiza tabs
        document.querySelectorAll('.payment-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-method="${method}"]`).classList.add('active');
        
        // Mostra/esconde formulários
        document.getElementById('card-form').style.display = method === 'pix' ? 'none' : 'block';
        document.getElementById('pix-form').style.display = method === 'pix' ? 'block' : 'none';
        
        // Mostra/esconde tabela de parcelas
        const installmentsTable = document.getElementById('installments-table');
        if (installmentsTable) {
            installmentsTable.style.display = method === 'credit' ? 'block' : 'none';
        }
        
        // Limpa PIX se estava ativo
        if (method !== 'pix' && this.pixTransaction) {
            this.clearPixTransaction();
        }
        
        this.updateProcessButton();
    }
    
    formatCardNumber(input) {
        let value = input.value.replace(/\D/g, '');
        value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        input.value = value;
    }
    
    formatExpiry(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        input.value = value;
    }
    
    formatCpfCnpj(input) {
        let value = input.value.replace(/\D/g, '');
        
        if (value.length <= 11) {
            // CPF: 000.000.000-00
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        } else {
            // CNPJ: 00.000.000/0000-00
            value = value.replace(/^(\d{2})(\d)/, '$1.$2');
            value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
            value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
            value = value.replace(/(\d{4})(\d)/, '$1-$2');
        }
        
        input.value = value;
    }
    
    validateCard() {
        const cardNumber = document.getElementById('card-number').value.replace(/\D/g, '');
        const cardCvv = document.getElementById('card-cvv').value;
        const cardExpiry = document.getElementById('card-expiry').value;
        const cardName = document.getElementById('card-name').value.trim();
        const validationDiv = document.getElementById('card-validation');
        
        if (!validationDiv) return;
        
        let message = '';
        let className = '';
        
        if (cardNumber.length === 0) {
            message = '';
        } else if (cardNumber.length < 16) {
            message = 'Número do cartão incompleto';
            className = 'invalid';
        } else {
            const brand = this.getCardBrand(cardNumber);
            if (!brand) {
                message = 'Bandeira não suportada';
                className = 'invalid';
            } else {
                message = `Cartão ${brand} detectado`;
                className = 'valid';
                
                // Validações adicionais
                if (cardCvv.length !== 3) {
                    message = 'CVV deve ter 3 dígitos';
                    className = 'invalid';
                } else if (!this.isValidExpiry(cardExpiry)) {
                    message = 'Data de validade inválida';
                    className = 'invalid';
                } else if (cardName.length < 2) {
                    message = 'Nome no cartão é obrigatório';
                    className = 'invalid';
                }
            }
        }
        
        validationDiv.textContent = message;
        validationDiv.className = `card-validation-message ${className}`;
        
        this.updateProcessButton();
    }
    
    getCardBrand(cardNumber) {
        if (cardNumber.startsWith('4')) return 'VISA';
        if (cardNumber.startsWith('5')) return 'MASTERCARD';
        return null;
    }
    
    isValidExpiry(expiry) {
        if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
        
        const [month, year] = expiry.split('/').map(Number);
        if (month < 1 || month > 12) return false;
        
        const now = new Date();
        const currentYear = now.getFullYear() % 100;
        const currentMonth = now.getMonth() + 1;
        
        if (year < currentYear) return false;
        if (year === currentYear && month < currentMonth) return false;
        
        return true;
    }
    
    updateProcessButton() {
        const button = document.getElementById('process-payment');
        if (!button) return;
        
        let isValid = false;
        
        if (this.currentMethod === 'pix') {
            const pixCpf = document.getElementById('pix-cpf').value.replace(/\D/g, '');
            isValid = pixCpf.length === 11 || pixCpf.length === 14;
            
            if (this.pixTransaction) {
                button.textContent = 'Aguardando Pagamento PIX...';
                button.disabled = true;
                return;
            } else {
                button.textContent = 'Gerar PIX';
            }
        } else {
            const cardNumber = document.getElementById('card-number').value.replace(/\D/g, '');
            const cardCvv = document.getElementById('card-cvv').value;
            const cardExpiry = document.getElementById('card-expiry').value;
            const cardName = document.getElementById('card-name').value.trim();
            const installments = document.getElementById('installments').value;
            
            isValid = cardNumber.length === 16 && 
                     cardCvv.length === 3 && 
                     this.isValidExpiry(cardExpiry) && 
                     cardName.length >= 2 && 
                     installments;
            
            button.textContent = 'Finalizar Pagamento';
        }
        
        button.disabled = !isValid;
    }
    
    async processPayment() {
        const button = document.getElementById('process-payment');
        if (!button || button.disabled) return;
        
        button.disabled = true;
        button.classList.add('loading');
        
        try {
            if (this.currentMethod === 'pix') {
                await this.processPixPayment();
            } else {
                await this.processCardPayment();
            }
        } catch (error) {
            console.error('Erro no pagamento:', error);
            this.showError(error.message || 'Erro ao processar pagamento');
        } finally {
            button.disabled = false;
            button.classList.remove('loading');
        }
    }
    
    async processCardPayment() {
        const cardData = {
            pan: document.getElementById('card-number').value.replace(/\D/g, ''),
            cvv: document.getElementById('card-cvv').value,
            expiry_month: document.getElementById('card-expiry').value.split('/')[0],
            expiry_year: '20' + document.getElementById('card-expiry').value.split('/')[1],
            holder_name: document.getElementById('card-name').value.trim(),
            installments: parseInt(document.getElementById('installments').value)
        };
        
        const selectedInstallment = this.currentQuote.installments.find(i => i.installments === cardData.installments);
        if (!selectedInstallment) {
            throw new Error('Parcelamento selecionado inválido');
        }
        
        const paymentData = {
            amount: selectedInstallment.total_with_interest,
            installments: cardData.installments,
            card: cardData,
            type: this.currentMethod, // 'credit' ou 'debit'
            order_id: localStorage.getItem('currentOrderId')
        };
        
        const result = await window.paymentService.processCardPayment(paymentData);
        
        if (result.status === 'APPROVED') {
            // Atualizar status do pedido
            await window.paymentService.updateOrderPaymentStatus(
                paymentData.order_id,
                'Pago',
                {
                    method: this.currentMethod,
                    installments: cardData.installments,
                    amount: selectedInstallment.total_with_interest,
                    authorization_code: result.authorization_code,
                    transaction_id: result.transaction_id
                }
            );
            
            this.showSuccess('Pagamento aprovado!', result);
            
            // Limpar carrinho e redirecionar após sucesso
            setTimeout(() => {
                this.clearCartAndRedirect();
            }, 2000);
        } else {
            throw new Error(result.message || 'Pagamento recusado');
        }
    }
    
    async processPixPayment() {
        const pixCpf = document.getElementById('pix-cpf').value.replace(/\D/g, '');
        
        const pixData = {
            amount: this.orderTotal,
            payer_cpf: pixCpf.length === 11 ? pixCpf : null,
            payer_cnpj: pixCpf.length === 14 ? pixCpf : null,
            order_id: localStorage.getItem('currentOrderId')
        };
        
        const result = await window.paymentService.createPixTransaction(pixData);
        this.pixTransaction = result;
        
        this.showPixPaymentInfo(result);
        this.startPixTimer(result.expires_at);
        this.startPixPolling(result.txid);
    }
    
    showPixPaymentInfo(pixData) {
        const pixInfo = document.getElementById('pix-payment-info');
        const pixKeyValue = document.getElementById('pix-key-value');
        const qrContainer = document.getElementById('pix-qr-container');
        
        if (!pixInfo || !pixKeyValue || !qrContainer) return;
        
        pixKeyValue.textContent = pixData.pix_key;
        qrContainer.innerHTML = `<div style="font-size: 48px; line-height: 1;">${pixData.qr_code}</div>`;
        
        pixInfo.style.display = 'block';
        this.updateProcessButton();
    }
    
    startPixTimer(expiresAt) {
        const timerDisplay = document.getElementById('pix-timer');
        if (!timerDisplay) return;
        
        const expirationTime = new Date(expiresAt).getTime();
        
        this.pixTimer = setInterval(() => {
            const now = new Date().getTime();
            const timeLeft = expirationTime - now;
            
            if (timeLeft <= 0) {
                this.expirePixTransaction();
                return;
            }
            
            const minutes = Math.floor(timeLeft / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            // Muda cor conforme o tempo
            timerDisplay.className = 'timer-display';
            if (timeLeft < 5 * 60 * 1000) { // Últimos 5 minutos
                timerDisplay.classList.add('warning');
            }
            if (timeLeft < 2 * 60 * 1000) { // Últimos 2 minutos
                timerDisplay.classList.add('danger');
            }
        }, 1000);
    }
    
    startPixPolling(txid) {
        this.pixPolling = setInterval(async () => {
            try {
                const status = await window.paymentService.getPixStatus(txid);
            this.updatePixStatus(status.status);
            
            if (status.status === 'PAID') {
                clearInterval(this.pixPolling);
                
                // Atualizar status do pedido
                const orderId = localStorage.getItem('currentOrderId');
                await window.paymentService.updateOrderPaymentStatus(
                        orderId,
                        'Pago',
                        {
                            method: 'pix',
                            amount: this.orderTotal,
                            txid: txid,
                            pix_key: status.pix_key
                        }
                    );
                    
                    this.showSuccess('Pagamento PIX confirmado!', status);
                    
                    // Limpar carrinho e redirecionar após sucesso
                    setTimeout(() => {
                        this.clearCartAndRedirect();
                    }, 2000);
                    
                } else if (status.status === 'EXPIRED' || status.status === 'CANCELLED') {
                    this.expirePixTransaction();
                }
            } catch (error) {
                console.error('Erro ao verificar status PIX:', error);
            }
        }, 10000); // Polling a cada 10 segundos
    }
    
    updatePixStatus(status) {
        const statusDiv = document.getElementById('pix-status');
        if (!statusDiv) return;
        
        const indicator = statusDiv.querySelector('.status-indicator');
        if (!indicator) return;
        
        indicator.className = `status-indicator ${status.toLowerCase()}`;
        
        const statusText = {
            'PENDING': 'Aguardando pagamento...',
            'PAID': 'Pagamento confirmado!',
            'EXPIRED': 'PIX expirado',
            'CANCELLED': 'PIX cancelado'
        };
        
        indicator.innerHTML = `
            <i class="fas ${status === 'PAID' ? 'fa-check-circle' : status === 'PENDING' ? 'fa-clock' : 'fa-times-circle'}"></i>
            <span>${statusText[status] || status}</span>
        `;
    }
    
    async simulatePixPayment() {
        if (!this.pixTransaction) {
            this.showNotification('Nenhuma transação PIX ativa', 'error');
            return;
        }
        
        try {
            const result = await window.paymentService.simulatePixPayment(this.pixTransaction.txid);
            
            if (result.success) {
                this.showNotification('Pagamento PIX simulado com sucesso!', 'success');
                
                // O polling detectará a mudança de status automaticamente
                // e atualizará o pedido
            } else {
                this.showNotification(`Erro na simulação: ${result.error.message}`, 'error');
            }
        } catch (error) {
            console.error('Erro na simulação PIX:', error);
            this.showNotification('Erro interno na simulação', 'error');
        }
    }
    
    copyPixKey() {
        const pixKey = document.getElementById('pix-key-value').textContent;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(pixKey).then(() => {
                this.showNotification('Chave PIX copiada!');
            });
        } else {
            // Fallback para navegadores mais antigos
            const textArea = document.createElement('textarea');
            textArea.value = pixKey;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showNotification('Chave PIX copiada!');
        }
    }
    
    expirePixTransaction() {
        this.clearPixTransaction();
        this.updatePixStatus('EXPIRED');
        this.showError('PIX expirado. Gere um novo PIX para continuar.');
    }
    
    clearPixTransaction() {
        if (this.pixTimer) {
            clearInterval(this.pixTimer);
            this.pixTimer = null;
        }
        
        if (this.pixPolling) {
            clearInterval(this.pixPolling);
            this.pixPolling = null;
        }
        
        this.pixTransaction = null;
        
        const pixInfo = document.getElementById('pix-payment-info');
        if (pixInfo) {
            pixInfo.style.display = 'none';
        }
        
        this.updateProcessButton();
    }
    
    showSuccess(message, data) {
        // Limpa timers PIX
        this.clearPixTransaction();
        
        // Atualiza modal de confirmação
        document.getElementById('order-number').textContent = data.transaction_id || 'N/A';
        document.getElementById('order-total').textContent = `R$ ${this.orderTotal.toFixed(2).replace('.', ',')}`;
        document.getElementById('order-status').textContent = 'Pago';
        
        // Mostra modal
        document.getElementById('confirmation-modal').style.display = 'flex';
        
        this.showNotification(message, 'success');
    }
    
    clearCartAndRedirect() {
         // Limpa carrinho
         const userId = window.getCurrentUserId ? window.getCurrentUserId() : 'guest';
         const cartKey = `cart_${userId}`;
         localStorage.removeItem(cartKey);
         localStorage.removeItem('currentOrderId');
         
         // Redireciona para página de pedidos
         alert('Pagamento aprovado! Pedido confirmado com sucesso.');
         window.location.href = './orders.html';
     }
    
    showError(message) {
        this.showNotification(message, 'error');
    }
    
    showNotification(message, type = 'info') {
        // Cria notificação temporária
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 4px;
            color: white;
            font-weight: bold;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;
        
        if (type === 'success') {
            notification.style.background = '#28a745';
        } else if (type === 'error') {
            notification.style.background = '#dc3545';
        } else {
            notification.style.background = '#007bff';
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// Inicializa quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    // Gerar ID do pedido se não existir
    if (!localStorage.getItem('currentOrderId')) {
        localStorage.setItem('currentOrderId', 'ORDER-' + Date.now());
    }
    
    new CheckoutPayment();
});