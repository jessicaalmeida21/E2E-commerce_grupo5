// Script simplificado para gerenciar pedidos
document.addEventListener('DOMContentLoaded', function() {
    initOrdersPage();
});

let currentUser = null;
let allOrders = [];
let filteredOrders = [];

function initOrdersPage() {
    checkUserPermissions();
    loadOrders();
    setupEventListeners();
    setupHeader();
}

function checkUserPermissions() {
    const userData = JSON.parse(localStorage.getItem('currentUser'));
    if (!userData) {
        alert('Você precisa estar logado.');
        window.location.href = './login.html';
        return;
    }
    currentUser = userData;
}

function setupHeader() {
    const userNameHeader = document.getElementById('user-name-header');
    const logoutBtn = document.getElementById('logout-btn-header');
    
    if (userNameHeader) userNameHeader.textContent = currentUser.name;
    if (logoutBtn) logoutBtn.addEventListener('click', logout);
}

function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('sessionTimeout');
    window.location.href = './login.html';
}

function loadOrders() {
    allOrders = JSON.parse(localStorage.getItem('orders')) || [];
    filteredOrders = allOrders.filter(order => order.user_id === currentUser.id);
    displayOrders();
}

function displayOrders() {
    const ordersList = document.getElementById('orders-list');
    const emptyState = document.getElementById('empty-orders');
    
    if (filteredOrders.length === 0) {
        if (ordersList) ordersList.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }
    
    if (ordersList) ordersList.style.display = 'block';
    if (emptyState) emptyState.style.display = 'none';
    if (ordersList) ordersList.innerHTML = '';
    
    filteredOrders.forEach(order => {
        const orderElement = createOrderCard(order);
        if (ordersList) ordersList.appendChild(orderElement);
    });
}

function createOrderCard(order) {
    const orderElement = document.createElement('div');
    orderElement.className = 'order-card';
    
    const statusInfo = getStatusInfo(order.status);
    const canCancel = ['aguardando-pagamento', 'pago'].includes(order.status);
    const canReturn = order.status === 'entregue';
    
    orderElement.innerHTML = `
        <div class="order-header">
            <div class="order-info">
                <h3>Pedido #${order.id}</h3>
                <p class="order-date">${formatDate(order.created_at)}</p>
            </div>
            <div class="order-status">
                <span class="status-badge ${statusInfo.class}">${statusInfo.text}</span>
            </div>
        </div>
        
        <div class="order-items">
            ${order.items.map(item => `
                <div class="order-item">
                    <img src="${item.image}" alt="${item.title}" class="item-image">
                    <div class="item-info">
                        <h4>${item.title}</h4>
                        <p>Qtd: ${item.quantity} | ${item.brand || 'Marca'}</p>
                    </div>
                    <div class="item-price">${formatPrice(item.price * item.quantity)}</div>
                </div>
            `).join('')}
        </div>
        
        <div class="order-footer">
            <div class="order-total">
                <span>Total: <strong>${formatPrice(order.totals.total)}</strong></span>
            </div>
            <div class="order-actions">
                <button class="btn secondary" onclick="viewOrderDetails('${order.id}')">
                    <i class="fas fa-eye"></i> Ver Detalhes
                </button>
                ${canCancel ? `
                    <button class="btn danger" onclick="cancelOrder('${order.id}')">
                        <i class="fas fa-times"></i> Cancelar
                    </button>
                ` : ''}
                ${canReturn ? `
                    <button class="btn warning" onclick="returnOrder('${order.id}')">
                        <i class="fas fa-undo"></i> Devolver
                    </button>
                ` : ''}
            </div>
        </div>
    `;
    
    return orderElement;
}

function getStatusInfo(status) {
    const statusMap = {
        'aguardando-pagamento': { text: 'Aguardando Pagamento', class: 'warning' },
        'pago': { text: 'Pago', class: 'info' },
        'aguardando-envio': { text: 'Aguardando Envio', class: 'info' },
        'em-transporte': { text: 'Em Transporte', class: 'primary' },
        'entregue': { text: 'Entregue', class: 'success' },
        'cancelado': { text: 'Cancelado', class: 'danger' },
        'devolvido': { text: 'Devolvido', class: 'warning' }
    };
    return statusMap[status] || { text: 'Desconhecido', class: 'muted' };
}

function setupEventListeners() {
    const statusFilter = document.getElementById('status-filter');
    const periodFilter = document.getElementById('period-filter');
    const refreshBtn = document.getElementById('refresh-btn');
    const newOrderBtn = document.getElementById('new-order-btn');
    
    if (statusFilter) statusFilter.addEventListener('change', applyFilters);
    if (periodFilter) periodFilter.addEventListener('change', applyFilters);
    if (refreshBtn) refreshBtn.addEventListener('click', loadOrders);
    if (newOrderBtn) newOrderBtn.addEventListener('click', () => window.location.href = './catalog.html');
}

function applyFilters() {
    const statusFilter = document.getElementById('status-filter').value;
    const periodFilter = document.getElementById('period-filter').value;
    
    filteredOrders = allOrders.filter(order => {
        if (order.user_id !== currentUser.id) return false;
        if (statusFilter && order.status !== statusFilter) return false;
        
        if (periodFilter) {
            const orderDate = new Date(order.created_at);
            const now = new Date();
            const daysDiff = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));
            
            switch (periodFilter) {
                case 'last-30': if (daysDiff > 30) return false; break;
                case 'last-90': if (daysDiff > 90) return false; break;
                case 'last-year': if (daysDiff > 365) return false; break;
            }
        }
        
        return true;
    });
    
    displayOrders();
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatPrice(price) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(price);
}

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
    
    setTimeout(() => notification.style.opacity = '1', 100);
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Funções placeholder para modais
function viewOrderDetails(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;
    
    let details = `Detalhes do Pedido #${order.id}\n`;
    details += `Status: ${getStatusInfo(order.status).text}\n`;
    details += `Total: ${formatPrice(order.totals.total)}\n`;
    
    // Adicionar informações de logística se disponíveis
    if (order.logistics && window.logisticsUI) {
        details += `\nRastreamento: ${order.logistics.tracking_code}\n`;
        details += `Status Logístico: ${order.logistics.status}\n`;
        
        if (order.logistics.history && order.logistics.history.length > 0) {
            const lastEvent = order.logistics.history[order.logistics.history.length - 1];
            details += `Última Atualização: ${formatDate(lastEvent.timestamp)}\n`;
            details += `Descrição: ${lastEvent.description}`;
        }
    }
    
    alert(details);
}

function cancelOrder(orderId) {
    const reason = prompt('Motivo do cancelamento:');
    if (!reason) return;
    
    const order = allOrders.find(o => o.id === orderId);
    if (order) {
        order.status = 'cancelado';
        order.cancellation = { reason, cancelled_at: new Date().toISOString() };
        localStorage.setItem('orders', JSON.stringify(allOrders));
        loadOrders();
        showNotification('Pedido cancelado com sucesso', 'success');
    }
}

function returnOrder(orderId) {
    const type = prompt('Tipo de devolução (defect/no-defect):');
    const reason = prompt('Motivo da devolução:');
    if (!type || !reason) return;
    
    const order = allOrders.find(o => o.id === orderId);
    if (order) {
        order.status = 'devolvido';
        order.return = { type, reason, returned_at: new Date().toISOString() };
        localStorage.setItem('orders', JSON.stringify(allOrders));
        loadOrders();
        showNotification('Solicitação de devolução enviada', 'success');
    }
}

// Exportar funções para uso global
window.viewOrderDetails = viewOrderDetails;
window.cancelOrder = cancelOrder;
window.returnOrder = returnOrder;
