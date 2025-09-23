// Sistema de Gestão de Pedidos
class OrderManager {
    constructor() {
        this.orders = JSON.parse(localStorage.getItem('orders')) || [];
        this.nextOrderId = this.getNextOrderId();
    }

    // Gerar próximo ID de pedido
    getNextOrderId() {
        const lastOrder = this.orders.reduce((max, order) => 
            Math.max(max, parseInt(order.id) || 0), 0);
        return (lastOrder + 1).toString();
    }

    // Criar novo pedido
    createOrder(cart, shippingAddress, paymentMethod) {
        if (!cart || cart.length === 0) {
            throw new Error('Carrinho vazio');
        }

        // Verificar estoque
        this.validateStock(cart);

        const order = {
            id: this.nextOrderId,
            userId: this.getCurrentUserId(),
            items: cart.map(item => ({
                productId: item.id,
                title: item.title,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            })),
            subtotal: this.calculateSubtotal(cart),
            shipping: this.calculateShipping(this.calculateSubtotal(cart)),
            total: 0,
            status: 'Aguardando Pagamento',
            paymentMethod: paymentMethod,
            shippingAddress: shippingAddress,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            statusHistory: [{
                status: 'Aguardando Pagamento',
                date: new Date().toISOString(),
                description: 'Pedido criado'
            }]
        };

        order.total = order.subtotal + order.shipping;
        this.orders.push(order);
        this.nextOrderId = (parseInt(this.nextOrderId) + 1).toString();
        
        this.saveOrders();
        return order;
    }

    // Validar estoque
    validateStock(cart) {
        // Simulação - em produção seria verificação real no banco
        cart.forEach(item => {
            if (item.quantity <= 0) {
                throw new Error(`Produto ${item.title} sem estoque disponível`);
            }
        });
    }

    // Calcular subtotal
    calculateSubtotal(cart) {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
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
            throw new Error('Transição de status inválida');
        }

        order.status = newStatus;
        order.updatedAt = new Date().toISOString();
        order.statusHistory.push({
            status: newStatus,
            date: new Date().toISOString(),
            description: reason || this.getStatusDescription(newStatus)
        });

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
            'Pago': 'Pagamento confirmado',
            'Em Transporte': 'Pedido em transporte',
            'Entregue': 'Pedido entregue',
            'Cancelado': 'Pedido cancelado',
            'Devolvido': 'Pedido devolvido'
        };
        return descriptions[status] || status;
    }

    // Cancelar pedido
    cancelOrder(orderId, reason) {
        if (!reason || reason.trim().length < 10) {
            throw new Error('Motivo do cancelamento é obrigatório (mínimo 10 caracteres)');
        }

        const order = this.orders.find(o => o.id === orderId);
        if (!order) {
            throw new Error('Pedido não encontrado');
        }

        if (!['Aguardando Pagamento', 'Pago'].includes(order.status)) {
            throw new Error('Pedido não pode ser cancelado neste status');
        }

        return this.updateOrderStatus(orderId, 'Cancelado', `Cancelado: ${reason}`);
    }

    // Obter pedidos do usuário
    getUserOrders(userId) {
        return this.orders.filter(order => order.userId === userId)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Obter pedido por ID
    getOrderById(orderId) {
        return this.orders.find(order => order.id === orderId);
    }

    // Salvar pedidos
    saveOrders() {
        localStorage.setItem('orders', JSON.stringify(this.orders));
    }

    // Formatar preço
    formatPrice(price) {
        return price.toLocaleString('pt-BR', {
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
        
        return daysSinceDelivery <= 30; // 30 dias para devolução
    }
}

// Instância global
window.orderManager = new OrderManager();
