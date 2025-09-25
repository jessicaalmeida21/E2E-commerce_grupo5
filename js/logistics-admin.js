// Script para administração de logística
document.addEventListener('DOMContentLoaded', function() {
    checkUserPermissions();
    loadLogisticsData();
    setupEventListeners();
    setupHeader();
});

let currentUser = null;
let allOrders = [];
let filteredOrders = [];
let currentOrderId = null;

// Verificar permissões do usuário
function checkUserPermissions() {
    const currentUserData = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUserData || currentUserData.profile !== 'seller') {
        alert('Acesso negado. Apenas administradores podem acessar esta página.');
        window.location.href = './login.html';
        return;
    }
    
    currentUser = currentUserData;
}

// Configurar header
function setupHeader() {
    const userNameHeader = document.getElementById('user-name');
    const logoutBtn = document.getElementById('logout-btn');
    
    if (userNameHeader) {
        userNameHeader.textContent = currentUser.name;
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}

// Logout
function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('sessionTimeout');
    window.location.href = './login.html';
}

// Carregar dados de logística
function loadLogisticsData() {
    allOrders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Filtrar apenas pedidos com logística (pagos)
    filteredOrders = allOrders.filter(order => 
        order.logistics || order.status === 'pago'
    );
    
    // Inicializar logística para pedidos pagos sem logística
    filteredOrders.forEach(order => {
        if (order.status === 'pago' && !order.logistics) {
            window.logisticsService.initializeLogistics(order.id);
        }
    });
    
    updateStats();
    displayOrders();
}

// Atualizar estatísticas
function updateStats() {
    const stats = window.logisticsService.getLogisticsStats();
    
    document.getElementById('stats-awaiting').textContent = stats['aguardando-envio'] || 0;
    document.getElementById('stats-transit').textContent = stats['em-transporte'] || 0;
    document.getElementById('stats-delivered').textContent = stats['entregue'] || 0;
    document.getElementById('stats-total').textContent = stats.total || 0;
}

// Exibir pedidos
function displayOrders() {
    const tableBody = document.getElementById('logistics-table-body');
    const emptyState = document.getElementById('empty-logistics');
    
    if (filteredOrders.length === 0) {
        document.querySelector('.logistics-table-container').style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    document.querySelector('.logistics-table-container').style.display = 'block';
    emptyState.style.display = 'none';
    tableBody.innerHTML = '';
    
    filteredOrders.forEach(order => {
        const row = createOrderRow(order);
        tableBody.appendChild(row);
    });
}

// Criar linha da tabela
function createOrderRow(order) {
    const row = document.createElement('tr');
    
    // Buscar dados do usuário
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.id === order.user_id);
    const customerName = user ? user.name : 'Cliente não encontrado';
    
    const logistics = order.logistics;
    const statusInfo = getLogisticsStatusInfo(logistics?.status || 'aguardando-envio');
    
    // Última atualização
    const lastUpdate = logistics?.history?.length > 0 ? 
        logistics.history[logistics.history.length - 1].timestamp : 
        order.created_at;
    
    row.innerHTML = `
        <td>
            <strong>#${order.id}</strong>
            <br>
            <small>${formatPrice(order.totals.total)}</small>
        </td>
        <td>${customerName}</td>
        <td>${formatDate(order.created_at)}</td>
        <td>
            <span class="tracking-code">${logistics?.tracking_code || 'N/A'}</span>
        </td>
        <td>
            <span class="logistics-status-badge ${logistics?.status || 'aguardando-envio'}">
                <i class="${statusInfo.icon}"></i>
                ${statusInfo.text}
            </span>
        </td>
        <td>${formatDate(lastUpdate)}</td>
        <td class="actions">
            <button class="btn secondary btn-sm" onclick="updateOrderStatus('${order.id}')" title="Atualizar Status">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn info btn-sm" onclick="viewOrderHistory('${order.id}')" title="Ver Histórico">
                <i class="fas fa-history"></i>
            </button>
        </td>
    `;
    
    return row;
}

// Obter informações do status logístico
function getLogisticsStatusInfo(status) {
    const statusMap = {
        'aguardando-envio': { text: 'Aguardando Envio', icon: 'fas fa-clock' },
        'em-transporte': { text: 'Em Transporte', icon: 'fas fa-truck' },
        'entregue': { text: 'Entregue', icon: 'fas fa-check-circle' }
    };
    
    return statusMap[status] || { text: 'Desconhecido', icon: 'fas fa-question-circle' };
}

// Configurar event listeners
function setupEventListeners() {
    // Filtros
    document.getElementById('status-filter').addEventListener('change', applyFilters);
    document.getElementById('refresh-btn').addEventListener('click', loadLogisticsData);
    
    // Modais
    setupModalEventListeners();
}

// Configurar event listeners dos modais
function setupModalEventListeners() {
    // Modal de atualização de status
    document.getElementById('close-update-modal').addEventListener('click', closeUpdateModal);
    document.getElementById('cancel-update-status').addEventListener('click', closeUpdateModal);
    document.getElementById('confirm-update-status').addEventListener('click', confirmUpdateStatus);
    
    // Modal de histórico
    document.getElementById('close-history-modal').addEventListener('click', closeHistoryModal);
    document.getElementById('close-history').addEventListener('click', closeHistoryModal);
    
    // Detectar mudança de status para mostrar campo de motivo
    document.getElementById('new-status').addEventListener('change', checkStatusChange);
    
    // Fechar modais clicando fora
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    });
}

// Aplicar filtros
function applyFilters() {
    const statusFilter = document.getElementById('status-filter').value;
    
    filteredOrders = allOrders.filter(order => {
        // Filtrar apenas pedidos com logística
        if (!order.logistics && order.status !== 'pago') return false;
        
        if (statusFilter) {
            const orderStatus = order.logistics?.status || 'aguardando-envio';
            if (orderStatus !== statusFilter) return false;
        }
        
        return true;
    });
    
    displayOrders();
}

// Atualizar status do pedido
function updateOrderStatus(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;
    
    currentOrderId = orderId;
    
    // Preencher informações do modal
    document.getElementById('update-order-number').textContent = `Pedido #${order.id}`;
    document.getElementById('update-tracking-code').textContent = order.logistics?.tracking_code || 'N/A';
    
    const currentStatus = order.logistics?.status || 'aguardando-envio';
    const statusInfo = getLogisticsStatusInfo(currentStatus);
    document.getElementById('update-current-status').textContent = statusInfo.text;
    
    // Limpar formulário
    document.getElementById('new-status').value = '';
    document.getElementById('status-reason').value = '';
    document.getElementById('reason-group').style.display = 'none';
    
    // Limpar mensagens de erro
    const errorMessage = document.getElementById('update-error-message');
    errorMessage.textContent = '';
    errorMessage.classList.remove('show');
    
    // Mostrar modal
    document.getElementById('update-status-modal').classList.add('show');
}

// Verificar mudança de status
function checkStatusChange() {
    const order = allOrders.find(o => o.id === currentOrderId);
    if (!order) return;
    
    const currentStatus = order.logistics?.status || 'aguardando-envio';
    const newStatus = document.getElementById('new-status').value;
    const reasonGroup = document.getElementById('reason-group');
    
    if (!newStatus) {
        reasonGroup.style.display = 'none';
        return;
    }
    
    // Verificar se é uma mudança normal no fluxo
    const statusFlow = ['aguardando-envio', 'em-transporte', 'entregue'];
    const currentIndex = statusFlow.indexOf(currentStatus);
    const newIndex = statusFlow.indexOf(newStatus);
    
    // Se não for a próxima etapa, mostrar campo de motivo
    if (newIndex !== currentIndex + 1) {
        reasonGroup.style.display = 'block';
        document.getElementById('status-reason').required = true;
    } else {
        reasonGroup.style.display = 'none';
        document.getElementById('status-reason').required = false;
    }
}

// Confirmar atualização de status
function confirmUpdateStatus() {
    const newStatus = document.getElementById('new-status').value;
    const reason = document.getElementById('status-reason').value.trim();
    const errorMessage = document.getElementById('update-error-message');
    
    // Limpar mensagens de erro
    errorMessage.textContent = '';
    errorMessage.classList.remove('show');
    
    if (!newStatus) {
        errorMessage.textContent = 'Selecione um novo status.';
        errorMessage.classList.add('show');
        return;
    }
    
    // Verificar se motivo é necessário
    const order = allOrders.find(o => o.id === currentOrderId);
    const currentStatus = order.logistics?.status || 'aguardando-envio';
    const statusFlow = ['aguardando-envio', 'em-transporte', 'entregue'];
    const currentIndex = statusFlow.indexOf(currentStatus);
    const newIndex = statusFlow.indexOf(newStatus);
    
    if (newIndex !== currentIndex + 1 && !reason) {
        errorMessage.textContent = 'Motivo é obrigatório para esta alteração.';
        errorMessage.classList.add('show');
        return;
    }
    
    try {
        // Atualizar status
        window.logisticsService.updateLogisticsStatus(currentOrderId, newStatus, reason || null);
        
        // Recarregar dados
        loadLogisticsData();
        
        // Fechar modal
        closeUpdateModal();
        
        showNotification('Status atualizado com sucesso!', 'success');
        
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        errorMessage.textContent = error.message || 'Erro ao atualizar status.';
        errorMessage.classList.add('show');
    }
}

// Ver histórico do pedido
function viewOrderHistory(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order || !order.logistics) return;
    
    // Preencher informações do modal
    document.getElementById('history-order-number').textContent = `Pedido #${order.id}`;
    document.getElementById('history-tracking-code').textContent = order.logistics.tracking_code;
    
    // Renderizar timeline
    const timeline = document.getElementById('history-timeline');
    timeline.innerHTML = '';
    
    if (order.logistics.history && order.logistics.history.length > 0) {
        order.logistics.history.forEach(event => {
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item';
            
            timelineItem.innerHTML = `
                <div class="timeline-time">${formatDateTime(event.timestamp)}</div>
                <div class="timeline-description">${event.description}</div>
                ${event.reason ? `<div class="timeline-reason">Motivo: ${event.reason}</div>` : ''}
            `;
            
            timeline.appendChild(timelineItem);
        });
    } else {
        timeline.innerHTML = '<p class="text-muted">Nenhum histórico disponível.</p>';
    }
    
    // Mostrar modal
    document.getElementById('history-modal').classList.add('show');
}

// Fechar modais
function closeUpdateModal() {
    document.getElementById('update-status-modal').classList.remove('show');
    currentOrderId = null;
}

function closeHistoryModal() {
    document.getElementById('history-modal').classList.remove('show');
}

// Funções auxiliares
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function formatDateTime(dateString) {
    return new Date(dateString).toLocaleString('pt-BR', {
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
    
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 100);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Exportar funções para uso global
window.updateOrderStatus = updateOrderStatus;
window.viewOrderHistory = viewOrderHistory;
