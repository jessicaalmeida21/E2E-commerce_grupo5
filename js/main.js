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
async function loadFeaturedProducts() {
    const featuredContainer = document.getElementById('featured-products-container');
    if (!featuredContainer) return;
    
    try {
        console.log('Carregando produtos em destaque...');
        
        // Tentar carregar produtos em destaque da API
        let featured = [];
        try {
            featured = await productsModule.getFeaturedProducts(4);
            console.log('Produtos carregados do productsModule:', featured);
        } catch (error) {
            console.log('Erro no productsModule, tentando database.js diretamente...');
        }
        
        // Se não há produtos, usar database.js diretamente
        if (!featured || featured.length === 0) {
            console.log('Usando database.js diretamente...');
            if (typeof getAllProducts === 'function') {
                const allProducts = getAllProducts();
                featured = allProducts.slice(0, 4); // Pegar os primeiros 4 produtos
                console.log('Produtos carregados do database.js:', featured.length);
            }
        }
        
        // Se ainda não há produtos, usar fallback
        if (!featured || featured.length === 0) {
            console.log('Usando produtos de fallback...');
            featured = [
                {
                    id: 'PROD-001',
                    title: 'Samsung Galaxy S24 FE 5G',
                    description: 'Smartphone Samsung Galaxy S24 FE 5G com 8GB RAM, 128GB',
                    price: 2899.99,
                    originalPrice: 3299.99,
                    discount: 12,
                    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
                    category: 'Smartphones',
                    brand: 'Samsung',
                    stock: 15,
                    rating: 4.5,
                    ratingCount: 234
                },
                {
                    id: 'PROD-002',
                    title: 'iPhone 15 Pro Max',
                    description: 'iPhone 15 Pro Max com chip A17 Pro, câmera principal 48MP',
                    price: 8999.99,
                    originalPrice: 9999.99,
                    discount: 10,
                    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
                    category: 'Smartphones',
                    brand: 'Apple',
                    stock: 8,
                    rating: 4.8,
                    ratingCount: 567
                },
                {
                    id: 'PROD-003',
                    title: 'Notebook Acer Aspire 5',
                    description: 'Notebook Acer Aspire 5 com Intel Core i5, 8GB RAM, 512GB SSD',
                    price: 2499.99,
                    originalPrice: 2999.99,
                    discount: 17,
                    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
                    category: 'Notebooks',
                    brand: 'Acer',
                    stock: 12,
                    rating: 4.2,
                    ratingCount: 156
                },
                {
                    id: 'PROD-004',
                    title: 'Smart TV Samsung 55" 4K',
                    description: 'Smart TV Samsung 55" 4K UHD com Tizen OS, HDR, Wi-Fi',
                    price: 1899.99,
                    originalPrice: 2299.99,
                    discount: 17,
                    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
                    category: 'Televisões',
                    brand: 'Samsung',
                    stock: 25,
                    rating: 4.4,
                    ratingCount: 312
                }
            ];
        }
        
        // Limpa o container
        featuredContainer.innerHTML = '';
        
        // Adiciona os produtos ao container
        featured.forEach(product => {
            const productCard = createProductCard(product);
            featuredContainer.appendChild(productCard);
        });
        
        console.log(`${featured.length} produtos em destaque carregados com sucesso!`);
    } catch (error) {
        console.error('Erro ao carregar produtos em destaque:', error);
        featuredContainer.innerHTML = '<p>Erro ao carregar produtos. Tente novamente mais tarde.</p>';
    }
}

// Função para criar um card de produto
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const discountBadge = product.discount > 0 ? 
        `<div class="discount-badge">-${product.discount}%</div>` : '';
    
    const originalPrice = product.originalPrice && product.originalPrice > product.price ? 
        `<div class="original-price">${productsModule.formatPrice(product.originalPrice)}</div>` : '';
    
    const rating = product.rating ? 
        `<div class="product-rating">
            <span class="stars">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}</span>
            <span class="rating-count">(${product.ratingCount || 0})</span>
        </div>` : '';

    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.title}">
            ${discountBadge}
        </div>
        <div class="product-info">
            <div class="product-price">
                ${originalPrice}
                <span class="current-price">${productsModule.formatPrice(product.price)}</span>
            </div>
            <h3 class="product-title">${product.title}</h3>
            <p class="product-brand">${product.brand || 'Marca'}</p>
            ${rating}
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
        const productId = this.getAttribute('data-id');
        try {
            productsModule.addToCart(productId);
            showNotification('Produto adicionado ao carrinho!', 'success');
        } catch (error) {
            showNotification('Erro: ' + error.message, 'error');
        }
    });
    
    // Adiciona evento para o botão de favoritos
    card.querySelector('.wishlist-btn').addEventListener('click', function() {
        const productId = this.getAttribute('data-id');
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
        const productId = button.getAttribute('data-id');
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
    
    // Buscar por input e button
    const searchInput = searchForm.querySelector('input');
    const searchButton = searchForm.querySelector('button');
    
    if (searchButton) {
        searchButton.addEventListener('click', function(e) {
            e.preventDefault();
            performSearch();
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });
    }
    
    function performSearch() {
        const query = searchInput.value.trim();
        
        if (query) {
            // Redireciona para a página de catálogo com busca
            window.location.href = `./pages/catalog.html?search=${encodeURIComponent(query)}`;
        }
    }
}

// Função para configurar eventos de categorias
function setupCategoryEvents() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.querySelector('h3').textContent;
            window.location.href = `pages/catalog.html?category=${encodeURIComponent(category)}`;
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