// Script para gerenciar a página de catálogo
document.addEventListener('DOMContentLoaded', function() {
    initializeCatalog();
});

let currentPage = 1;
let currentCategory = '';
let currentSearch = '';
let currentSort = '';
let isLoading = false;
let allProducts = [];
const productsPerPage = 25;

// Inicializar catálogo
async function initializeCatalog() {
    try {
        console.log('Inicializando catálogo...');
        console.log('productsModule disponível:', typeof productsModule);
        
        // Aguardar um pouco para garantir que os módulos estejam carregados
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log('productsModule após timeout:', typeof productsModule);
        
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
        const categories = await productsModule.getCategories();
        console.log('Categorias recebidas:', categories);
        
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
                option.value = category;
                option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
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
        console.log('Carregando produtos da API...');
        
        // Carregar produtos da API (buscar mais produtos)
        let products = await productsModule.loadProducts(1, 500);
        
        // Se não carregou 500, tentar carregar em lotes
        if (products.length < 500) {
            console.log(`Carregados apenas ${products.length} produtos, tentando carregar mais...`);
            const additionalProducts = await productsModule.loadProducts(2, 500);
            if (additionalProducts && additionalProducts.length > 0) {
                products = [...products, ...additionalProducts];
                console.log(`Total de produtos após segunda tentativa: ${products.length}`);
            }
        }
        console.log('Produtos carregados:', products.length);
        console.log('Primeiros 3 produtos:', products.slice(0, 3));
        
        if (!products || products.length === 0) {
            console.log('Nenhum produto encontrado, usando fallback...');
            products = await productsModule.loadLocalProducts();
            console.log('Produtos locais carregados:', products.length);
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
        
        // Aplicar paginação (25 produtos por página)
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
        grid.innerHTML = '';
        emptyCatalog.style.display = 'block';
        return;
    }
    
    emptyCatalog.style.display = 'none';
    grid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        grid.appendChild(productCard);
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

    const stockStatus = product.stock > 0 ? 
        `<span class="stock-status in-stock">Em estoque</span>` : 
        `<span class="stock-status out-of-stock">Fora de estoque</span>`;

    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.title}" loading="lazy">
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
            ${stockStatus}
            <div class="product-actions">
                <button class="add-to-cart" data-id="${product.id}" ${product.stock === 0 ? 'disabled' : ''}>
                    <i class="fas fa-shopping-cart"></i> 
                    ${product.stock === 0 ? 'Fora de estoque' : 'Adicionar'}
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
        addToCartBtn.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            try {
                productsModule.addToCart(productId);
                showNotification('Produto adicionado ao carrinho!', 'success');
            } catch (error) {
                showNotification('Erro: ' + error.message, 'error');
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

// Mostrar/ocultar loading
function showLoading(show) {
    const loading = document.getElementById('loading');
    const grid = document.getElementById('products-grid');
    
    if (show) {
        loading.style.display = 'flex';
        grid.style.display = 'none';
    } else {
        loading.style.display = 'none';
        grid.style.display = 'grid';
    }
}

// Mostrar catálogo vazio
function showEmptyCatalog() {
    const grid = document.getElementById('products-grid');
    const emptyCatalog = document.getElementById('empty-catalog');
    
    grid.innerHTML = '';
    emptyCatalog.style.display = 'block';
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
