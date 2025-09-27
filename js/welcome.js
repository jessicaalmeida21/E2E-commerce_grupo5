// Script para gerenciar a página de boas-vindas
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o usuário está logado
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = 'login.html';
        return;
    }
    
    // Configurar cabeçalho do usuário
    setupHeaderUserActions();
    
    // Carregar dados do usuário
    loadUserData();
    
    // Configurar event listeners
    setupEventListeners();
    
    // Atualizar contador do carrinho
    updateCartCounter();
});

// Função para configurar as ações do usuário no cabeçalho
function setupHeaderUserActions() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const loggedOutActions = document.getElementById('logged-out-actions');
    const loggedInActions = document.getElementById('logged-in-actions');
    const userNameHeader = document.getElementById('user-name-header');
    const adminLink = document.getElementById('admin-link');
    const logoutBtn = document.getElementById('logout-btn-header');
    
    if (currentUser) {
        // Usuário logado
        if (loggedOutActions) loggedOutActions.style.display = 'none';
        if (loggedInActions) loggedInActions.style.display = 'flex';
        if (userNameHeader) userNameHeader.textContent = currentUser.name;
        
        // Mostrar link de gestão se for vendedor
        if (adminLink && currentUser.profile === 'seller') {
            adminLink.style.display = 'inline-block';
        }
        
        // Configurar logout
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function() {
                localStorage.removeItem('currentUser');
                localStorage.removeItem('sessionTimeout');
                alert('Logout realizado com sucesso!');
                window.location.href = '../index.html';
            });
        }
    } else {
        // Usuário não logado
        if (loggedOutActions) loggedOutActions.style.display = 'block';
        if (loggedInActions) loggedInActions.style.display = 'none';
    }
}

// Carregar dados do usuário
function loadUserData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    // Atualizar nome do usuário na página
    const userNameWelcome = document.getElementById('user-name-welcome');
    if (userNameWelcome) {
        userNameWelcome.textContent = currentUser.name;
    }
    
    // Mostrar card de admin se for vendedor
    const adminCard = document.getElementById('admin-card');
    if (adminCard && currentUser.profile === 'seller') {
        adminCard.style.display = 'block';
    }
    
    console.log('Dados do usuário carregados:', currentUser);
}

// Configurar event listeners
function setupEventListeners() {
    // Configurar busca
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');
    
    if (searchInput && searchButton) {
        searchButton.addEventListener('click', function() {
            const query = searchInput.value.trim();
            if (query) {
                window.location.href = `catalog.html?search=${encodeURIComponent(query)}`;
            }
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const query = this.value.trim();
                if (query) {
                    window.location.href = `catalog.html?search=${encodeURIComponent(query)}`;
                }
            }
        });
    }
    
    // Configurar links de navegação
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Adicionar classe ativa
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    console.log('Event listeners configurados na página de boas-vindas');
}

// Atualizar contador do carrinho
function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    
    const cartCounters = document.querySelectorAll('#cart-count, .cart-count, .cart-counter');
    cartCounters.forEach(counter => {
        counter.textContent = totalItems;
        counter.style.display = totalItems > 0 ? 'flex' : 'none';
    });
    
    console.log(`Carrinho atualizado: ${totalItems} itens`);
}

// Função para verificar timeout da sessão
function checkSessionTimeout() {
    const timeout = localStorage.getItem('sessionTimeout');
    if (!timeout) return;
    
    const timeoutDate = new Date(parseInt(timeout, 10));
    if (Date.now() > timeoutDate.getTime()) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('sessionTimeout');
        alert('Sua sessão expirou por inatividade. Por favor, faça login novamente.');
        window.location.href = 'login.html';
    }
}

// Verificar timeout a cada minuto
setInterval(checkSessionTimeout, 60000);

// Renovar timeout da sessão em cada interação do usuário
function renewSessionTimeout() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const newTimeout = Date.now() + 30 * 60 * 1000; // 30 minutos
        localStorage.setItem('sessionTimeout', newTimeout);
    }
}

// Adicionar event listeners para renovar sessão
['click', 'keypress', 'scroll', 'mousemove'].forEach(event => {
    document.addEventListener(event, renewSessionTimeout);
});

// Função para mostrar mensagem de sucesso
function showSuccessMessage(message) {
    // Criar elemento de mensagem
    const messageEl = document.createElement('div');
    messageEl.className = 'success-message';
    messageEl.innerHTML = `
        <div class="message-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Adicionar estilos
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    // Adicionar ao DOM
    document.body.appendChild(messageEl);
    
    // Remover após 3 segundos
    setTimeout(() => {
        messageEl.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 300);
    }, 3000);
}

// Adicionar estilos de animação
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .success-message .message-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .success-message i {
        font-size: 1.2rem;
    }
`;
document.head.appendChild(style);

// Mostrar mensagem de boas-vindas
setTimeout(() => {
    showSuccessMessage('Bem-vindo(a) ao E2E-Commerce!');
}, 1000);
