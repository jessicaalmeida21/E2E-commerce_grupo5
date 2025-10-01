// Script para gerenciar a página de pedidos - VERSÃO COMPLETA
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o usuário está logado
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = 'login.html';
        return;
    }

    // Carregar pedidos e estatísticas
    loadOrders();
    loadOrderStats();
    setupEventListeners();
});

let currentOrderId = null;

// Carregar estatísticas dos pedidos
function loadOrderStats() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const stats = orderManager.getOrderStats(currentUser.id);
    
    // Atualizar contadores na interface
    updateStatsDisplay(stats);
}

// Atualizar exibição das estatísticas
function updateStatsDisplay(stats) {
    const statsContainer = document.getElementById('order-stats');
    if (statsContainer) {
        statsContainer.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number">${stats.total}</div>
                    <div class="stat-label">Total de Pedidos</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${stats.aguardandoPagamento}</div>
                    <div class="stat-label">Aguardando Pagamento</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${stats.emTransporte}</div>
                    <div class="stat-label">Em Transporte</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${stats.entregue}</div>
                    <div class="stat-label">Entregues</div>
                </div>
                <div class="stat-card total-value">
                    <div class="stat-number">${orderManager.formatPrice(stats.totalValue)}</div>
                    <div class="stat-label">Valor Total</div>
                </div>
            </div>
        `;
    }
}

// Carregar pedidos com filtros avançados
function loadOrders() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const statusFilter = document.getElementById('status-filter').value;
    const periodFilter = document.getElementById('period-filter').value;
    
    const filters = {};
    if (statusFilter) filters.status = statusFilter;
    if (periodFilter) filters.period = periodFilter;
    
    const orders = orderManager.getUserOrders(currentUser.id, filters);
    displayOrders(orders);
    
    // Atualizar contador de resultados
    updateResultsCount(orders.length);
}

// Atualizar contador de resultados
function updateResultsCount(count) {
    const counter = document.getElementById('results-count');
    if (counter) {
        counter.textContent = `${count} pedido${count !== 1 ? 's' : ''} encontrado${count !== 1 ? 's' : ''}`;
    }
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
    
    // Determinar se o pedido está próximo do cancelamento automático
    const isNearCancellation = checkNearCancellation(order);
    
    orderDiv.innerHTML = `
        <div class="order-header">
            <div class="order-info">
                <h3>Pedido #${order.id}</h3>
                <div class="order-date">${formatDate(order.createdAt)}</div>
                ${isNearCancellation ? '<div class="cancellation-warning"><i class="fas fa-exclamation-triangle"></i> Pagamento pendente - Cancelamento automático em breve</div>' : ''}
            </div>
            <div class="order-status">
                <span class="status-badge status-${order.status.toLowerCase().replace(/\s+/g, '-')}">
                    ${order.status}
                </span>
                ${order.autoCancelled ? '<div class="auto-cancelled-badge">Cancelado Automaticamente</div>' : ''}
            </div>
        </div>
        
        <div class="order-items">
            ${order.items.map(item => `
                <div class="order-item">
                    <img src="${item.image}" alt="${item.title}" onerror="this.src='images/placeholder.jpg'">
                    <div class="item-details">
                        <h4>${item.title}</h4>
                        <div class="item-quantity">Qtd: ${item.quantity}</div>
                        <div class="item-price">${orderManager.formatPrice(item.price * item.quantity)}</div>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="order-summary">
            <div class="summary-row">
                <span>Subtotal:</span>
                <span>${orderManager.formatPrice(order.subtotal)}</span>
            </div>
            <div class="summary-row">
                <span>Frete:</span>
                <span>${order.shipping === 0 ? 'Grátis' : orderManager.formatPrice(order.shipping)}</span>
            </div>
            <div class="summary-row total">
                <span><strong>Total:</strong></span>
                <span><strong>${orderManager.formatPrice(order.total)}</strong></span>
            </div>
        </div>
        
        ${order.shippingAddress ? `
            <div class="shipping-address">
                <h4><i class="fas fa-map-marker-alt"></i> Endereço de Entrega (${order.addressType})</h4>
                <p>${order.shippingAddress.logradouro}, ${order.shippingAddress.numero || 'S/N'}</p>
                <p>${order.shippingAddress.bairro} - ${order.shippingAddress.cidade}/${order.shippingAddress.uf}</p>
                <p>CEP: ${order.shippingAddress.cep}</p>
                ${order.shippingAddress.complemento ? `<p>Complemento: ${order.shippingAddress.complemento}</p>` : ''}
            </div>
        ` : ''}
        
        <div class="order-footer">
            <div class="order-actions">
                <button class="btn-secondary" onclick="toggleOrderDetails('${order.id}')">
                    <i class="fas fa-eye"></i> <span id="toggle-text-${order.id}">Ver Detalhes</span>
                </button>
                ${order.logistics ? `
                    <button class="btn-info" onclick="showTrackingInfo('${order.id}')">
                        <i class="fas fa-truck"></i> Rastrear Pedido
                    </button>
                ` : ''}
                ${getOrderActionButtons(order)}
            </div>
            ${order.logistics ? `
                <div class="logistics-summary">
                    <div class="logistics-info">
                        <span class="tracking-code">
                            <i class="fas fa-barcode"></i> ${order.logistics.tracking_code}
                        </span>
                        <span class="logistics-status status-${order.logistics.status}">
                            ${getLogisticsStatusText(order.logistics.status)}
                        </span>
                    </div>
                </div>
            ` : ''}
        </div>
        
        <div class="order-timeline" id="timeline-${order.id}" style="display: none;">
            <h4><i class="fas fa-history"></i> Histórico do Pedido</h4>
            <div class="timeline">
                ${order.statusHistory.map((entry, index) => `
                    <div class="timeline-item ${index === 0 ? 'current' : ''}">
                        <div class="timeline-marker"></div>
                        <div class="timeline-content">
                            <div class="timeline-date">${formatDateTime(entry.date)}</div>
                            <div class="timeline-status"><strong>${entry.status}</strong></div>
                            <div class="timeline-description">${entry.description}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            ${order.cancellationReason ? `
                <div class="cancellation-info">
                    <h5><i class="fas fa-ban"></i> Motivo do Cancelamento</h5>
                    <p>${order.cancellationReason}</p>
                    <small>Cancelado em: ${formatDateTime(order.cancellationDate)}</small>
                </div>
            ` : ''}
            
            ${order.returnReason ? `
                <div class="return-info">
                    <h5><i class="fas fa-undo"></i> Motivo da Devolução</h5>
                    <p>${order.returnReason}</p>
                    <p><strong>Tipo:</strong> ${order.hasDefect ? 'Produto com defeito (30 dias)' : 'Produto sem defeito (7 dias)'}</p>
                    <small>Solicitado em: ${formatDateTime(order.returnDate)}</small>
                </div>
            ` : ''}
        </div>
    `;
    
    return orderDiv;
}

// Verificar se o pedido está próximo do cancelamento automático
function checkNearCancellation(order) {
    if (order.status !== 'Aguardando Pagamento' || !order.cancellationDeadline) {
        return false;
    }
    
    const now = new Date();
    const deadline = new Date(order.cancellationDeadline);
    const hoursRemaining = (deadline - now) / (1000 * 60 * 60);
    
    return hoursRemaining <= 24 && hoursRemaining > 0; // Avisar nas últimas 24 horas
}

// Obter botões de ação do pedido
function getOrderActionButtons(order) {
    let buttons = '';
    
    // Botão de cancelamento
    if (orderManager.canCancelOrder(order.id)) {
        buttons += `
            <button class="btn danger" onclick="showCancelModal('${order.id}')">
                <i class="fas fa-times"></i> Cancelar Pedido
            </button>
        `;
    }
    
    // Botão de devolução
    if (orderManager.canReturnOrder(order.id)) {
        buttons += `
            <button class="btn warning" onclick="showReturnModal('${order.id}')">
                <i class="fas fa-undo"></i> Solicitar Devolução
            </button>
        `;
    }
    
    // Botão de rastreamento (simulado)
    if (order.status === 'Em Transporte') {
        buttons += `
            <button class="btn info" onclick="showTrackingInfo('${order.id}')">
                <i class="fas fa-truck"></i> Rastrear Pedido
            </button>
        `;
    }
    
    return buttons;
}

// Configurar event listeners
function setupEventListeners() {
    // Botões principais
    const newOrderBtn = document.getElementById('new-order-btn');
    if (newOrderBtn) {
        newOrderBtn.addEventListener('click', () => {
            window.location.href = 'catalog.html';
        });
    }

    const manageAddressesBtn = document.getElementById('manage-addresses-btn');
    if (manageAddressesBtn) {
        manageAddressesBtn.addEventListener('click', openAddressesModal);
    }

    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', loadOrders);
    }

    // Filtros
    const statusFilter = document.getElementById('status-filter');
    if (statusFilter) {
        statusFilter.addEventListener('change', loadOrders);
    }

    const periodFilter = document.getElementById('period-filter');
    if (periodFilter) {
        periodFilter.addEventListener('change', loadOrders);
    }

    const valueFilter = document.getElementById('value-filter');
    if (valueFilter) {
        valueFilter.addEventListener('change', loadOrders);
    }
    
    // Botão de limpar filtros
    const clearFiltersBtn = document.getElementById('clear-filters-btn');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearFilters);
    }

    // Aviso de pagamentos pendentes
    const viewPendingBtn = document.getElementById('view-pending-payments');
    if (viewPendingBtn) {
        viewPendingBtn.addEventListener('click', () => {
            document.getElementById('status-filter').value = 'aguardando-pagamento';
            loadOrders();
        });
    }

    // Modal de detalhes do pedido
    const closeOrderModal = document.getElementById('close-order-modal');
    if (closeOrderModal) {
        closeOrderModal.addEventListener('click', closeOrderDetailsModal);
    }

    const closeOrderDetails = document.getElementById('close-order-details');
    if (closeOrderDetails) {
        closeOrderDetails.addEventListener('click', closeOrderDetailsModal);
    }

    const cancelOrderBtn = document.getElementById('cancel-order-btn');
    if (cancelOrderBtn) {
        cancelOrderBtn.addEventListener('click', openCancelModal);
    }

    const returnOrderBtn = document.getElementById('return-order-btn');
    if (returnOrderBtn) {
        returnOrderBtn.addEventListener('click', openReturnModal);
    }

    // Modal de cancelamento
    const closeCancelModal = document.getElementById('close-cancel-modal');
    if (closeCancelModal) {
        closeCancelModal.addEventListener('click', () => {
            document.getElementById('cancel-order-modal').style.display = 'none';
        });
    }

    const cancelCancelOrder = document.getElementById('cancel-cancel-order');
    if (cancelCancelOrder) {
        cancelCancelOrder.addEventListener('click', () => {
            document.getElementById('cancel-order-modal').style.display = 'none';
        });
    }

    const confirmCancelOrder = document.getElementById('confirm-cancel-order');
    if (confirmCancelOrder) {
        confirmCancelOrder.addEventListener('click', confirmCancel);
    }

    // Modal de devolução
    const closeReturnModal = document.getElementById('close-return-modal');
    if (closeReturnModal) {
        closeReturnModal.addEventListener('click', () => {
            document.getElementById('return-order-modal').style.display = 'none';
        });
    }

    const cancelReturnOrder = document.getElementById('cancel-return-order');
    if (cancelReturnOrder) {
        cancelReturnOrder.addEventListener('click', () => {
            document.getElementById('return-order-modal').style.display = 'none';
        });
    }

    const confirmReturnOrder = document.getElementById('confirm-return-order');
    if (confirmReturnOrder) {
        confirmReturnOrder.addEventListener('click', confirmReturn);
    }

    // Modal de endereços
    const closeAddressesModal = document.getElementById('close-addresses-modal');
    if (closeAddressesModal) {
        closeAddressesModal.addEventListener('click', () => {
            document.getElementById('addresses-modal').style.display = 'none';
        });
    }

    const closeAddresses = document.getElementById('close-addresses');
    if (closeAddresses) {
        closeAddresses.addEventListener('click', () => {
            document.getElementById('addresses-modal').style.display = 'none';
        });
    }

    const addAddressBtn = document.getElementById('add-address-btn');
    if (addAddressBtn) {
        addAddressBtn.addEventListener('click', showAddAddressForm);
    }

    const saveAddressBtn = document.getElementById('save-address-btn');
    if (saveAddressBtn) {
        saveAddressBtn.addEventListener('click', saveAddress);
    }

    const cancelAddressBtn = document.getElementById('cancel-address-btn');
    if (cancelAddressBtn) {
        cancelAddressBtn.addEventListener('click', hideAddAddressForm);
    }

    // CEP input
    const addressCep = document.getElementById('address-cep');
    if (addressCep) {
        addressCep.addEventListener('input', formatCEP);
        addressCep.addEventListener('blur', consultCEP);
    }

    // Fechar modais clicando fora
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
}

// Limpar filtros
function clearFilters() {
    const statusFilter = document.getElementById('status-filter');
    const periodFilter = document.getElementById('period-filter');
    const valueFilter = document.getElementById('value-filter');
    
    if (statusFilter) statusFilter.value = '';
    if (periodFilter) periodFilter.value = '';
    if (valueFilter) valueFilter.value = '';
    
    loadOrders();
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

// Alternar detalhes do pedido
function toggleOrderDetails(orderId) {
    const timeline = document.getElementById(`timeline-${orderId}`);
    const toggleText = document.getElementById(`toggle-text-${orderId}`);
    
    if (timeline.style.display === 'none') {
        timeline.style.display = 'block';
        toggleText.textContent = 'Ocultar Detalhes';
    } else {
        timeline.style.display = 'none';
        toggleText.textContent = 'Ver Detalhes';
    }
}

// Mostrar informações de rastreamento (simulado)
function showTrackingInfo(orderId) {
    const order = orderManager.getOrderById(orderId);
    if (!order) return;
    
    // Se o pedido tem logística, mostrar informações detalhadas
    if (order.logistics) {
        const logisticsUI = new LogisticsUI();
        const trackingCard = logisticsUI.renderTrackingCard(order.logistics, order.id);
        
        // Criar modal para exibir informações de rastreamento
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content tracking-modal">
                <div class="modal-header">
                    <h3><i class="fas fa-truck"></i> Rastreamento do Pedido #${orderId}</h3>
                    <button class="close-btn" onclick="this.closest('.modal-overlay').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${trackingCard}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Fechar modal ao clicar fora
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    } else {
        // Fallback para pedidos sem logística
        alert(`Rastreamento do Pedido #${orderId}\n\nStatus: ${order.status}\nÚltima atualização: ${formatDateTime(order.updatedAt)}\n\nEm breve você receberá o código de rastreamento por email.`);
    }
}

// Mostrar modal de cancelamento
function showCancelModal(orderId) {
    currentOrderId = orderId;
    document.getElementById('cancel-modal').style.display = 'block';
    document.getElementById('cancel-reason').value = '';
    document.getElementById('cancel-reason').focus();
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
        const result = orderManager.cancelOrder(currentOrderId, reason);
        
        if (result.success) {
            alert('Pedido cancelado com sucesso!');
            document.getElementById('cancel-order-modal').style.display = 'none';
            loadOrders();
            loadOrderStats();
        } else {
            alert(`Erro ao cancelar pedido: ${result.message}`);
        }
    } catch (error) {
        alert(`Erro: ${error.message}`);
    }
}

// Confirmar devolução
function confirmReturn() {
    const returnType = document.getElementById('return-type').value;
    const reason = document.getElementById('return-reason').value.trim();
    
    if (!returnType) {
        alert('Selecione o tipo de devolução.');
        return;
    }
    
    if (reason.length < 10) {
        alert('O motivo da devolução deve ter pelo menos 10 caracteres.');
        return;
    }
    
    try {
        const hasDefect = returnType === 'defect';
        const result = orderManager.requestReturn(currentOrderId, reason, hasDefect);
        
        if (result.success) {
            alert('Solicitação de devolução enviada com sucesso!');
            document.getElementById('return-order-modal').style.display = 'none';
            loadOrders();
            loadOrderStats();
        } else {
            alert(`Erro ao solicitar devolução: ${result.message}`);
        }
    } catch (error) {
        alert(`Erro: ${error.message}`);
    }
}

// Abrir modal de cancelamento
function openCancelModal() {
    const order = orderManager.getOrderById(currentOrderId);
    if (!order) return;
    
    document.getElementById('cancel-order-number').textContent = `Pedido #${order.id}`;
    document.getElementById('cancel-order-value').textContent = orderManager.formatPrice(order.total);
    document.getElementById('cancel-reason').value = '';
    document.getElementById('cancel-order-modal').style.display = 'block';
}

// Abrir modal de devolução
function openReturnModal() {
    const order = orderManager.getOrderById(currentOrderId);
    if (!order) return;
    
    document.getElementById('return-order-number').textContent = `Pedido #${order.id}`;
    document.getElementById('return-delivery-date').textContent = formatDate(order.deliveredAt);
    document.getElementById('return-type').value = '';
    document.getElementById('return-reason').value = '';
    document.getElementById('return-order-modal').style.display = 'block';
}

// Fechar modal de detalhes do pedido
function closeOrderDetailsModal() {
    document.getElementById('order-details-modal').style.display = 'none';
    currentOrderId = null;
}

// Abrir modal de endereços
function openAddressesModal() {
    loadUserAddresses();
    document.getElementById('addresses-modal').style.display = 'block';
}

// Carregar endereços do usuário
function loadUserAddresses() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const addresses = orderManager.getUserAddresses(currentUser.id);
    const addressesList = document.getElementById('addresses-list');
    
    if (addresses.length === 0) {
        addressesList.innerHTML = '<p>Nenhum endereço cadastrado.</p>';
        return;
    }
    
    let html = '';
    addresses.forEach((address, index) => {
        html += `
            <div class="address-card">
                <div class="address-header">
                    <h4><i class="fas fa-map-marker-alt"></i> ${address.type.charAt(0).toUpperCase() + address.type.slice(1)}</h4>
                    <button class="btn danger small" onclick="removeAddress(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="address-details">
                    <p>${address.street}, ${address.number}</p>
                    ${address.complement ? `<p>${address.complement}</p>` : ''}
                    <p>${address.neighborhood} - ${address.city}/${address.state}</p>
                    <p>CEP: ${address.cep}</p>
                </div>
            </div>
        `;
    });
    
    addressesList.innerHTML = html;
}

// Mostrar formulário de adicionar endereço
function showAddAddressForm() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const addresses = orderManager.getUserAddresses(currentUser.id);
    
    if (addresses.length >= 3) {
        alert('Você já possui o máximo de 3 endereços cadastrados.');
        return;
    }
    
    document.getElementById('add-address-section').style.display = 'block';
    document.getElementById('add-address-btn').style.display = 'none';
    document.getElementById('save-address-btn').style.display = 'inline-block';
    document.getElementById('cancel-address-btn').style.display = 'inline-block';
    
    // Limpar formulário
    document.getElementById('address-form').reset();
}

// Esconder formulário de adicionar endereço
function hideAddAddressForm() {
    document.getElementById('add-address-section').style.display = 'none';
    document.getElementById('add-address-btn').style.display = 'inline-block';
    document.getElementById('save-address-btn').style.display = 'none';
    document.getElementById('cancel-address-btn').style.display = 'none';
}

// Salvar endereço
function saveAddress() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    const address = {
        type: document.getElementById('address-type').value,
        cep: document.getElementById('address-cep').value,
        street: document.getElementById('address-street').value,
        number: document.getElementById('address-number').value,
        complement: document.getElementById('address-complement').value,
        neighborhood: document.getElementById('address-neighborhood').value,
        city: document.getElementById('address-city').value,
        state: document.getElementById('address-state').value
    };
    
    // Validações
    if (!address.type || !address.cep || !address.street || !address.number || !address.neighborhood || !address.city || !address.state) {
        alert('Preencha todos os campos obrigatórios.');
        return;
    }
    
    try {
        const result = orderManager.addUserAddress(currentUser.id, address);
        
        if (result.success) {
            alert('Endereço adicionado com sucesso!');
            hideAddAddressForm();
            loadUserAddresses();
        } else {
            alert(`Erro ao adicionar endereço: ${result.message}`);
        }
    } catch (error) {
        alert(`Erro: ${error.message}`);
    }
}

// Remover endereço
function removeAddress(index) {
    if (confirm('Tem certeza que deseja remover este endereço?')) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const result = orderManager.removeUserAddress(currentUser.id, index);
        
        if (result.success) {
            alert('Endereço removido com sucesso!');
            loadUserAddresses();
        } else {
            alert(`Erro ao remover endereço: ${result.message}`);
        }
    }
}

// Formatar CEP
function formatCEP(event) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 5) {
        value = value.substring(0, 5) + '-' + value.substring(5, 8);
    }
    event.target.value = value;
}

// Consultar CEP
function consultCEP(event) {
    const cep = event.target.value.replace(/\D/g, '');
    
    if (cep.length === 8) {
        // Simular consulta de CEP
        const mockAddresses = {
            '01310100': {
                street: 'Avenida Paulista',
                neighborhood: 'Bela Vista',
                city: 'São Paulo',
                state: 'SP'
            },
            '04038001': {
                street: 'Rua Vergueiro',
                neighborhood: 'Vila Mariana',
                city: 'São Paulo',
                state: 'SP'
            }
        };
        
        const addressData = mockAddresses[cep];
        if (addressData) {
            document.getElementById('address-street').value = addressData.street;
            document.getElementById('address-neighborhood').value = addressData.neighborhood;
            document.getElementById('address-city').value = addressData.city;
            document.getElementById('address-state').value = addressData.state;
        } else {
            alert('CEP não encontrado. Preencha os dados manualmente.');
        }
    }
}

// Limpar filtros
function clearFilters() {
    const statusFilter = document.getElementById('status-filter');
    const periodFilter = document.getElementById('period-filter');
    const valueFilter = document.getElementById('value-filter');
    
    if (statusFilter) statusFilter.value = '';
    if (periodFilter) periodFilter.value = '';
    if (valueFilter) valueFilter.value = '';
    
    loadOrders();
}

// Exportar pedidos (funcionalidade adicional)
function exportOrders() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const orders = orderManager.getUserOrders(currentUser.id);
    
    const csvContent = "data:text/csv;charset=utf-8," + 
        "Pedido,Data,Status,Total,Itens\n" +
        orders.map(order => 
            `${order.id},${formatDate(order.createdAt)},${order.status},${order.total},"${order.items.map(item => `${item.title} (${item.quantity}x)`).join('; ')}"`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `pedidos_${currentUser.name}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Obter texto do status logístico
function getLogisticsStatusText(status) {
    const statusMap = {
        'aguardando-envio': 'Aguardando Envio',
        'em-transporte': 'Em Transporte',
        'entregue': 'Entregue'
    };
    return statusMap[status] || status;
}
