// Espera o DOM carregar completamente
document.addEventListener('DOMContentLoaded', function() {
    // Inicializa o contador do carrinho
    productsModule.updateCartCounter();
    
    // Carrega os produtos em destaque na página inicial
    loadFeaturedProducts();
    
    // Configura o formulário de busca
    setupSearchForm();
    
    // Adiciona eventos para categorias
    setupCategoryEvents();
    
    // Configura o cabeçalho baseado no status de login
    setupHeaderUserActions();
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
                window.location.reload();
            });
        }
        
        // Verificar timeout da sessão
        checkSessionTimeout();
    } else {
        // Usuário não logado
        if (loggedOutActions) loggedOutActions.style.display = 'block';
        if (loggedInActions) loggedInActions.style.display = 'none';
    }
}

// Função para carregar produtos em destaque na página inicial
function loadFeaturedProducts() {
    const featuredContainer = document.getElementById('featured-products-container');
    if (!featuredContainer) return;
    
    // Pega 4 produtos aleatórios para mostrar como destaque
    const shuffled = [...productsModule.products].sort(() => 0.5 - Math.random());
    const featured = shuffled.slice(0, 4);
    
    // Limpa o container
    featuredContainer.innerHTML = '';
    
    // Adiciona os produtos ao container
    featured.forEach(product => {
        const productCard = createProductCard(product);
        featuredContainer.appendChild(productCard);
    });
}

// Função para criar um card de produto
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.title}">
        </div>
        <div class="product-info">
            <div class="product-price">${productsModule.formatPrice(product.price)}</div>
            <h3 class="product-title">${product.title}</h3>
            <p class="product-seller">Vendido por: ${product.seller}</p>
            <div class="product-actions">
                <button class="add-to-cart" data-id="${product.id}">
                    <i class="fas fa-shopping-cart"></i> Adicionar
                </button>
                <button class="wishlist-btn" data-id="${product.id}">
                    <i class="far fa-heart"></i>
                </button>
            </div>
        </div>
    `;
    
    // Adiciona evento para o botão de adicionar ao carrinho
    card.querySelector('.add-to-cart').addEventListener('click', function() {
        const productId = parseInt(this.getAttribute('data-id'));
        productsModule.addToCart(productId);
    });
    
    // Adiciona evento para o botão de favoritos
    card.querySelector('.wishlist-btn').addEventListener('click', function() {
        const productId = parseInt(this.getAttribute('data-id'));
        toggleWishlist(productId);
    });
    
    return card;
}

// Função para alternar produto na lista de desejos
function toggleWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    const index = wishlist.indexOf(productId);
    
    if (index >= 0) {
        // Remove da lista de desejos
        wishlist.splice(index, 1);
        showNotification('Produto removido dos favoritos', 'info');
    } else {
        // Adiciona à lista de desejos
        wishlist.push(productId);
        showNotification('Produto adicionado aos favoritos', 'success');
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    
    // Atualiza o ícone do coração
    updateWishlistIcons();
}

// Função para atualizar os ícones de favoritos
function updateWishlistIcons() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    document.querySelectorAll('.wishlist-btn').forEach(button => {
        const productId = parseInt(button.getAttribute('data-id'));
        const icon = button.querySelector('i');
        
        if (wishlist.includes(productId)) {
            icon.className = 'fas fa-heart';
            icon.style.color = '#ff4d4d';
        } else {
            icon.className = 'far fa-heart';
            icon.style.color = '';
        }
    });
}

// Função para configurar o formulário de busca
function setupSearchForm() {
    const searchForm = document.querySelector('.search-bar');
    if (!searchForm) return;
    
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const searchInput = this.querySelector('input');
        const query = searchInput.value.trim();
        
        if (query) {
            // Redireciona para a página de resultados de busca
            window.location.href = `pages/search.html?q=${encodeURIComponent(query)}`;
        }
    });
}

// Função para configurar eventos de categorias
function setupCategoryEvents() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.querySelector('h3').textContent;
            window.location.href = `pages/categories.html?category=${encodeURIComponent(category)}`;
        });
    });
}

// Função para mostrar notificações
function showNotification(message, type = 'info') {
    // Remove notificação existente se houver
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Cria nova notificação
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Adiciona estilos inline para garantir que apareça corretamente
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    // Define cor baseada no tipo
    switch(type) {
        case 'success':
            notification.style.backgroundColor = '#4CAF50';
            break;
        case 'error':
            notification.style.backgroundColor = '#f44336';
            break;
        case 'warning':
            notification.style.backgroundColor = '#ff9800';
            break;
        default:
            notification.style.backgroundColor = '#2196F3';
    }
    
    // Adiciona ao body
    document.body.appendChild(notification);
    
    // Anima entrada
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10);
    
    // Remove após 3 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Verificar timeout da sessão
function checkSessionTimeout() {
    const timeout = localStorage.getItem('sessionTimeout');
    if (timeout) {
        const timeoutDate = new Date(parseInt(timeout));
        if (new Date() > timeoutDate) {
            // Sessão expirada
            localStorage.removeItem('currentUser');
            localStorage.removeItem('sessionTimeout');
            showNotification('Sua sessão expirou. Por favor, faça login novamente.', 'warning');
            setTimeout(() => {
                window.location.href = 'pages/login.html';
            }, 2000);
        } else {
            // Renovar timeout
            setSessionTimeout();
        }
    }
}

// Definir timeout da sessão (30 minutos)
function setSessionTimeout() {
    const timeout = new Date().getTime() + (30 * 60 * 1000);
    localStorage.setItem('sessionTimeout', timeout);
}