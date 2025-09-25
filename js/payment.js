// Sistema de Pagamento - Mock API
class PaymentService {
    constructor() {
        this.baseUrl = 'https://api.mock-payment.e2e.com'; // URL fictícia
        this.cards = {
            credit: {
                '4111111111111111': { brand: 'VISA', cvv: '123', result: 'APPROVED' },
                '4000000000000002': { brand: 'VISA', cvv: '123', result: 'DECLINED', error: 'insufficient_funds' },
                '5555555555554444': { brand: 'MASTERCARD', cvv: '321', result: 'APPROVED' },
                '5105105105105100': { brand: 'MASTERCARD', cvv: '321', result: 'DECLINED', error: 'do_not_honor' }
            },
            debit: {
                '4900000000000000': { brand: 'VISA', cvv: '111', result: 'APPROVED' },
                '4916000000000000': { brand: 'VISA', cvv: '111', result: 'DECLINED', error: 'insufficient_funds' },
                '5200828282828210': { brand: 'MASTERCARD', cvv: '222', result: 'APPROVED' },
                '5200000000000007': { brand: 'MASTERCARD', cvv: '222', result: 'DECLINED', error: 'do_not_honor' }
            }
        };
        this.pixKeys = {
            email: 'pix@e2etreinamentos.com.br',
            phone: '11991919191'
        };
    }

    // Simular cotação de parcelas
    async getQuote(amount) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const installments = [];
                
                // 1x sem juros
                installments.push({
                    installments: 1,
                    installment_amount: amount,
                    total_with_interest: amount,
                    total_interest: 0
                });
                
                // 2-10x com 1% a.m.
                for (let i = 2; i <= 10; i++) {
                    const monthlyRate = 0.01; // 1% a.m.
                    const installmentAmount = this.calculateInstallment(amount, monthlyRate, i);
                    const totalWithInterest = installmentAmount * i;
                    const totalInterest = totalWithInterest - amount;
                    
                    installments.push({
                        installments: i,
                        installment_amount: Math.round(installmentAmount * 100) / 100,
                        total_with_interest: Math.round(totalWithInterest * 100) / 100,
                        total_interest: Math.round(totalInterest * 100) / 100
                    });
                }
                
                resolve({ installments });
            }, 500);
        });
    }

    // Calcular parcela usando fórmula Price
    calculateInstallment(principal, monthlyRate, installments) {
        if (monthlyRate === 0) return principal / installments;
        
        const factor = Math.pow(1 + monthlyRate, installments);
        return principal * (monthlyRate * factor) / (factor - 1);
    }

    // Validar cartão
    validateCard(cardNumber, cvv, expiry, cardType) {
        const cleanNumber = cardNumber.replace(/\s/g, '');
        const cardData = this.cards[cardType][cleanNumber];
        
        if (!cardData) {
            return { valid: false, error: 'unsupported_brand' };
        }
        
        if (cardData.cvv !== cvv) {
            return { valid: false, error: 'invalid_cvv' };
        }
        
        // Validar validade (simplificado)
        const [month, year] = expiry.split('/');
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;
        
        if (parseInt(year) < currentYear || 
            (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
            return { valid: false, error: 'expired_card' };
        }
        
        return { valid: true, result: cardData.result, error: cardData.error };
    }

    // Processar pagamento com cartão
    async processCardPayment(paymentData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const validation = this.validateCard(
                    paymentData.cardNumber,
                    paymentData.cvv,
                    paymentData.expiry,
                    paymentData.cardType
                );
                
                if (!validation.valid) {
                    reject({
                        error: validation.error,
                        message: this.getErrorMessage(validation.error)
                    });
                    return;
                }
                
                if (validation.result === 'DECLINED') {
                    reject({
                        error: validation.error,
                        message: this.getErrorMessage(validation.error)
                    });
                    return;
                }
                
                // Simular processamento
                resolve({
                    transaction_id: this.generateTransactionId(),
                    status: 'APPROVED',
                    amount: paymentData.amount,
                    installments: paymentData.installments
                });
            }, 2000);
        });
    }

    // Processar pagamento PIX
    async processPixPayment(paymentData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const txid = this.generateTransactionId();
                const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos
                
                resolve({
                    txid,
                    pix_key: this.pixKeys.email,
                    qr_code: this.generateQRCode(txid, paymentData.amount),
                    expires_at: expiresAt.toISOString(),
                    status: 'PENDING'
                });
            }, 1000);
        });
    }

    // Verificar status PIX
    async checkPixStatus(txid) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simular 70% de chance de aprovação
                const approved = Math.random() > 0.3;
                resolve({
                    status: approved ? 'PAID' : 'EXPIRED',
                    paid_at: approved ? new Date().toISOString() : null
                });
            }, 1000);
        });
    }

    // Gerar ID de transação
    generateTransactionId() {
        return 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Gerar QR Code (simulado)
    generateQRCode(txid, amount) {
        return `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`;
    }

    // Obter mensagem de erro
    getErrorMessage(errorCode) {
        const messages = {
            'invalid_pan': 'Número do cartão inválido',
            'invalid_cvv': 'CVV inválido',
            'expired_card': 'Cartão expirado',
            'unsupported_brand': 'Bandeira não suportada',
            'limit_exceeded': 'Limite excedido',
            'insufficient_funds': 'Saldo insuficiente',
            'do_not_honor': 'Transação negada',
            'amount_mismatch': 'Valor incorreto',
            'order_not_eligible': 'Pedido não elegível para pagamento',
            'expired_pix': 'PIX expirado',
            'pix_not_found': 'PIX não encontrado'
        };
        return messages[errorCode] || 'Erro desconhecido';
    }
}

// Instância global do serviço de pagamento
const paymentService = new PaymentService();

// Utilitários de formatação
const PaymentUtils = {
    // Formatar número do cartão
    formatCardNumber(value) {
        return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
    },

    // Mascarar número do cartão
    maskCardNumber(cardNumber) {
        const clean = cardNumber.replace(/\s/g, '');
        return clean.substring(0, 4) + ' **** **** ' + clean.substring(12);
    },

    // Formatar CVV
    formatCVV(value) {
        return value.replace(/\D/g, '').substring(0, 3);
    },

    // Formatar validade
    formatExpiry(value) {
        return value.replace(/\D/g, '').replace(/(.{2})/, '$1/').substring(0, 5);
    },

    // Formatar CPF/CNPJ
    formatCPF(value) {
        const clean = value.replace(/\D/g, '');
        if (clean.length <= 11) {
            return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else {
            return clean.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        }
    },

    // Formatar CEP
    formatCEP(value) {
        return value.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2');
    },

    // Validar CPF/CNPJ
    validateCPF(value) {
        const clean = value.replace(/\D/g, '');
        return clean.length === 11 || clean.length === 14;
    },

    // Validar CEP
    validateCEP(value) {
        const clean = value.replace(/\D/g, '');
        return clean.length === 8;
    }
};

// Exportar para uso global
window.paymentService = paymentService;
window.PaymentUtils = PaymentUtils;