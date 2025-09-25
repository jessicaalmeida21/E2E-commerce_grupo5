// Sistema de Logística
class LogisticsService {
    constructor() {
        this.statusFlow = [
            'aguardando-envio',
            'em-transporte', 
            'entregue'
        ];
        
        this.statusNames = {
            'aguardando-envio': 'Aguardando Envio',
            'em-transporte': 'Em Transporte',
            'entregue': 'Entregue'
        };
    }
    
    // Calcular frete
    calculateShipping(subtotal) {
        return subtotal >= 399 ? 0 : 100;
    }
    
    // Inicializar logística para um pedido
    initializeLogistics(orderId) {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const order = orders.find(o => o.id === orderId);
        
        if (!order) return null;
        
        if (!order.logistics) {
            order.logistics = {
                status: 'aguardando-envio',
                tracking_code: this.generateTrackingCode(),
                history: [{
                    status: 'aguardando-envio',
                    timestamp: new Date().toISOString(),
                    description: 'Pedido recebido e aguardando envio'
                }]
            };
            
            localStorage.setItem('orders', JSON.stringify(orders));
        }
        
        return order.logistics;
    }
    
    // Atualizar status logístico
    updateLogisticsStatus(orderId, newStatus, reason = null) {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const order = orders.find(o => o.id === orderId);
        
        if (!order || !order.logistics) return false;
        
        const currentIndex = this.statusFlow.indexOf(order.logistics.status);
        const newIndex = this.statusFlow.indexOf(newStatus);
        
        // Validar se pode avançar para o próximo status
        if (newIndex !== currentIndex + 1 && !reason) {
            throw new Error('Não é possível pular etapas sem justificativa');
        }
        
        // Atualizar status
        order.logistics.status = newStatus;
        
        // Adicionar ao histórico
        const historyEntry = {
            status: newStatus,
            timestamp: new Date().toISOString(),
            description: this.getStatusDescription(newStatus)
        };
        
        if (reason) {
            historyEntry.reason = reason;
            historyEntry.description += ` (Motivo: ${reason})`;
        }
        
        order.logistics.history.push(historyEntry);
        
        // Se entregue, definir data de entrega
        if (newStatus === 'entregue') {
            order.delivery_date = new Date().toISOString();
        }
        
        // Atualizar timestamp do pedido
        order.updated_at = new Date().toISOString();
        
        localStorage.setItem('orders', JSON.stringify(orders));
        return true;
    }
    
    // Obter histórico logístico
    getLogisticsHistory(orderId) {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const order = orders.find(o => o.id === orderId);
        
        return order?.logistics?.history || [];
    }
    
    // Gerar código de rastreamento
    generateTrackingCode() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        
        let code = '';
        
        // 2 letras + 9 números + 2 letras (formato BR + Correios)
        code += letters.charAt(Math.floor(Math.random() * letters.length));
        code += letters.charAt(Math.floor(Math.random() * letters.length));
        
        for (let i = 0; i < 9; i++) {
            code += numbers.charAt(Math.floor(Math.random() * numbers.length));
        }
        
        code += letters.charAt(Math.floor(Math.random() * letters.length));
        code += letters.charAt(Math.floor(Math.random() * letters.length));
        
        return code;
    }
    
    // Obter descrição do status
    getStatusDescription(status) {
        const descriptions = {
            'aguardando-envio': 'Pedido sendo preparado para envio',
            'em-transporte': 'Pedido saiu para entrega',
            'entregue': 'Pedido entregue com sucesso'
        };
        
        return descriptions[status] || 'Status atualizado';
    }
    
    // Simular rastreamento
    async simulateTracking(trackingCode) {
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simular dados de rastreamento
        return {
            code: trackingCode,
            status: 'em-transporte',
            events: [
                {
                    date: '2024-01-15 08:00',
                    location: 'Centro de Distribuição - São Paulo/SP',
                    description: 'Objeto postado'
                },
                {
                    date: '2024-01-15 14:30',
                    location: 'Centro de Distribuição - São Paulo/SP',
                    description: 'Objeto em trânsito - por favor aguarde'
                },
                {
                    date: '2024-01-16 09:15',
                    location: 'Unidade de Distribuição - Campinas/SP',
                    description: 'Objeto saiu para entrega ao destinatário'
                }
            ]
        };
    }
    
    // Obter pedidos por status logístico (para admin)
    getOrdersByLogisticsStatus(status = null) {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        
        if (!status) return orders;
        
        return orders.filter(order => 
            order.logistics && order.logistics.status === status
        );
    }
    
    // Obter estatísticas logísticas
    getLogisticsStats() {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const stats = {
            'aguardando-envio': 0,
            'em-transporte': 0,
            'entregue': 0,
            total: 0
        };
        
        orders.forEach(order => {
            if (order.logistics) {
                stats[order.logistics.status] = (stats[order.logistics.status] || 0) + 1;
            }
            stats.total++;
        });
        
        return stats;
    }
}

// Classe para gerenciar interface de logística
class LogisticsUI {
    constructor() {
        this.logisticsService = new LogisticsService();
    }
    
    // Renderizar card de rastreamento
    renderTrackingCard(order) {
        if (!order.logistics) return '';
        
        const logistics = order.logistics;
        const statusInfo = this.getStatusInfo(logistics.status);
        
        return `
            <div class="tracking-card">
                <div class="tracking-header">
                    <h4><i class="fas fa-truck"></i> Rastreamento</h4>
                    <span class="tracking-code">${logistics.tracking_code}</span>
                </div>
                
                <div class="tracking-status">
                    <div class="status-indicator ${statusInfo.class}">
                        <i class="${statusInfo.icon}"></i>
                        <span>${statusInfo.text}</span>
                    </div>
                </div>
                
                <div class="tracking-progress">
                    ${this.renderProgressBar(logistics.status)}
                </div>
                
                <div class="tracking-history">
                    <h5>Histórico de Movimentações</h5>
                    ${logistics.history.map(event => `
                        <div class="history-item">
                            <div class="history-time">
                                ${this.formatDateTime(event.timestamp)}
                            </div>
                            <div class="history-description">
                                ${event.description}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // Renderizar barra de progresso
    renderProgressBar(currentStatus) {
        const statuses = ['aguardando-envio', 'em-transporte', 'entregue'];
        const currentIndex = statuses.indexOf(currentStatus);
        
        return `
            <div class="progress-bar">
                ${statuses.map((status, index) => {
                    const isActive = index <= currentIndex;
                    const isCompleted = index < currentIndex;
                    const statusInfo = this.getStatusInfo(status);
                    
                    return `
                        <div class="progress-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}">
                            <div class="step-icon">
                                <i class="${statusInfo.icon}"></i>
                            </div>
                            <div class="step-label">${statusInfo.text}</div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }
    
    // Obter informações visuais do status
    getStatusInfo(status) {
        const statusMap = {
            'aguardando-envio': { 
                text: 'Aguardando Envio', 
                class: 'warning', 
                icon: 'fas fa-clock' 
            },
            'em-transporte': { 
                text: 'Em Transporte', 
                class: 'primary', 
                icon: 'fas fa-truck' 
            },
            'entregue': { 
                text: 'Entregue', 
                class: 'success', 
                icon: 'fas fa-check-circle' 
            }
        };
        
        return statusMap[status] || { 
            text: 'Desconhecido', 
            class: 'muted', 
            icon: 'fas fa-question-circle' 
        };
    }
    
    // Formatar data e hora
    formatDateTime(dateString) {
        return new Date(dateString).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// Exportar para uso global
window.LogisticsService = LogisticsService;
window.LogisticsUI = LogisticsUI;

// Instâncias globais
window.logisticsService = new LogisticsService();
window.logisticsUI = new LogisticsUI();
