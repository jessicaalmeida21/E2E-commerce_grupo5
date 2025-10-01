// API Mock de Pagamento - E2E Commerce
class PaymentAPI {
    constructor() {
        this.pixTransactions = new Map();
        this.paymentLogs = [];
        
        // Dados hardcoded para cartões de crédito
        this.creditCards = {
            '4111111111111111': { brand: 'VISA', cvv: '123', result: 'APPROVED' },
            '4000000000000002': { brand: 'VISA', cvv: '123', result: 'DECLINED', reason: 'insufficient_funds' },
            '5555555555554444': { brand: 'MASTERCARD', cvv: '321', result: 'APPROVED' },
            '5105105105105100': { brand: 'MASTERCARD', cvv: '321', result: 'DECLINED', reason: 'do_not_honor' }
        };
        
        // Dados hardcoded para cartões de débito
        this.debitCards = {
            '4900000000000000': { brand: 'VISA', cvv: '111', result: 'APPROVED' },
            '4916000000000000': { brand: 'VISA', cvv: '111', result: 'DECLINED', reason: 'insufficient_funds' },
            '5200828282828210': { brand: 'MASTERCARD', cvv: '222', result: 'APPROVED' },
            '5200000000000007': { brand: 'MASTERCARD', cvv: '222', result: 'DECLINED', reason: 'do_not_honor' }
        };
        
        // Chaves PIX válidas
        this.pixKeys = {
            email: 'pix@e2etreinamentos.com.br',
            phone: '11991919191'
        };
    }
    
    // Endpoint: POST /quote - Cotação de parcelas
    async quote(orderValue) {
        try {
            if (!orderValue || orderValue <= 0) {
                throw new Error('Valor do pedido inválido');
            }
            
            const installmentOptions = [];
            const monthlyRate = 0.01; // 1% a.m.
            
            // 1x à vista (sem juros)
            installmentOptions.push({
                installments: 1,
                installment_amount: orderValue,
                total_with_interest: orderValue,
                total_interest: 0,
                monthly_rate: 0
            });
            
            // 2x a 10x com juros
            for (let n = 2; n <= 10; n++) {
                const { installmentAmount, totalWithInterest, totalInterest } = 
                    this.calculateInstallments(orderValue, n, monthlyRate);
                
                installmentOptions.push({
                    installments: n,
                    installment_amount: installmentAmount,
                    total_with_interest: totalWithInterest,
                    total_interest: totalInterest,
                    monthly_rate: monthlyRate
                });
            }
            
            return {
                success: true,
                order_value: orderValue,
                installment_options: installmentOptions,
                timestamp: new Date().toISOString()
            };
            
        } catch (error) {
            return {
                success: false,
                error: 'invalid_amount',
                message: error.message
            };
        }
    }
    
    // Cálculo de parcelas usando fórmula Price
    calculateInstallments(principal, periods, monthlyRate) {
        // PMT = P * [i(1+i)^n] / [(1+i)^n - 1]
        const i = monthlyRate;
        const n = periods;
        const P = principal;
        
        const factor = Math.pow(1 + i, n);
        const installmentAmount = P * (i * factor) / (factor - 1);
        
        // Arredondar para 2 casas decimais
        const roundedInstallment = Math.round(installmentAmount * 100) / 100;
        const totalWithInterest = roundedInstallment * n;
        const totalInterest = totalWithInterest - P;
        
        return {
            installmentAmount: roundedInstallment,
            totalWithInterest: Math.round(totalWithInterest * 100) / 100,
            totalInterest: Math.round(totalInterest * 100) / 100
        };
    }
    
    // Endpoint: POST /card/authorize - Autorização de cartão
    async authorizeCard(paymentData) {
        try {
            const { 
                order_id, 
                amount, 
                installments, 
                card_type, 
                pan, 
                cvv, 
                expiry_month, 
                expiry_year, 
                holder_name 
            } = paymentData;
            
            // Validações básicas
            const validation = this.validateCardData(paymentData);
            if (!validation.valid) {
                return {
                    success: false,
                    error: validation.error,
                    message: validation.message
                };
            }
            
            // Verificar se o cartão existe nos dados hardcoded
            const cardDatabase = card_type === 'credit' ? this.creditCards : this.debitCards;
            const cardData = cardDatabase[pan];
            
            if (!cardData) {
                return {
                    success: false,
                    error: 'invalid_pan',
                    message: 'Cartão não encontrado'
                };
            }
            
            // Verificar CVV
            if (cardData.cvv !== cvv) {
                return {
                    success: false,
                    error: 'invalid_cvv',
                    message: 'CVV inválido'
                };
            }
            
            // Verificar limite de valor
            if (amount > 50000) {
                return {
                    success: false,
                    error: 'limit_exceeded',
                    message: 'Valor excede o limite permitido'
                };
            }
            
            // Log da tentativa (mascarando dados sensíveis)
            this.logPaymentAttempt({
                order_id,
                amount,
                installments,
                card_type,
                masked_pan: this.maskPAN(pan),
                brand: cardData.brand,
                result: cardData.result,
                timestamp: new Date().toISOString()
            });
            
            // Simular processamento
            await this.delay(1000);
            
            if (cardData.result === 'APPROVED') {
                const transactionId = this.generateTransactionId();
                
                return {
                    success: true,
                    transaction_id: transactionId,
                    status: 'APPROVED',
                    amount: amount,
                    installments: installments,
                    brand: cardData.brand,
                    masked_pan: this.maskPAN(pan),
                    authorization_code: this.generateAuthCode(),
                    timestamp: new Date().toISOString()
                };
            } else {
                return {
                    success: false,
                    error: cardData.reason,
                    message: this.getErrorMessage(cardData.reason),
                    brand: cardData.brand,
                    masked_pan: this.maskPAN(pan)
                };
            }
            
        } catch (error) {
            return {
                success: false,
                error: 'processing_error',
                message: 'Erro interno no processamento'
            };
        }
    }
    
    // Endpoint: POST /pix/create - Criar transação PIX
    async createPix(pixData) {
        try {
            const { order_id, amount, payer_cpf, payer_cnpj } = pixData;
            
            // Validações
            if (!order_id || !amount || amount <= 0) {
                return {
                    success: false,
                    error: 'invalid_amount',
                    message: 'Dados inválidos para criação do PIX'
                };
            }
            
            if (!payer_cpf && !payer_cnpj) {
                return {
                    success: false,
                    error: 'invalid_document',
                    message: 'CPF ou CNPJ obrigatório'
                };
            }
            
            // Validar formato do documento
            if (payer_cpf && !this.isValidCPF(payer_cpf)) {
                return {
                    success: false,
                    error: 'invalid_document',
                    message: 'CPF inválido'
                };
            }
            
            if (payer_cnpj && !this.isValidCNPJ(payer_cnpj)) {
                return {
                    success: false,
                    error: 'invalid_document',
                    message: 'CNPJ inválido'
                };
            }
            
            const txid = this.generateTxId();
            const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos
            
            const pixTransaction = {
                txid,
                order_id,
                amount,
                payer_cpf,
                payer_cnpj,
                status: 'PENDING',
                pix_key: this.pixKeys.email,
                qr_code: this.generateQRCode(txid, amount),
                created_at: new Date().toISOString(),
                expires_at: expiresAt.toISOString()
            };
            
            this.pixTransactions.set(txid, pixTransaction);
            
            // Auto-expirar após 30 minutos
            setTimeout(() => {
                const transaction = this.pixTransactions.get(txid);
                if (transaction && transaction.status === 'PENDING') {
                    transaction.status = 'EXPIRED';
                    transaction.expired_at = new Date().toISOString();
                }
            }, 30 * 60 * 1000);
            
            return {
                success: true,
                txid,
                pix_key: pixTransaction.pix_key,
                qr_code: pixTransaction.qr_code,
                amount: amount,
                expires_at: pixTransaction.expires_at,
                status: 'PENDING'
            };
            
        } catch (error) {
            return {
                success: false,
                error: 'processing_error',
                message: 'Erro ao criar transação PIX'
            };
        }
    }
    
    // Endpoint: GET /pix/{txid}/status - Status do PIX
    async getPixStatus(txid) {
        const transaction = this.pixTransactions.get(txid);
        
        if (!transaction) {
            return {
                success: false,
                error: 'pix_not_found',
                message: 'Transação PIX não encontrada'
            };
        }
        
        // Verificar se expirou
        if (transaction.status === 'PENDING' && new Date() > new Date(transaction.expires_at)) {
            transaction.status = 'EXPIRED';
            transaction.expired_at = new Date().toISOString();
        }
        
        return {
            success: true,
            txid: transaction.txid,
            status: transaction.status,
            amount: transaction.amount,
            created_at: transaction.created_at,
            expires_at: transaction.expires_at,
            paid_at: transaction.paid_at,
            expired_at: transaction.expired_at
        };
    }
    
    // Endpoint: POST /pix/{txid}/simulate - Simular pagamento PIX
    async simulatePixPayment(txid, action = 'pay') {
        const transaction = this.pixTransactions.get(txid);
        
        if (!transaction) {
            return {
                success: false,
                error: 'pix_not_found',
                message: 'Transação PIX não encontrada'
            };
        }
        
        if (transaction.status !== 'PENDING') {
            return {
                success: false,
                error: 'invalid_status',
                message: 'Transação não está pendente'
            };
        }
        
        if (action === 'pay') {
            transaction.status = 'PAID';
            transaction.paid_at = new Date().toISOString();
        } else if (action === 'cancel') {
            transaction.status = 'CANCELLED';
            transaction.cancelled_at = new Date().toISOString();
        }
        
        return {
            success: true,
            txid: transaction.txid,
            status: transaction.status,
            action: action
        };
    }
    
    // Métodos auxiliares
    validateCardData(data) {
        const { pan, cvv, expiry_month, expiry_year, amount } = data;
        
        // Validar PAN
        if (!pan || pan.length < 13 || pan.length > 19) {
            return { valid: false, error: 'invalid_pan', message: 'Número do cartão inválido' };
        }
        
        // Validar CVV
        if (!cvv || cvv.length !== 3) {
            return { valid: false, error: 'invalid_cvv', message: 'CVV deve ter 3 dígitos' };
        }
        
        // Validar validade
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        
        if (expiry_year < currentYear || (expiry_year === currentYear && expiry_month < currentMonth)) {
            return { valid: false, error: 'expired_card', message: 'Cartão expirado' };
        }
        
        return { valid: true };
    }
    
    maskPAN(pan) {
        if (!pan || pan.length < 8) return pan;
        const first6 = pan.substring(0, 6);
        const last4 = pan.substring(pan.length - 4);
        const middle = '*'.repeat(pan.length - 10);
        return first6 + middle + last4;
    }
    
    isValidCPF(cpf) {
        return cpf && cpf.replace(/\D/g, '').length === 11;
    }
    
    isValidCNPJ(cnpj) {
        return cnpj && cnpj.replace(/\D/g, '').length === 14;
    }
    
    generateTransactionId() {
        return 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    generateTxId() {
        return 'PIX_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    generateAuthCode() {
        return Math.random().toString(36).substr(2, 8).toUpperCase();
    }
    
    generateQRCode(txid, amount) {
        // Simular QR code como string base64 simples
        const qrData = `PIX|${txid}|${amount}|${this.pixKeys.email}`;
        return btoa(qrData);
    }
    
    getErrorMessage(errorCode) {
        const messages = {
            'insufficient_funds': 'Saldo insuficiente',
            'do_not_honor': 'Transação negada pelo banco',
            'invalid_cvv': 'CVV inválido',
            'expired_card': 'Cartão expirado',
            'limit_exceeded': 'Limite excedido'
        };
        return messages[errorCode] || 'Erro desconhecido';
    }
    
    logPaymentAttempt(logData) {
        this.paymentLogs.push(logData);
        console.log('Payment attempt logged:', logData);
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Método para obter logs (para debug)
    getPaymentLogs() {
        return this.paymentLogs;
    }
    
    // Método para limpar transações PIX expiradas
    cleanExpiredPixTransactions() {
        const now = new Date();
        for (const [txid, transaction] of this.pixTransactions.entries()) {
            if (transaction.status === 'PENDING' && new Date(transaction.expires_at) < now) {
                transaction.status = 'EXPIRED';
                transaction.expired_at = now.toISOString();
            }
        }
    }
}

// Instância global da API
window.paymentAPI = new PaymentAPI();