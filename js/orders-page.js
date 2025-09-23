// Script para gerenciar a página de pedidos
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o usuário está logado
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = 'login.html';
        return;
    }

    // Carregar pedidos
    loadOrders();
    setupEventListeners();
});

let currentOrderId = null;

// Carregar pedidos
function loadOrders() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const orders = orderManager.getUserOrders(currentUser.id);
    const statusFilter = document.getElementById('status-filter').value;
    
    // Filtrar por status
    const filteredOrders = statusFilter ? 
        orders.filter(order => order.status === statusFilter) : 
        orders;
    
    displayOrders(filteredOrders);
}

// Exibir pedidos
function displayOrders(orders) {
    const container = document.getElementById('orders-list');
    const emptyOrders = document.getElementById('empty-orders');
    
    if (orders.length === 0) {
        container.innerHTML = '';
        emptyOrders.style.display = 'block';
        return;
    }
    
    emptyOrders.style.display = 'none';
    container.innerHTML = '';
    
    orders.forEach(order => {
        const orderElement = createOrderElement(order);
        container.appendChild(orderElement);
    });
}

// Criar elemento do pedido
function createOrderElement(order) {
    const orderDiv = document.createElement('div');
    orderDiv.className = 'order-card';
    orderDiv.innerHTML = `
        <div class="order-header">
            <div class="order-info">
                <h3>Pedido #${order.id}</h3>
                <div class="order-date">${formatDate(order.createdAt)}</div>
            </div>
            <div class="order-status">
                <span class="status-badge status-${order.status.toLowerCase().replace(' ', '-')}">
                    ${order.status}
                </span>
            </div>
        </div>
        
        <div class="order-items">
            ${order.items.map(item => `
                <div class="order-item">
                    <img src="${item.image}" alt="${item.title}">
                    <div class="item-details">
                        <h4>${item.title}</h4>
                        <div class="item-quantity">Qtd: ${item.quantity}</div>
                        <div class="item-price">${formatPrice(item.price * item.quantity)}</div>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="order-footer">
            <div class="order-total">
                <span>Total: ${formatPrice(order.total)}</span>
            </div>
            <div class="order-actions">
                <button class="btn-secondary" onclick="viewOrderDetails('${order.id}')">
                    <i class="fas fa-eye"></i> Ver Detalhes
                </button>
                ${getOrderActionButtons(order)}
            </div>
        </div>
        
        <div class="order-timeline" id="timeline-${order.id}" style="display: none;">
            <h4>Histórico do Pedido</h4>
            <div class="timeline">
                ${order.statusHistory.map(entry => `
                    <div class="timeline-item">
                        <div class="timeline-date">${formatDateTime(entry.date)}</div>
                        <div class="timeline-content">
                            <strong>${entry.status}</strong>
                            <p>${entry.description}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    return orderDiv;
}

// Obter botões de ação do pedido
function getOrderActionButtons(order) {
    let buttons = '';
    
    // Botão de cancelamento
    if (orderManager.canCancelOrder(order.id)) {
        buttons += `
            <button class="btn danger" onclick="showCancelModal('${order.id}')">
                <i class="fas fa-times"></i> Cancelar
            </button>
        `;
    }
    
    // Botão de devolução
    if (orderManager.canReturnOrder(order.id)) {
        buttons += `
            <button class="btn warning" onclick="showReturnModal('${order.id}')">
                <i class="fas fa-undo"></i> Devolver
            </button>
        `;
    }
    
    return buttons;
}

// Configurar event listeners
function setupEventListeners() {
    // Filtro de status
    document.getElementById('status-filter').addEventListener('change', loadOrders);
    
    // Modal de cancelamento
    document.getElementById('confirm-cancel').addEventListener('click', confirmCancel);
    document.getElementById('cancel-cancel').addEventListener('click', closeCancelModal);
    
    // Modal de devolução
    document.getElementById('confirm-return').addEventListener('click', confirmReturn);
    document.getElementById('cancel-return').addEventListener('click', closeReturnModal);
    
    // Fechar modais
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // Fechar modal clicando fora
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

// Ver detalhes do pedido
function viewOrderDetails(orderId) {
    const timeline = document.getElementById(`timeline-${orderId}`);
    if (timeline.style.display === 'none') {
        timeline.style.display = 'block';
    } else {
        timeline.style.display = 'none';
    }
}

// Mostrar modal de cancelamento
function showCancelModal(orderId) {
    currentOrderId = orderId;
    document.getElementById('cancel-modal').style.display = 'block';
    document.getElementById('cancel-reason').value = '';
}

// Fechar modal de cancelamento
function closeCancelModal() {
    document.getElementById('cancel-modal').style.display = 'none';
    currentOrderId = null;
}

// Confirmar cancelamento
function confirmCancel() {
    const reason = document.getElementById('cancel-reason').value.trim();
    
    if (reason.length < 10) {
        alert('O motivo do cancelamento deve ter pelo menos 10 caracteres.');
        return;
    }
    
    try {
        orderManager.cancelOrder(currentOrderId, reason);
        alert('Pedido cancelado com sucesso!');
        closeCancelModal();
        loadOrders(); // Recarregar lista
    } catch (error) {
        alert('Erro ao cancelar pedido: ' + error.message);
    }
}

// Mostrar modal de devolução
function showReturnModal(orderId) {
    currentOrderId = orderId;
    document.getElementById('return-modal').style.display = 'block';
    document.getElementById('return-reason').value = '';
}

// Fechar modal de devolução
function closeReturnModal() {
    document.getElementById('return-modal').style.display = 'none';
    currentOrderId = null;
}

// Confirmar devolução
function confirmReturn() {
    const reason = document.getElementById('return-reason').value.trim();
    
    if (!reason) {
        alert('Informe o motivo da devolução.');
        return;
    }
    
    try {
        // Simular devolução
        orderManager.updateOrderStatus(currentOrderId, 'Devolvido', `Devolução: ${reason}`);
        alert('Solicitação de devolução enviada com sucesso!');
        closeReturnModal();
        loadOrders(); // Recarregar lista
    } catch (error) {
        alert('Erro ao solicitar devolução: ' + error.message);
    }
}

// Formatar data
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Formatar data e hora
function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Formatar preço
function formatPrice(price) {
    return price.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}
