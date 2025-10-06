// Script para gerenciar a página de catálogo - v45 (debug estoque detalhado)
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== CATALOG.JS V45 INICIADO ===');
    console.log('Timestamp:', Date.now());
    console.log('productsDatabase disponível:', typeof productsDatabase);
    
    // Inicializar OrderManager para controle de estoque
    if (typeof OrderManager !== 'undefined' && !window.orderManager) {
        window.orderManager = new OrderManager();
        console.log('OrderManager inicializado para controle de estoque');
    }
    
    // Aguardar um pouco mais para garantir carregamento completo
    setTimeout(() => {
        console.log('Iniciando catálogo após timeout...');
        initializeCatalog();
    }, 2000); // Aumentado para 2 segundos
});

let currentPage = 1;
let currentCategory = '';
let currentSearch = '';
let currentSort = '';
let isLoading = false;
let allProducts = [];
const productsPerPage = 24;

// Inicializar catálogo
async function initializeCatalog() {
    try {
        console.log('Inicializando catálogo...');
        console.log('productsModule disponível:', typeof productsModule);
        console.log('getAllProducts disponível:', typeof getAllProducts);
        console.log('getCategories disponível:', typeof getCategories);
        
        // Aguardar um pouco para garantir que os módulos estejam carregados
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('productsModule após timeout:', typeof productsModule);
        console.log('getAllProducts após timeout:', typeof getAllProducts);
        console.log('getCategories após timeout:', typeof getCategories);
        
        // Carregar categorias
        console.log('Carregando categorias...');
        await loadCategories();
        
        // Processar parâmetros da URL
        processUrlParams();
        
        // Carregar produtos iniciais
        console.log('Carregando produtos...');
        await loadProducts();
        
        // Configurar event listeners
        setupEventListeners();
        
        console.log('Catálogo inicializado com sucesso!');
    } catch (error) {
        console.error('Erro ao inicializar catálogo:', error);
        // Fallback: carregar produtos diretamente
        console.log('Tentando carregar produtos diretamente...');
        await loadProductsDirectly();
    }
}

// Processar parâmetros da URL
function processUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Processar busca
    const search = urlParams.get('search');
    if (search) {
        currentSearch = search;
        document.getElementById('search-input').value = search;
    }
    
    // Processar categoria
    const category = urlParams.get('category');
    if (category) {
        currentCategory = category;
        document.getElementById('category-filter').value = category;
    }
}

// Carregar categorias
async function loadCategories() {
    try {
        console.log('Carregando categorias...');
        
        // Aguardar um pouco para garantir que os módulos estejam carregados
        await new Promise(resolve => setTimeout(resolve, 500));
        
        let categories = [];
        
        // Tentar carregar via productsModule primeiro
        if (typeof productsModule !== 'undefined' && productsModule.getCategories) {
            try {
                categories = await productsModule.getCategories();
                console.log('Categorias recebidas do productsModule:', categories);
            } catch (error) {
                console.error('Erro ao carregar categorias via productsModule:', error);
            }
        }
        
        // Se não há categorias, usar database.js diretamente
        if (!categories || categories.length === 0) {
            console.log('Usando categorias do database.js diretamente...');
            if (typeof getCategories === 'function') {
                categories = getCategories();
                console.log('Categorias carregadas diretamente do database.js:', categories);
            } else if (typeof productsDatabase !== 'undefined') {
                // Extrair categorias do productsDatabase
                categories = Object.keys(productsDatabase).map(key => ({
                    key: key,
                    name: key.charAt(0).toUpperCase() + key.slice(1)
                }));
                console.log('Categorias extraídas do productsDatabase:', categories);
            }
        }
        
        const categoryFilter = document.getElementById('category-filter');
        if (!categoryFilter) {
            console.error('Elemento category-filter não encontrado');
            return;
        }
        
        // Limpar opções existentes (exceto a primeira)
        while (categoryFilter.children.length > 1) {
            categoryFilter.removeChild(categoryFilter.lastChild);
        }
        
        // Adicionar categorias
        if (categories && categories.length > 0) {
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.key || category;
                option.textContent = category.name || (category.charAt(0).toUpperCase() + category.slice(1));
                categoryFilter.appendChild(option);
            });
            console.log(`${categories.length} categorias adicionadas ao filtro`);
        } else {
            console.log('Nenhuma categoria encontrada');
        }
    } catch (error) {
        console.error('Erro ao carregar categorias:', error);
    }
}

// Carregar produtos
async function loadProducts(page = 1) {
    if (isLoading) return;
    
    isLoading = true;
    showLoading(true);
    
    try {
        console.log('=== INICIANDO CARREGAMENTO DE PRODUTOS ===');
        console.log('productsModule disponível:', typeof productsModule);
        console.log('window.apiService disponível:', typeof window.apiService);
        
        let products = [];
        
        // Tentar carregar produtos via productsModule primeiro
        if (typeof productsModule !== 'undefined') {
            try {
                console.log('Tentando carregar via productsModule...');
                products = await productsModule.loadProducts(1, 500); // Carregar todos os 500 produtos
                console.log('Produtos carregados via productsModule:', products.length);
            } catch (error) {
                console.error('Erro no productsModule:', error);
            }
        }
        
        // Se não conseguiu carregar, tentar via apiService diretamente
        if (!products || products.length === 0) {
            console.log('Tentando carregar via apiService diretamente...');
            try {
                if (typeof window.apiService !== 'undefined') {
                    const response = await window.apiService.getProducts(1, 500);
                    products = response.products || [];
                    console.log('Produtos carregados via apiService:', products.length);
                }
            } catch (error) {
                console.error('Erro no apiService:', error);
            }
        }
        
        // Se ainda não há produtos, usar produtos locais
        if (!products || products.length === 0) {
            console.log('Usando produtos locais como fallback...');
            if (typeof productsDatabase !== 'undefined') {
                const allProducts = [];
                Object.values(productsDatabase).forEach(category => {
                    if (Array.isArray(category)) {
                        allProducts.push(...category);
                    }
                });
                products = allProducts;
                console.log('Produtos locais carregados:', products.length);
            }
        }
        
        // Se ainda não há produtos, carregar da API diretamente
        if (!products || products.length === 0) {
            console.log('Carregando da API diretamente...');
            try {
                const response = await fetch('https://catalogo-products.pages.dev/api/products?page=1&pageSize=500');
                const data = await response.json();
                
                if (data.products && data.products.length > 0) {
                    products = data.products.map(product => ({
                        id: product.id,
                        title: product.title,
                        description: product.description,
                        price: product.price?.final || product.price?.original || 0,
                        originalPrice: product.price?.original || (product.price?.final * 1.2),
                        discount: product.price?.discount_percent || 0,
                        category: product.category,
                        brand: product.brand,
                        image: product.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
                        stock: product.stock?.quantity || Math.floor(Math.random() * 100) + 10,
                        rating: product.rating?.average || Math.round((Math.random() * 2 + 3) * 10) / 10,
                        ratingCount: product.rating?.count || Math.floor(Math.random() * 500) + 50
                    }));
                    console.log('Produtos carregados da API diretamente:', products.length);
                }
            } catch (error) {
                console.error('Erro ao carregar da API diretamente:', error);
            }
        }
        
        // Se ainda não há produtos, usar database.js diretamente
        if (!products || products.length === 0) {
            console.log('Usando database.js diretamente...');
            if (typeof getAllProducts === 'function') {
                products = getAllProducts();
                console.log('Produtos carregados diretamente do database.js:', products.length);
            } else {
                console.log('getAllProducts não está disponível, tentando carregar diretamente...');
                await loadProductsDirectly();
                return;
            }
        }
        
        // Aplicar filtros locais
        if (currentCategory) {
            products = products.filter(p => p.category && p.category.toLowerCase() === currentCategory.toLowerCase());
        }
        
        if (currentSearch) {
            const searchTerm = currentSearch.toLowerCase();
            products = products.filter(p => 
                (p.title && p.title.toLowerCase().includes(searchTerm)) ||
                (p.description && p.description.toLowerCase().includes(searchTerm)) ||
                (p.brand && p.brand.toLowerCase().includes(searchTerm))
            );
        }
        
        // Aplicar ordenação se necessário
        if (currentSort) {
            products = productsModule.sortProducts(products, currentSort);
        }
        
        console.log('Produtos após filtros:', products.length);
        
        // Aplicar paginação (24 produtos por página)
        const totalPages = Math.ceil(products.length / productsPerPage);
        const startIndex = (page - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        const paginatedProducts = products.slice(startIndex, endIndex);
        
        console.log(`Página ${page} de ${totalPages} - Mostrando ${paginatedProducts.length} de ${products.length} produtos`);
        
        displayProducts(paginatedProducts);
        
        // Criar meta de paginação
        const meta = {
            page: page,
            totalPages: totalPages,
            total: products.length
        };
        
        updatePagination(meta);
        
        currentPage = page;
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        showEmptyCatalog();
    } finally {
        isLoading = false;
        showLoading(false);
    }
}

// Exibir produtos
function displayProducts(products) {
    const grid = document.getElementById('products-grid');
    const emptyCatalog = document.getElementById('empty-catalog');
    
    if (products.length === 0) {
        if (grid) grid.innerHTML = '';
        if (emptyCatalog) emptyCatalog.style.display = 'block';
        return;
    }
    
    if (emptyCatalog) emptyCatalog.style.display = 'none';
    if (grid) grid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        if (grid) grid.appendChild(productCard);
    });
}

// Criar card do produto
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

    // INTEGRAÇÃO COM SISTEMA DE ESTOQUE DO ORDERMANAGER
    let stockQuantity = 0;
    
    // Primeiro, tentar obter estoque do OrderManager (sistema dinâmico)
    if (window.orderManager && window.orderManager.stockData) {
        stockQuantity = window.orderManager.stockData[product.id] || 0;
        console.log(`Estoque do OrderManager para ${product.title}: ${stockQuantity}`);
    } 
    // Se não houver OrderManager, usar estoque do produto
    else if (product.stock !== undefined && product.stock !== null) {
        stockQuantity = parseInt(product.stock) || 0;
        console.log(`Estoque do produto para ${product.title}: ${stockQuantity}`);
    }
    
    const stockAvailable = stockQuantity > 0;
    
    // Exibição mais clara do estoque
    let stockDisplay;
    if (stockQuantity > 10) {
        stockDisplay = `✅ Em estoque (${stockQuantity} unidades)`;
    } else if (stockQuantity > 0) {
        stockDisplay = `⚠️ Últimas ${stockQuantity} unidades`;
    } else {
        stockDisplay = `❌ Fora de estoque`;
    }
    
    const stockClass = stockQuantity > 10 ? 'in-stock' : 
                      stockQuantity > 0 ? 'low-stock' : 'out-of-stock';
    
    const stockStatus = `<div class="stock-status ${stockClass}">${stockDisplay}</div>`;

    card.innerHTML = `
        <img src="${product.image}" alt="${product.title}" class="product-img" loading="lazy">
            ${discountBadge}
        <div class="product-info">
            <div class="product-price">
                ${originalPrice}
                <span class="current-price">${productsModule.formatPrice(product.price)}</span>
            </div>
            <h3 class="product-title">${product.title}</h3>
            <p class="product-brand">${product.brand || 'Marca'}</p>
            ${rating}
            ${stockStatus}
            <div class="product-actions">
                <button class="add-to-cart" data-id="${product.id}" ${!stockAvailable ? 'disabled' : ''}>
                    <i class="fas fa-shopping-cart"></i> 
                    ${stockAvailable ? 'Adicionar ao Carrinho' : 'Fora de Estoque'}
                </button>
                <button class="wishlist-btn" data-id="${product.id}">
                    <i class="far fa-heart"></i>
                </button>
            </div>
        </div>
    `;
    
    // Adicionar eventos
    const addToCartBtn = card.querySelector('.add-to-cart');
    if (addToCartBtn && !addToCartBtn.disabled) {
        addToCartBtn.addEventListener('click', async function() {
            const productId = this.getAttribute('data-id');
            try {
                // Não fazer verificação dupla de estoque aqui - deixar o products.js fazer
                const result = await productsModule.addToCart(productId);
                showNotification('Produto adicionado ao carrinho!', 'success');
                
                // Atualizar exibição do estoque após adicionar ao carrinho
                setTimeout(() => {
                    location.reload(); // Recarregar para atualizar estoques
                }, 1000);
                
            } catch (error) {
                console.error('Erro ao adicionar ao carrinho:', error);
                showNotification('Erro ao adicionar ao carrinho: ' + error.message, 'error');
            }
        });
    }
    
    const wishlistBtn = card.querySelector('.wishlist-btn');
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            const icon = this.querySelector('i');
            if (this.classList.contains('active')) {
                icon.className = 'fas fa-heart';
                showNotification('Adicionado aos favoritos!', 'success');
            } else {
                icon.className = 'far fa-heart';
                showNotification('Removido dos favoritos!', 'info');
            }
        });
    }
    
    return card;
}

// Atualizar paginação
function updatePagination(meta) {
    const pagination = document.getElementById('pagination');
    const { page, totalPages, total } = meta;
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = `
        <div class="pagination-info">
            Página ${page} de ${totalPages} (${total} produtos)
        </div>
        <div class="pagination-controls">
    `;
    
    // Botão anterior
    if (page > 1) {
        paginationHTML += `<button class="pagination-btn" data-page="${page - 1}">
            <i class="fas fa-chevron-left"></i> Anterior
        </button>`;
    }
    
    // Números das páginas
    const startPage = Math.max(1, page - 2);
    const endPage = Math.min(totalPages, page + 2);
    
    if (startPage > 1) {
        paginationHTML += `<button class="pagination-btn" data-page="1">1</button>`;
        if (startPage > 2) {
            paginationHTML += `<span class="pagination-ellipsis">...</span>`;
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `<button class="pagination-btn ${i === page ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<span class="pagination-ellipsis">...</span>`;
        }
        paginationHTML += `<button class="pagination-btn" data-page="${totalPages}">${totalPages}</button>`;
    }
    
    // Botão próximo
    if (page < totalPages) {
        paginationHTML += `<button class="pagination-btn" data-page="${page + 1}">
            Próximo <i class="fas fa-chevron-right"></i>
        </button>`;
    }
    
    paginationHTML += '</div>';
    pagination.innerHTML = paginationHTML;
    
    // Adicionar eventos aos botões
    pagination.querySelectorAll('.pagination-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const page = parseInt(this.getAttribute('data-page'));
            loadProducts(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

// Configurar event listeners
function setupEventListeners() {
    // Busca
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Filtros
    document.getElementById('category-filter').addEventListener('change', function() {
        currentCategory = this.value;
        currentPage = 1;
        loadProducts();
    });
    
    document.getElementById('sort-filter').addEventListener('change', function() {
        currentSort = this.value;
        loadProducts(currentPage);
    });
}

// Realizar busca
function performSearch() {
    const searchInput = document.getElementById('search-input');
    currentSearch = searchInput.value.trim();
    currentPage = 1;
    loadProducts();
}

// Mostrar/ocultar loading com melhor UX
function showLoading(show) {
    const loading = document.getElementById('loading');
    const grid = document.getElementById('products-grid');
    
    if (show) {
        if (loading) {
            loading.style.display = 'flex';
            loading.style.opacity = '1';
        }
        if (grid) grid.style.opacity = '0.5';
    } else {
        if (loading) {
            loading.style.opacity = '0';
            setTimeout(() => {
                if (loading) loading.style.display = 'none';
            }, 300);
        }
        if (grid) {
            grid.style.display = 'grid';
            grid.style.opacity = '1';
        }
    }
}

// Mostrar catálogo vazio
function showEmptyCatalog() {
    const grid = document.getElementById('products-grid');
    const emptyCatalog = document.getElementById('empty-catalog');
    
    if (grid) grid.innerHTML = '';
    if (emptyCatalog) emptyCatalog.style.display = 'block';
}

// Carregar produtos diretamente do database.js
async function loadProductsDirectly() {
    try {
        console.log('Carregando produtos diretamente do database.js...');
        
        if (typeof getAllProducts === 'function') {
            const products = getAllProducts();
            console.log('Produtos carregados diretamente:', products.length);
            
            if (products && products.length > 0) {
                // Aplicar paginação
                const totalPages = Math.ceil(products.length / productsPerPage);
                const startIndex = (currentPage - 1) * productsPerPage;
                const endIndex = startIndex + productsPerPage;
                const paginatedProducts = products.slice(startIndex, endIndex);
                
                console.log(`Mostrando ${paginatedProducts.length} de ${products.length} produtos`);
                displayProducts(paginatedProducts);
                
                // Criar meta de paginação
                const meta = {
                    page: currentPage,
                    totalPages: totalPages,
                    total: products.length
                };
                
                updatePagination(meta);
                return;
            }
        }
        
        console.log('Nenhum produto encontrado no database.js');
        showEmptyCatalog();
        
    } catch (error) {
        console.error('Erro ao carregar produtos diretamente:', error);
        showEmptyCatalog();
    }
}

// Mostrar notificação
function showNotification(message, type = 'info') {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Adicionar ao body
    document.body.appendChild(notification);
    
    // Mostrar notificação
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}


