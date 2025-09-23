// Sistema de Pagamento Mock
class PaymentManager {
    constructor() {
        this.apiBaseUrl = 'https://api-mock-payment.e2e.com.br'; // Mock API
    }

    // Obter cotações de parcelamento
    async getQuote(amount) {
        // Simulação de API - em produção seria chamada real
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
                        installment_amount: installmentAmount,
                        total_with_interest: totalWithInterest,
                        total_interest: totalInterest
                    });
                }

                resolve({
                    amount: amount,
                    installments: installments
                });
            }, 500);
        });
    }

    // Calcular parcela usando fórmula Price
    calculateInstallment(principal, monthlyRate, installments) {
        if (monthlyRate === 0) return principal / installments;
        
        const factor = Math.pow(1 + monthlyRate, installments);
        return principal * (monthlyRate * factor) / (factor - 1);
    }

    // Processar pagamento com cartão
    async processCardPayment(orderId, cardData, installments) {
        // Validações básicas
        this.validateCardData(cardData);

        // Simular processamento
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const result = this.mockCardPayment(cardData);
                
                if (result.approved) {
                    resolve({
                        success: true,
                        transactionId: this.generateTransactionId(),
                        message: 'Pagamento aprovado'
                    });
                } else {
                    reject({
                        success: false,
                        error: result.error,
                        message: result.message
                    });
                }
            }, 2000);
        });
    }

    // Validar dados do cartão
    validateCardData(cardData) {
        const { pan, cvv, expiry, cardholderName } = cardData;

        if (!pan || pan.replace(/\s/g, '').length < 13) {
            throw new Error('Número do cartão inválido');
        }

        if (!cvv || cvv.length !== 3) {
            throw new Error('CVV inválido');
        }

        if (!expiry || !/^\d{2}\/\d{2}$/.test(expiry)) {
            throw new Error('Data de validade inválida');
        }

        if (!cardholderName || cardholderName.trim().length < 2) {
            throw new Error('Nome do portador inválido');
        }

        // Verificar se cartão não expirou
        const [month, year] = expiry.split('/');
        const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
        if (expiryDate < new Date()) {
            throw new Error('Cartão expirado');
        }
    }

    // Mock de pagamento com cartão
    mockCardPayment(cardData) {
        const pan = cardData.pan.replace(/\s/g, '');
        
        // Cartões de teste aprovados
        const approvedCards = [
            '4111111111111111', // VISA
            '5555555555554444', // MASTERCARD
            '4900000000000000', // VISA Débito
            '5200828282828210'  // MASTERCARD Débito
        ];

        // Cartões de teste reprovados
        const declinedCards = [
            '4000000000000002', // VISA - insufficient_funds
            '5105105105105100', // MASTERCARD - do_not_honor
            '4916000000000000', // VISA Débito - insufficient_funds
            '5200000000000007'  // MASTERCARD Débito - do_not_honor
        ];

        if (approvedCards.includes(pan)) {
            return { approved: true };
        } else if (declinedCards.includes(pan)) {
            return { 
                approved: false, 
                error: 'insufficient_funds',
                message: 'Pagamento recusado - fundos insuficientes'
            };
        } else {
            return { 
                approved: false, 
                error: 'invalid_pan',
                message: 'Cartão não reconhecido'
            };
        }
    }

    // Processar pagamento PIX
    async processPixPayment(orderId, payerData) {
        // Validar CPF/CNPJ
        if (!this.validatePixPayer(payerData)) {
            throw new Error('CPF ou CNPJ inválido');
        }

        // Simular geração de PIX
        return new Promise((resolve) => {
            setTimeout(() => {
                const txid = this.generateTransactionId();
                const pixData = {
                    txid: txid,
                    pix_key: 'pix@e2etreinamentos.com.br',
                    qr_code: this.generateQRCode(txid),
                    expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 min
                };

                // Simular status inicial
                this.pixStatuses = this.pixStatuses || {};
                this.pixStatuses[txid] = 'PENDING';

                resolve(pixData);
            }, 1000);
        });
    }

    // Validar pagador PIX
    validatePixPayer(payerData) {
        const { cpf, cnpj } = payerData;
        
        if (cpf && this.isValidCPF(cpf)) return true;
        if (cnpj && this.isValidCNPJ(cnpj)) return true;
        
        return false;
    }

    // Validar CPF
    isValidCPF(cpf) {
        cpf = cpf.replace(/\D/g, '');
        if (cpf.length !== 11) return false;
        
        // Algoritmo de validação CPF
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.charAt(9))) return false;

        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cpf.charAt(i)) * (11 - i);
        }
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.charAt(10))) return false;

        return true;
    }

    // Validar CNPJ
    isValidCNPJ(cnpj) {
        cnpj = cnpj.replace(/\D/g, '');
        if (cnpj.length !== 14) return false;
        
        // Algoritmo de validação CNPJ
        let sum = 0;
        let weight = 2;
        for (let i = 11; i >= 0; i--) {
            sum += parseInt(cnpj.charAt(i)) * weight;
            weight = weight === 9 ? 2 : weight + 1;
        }
        let remainder = sum % 11;
        if (remainder < 2) remainder = 0;
        else remainder = 11 - remainder;
        if (remainder !== parseInt(cnpj.charAt(12))) return false;

        sum = 0;
        weight = 2;
        for (let i = 12; i >= 0; i--) {
            sum += parseInt(cnpj.charAt(i)) * weight;
            weight = weight === 9 ? 2 : weight + 1;
        }
        remainder = sum % 11;
        if (remainder < 2) remainder = 0;
        else remainder = 11 - remainder;
        if (remainder !== parseInt(cnpj.charAt(13))) return false;

        return true;
    }

    // Verificar status PIX
    async checkPixStatus(txid) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simular verificação de status
                const statuses = ['PENDING', 'PAID', 'EXPIRED', 'CANCELLED'];
                const currentStatus = this.pixStatuses?.[txid] || 'PENDING';
                
                // Simular mudança de status após 5 segundos
                if (currentStatus === 'PENDING' && Math.random() > 0.7) {
                    this.pixStatuses[txid] = 'PAID';
                }
                
                resolve({
                    status: this.pixStatuses?.[txid] || 'PENDING',
                    message: this.getPixStatusMessage(this.pixStatuses?.[txid] || 'PENDING')
                });
            }, 1000);
        });
    }

    // Obter mensagem do status PIX
    getPixStatusMessage(status) {
        const messages = {
            'PENDING': 'Aguardando pagamento PIX',
            'PAID': 'Pagamento PIX confirmado',
            'EXPIRED': 'PIX expirado',
            'CANCELLED': 'PIX cancelado'
        };
        return messages[status] || 'Status desconhecido';
    }

    // Gerar ID de transação
    generateTransactionId() {
        return 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Gerar QR Code (simulação)
    generateQRCode(txid) {
        return `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`;
    }

    // Mascarar número do cartão
    maskCardNumber(pan) {
        const cleaned = pan.replace(/\s/g, '');
        if (cleaned.length < 8) return pan;
        
        const start = cleaned.substring(0, 4);
        const end = cleaned.substring(cleaned.length - 4);
        const middle = '*'.repeat(cleaned.length - 8);
        
        return `${start}${middle}${end}`;
    }

    // Formatar preço
    formatPrice(price) {
        return price.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }
}

// Instância global
window.paymentManager = new PaymentManager();
