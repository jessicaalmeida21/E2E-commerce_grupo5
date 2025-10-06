// Script para gerenciar a página de fornecedores com funcionalidades completas
document.addEventListener('DOMContentLoaded', function() {
    initializeSellers();
});

let currentPage = 1;
let currentCategory = '';
let currentSearch = '';
let currentSort = '';
let isLoading = false;
let allSellers = [];
const sellersPerPage = 12;

// Inicializar página de fornecedores
async function initializeSellers() {
    try {
        console.log('Inicializando página de fornecedores...');
        
        // Aguardar carregamento dos módulos
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Carregar categorias
        await loadCategories();
        
        // Processar parâmetros da URL
        processUrlParams();
        
        // Carregar dados iniciais
        await loadAllData();
        
        // Configurar event listeners
        setupEventListeners();
        
        // Exibir dados iniciais
        displayCurrentView();
        
        console.log('Página de fornecedores inicializada com sucesso!');
    } catch (error) {
        console.error('Erro ao inicializar fornecedores:', error);
        showError('Erro ao carregar dados. Tente recarregar a página.');
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
        
        let categories = [];
        
        // Tentar carregar via productsModule
        if (typeof productsModule !== 'undefined' && productsModule.getCategories) {
            try {
                categories = await productsModule.getCategories();
                console.log('Categorias carregadas via productsModule:', categories);
            } catch (error) {
                console.error('Erro no productsModule:', error);
            }
        }
        
        // Se não conseguiu, tentar via database.js diretamente
        if (!categories || categories.length === 0) {
            console.log('Tentando carregar categorias via database.js...');
            if (typeof getCategories === 'function') {
                categories = getCategories();
                console.log('Categorias carregadas via database.js:', categories);
            }
        }
        
        // Se ainda não tem categorias, usar fallback
        if (!categories || categories.length === 0) {
            console.log('Usando categorias de fallback...');
            categories = [
                { key: 'smartphones', name: 'Smartphones' },
                { key: 'notebooks', name: 'Notebooks' },
                { key: 'televisoes', name: 'Televisões' },
                { key: 'audio', name: 'Áudio e Som' },
                { key: 'calcados', name: 'Calçados' },
                { key: 'roupas', name: 'Roupas' },
                { key: 'eletrodomesticos', name: 'Eletrodomésticos' },
                { key: 'esportes', name: 'Esportes e Lazer' },
                { key: 'monitores', name: 'Monitores' },
                { key: 'relogios', name: 'Relógios' }
            ];
        }
        
        // Preencher select de categorias
        const categorySelect = document.getElementById('category-filter');
        categorySelect.innerHTML = '<option value="">Todas as Categorias</option>';
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.key || category;
            option.textContent = category.name || category;
            categorySelect.appendChild(option);
        });
        
        console.log('Categorias carregadas:', categories);
        return categories;
        
    } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        return [];
    }
}

// Carregar todos os dados (produtos e fornecedores)
async function loadAllData() {
    try {
        console.log('Carregando todos os dados...');
        
        // Gerar fornecedores baseados nos produtos
        generateSellers();
        
        console.log('Dados carregados:', {
            fornecedores: allSellers.length
        });
        
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        throw error;
    }
}

// Gerar fornecedores baseados nos produtos
function generateSellers() {
    try {
        console.log('Gerando fornecedores...');
        
        const sellersMap = new Map();
        
        // Obter produtos do database
        let products = [];
        if (typeof getAllProducts === 'function') {
            products = getAllProducts();
        } else {
            console.warn('getAllProducts não disponível, usando dados de fallback');
            // Criar alguns fornecedores de exemplo
            const categories = ['eletrônicos', 'roupas', 'casa', 'livros', 'esportes'];
            categories.forEach((category, index) => {
                const categoryKey = category.toLowerCase().replace(/\s+/g, '-');
                sellersMap.set(categoryKey, {
                    id: `seller-${categoryKey}`,
                    name: getSellerName(categoryKey),
                    category: category,
                    categoryKey: categoryKey,
                    description: getSellerDescription(categoryKey),
                    logo: getSellerLogo(categoryKey),
                    rating: (4 + Math.random()).toFixed(1),
                    products: [],
                    productsCount: Math.floor(Math.random() * 50) + 10,
                    joinedDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), 1)
                });
            });
            
            allSellers = Array.from(sellersMap.values());
            console.log('Fornecedores de fallback gerados:', allSellers.length);
            return;
        }
        
        // Agrupar produtos por categoria para criar fornecedores
        products.forEach(product => {
            const category = product.category || 'outros';
            const categoryKey = category.toLowerCase().replace(/\s+/g, '-');
            
            if (!sellersMap.has(categoryKey)) {
                sellersMap.set(categoryKey, {
                    id: `seller-${categoryKey}`,
                    name: getSellerName(categoryKey),
                    category: category,
                    categoryKey: categoryKey,
                    description: getSellerDescription(categoryKey),
                    logo: getSellerLogo(categoryKey),
                    rating: (4 + Math.random()).toFixed(1),
                    products: [],
                    joinedDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), 1)
                });
            }
            
            sellersMap.get(categoryKey).products.push(product);
        });
        
        // Converter para array
        allSellers = Array.from(sellersMap.values()).map(seller => ({
            ...seller,
            productsCount: seller.products.length
        }));
        
        console.log('Fornecedores gerados:', allSellers.length);
        
    } catch (error) {
        console.error('Erro ao gerar fornecedores:', error);
        allSellers = [];
    }
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
        displayCurrentView();
        updateUrl();
    });
    
    document.getElementById('sort-filter').addEventListener('change', function() {
        currentSort = this.value;
        displayCurrentView();
    });
    
    // Paginação
    document.getElementById('prev-page').addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            displayCurrentView();
        }
    });
    
    document.getElementById('next-page').addEventListener('click', function() {
        const totalItems = getFilteredSellers().length;
        const totalPages = Math.ceil(totalItems / sellersPerPage);
        
        if (currentPage < totalPages) {
            currentPage++;
            displayCurrentView();
        }
    });
}

// Realizar busca
function performSearch() {
    currentSearch = document.getElementById('search-input').value.trim();
    currentPage = 1;
    displayCurrentView();
    updateUrl();
}

// Exibir visualização atual
function displayCurrentView() {
    displaySellers();
    updateResultsInfo();
    updatePagination();
}

// Obter fornecedores filtrados
function getFilteredSellers() {
    let filtered = [...allSellers];
    
    // Filtrar por categoria
    if (currentCategory) {
        filtered = filtered.filter(seller => seller.categoryKey === currentCategory);
    }
    
    // Filtrar por busca
    if (currentSearch) {
        const searchLower = currentSearch.toLowerCase();
        filtered = filtered.filter(seller => 
            seller.name.toLowerCase().includes(searchLower) ||
            seller.category.toLowerCase().includes(searchLower) ||
            seller.description.toLowerCase().includes(searchLower)
        );
    }
    
    // Ordenar
    if (currentSort) {
        filtered.sort((a, b) => {
            switch (currentSort) {
                case 'name-asc':
                    return a.name.localeCompare(b.name);
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                case 'rating-desc':
                    return parseFloat(b.rating) - parseFloat(a.rating);
                default:
                    return 0;
            }
        });
    }
    
    return filtered;
}

// Exibir fornecedores
function displaySellers() {
    const grid = document.getElementById('sellers-grid');
    const filtered = getFilteredSellers();
    
    // Paginação
    const startIndex = (currentPage - 1) * sellersPerPage;
    const endIndex = startIndex + sellersPerPage;
    const paginatedSellers = filtered.slice(startIndex, endIndex);
    
    grid.innerHTML = '';
    
    if (paginatedSellers.length === 0) {
        grid.innerHTML = '<div class="no-results">Nenhum fornecedor encontrado.</div>';
        return;
    }
    
    paginatedSellers.forEach(seller => {
        const sellerCard = createSellerCard(seller);
        grid.appendChild(sellerCard);
    });
}

// Criar card do fornecedor
function createSellerCard(seller) {
    const card = document.createElement('div');
    card.className = 'seller-card';
    
    const rating = '★'.repeat(Math.floor(seller.rating)) + '☆'.repeat(5 - Math.floor(seller.rating));
    const joinedYear = seller.joinedDate.getFullYear();
    
    card.innerHTML = `
        <div class="seller-logo">
            <img src="${seller.logo}" alt="${seller.name}" onerror="this.src='https://via.placeholder.com/100x100/6c757d/ffffff?text=🏪'">
        </div>
        <div class="seller-info">
            <h3 class="seller-name">${seller.name}</h3>
            <p class="seller-category">${seller.category}</p>
            <p class="seller-description">${seller.description}</p>
            <div class="seller-stats">
                <div class="stat">
                    <span class="stat-value">${seller.rating}</span>
                    <span class="stat-label">Avaliação</span>
                </div>
                <div class="stat">
                    <span class="stat-value">${seller.productsCount}</span>
                    <span class="stat-label">Produtos</span>
                </div>
                <div class="stat">
                    <span class="stat-value">${joinedYear}</span>
                    <span class="stat-label">Desde</span>
                </div>
            </div>
            <div class="seller-rating">
                <span class="stars">${rating}</span>
                <span class="rating-text">(${seller.rating})</span>
            </div>
        </div>
    `;
    
    return card;
}

// Atualizar informações dos resultados
function updateResultsInfo() {
    const resultsCount = document.getElementById('results-count');
    const filtered = getFilteredSellers();
    resultsCount.textContent = `${filtered.length} fornecedor(es) encontrado(s)`;
}

// Atualizar paginação
function updatePagination() {
    const totalItems = getFilteredSellers().length;
    const totalPages = Math.ceil(totalItems / sellersPerPage);
    
    const pagination = document.getElementById('pagination');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const pageNumbers = document.getElementById('page-numbers');
    
    if (totalPages <= 1) {
        pagination.style.display = 'none';
        return;
    }
    
    pagination.style.display = 'flex';
    
    // Botão anterior
    prevBtn.disabled = currentPage === 1;
    
    // Botão próximo
    nextBtn.disabled = currentPage === totalPages;
    
    // Números das páginas
    pageNumbers.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `page-number ${i === currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                displayCurrentView();
            });
            pageNumbers.appendChild(pageBtn);
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'page-ellipsis';
            ellipsis.textContent = '...';
            pageNumbers.appendChild(ellipsis);
        }
    }
}

// Atualizar URL
function updateUrl() {
    const params = new URLSearchParams();
    
    if (currentSearch) params.set('search', currentSearch);
    if (currentCategory) params.set('category', currentCategory);
    
    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState({}, '', newUrl);
}

// Mostrar erro
function showError(message) {
    const resultsCount = document.getElementById('results-count');
    resultsCount.innerHTML = `<span style="color: red;"><i class="fas fa-exclamation-triangle"></i> ${message}</span>`;
}

// Funções auxiliares para fornecedores
function getSellerName(categoryKey) {
    const names = {
        'smartphones': ['TechMobile', 'SmartPhone Pro', 'Mobile World', 'CellTech'],
        'notebooks': ['NotebookMax', 'LaptopStore', 'Computer Pro', 'TechNotebook'],
        'televisoes': ['TV Center', 'SmartTV Pro', 'Televisão Plus', 'TV World'],
        'audio': ['AudioMax', 'Som & Música', 'Audio Pro', 'Sound Store'],
        'calcados': ['Sapatos & Cia', 'Calçados Premium', 'Shoe Store', 'Pé Direito'],
        'roupas': ['Fashion Store', 'Moda & Estilo', 'Roupas Premium', 'Style Center'],
        'eletrodomesticos': ['Casa & Cozinha', 'EletroCasa', 'Home Appliances', 'Domésticos Pro'],
        'esportes': ['Sports Center', 'Atleta Store', 'Fitness Pro', 'Sport Zone'],
        'monitores': ['Monitor Pro', 'Display Center', 'Screen Store', 'Monitor Plus'],
        'relogios': ['Tempo & Estilo', 'Relógios Premium', 'Watch Store', 'Time Center']
    };
    
    const categoryNames = names[categoryKey] || ['Loja Premium', 'Store Pro', 'Mega Store', 'Super Store'];
    return categoryNames[Math.floor(Math.random() * categoryNames.length)];
}

function getSellerDescription(categoryKey) {
    const descriptions = {
        'smartphones': 'Especialista em smartphones e tecnologia móvel de última geração.',
        'notebooks': 'Notebooks e laptops para trabalho, estudo e entretenimento.',
        'televisoes': 'Smart TVs e televisões com a melhor qualidade de imagem.',
        'audio': 'Equipamentos de áudio e som para todos os ambientes.',
        'calcados': 'Calçados confortáveis e estilosos para todas as ocasiões.',
        'roupas': 'Moda e estilo para todos os momentos da sua vida.',
        'eletrodomesticos': 'Sua casa mais moderna e funcional com nossos eletrodomésticos.',
        'esportes': 'Equipamentos esportivos para você alcançar seus objetivos.',
        'monitores': 'Monitores profissionais para trabalho e gaming.',
        'relogios': 'Relógios elegantes e funcionais para marcar seu tempo.'
    };
    
    return descriptions[categoryKey] || 'Produtos de qualidade para todas as suas necessidades.';
}

function getSellerLogo(categoryKey) {
    const logos = {
        'smartphones': 'https://via.placeholder.com/100x100/007bff/ffffff?text=📱',
        'notebooks': 'https://via.placeholder.com/100x100/28a745/ffffff?text=💻',
        'televisoes': 'https://via.placeholder.com/100x100/ffc107/ffffff?text=📺',
        'audio': 'https://via.placeholder.com/100x100/e83e8c/ffffff?text=🎵',
        'calcados': 'https://via.placeholder.com/100x100/fd7e14/ffffff?text=👟',
        'roupas': 'https://via.placeholder.com/100x100/6f42c1/ffffff?text=👕',
        'eletrodomesticos': 'https://via.placeholder.com/100x100/20c997/ffffff?text=🏠',
        'esportes': 'https://via.placeholder.com/100x100/dc3545/ffffff?text=⚽',
        'monitores': 'https://via.placeholder.com/100x100/17a2b8/ffffff?text=🖥️',
        'relogios': 'https://via.placeholder.com/100x100/6c757d/ffffff?text=⌚'
    };
    
    return logos[categoryKey] || 'https://via.placeholder.com/100x100/6c757d/ffffff?text=🏪';
}

function viewProduct(productId) {
    window.location.href = `product.html?id=${productId}`;
}

function addToCart(productId) {
    if (typeof window.addToCart === 'function') {
        window.addToCart(productId);
    } else {
        console.log('Produto adicionado ao carrinho:', productId);
        alert('Produto adicionado ao carrinho!');
    }
}
