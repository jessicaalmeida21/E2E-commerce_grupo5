// Sistema de Gestão de Pedidos - VERSÃO COMPLETA
class OrderManager {
    constructor() {
        this.orders = JSON.parse(localStorage.getItem('orders')) || [];
        this.nextOrderId = this.getNextOrderId();
        this.stockData = this.initializeStockData();
        this.addresses = JSON.parse(localStorage.getItem('user_addresses')) || {};
        this.initializeAutoCancellation();
    }

    // Inicializar dados de estoque simulado
    initializeStockData() {
        const stockKey = 'product_stock';
        let stock = JSON.parse(localStorage.getItem(stockKey));
        
        if (!stock) {
            // Inicializar estoque padrão para todos os produtos
            stock = {};
            // Simular estoque para produtos existentes
            for (let i = 1; i <= 500; i++) {
                const productId = `PROD-${i.toString().padStart(3, '0')}`;
                stock[productId] = Math.floor(Math.random() * 50) + 10; // Entre 10 e 60 unidades
            }
            localStorage.setItem(stockKey, JSON.stringify(stock));
        }
        
        return stock;
    }

    // Gerar próximo ID de pedido
    getNextOrderId() {
        const lastOrder = this.orders.reduce((max, order) => 
            Math.max(max, parseInt(order.id) || 0), 0);
        return (lastOrder + 1).toString().padStart(6, '0');
    }

    // Validar estoque em tempo real
    validateStockRealTime(cart) {
        const unavailableProducts = [];
        
        cart.forEach(item => {
            const currentStock = this.stockData[item.id] || 0;
            if (currentStock < item.quantity) {
                unavailableProducts.push({
                    productId: item.id,
                    title: item.title,
                    requestedQuantity: item.quantity,
                    availableStock: currentStock
                });
            }
        });

        if (unavailableProducts.length > 0) {
            const errorMessage = unavailableProducts.map(p => 
                `${p.title}: solicitado ${p.requestedQuantity}, disponível ${p.availableStock}`
            ).join('; ');
            throw new Error(`Produtos sem estoque suficiente: ${errorMessage}`);
        }

        return true;
    }

    // Reduzir estoque após confirmação do pedido
    reduceStock(cart) {
        cart.forEach(item => {
            if (this.stockData[item.id]) {
                this.stockData[item.id] -= item.quantity;
                if (this.stockData[item.id] < 0) {
                    this.stockData[item.id] = 0;
                }
            }
        });
        localStorage.setItem('product_stock', JSON.stringify(this.stockData));
    }

    // Restaurar estoque (em caso de cancelamento)
    restoreStock(orderItems) {
        orderItems.forEach(item => {
            if (this.stockData[item.productId]) {
                this.stockData[item.productId] += item.quantity;
            } else {
                this.stockData[item.productId] = item.quantity;
            }
        });
        localStorage.setItem('product_stock', JSON.stringify(this.stockData));
    }

    // Gerenciar endereços do usuário (máximo 3)
    saveUserAddress(userId, addressType, addressData) {
        const validTypes = ['residencial', 'comercial', 'entrega'];
        if (!validTypes.includes(addressType)) {
            throw new Error('Tipo de endereço inválido. Use: residencial, comercial ou entrega');
        }

        if (!this.addresses[userId]) {
            this.addresses[userId] = {};
        }

        // Verificar se já tem 3 endereços e está tentando adicionar um novo tipo
        const userAddresses = this.addresses[userId];
        const addressCount = Object.keys(userAddresses).length;
        
        if (addressCount >= 3 && !userAddresses[addressType]) {
            throw new Error('Limite máximo de 3 endereços atingido');
        }

        this.addresses[userId][addressType] = {
            ...addressData,
            type: addressType,
            updatedAt: new Date().toISOString()
        };

        localStorage.setItem('user_addresses', JSON.stringify(this.addresses));
        return this.addresses[userId][addressType];
    }

    // Consultar CEP (simulação)
    async consultarCEP(cep) {
        // Simulação de consulta de CEP
        const cepLimpo = cep.replace(/\D/g, '');
        
        if (cepLimpo.length !== 8) {
            throw new Error('CEP deve conter 8 dígitos');
        }

        // Simulação de dados de endereço
        const mockAddresses = {
            '01310100': { logradouro: 'Avenida Paulista', bairro: 'Bela Vista', cidade: 'São Paulo', uf: 'SP' },
            '20040020': { logradouro: 'Rua da Assembleia', bairro: 'Centro', cidade: 'Rio de Janeiro', uf: 'RJ' },
            '30112000': { logradouro: 'Rua da Bahia', bairro: 'Centro', cidade: 'Belo Horizonte', uf: 'MG' }
        };

        return new Promise((resolve) => {
            setTimeout(() => {
                const address = mockAddresses[cepLimpo] || {
                    logradouro: 'Rua Exemplo',
                    bairro: 'Bairro Exemplo',
                    cidade: 'Cidade Exemplo',
                    uf: 'EX'
                };
                resolve({ ...address, cep: cepLimpo });
            }, 500);
        });
    }

    // Criar novo pedido com todas as validações
    createOrder(cart, shippingAddress, paymentMethod, addressType = 'entrega') {
        if (!cart || cart.length === 0) {
            throw new Error('Carrinho vazio. Adicione pelo menos 1 produto para finalizar o pedido.');
        }

        const userId = this.getCurrentUserId();
        if (!userId) {
            throw new Error('Usuário não autenticado');
        }

        // Validar estoque em tempo real
        this.validateStockRealTime(cart);

        // Salvar endereço se fornecido
        if (shippingAddress && shippingAddress.cep) {
            this.saveUserAddress(userId, addressType, shippingAddress);
        }

        const order = {
            id: this.nextOrderId,
            userId: userId,
            items: cart.map(item => ({
                productId: item.id,
                title: item.title,
                price: parseFloat(item.price),
                quantity: parseInt(item.quantity),
                image: item.image
            })),
            subtotal: this.calculateSubtotal(cart),
            shipping: 0,
            total: 0,
            status: 'Aguardando Pagamento',
            paymentMethod: paymentMethod,
            shippingAddress: shippingAddress,
            addressType: addressType,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            statusHistory: [{
                status: 'Aguardando Pagamento',
                date: new Date().toISOString(),
                description: 'Pedido criado e aguardando confirmação do pagamento'
            }],
            cancellationDeadline: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString() // 72 horas
        };

        order.shipping = this.calculateShipping(order.subtotal);
        order.total = order.subtotal + order.shipping;

        // Reduzir estoque
        this.reduceStock(cart);

        this.orders.push(order);
        this.nextOrderId = (parseInt(this.nextOrderId) + 1).toString().padStart(6, '0');
        
        this.saveOrders();
        return order;
    }

    // Calcular subtotal
    calculateSubtotal(cart) {
        return cart.reduce((total, item) => {
            const price = parseFloat(item.price) || 0;
            const quantity = parseInt(item.quantity) || 1;
            return total + (price * quantity);
        }, 0);
    }

    // Calcular frete
    calculateShipping(subtotal) {
        return subtotal >= 399 ? 0 : 100;
    }

    // Obter usuário atual
    getCurrentUserId() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        return currentUser ? currentUser.id : null;
    }

    // Atualizar status do pedido
    updateOrderStatus(orderId, newStatus, reason = '') {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) {
            throw new Error('Pedido não encontrado');
        }

        // Validar transição de status
        if (!this.isValidStatusTransition(order.status, newStatus)) {
            throw new Error(`Transição de status inválida: ${order.status} → ${newStatus}`);
        }

        const oldStatus = order.status;
        order.status = newStatus;
        order.updatedAt = new Date().toISOString();
        order.statusHistory.push({
            status: newStatus,
            date: new Date().toISOString(),
            description: reason || this.getStatusDescription(newStatus),
            previousStatus: oldStatus
        });

        // Inicializar logística automaticamente quando o pedido for pago
        if (newStatus === 'Pago' && !order.logistics) {
            // Verificar se o LogisticsService está disponível
            if (typeof LogisticsService !== 'undefined') {
                const logisticsService = new LogisticsService();
                order.logistics = {
                    status: 'aguardando-envio',
                    tracking_code: logisticsService.generateTrackingCode(),
                    history: [{
                        status: 'aguardando-envio',
                        timestamp: new Date().toISOString(),
                        description: 'Pedido pago e aguardando envio'
                    }]
                };
            }
        }

        this.saveOrders();
        return order;
    }

    // Validar transição de status
    isValidStatusTransition(currentStatus, newStatus) {
        const validTransitions = {
            'Aguardando Pagamento': ['Pago', 'Cancelado'],
            'Pago': ['Em Transporte', 'Cancelado'],
            'Em Transporte': ['Entregue'],
            'Entregue': ['Devolvido'],
            'Cancelado': [],
            'Devolvido': []
        };

        return validTransitions[currentStatus]?.includes(newStatus) || false;
    }

    // Obter descrição do status
    getStatusDescription(status) {
        const descriptions = {
            'Aguardando Pagamento': 'Aguardando confirmação do pagamento',
            'Pago': 'Pagamento confirmado, preparando para envio',
            'Em Transporte': 'Pedido em transporte para entrega',
            'Entregue': 'Pedido entregue com sucesso',
            'Cancelado': 'Pedido cancelado',
            'Devolvido': 'Pedido devolvido'
        };
        return descriptions[status] || status;
    }

    // Cancelar pedido com motivo obrigatório
    cancelOrder(orderId, reason) {
        if (!reason || reason.trim().length < 10) {
            throw new Error('Motivo do cancelamento é obrigatório e deve ter pelo menos 10 caracteres');
        }

        const order = this.orders.find(o => o.id === orderId);
        if (!order) {
            throw new Error('Pedido não encontrado');
        }

        if (!['Aguardando Pagamento', 'Pago'].includes(order.status)) {
            throw new Error('Pedido não pode ser cancelado neste status. Apenas pedidos "Aguardando Pagamento" ou "Pago" podem ser cancelados.');
        }

        // Restaurar estoque
        this.restoreStock(order.items);

        order.cancellationReason = reason.trim();
        order.cancellationDate = new Date().toISOString();

        return this.updateOrderStatus(orderId, 'Cancelado', `Cancelado pelo cliente: ${reason}`);
    }

    // Sistema de devolução
    requestReturn(orderId, reason, hasDefect = false) {
        if (!reason || reason.trim().length < 10) {
            throw new Error('Motivo da devolução é obrigatório e deve ter pelo menos 10 caracteres');
        }

        const order = this.orders.find(o => o.id === orderId);
        if (!order) {
            throw new Error('Pedido não encontrado');
        }

        if (order.status !== 'Entregue') {
            throw new Error('Apenas pedidos entregues podem ser devolvidos');
        }

        // Verificar prazo de devolução
        const deliveryDate = new Date(order.statusHistory.find(h => h.status === 'Entregue')?.date);
        const now = new Date();
        const daysSinceDelivery = Math.floor((now - deliveryDate) / (1000 * 60 * 60 * 24));
        
        const maxDays = hasDefect ? 30 : 7;
        if (daysSinceDelivery > maxDays) {
            throw new Error(`Prazo para devolução expirado. ${hasDefect ? 'Produtos com defeito' : 'Produtos sem defeito'} podem ser devolvidos em até ${maxDays} dias após a entrega.`);
        }

        // Restaurar estoque
        this.restoreStock(order.items);

        order.returnReason = reason.trim();
        order.returnDate = new Date().toISOString();
        order.hasDefect = hasDefect;
        order.returnDeadlineDays = maxDays;

        return this.updateOrderStatus(orderId, 'Devolvido', `Devolução solicitada: ${reason} (${hasDefect ? 'com defeito' : 'sem defeito'})`);
    }

    // Cancelamento automático após 72h
    initializeAutoCancellation() {
        setInterval(() => {
            this.checkAutoCancellation();
        }, 60 * 60 * 1000); // Verificar a cada hora
    }

    checkAutoCancellation() {
        const now = new Date();
        const ordersToCancel = this.orders.filter(order => {
            if (order.status !== 'Aguardando Pagamento') return false;
            
            const deadline = new Date(order.cancellationDeadline);
            return now > deadline;
        });

        ordersToCancel.forEach(order => {
            try {
                // Restaurar estoque
                this.restoreStock(order.items);
                
                order.cancellationReason = 'Cancelamento automático - Pagamento não confirmado em 72 horas';
                order.cancellationDate = new Date().toISOString();
                order.autoCancelled = true;
                
                this.updateOrderStatus(order.id, 'Cancelado', 'Cancelamento automático - Pagamento não confirmado em 72 horas');
                
                console.log(`Pedido ${order.id} cancelado automaticamente por falta de pagamento`);
            } catch (error) {
                console.error(`Erro ao cancelar automaticamente pedido ${order.id}:`, error);
            }
        });

        if (ordersToCancel.length > 0) {
            this.saveOrders();
        }
    }

    // Obter pedidos do usuário com filtros
    getUserOrders(userId, filters = {}) {
        let orders = this.orders.filter(order => order.userId === userId);

        // Filtro por status
        if (filters.status) {
            orders = orders.filter(order => order.status === filters.status);
        }

        // Filtro por período
        if (filters.period) {
            const now = new Date();
            let startDate;
            
            switch (filters.period) {
                case 'last-30':
                    startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    break;
                case 'last-90':
                    startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                    break;
                case 'last-year':
                    startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                    break;
            }
            
            if (startDate) {
                orders = orders.filter(order => new Date(order.createdAt) >= startDate);
            }
        }

        return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Obter pedido por ID
    getOrderById(orderId) {
        return this.orders.find(order => order.id === orderId);
    }

    // Obter endereços do usuário
    getUserAddresses(userId) {
        return this.addresses[userId] || {};
    }

    // Remover endereço
    removeUserAddress(userId, addressType) {
        if (this.addresses[userId] && this.addresses[userId][addressType]) {
            delete this.addresses[userId][addressType];
            localStorage.setItem('user_addresses', JSON.stringify(this.addresses));
            return true;
        }
        return false;
    }

    // Salvar pedidos
    saveOrders() {
        localStorage.setItem('orders', JSON.stringify(this.orders));
    }

    // Formatar preço
    formatPrice(price) {
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

    // Verificar se pedido pode ser cancelado
    canCancelOrder(orderId) {
        const order = this.getOrderById(orderId);
        return order && ['Aguardando Pagamento', 'Pago'].includes(order.status);
    }

    // Verificar se pedido pode ser devolvido
    canReturnOrder(orderId) {
        const order = this.getOrderById(orderId);
        if (!order || order.status !== 'Entregue') return false;
        
        const deliveryDate = new Date(order.statusHistory.find(h => h.status === 'Entregue')?.date);
        const now = new Date();
        const daysSinceDelivery = Math.floor((now - deliveryDate) / (1000 * 60 * 60 * 24));
        
        return daysSinceDelivery <= 30; // 30 dias máximo para devolução
    }

    // Obter estatísticas dos pedidos
    getOrderStats(userId) {
        const userOrders = this.getUserOrders(userId);
        
        return {
            total: userOrders.length,
            aguardandoPagamento: userOrders.filter(o => o.status === 'Aguardando Pagamento').length,
            pago: userOrders.filter(o => o.status === 'Pago').length,
            emTransporte: userOrders.filter(o => o.status === 'Em Transporte').length,
            entregue: userOrders.filter(o => o.status === 'Entregue').length,
            cancelado: userOrders.filter(o => o.status === 'Cancelado').length,
            devolvido: userOrders.filter(o => o.status === 'Devolvido').length,
            totalValue: userOrders.reduce((sum, order) => sum + order.total, 0)
        };
    }
}

// Instância global
window.orderManager = new OrderManager();
