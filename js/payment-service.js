// Serviço de Pagamento - E2E Commerce
class PaymentService {
    constructor() {
        this.currentQuote = null;
        this.currentPixTransaction = null;
        this.pixPollingInterval = null;
    }
    
    // Obter cotação de parcelas
    async getQuote(orderValue) {
        try {
            const quote = await window.paymentAPI.quote(orderValue);
            if (quote.success) {
                this.currentQuote = quote;
                return quote;
            } else {
                throw new Error(quote.message);
            }
        } catch (error) {
            console.error('Erro ao obter cotação:', error);
            throw error;
        }
    }
    
    // Obter cotação de parcelas (alias para compatibilidade)
    async getInstallmentQuote(orderValue, installments = null) {
        return await this.getQuote(orderValue);
    }
    
    // Processar pagamento com cartão
    async processCardPayment(paymentData) {
        try {
            // Validar se temos uma cotação válida
            if (!this.currentQuote) {
                throw new Error('Cotação não encontrada. Solicite uma nova cotação.');
            }
            
            // Encontrar a opção de parcela selecionada
            const selectedOption = this.currentQuote.installment_options.find(
                option => option.installments === paymentData.installments
            );
            
            if (!selectedOption) {
                throw new Error('Opção de parcelamento inválida');
            }
            
            // Usar o valor total com juros da cotação
            const paymentRequest = {
                ...paymentData,
                amount: selectedOption.total_with_interest
            };
            
            const result = await window.paymentAPI.authorizeCard(paymentRequest);
            
            if (result.success) {
                // Atualizar status do pedido para "Pago"
                await this.updateOrderPaymentStatus(paymentData.order_id, {
                    status: 'paid',
                    payment_method: 'card',
                    transaction_id: result.transaction_id,
                    amount_paid: result.amount,
                    installments: result.installments,
                    card_brand: result.brand,
                    masked_pan: result.masked_pan,
                    authorization_code: result.authorization_code,
                    paid_at: result.timestamp
                });
                
                return result;
            } else {
                throw new Error(result.message);
            }
            
        } catch (error) {
            console.error('Erro no pagamento com cartão:', error);
            throw error;
        }
    }
    
    // Criar transação PIX
    async createPixPayment(pixData) {
        try {
            const result = await window.paymentAPI.createPix(pixData);
            
            if (result.success) {
                this.currentPixTransaction = result;
                return result;
            } else {
                throw new Error(result.message);
            }
            
        } catch (error) {
            console.error('Erro ao criar PIX:', error);
            throw error;
        }
    }
    
    // Iniciar polling do status PIX
    startPixPolling(txid, onStatusChange) {
        if (this.pixPollingInterval) {
            clearInterval(this.pixPollingInterval);
        }
        
        this.pixPollingInterval = setInterval(async () => {
            try {
                const status = await window.paymentAPI.getPixStatus(txid);
                
                if (status.success) {
                    onStatusChange(status);
                    
                    // Parar polling se status final
                    if (['PAID', 'EXPIRED', 'CANCELLED'].includes(status.status)) {
                        this.stopPixPolling();
                        
                        // Se pago, atualizar pedido
                        if (status.status === 'PAID') {
                            await this.updateOrderPaymentStatus(this.currentPixTransaction.order_id, {
                                status: 'paid',
                                payment_method: 'pix',
                                transaction_id: txid,
                                amount_paid: status.amount,
                                paid_at: status.paid_at
                            });
                        }
                    }
                }
            } catch (error) {
                console.error('Erro no polling PIX:', error);
            }
        }, 10000); // 10 segundos
    }
    
    // Parar polling do PIX
    stopPixPolling() {
        if (this.pixPollingInterval) {
            clearInterval(this.pixPollingInterval);
            this.pixPollingInterval = null;
        }
    }
    
    // Simular pagamento PIX (para testes)
    async simulatePixPayment(txid, action = 'pay') {
        try {
            return await window.paymentAPI.simulatePixPayment(txid, action);
        } catch (error) {
            console.error('Erro ao simular PIX:', error);
            throw error;
        }
    }
    
    // Atualizar status de pagamento do pedido
    async updateOrderPaymentStatus(orderId, paymentInfo) {
        try {
            // Buscar pedido
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            const orderIndex = orders.findIndex(order => order.id === orderId);
            
            if (orderIndex === -1) {
                throw new Error('Pedido não encontrado');
            }
            
            const order = orders[orderIndex];
            
            // Verificar se pedido está elegível para pagamento
            if (order.status !== 'Aguardando Pagamento') {
                throw new Error('Pedido não está aguardando pagamento');
            }
            
            // Atualizar informações de pagamento
            order.paymentInfo = paymentInfo;
            order.paidAt = paymentInfo.paid_at;
            
            // Atualizar status do pedido usando o sistema existente
            if (window.ordersService && window.ordersService.updateOrderStatus) {
                await window.ordersService.updateOrderStatus(orderId, 'Pago', 'Pagamento processado com sucesso');
            } else {
                // Fallback: atualizar diretamente
                order.status = 'Pago';
                order.updatedAt = new Date().toISOString();
                
                // Adicionar ao histórico
                if (!order.statusHistory) {
                    order.statusHistory = [];
                }
                
                order.statusHistory.push({
                    status: 'Pago',
                    date: new Date().toISOString(),
                    description: 'Pagamento processado com sucesso',
                    previousStatus: 'Aguardando Pagamento'
                });
            }
            
            // Salvar pedidos atualizados
            orders[orderIndex] = order;
            localStorage.setItem('orders', JSON.stringify(orders));
            
            // Disparar evento de atualização
            window.dispatchEvent(new CustomEvent('orderUpdated', { 
                detail: { orderId, order } 
            }));
            
            return order;
            
        } catch (error) {
            console.error('Erro ao atualizar status do pedido:', error);
            throw error;
        }
    }
    
    // Validar dados do cartão
    validateCardData(cardData) {
        const errors = [];
        
        // Validar PAN
        if (!cardData.pan || cardData.pan.replace(/\s/g, '').length < 13) {
            errors.push('Número do cartão inválido');
        }
        
        // Validar CVV
        if (!cardData.cvv || cardData.cvv.length !== 3) {
            errors.push('CVV deve ter 3 dígitos');
        }
        
        // Validar validade
        if (!cardData.expiry_month || !cardData.expiry_year) {
            errors.push('Data de validade obrigatória');
        } else {
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth() + 1;
            
            if (cardData.expiry_year < currentYear || 
                (cardData.expiry_year === currentYear && cardData.expiry_month < currentMonth)) {
                errors.push('Cartão expirado');
            }
        }
        
        // Validar nome do portador
        if (!cardData.holder_name || cardData.holder_name.trim().length < 3) {
            errors.push('Nome do portador obrigatório');
        }
        
        return {
            valid: errors.length === 0,
            errors: errors
        };
    }
    
    // Validar dados do PIX
    validatePixData(pixData) {
        const errors = [];
        
        // Validar documento
        if (!pixData.payer_cpf && !pixData.payer_cnpj) {
            errors.push('CPF ou CNPJ obrigatório');
        }
        
        if (pixData.payer_cpf && !this.isValidCPF(pixData.payer_cpf)) {
            errors.push('CPF inválido');
        }
        
        if (pixData.payer_cnpj && !this.isValidCNPJ(pixData.payer_cnpj)) {
            errors.push('CNPJ inválido');
        }
        
        return {
            valid: errors.length === 0,
            errors: errors
        };
    }
    
    // Utilitários
    isValidCPF(cpf) {
        const cleanCPF = cpf.replace(/\D/g, '');
        return cleanCPF.length === 11;
    }
    
    isValidCNPJ(cnpj) {
        const cleanCNPJ = cnpj.replace(/\D/g, '');
        return cleanCNPJ.length === 14;
    }
    
    // Mascarar PAN para exibição
    maskPAN(pan) {
        if (!pan || pan.length < 8) return pan;
        const cleanPAN = pan.replace(/\s/g, '');
        const first6 = cleanPAN.substring(0, 6);
        const last4 = cleanPAN.substring(cleanPAN.length - 4);
        const middle = '*'.repeat(cleanPAN.length - 10);
        return first6 + middle + last4;
    }
    
    // Formatar valor monetário
    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }
    
    // Calcular tempo restante para expiração PIX
    getPixTimeRemaining(expiresAt) {
        const now = new Date();
        const expires = new Date(expiresAt);
        const diff = expires - now;
        
        if (diff <= 0) return null;
        
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        
        return {
            minutes,
            seconds,
            total: diff,
            formatted: `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        };
    }
    
    // Limpar dados sensíveis
    clearSensitiveData() {
        this.currentQuote = null;
        this.currentPixTransaction = null;
        this.stopPixPolling();
    }
    
    // Obter histórico de pagamentos
    getPaymentHistory(orderId) {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const order = orders.find(o => o.id === orderId);
        return order ? order.paymentInfo : null;
    }
}

// Instância global do serviço
window.paymentService = new PaymentService();