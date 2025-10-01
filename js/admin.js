// Verificação de autenticação e perfil
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== INICIALIZANDO ADMIN ===');
    checkUserPermissions();
    
    // Aguardar um pouco para garantir que os módulos sejam carregados
    setTimeout(async () => {
        await loadProducts();
        loadCategories();
        setupEventListeners();
        setupHeader();
        
        // Forçar renderização após um tempo
        setTimeout(() => {
            console.log('🔄 Forçando renderização...');
            applyFiltersAndSort();
        }, 500);
    }, 100);
});

// Verificar permissões do usuário
function checkUserPermissions() {
    const currentUserData = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUserData) {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = '../pages/login.html';
        return;
    }

    // Apenas vendedores podem gerenciar produtos
    if (currentUserData.profile !== 'seller') {
        alert('Você não tem permissão para acessar esta página.');
        window.location.href = '../index.html';
        return;
    }
    
    currentUser = currentUserData;
}

// Configurar header
function setupHeader() {
    const userName = document.getElementById('user-name');
    const logoutBtn = document.getElementById('logout-btn');
    
    if (userName) {
        userName.textContent = currentUser.name;
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}

// Logout
function logout() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('sessionTimeout');
        window.location.href = '../pages/login.html';
}

// Variáveis globais
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 10;

// Carregar produtos da API
async function loadProducts() {
    try {
        console.log('=== INICIANDO CARREGAMENTO DE PRODUTOS ===');
        console.log('productsModule disponível:', typeof productsModule);
        console.log('window.productsModule disponível:', typeof window.productsModule);
        
        // Aguardar um pouco para garantir que o productsModule seja carregado
        if (typeof productsModule === 'undefined' && typeof window.productsModule !== 'undefined') {
            window.productsModule = window.productsModule;
        }
        
        if (typeof productsModule === 'undefined') {
            console.log('⏳ Aguardando carregamento do productsModule...');
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // Carregar produtos usando o módulo products (buscar 500 produtos)
        if (typeof productsModule !== 'undefined' && productsModule.loadProducts) {
            allProducts = await productsModule.loadProducts(1, 500);
        } else if (typeof window.productsModule !== 'undefined' && window.productsModule.loadProducts) {
            allProducts = await window.productsModule.loadProducts(1, 500);
        } else {
            throw new Error('productsModule não disponível');
        }
        
        console.log('✅ Produtos carregados via API:', allProducts.length);
        console.log('Primeiros 3 produtos:', allProducts.slice(0, 3));
        
        // Garantir que todos os produtos tenham estoque
        allProducts = allProducts.map(product => ({
            ...product,
            stock: product.stock || Math.floor(Math.random() * 50) + 1
        }));
    
        filteredProducts = [...allProducts];
        applyFiltersAndSort();
        
        // Carregar categorias dinamicamente
        loadCategories();
        
    } catch (error) {
        console.error('❌ Erro ao carregar produtos via API:', error);
        console.log('🔄 Usando produtos de fallback...');
        
        // Fallback para produtos locais
        allProducts = [
            {
                id: 'PROD-001',
                title: 'Smartphone Galaxy S21',
                description: 'Smartphone com tela de 6.2 polegadas',
                price: 2500.00,
                originalPrice: 3000.00,
                discount: 17,
                image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center',
                category: 'eletrônicos',
                brand: 'Samsung',
                stock: 50,
                rating: 4.5,
                ratingCount: 120
            },
            {
                id: 'PROD-002',
                title: 'Notebook Dell Inspiron',
                description: 'Notebook para trabalho e estudos',
                price: 3500.00,
                originalPrice: 4000.00,
                discount: 13,
                image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop&crop=center',
                category: 'eletrônicos',
                brand: 'Dell',
                stock: 25,
                rating: 4.2,
                ratingCount: 85
            }
        ];
        
        // Adicionar mais produtos de fallback
        allProducts.push(
            {
                id: 'PROD-003',
                title: 'Fone Bluetooth Dell',
                description: 'Fone TWS Dell com ANC',
                price: 163.30,
                originalPrice: 200.00,
                discount: 18,
                image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center',
                category: 'eletrônicos',
                brand: 'Dell',
                stock: 30,
                rating: 4.3,
                ratingCount: 95
            },
            {
                id: 'PROD-004',
                title: 'Smart TV Lenovo 55" 4K UHD',
                description: 'Smart TV Lenovo 55" com 4K, HDR e apps de streaming',
                price: 1204.84,
                originalPrice: 1500.00,
                discount: 20,
                image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&crop=center',
                category: 'eletrônicos',
                brand: 'Lenovo',
                stock: 15,
                rating: 4.1,
                ratingCount: 67
            },
            {
                id: 'PROD-005',
                title: 'Notebook HP Pavilion',
                description: 'Notebook HP para trabalho e entretenimento',
                price: 2800.00,
                originalPrice: 3200.00,
                discount: 12,
                image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&crop=center',
                category: 'eletrônicos',
                brand: 'HP',
                stock: 20,
                rating: 4.0,
                ratingCount: 45
            }
        );
        
        console.log('✅ Produtos de fallback carregados:', allProducts.length);
        filteredProducts = [...allProducts];
        applyFiltersAndSort();
    }
}

// Carregar categorias dinamicamente
async function loadCategories() {
    try {
        console.log('=== CARREGANDO CATEGORIAS ===');
        
        let categories = [];
        
        // Tentar carregar categorias do productsModule
        if (typeof productsModule !== 'undefined' && productsModule.getCategories) {
            categories = await productsModule.getCategories();
        } else if (typeof window.productsModule !== 'undefined' && window.productsModule.getCategories) {
            categories = await window.productsModule.getCategories();
        } else {
            console.log('productsModule não disponível, extraindo categorias dos produtos carregados');
            // Extrair categorias únicas dos produtos carregados
            const uniqueCategories = [...new Set(allProducts.map(product => product.category))];
            categories = uniqueCategories.filter(cat => cat); // Remover valores vazios
        }
        
        console.log('Categorias encontradas:', categories);
        
        const categoryFilter = document.getElementById('category-filter');
        
        if (!categoryFilter) {
            console.error('Elemento category-filter não encontrado');
            return;
        }
        
        // Limpar opções existentes (exceto "Todas")
        categoryFilter.innerHTML = '<option value="">Todas</option>';
        
        // Adicionar categorias da API
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            categoryFilter.appendChild(option);
        });
        
        console.log('✅ Categorias carregadas no filtro:', categories.length);
    } catch (error) {
        console.error('❌ Erro ao carregar categorias:', error);
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Busca
    document.getElementById('search-btn').addEventListener('click', function() {
        applyFiltersAndSort();
    });
    
    document.getElementById('product-search').addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            applyFiltersAndSort();
        }
    });
    
    // Filtros e ordenação
    document.getElementById('category-filter').addEventListener('change', applyFiltersAndSort);
    document.getElementById('sort-by').addEventListener('change', applyFiltersAndSort);
    document.getElementById('status-filter').addEventListener('change', applyFiltersAndSort);
    
    // Modal de estoque
    document.getElementById('close-stock-modal').addEventListener('click', closeModal);
    document.getElementById('cancel-add-stock').addEventListener('click', closeModal);
    document.getElementById('confirm-add-stock').addEventListener('click', confirmAddStock);
    
    // Preview do estoque
    document.getElementById('stock-amount').addEventListener('change', updateStockPreview);
    
    // Fechar modal clicando fora
    document.getElementById('stock-modal').addEventListener('click', (e) => {
        if (e.target.id === 'stock-modal') {
            closeModal();
        }
    });
}

// Aplicar filtros e ordenação
function applyFiltersAndSort() {
    const searchTerm = document.getElementById('product-search').value.toLowerCase();
    const categoryFilter = document.getElementById('category-filter').value.toLowerCase();
    const statusFilter = document.getElementById('status-filter').value.toLowerCase();
    const sortBy = document.getElementById('sort-by').value;
    
    // Filtrar produtos
    filteredProducts = allProducts.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchTerm) || 
                             (product.description && product.description.toLowerCase().includes(searchTerm));
        const matchesCategory = categoryFilter === '' || product.category.toLowerCase() === categoryFilter;
        
        // Filtro de status
        let matchesStatus = true;
        if (statusFilter === 'active') {
            matchesStatus = product.stock > 0 && product.status !== 'inactive' && product.active !== false;
        } else if (statusFilter === 'inactive') {
            matchesStatus = product.stock === 0 || product.status === 'inactive' || product.active === false;
        }
        
        return matchesSearch && matchesCategory && matchesStatus;
    });
    
    // Ordenar produtos
    filteredProducts.sort((a, b) => {
        switch(sortBy) {
            case 'name-asc':
                return a.title.localeCompare(b.title);
            case 'name-desc':
                return b.title.localeCompare(a.title);
            case 'price-asc':
                return a.price - b.price;
            case 'price-desc':
                return b.price - a.price;
            case 'stock-asc':
                return a.stock - b.stock;
            case 'stock-desc':
                return b.stock - a.stock;
            default:
                return 0;
        }
    });
    
    // Resetar para a primeira página e renderizar
    currentPage = 1;
    renderProducts();
    renderPagination();
}

// Renderizar produtos na tabela
function renderProducts() {
    console.log('=== RENDERIZANDO PRODUTOS ===');
    console.log('filteredProducts.length:', filteredProducts.length);
    console.log('allProducts.length:', allProducts.length);
    
    const productsList = document.getElementById('products-list');
    const noProducts = document.getElementById('no-products');
    
    console.log('Elementos DOM encontrados:', {
        productsList: !!productsList,
        noProducts: !!noProducts
    });
    
    // Limpar lista atual
    productsList.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        console.log('❌ Nenhum produto para exibir');
        productsList.innerHTML = '';
        noProducts.style.display = 'block';
        return;
    }
    
    console.log('✅ Exibindo produtos:', filteredProducts.length);
    
    noProducts.style.display = 'none';
    
    // Calcular índices para paginação
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = Math.min(startIndex + productsPerPage, filteredProducts.length);
    
    // Renderizar produtos da página atual
    for (let i = startIndex; i < endIndex; i++) {
        const product = filteredProducts[i];
        const row = document.createElement('tr');
        
        // Formatar preço
        const formattedPrice = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(product.price);
        
        // Status do produto (ativo/inativo) - baseado no estoque e status
        const isActive = (product.stock > 0) && (product.status !== 'inactive') && (product.active !== false);
        const statusText = isActive ? 'Ativo' : 'Inativo';
        const statusClass = isActive ? 'status-active' : 'status-inactive';
        
        // Botão de acréscimo de estoque
        const stockButton = isActive ? 
            `<button class="action-btn stock-btn" onclick="openStockModal('${product.id}')" title="Adicionar estoque">
                <i class="fas fa-plus"></i> +10
            </button>` :
            `<button class="action-btn stock-btn" disabled title="Produto inativo">
                <i class="fas fa-ban"></i> Inativo
            </button>`;
        
        row.innerHTML = `
            <td><img src="${product.image}" alt="${product.title}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;"></td>
            <td>
                <div class="product-info">
                    <strong>${product.title}</strong>
                    <small>${product.brand || 'Marca'}</small>
                </div>
            </td>
            <td><span class="category-badge">${product.category}</span></td>
            <td><strong>${formattedPrice}</strong></td>
            <td><span class="stock-value">${product.stock}</span></td>
            <td><span class="product-status ${statusClass}">${statusText}</span></td>
            <td>${stockButton}</td>
            <td class="product-actions">
                <button class="action-btn view-btn" onclick="viewProduct('${product.id}')" title="Ver detalhes">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        
        productsList.appendChild(row);
    }
}

// Renderizar paginação
function renderPagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    if (totalPages <= 1) {
        return;
    }
    
    // Botão anterior
    const prevButton = document.createElement('button');
    prevButton.classList.add('page-btn');
    prevButton.textContent = '«';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderProducts();
            renderPagination();
        }
    });
    pagination.appendChild(prevButton);
    
    // Botões de página
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.classList.add('page-btn');
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        pageButton.textContent = i;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            renderProducts();
            renderPagination();
        });
        pagination.appendChild(pageButton);
    }
    
    // Botão próximo
    const nextButton = document.createElement('button');
    nextButton.classList.add('page-btn');
    nextButton.textContent = '»';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderProducts();
            renderPagination();
        }
    });
    pagination.appendChild(nextButton);
}

// Ver detalhes do produto
function viewProduct(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    // Criar modal de detalhes do produto
    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2><i class="fas fa-info-circle"></i> Detalhes do Produto</h2>
                <button class="close-modal" onclick="this.closest('.modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="product-details-full">
                    <div class="product-image-large">
                        <img src="${product.image}" alt="${product.title}">
                    </div>
                    <div class="product-info-full">
                        <h3>${product.title}</h3>
                        <p class="product-brand">Marca: ${product.brand || 'N/A'}</p>
                        <p class="product-category">Categoria: ${product.category}</p>
                        <p class="product-price">Preço: ${new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        }).format(product.price)}</p>
                        <p class="product-stock">Estoque atual: <strong>${product.stock}</strong></p>
                        <p class="product-description">${product.description || 'Sem descrição disponível.'}</p>
                        ${product.rating ? `<p class="product-rating">Avaliação: ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))} (${product.ratingCount || 0} avaliações)</p>` : ''}
                    </div>
                </div>
            </div>
            <div class="modal-actions">
                <button class="btn secondary" onclick="this.closest('.modal').remove()">Fechar</button>
                ${product.stock > 0 ? `<button class="btn primary" onclick="openStockModal('${product.id}'); this.closest('.modal').remove();">Adicionar Estoque</button>` : ''}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Mostrar notificação
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

// Variável para armazenar o ID do produto atual no modal
let currentProductId = null;

// Abrir modal para adicionar estoque
function openStockModal(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    // Verificar se produto está ativo (conforme regras de negócio)
    const isActive = (product.stock > 0) && (product.status !== 'inactive') && (product.active !== false);
    if (!isActive) {
        showNotification('Produto inativo: não é possível ajustar estoque.', 'error');
        return;
    }
    
    currentProductId = productId;
    
    // Preencher informações do produto
    document.getElementById('modal-product-image').src = product.image;
    document.getElementById('modal-product-image').alt = product.title;
    document.getElementById('modal-product-name').textContent = product.title;
    document.getElementById('modal-product-category').textContent = product.category;
    document.getElementById('modal-product-price').textContent = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(product.price);
    document.getElementById('modal-current-stock').textContent = product.stock;
    
    // Limpar mensagens de erro
    document.getElementById('stock-error-message').textContent = '';
    document.getElementById('stock-error-message').classList.remove('show');
    
    // Resetar seleção de estoque
    document.getElementById('stock-amount').value = '10';
    updateStockPreview();
    
    // Mostrar modal
    document.getElementById('stock-modal').classList.add('show');
}

// Fechar modal
function closeModal() {
    document.getElementById('stock-modal').classList.remove('show');
    currentProductId = null;
}

// Atualizar preview do novo estoque
function updateStockPreview() {
    if (currentProductId === null) return;
    
    const product = allProducts.find(p => p.id === currentProductId);
    if (!product) return;
    
    const amountToAdd = parseInt(document.getElementById('stock-amount').value) || 0;
    const newStock = product.stock + amountToAdd;
    
    document.getElementById('new-stock-preview').textContent = newStock;
    
    // Atualizar mensagem de confirmação com mais detalhes
    const confirmationText = `Confirmar acréscimo de +${amountToAdd} unidades ao estoque?
    
Produto: ${product.title}
Estoque atual: ${product.stock} unidades
Novo estoque: ${newStock} unidades`;
    document.getElementById('confirmation-text').innerHTML = confirmationText.replace(/\n/g, '<br>');
}

// Confirmar adição de estoque
function confirmAddStock() {
    if (currentProductId === null) return;
    
    const product = allProducts.find(p => p.id === currentProductId);
    if (!product) return;
    
    const amountToAdd = parseInt(document.getElementById('stock-amount').value);
    
    // Limpar mensagens de erro anteriores
    const errorMessage = document.getElementById('stock-error-message');
    errorMessage.textContent = '';
    errorMessage.classList.remove('show');
    
    // Validação: apenas múltiplos de 10
    if (isNaN(amountToAdd) || amountToAdd <= 0 || amountToAdd % 10 !== 0) {
        errorMessage.textContent = 'Acréscimo deve ser em lotes de 10 (10, 20, 30…).';
        errorMessage.classList.add('show');
        return;
    }
    
    // Verificar se produto está ativo (produtos com status inativo ou estoque 0)
    if (product.status === 'inactive' || product.active === false) {
        errorMessage.textContent = 'Produto inativo: não é possível ajustar estoque.';
        errorMessage.classList.add('show');
        return;
    }
    
    // Verificar limite máximo de estoque (opcional - 1000 unidades)
    const maxStock = 1000;
    if (product.stock + amountToAdd > maxStock) {
        errorMessage.textContent = `Operação ultrapassa o limite de estoque (máx. ${maxStock}).`;
        errorMessage.classList.add('show');
        return;
    }
    
    try {
    // Adicionar estoque ao produto
    product.stock += amountToAdd;
    
    // Atualizar a lista filtrada também
    const filteredProduct = filteredProducts.find(p => p.id === currentProductId);
    if (filteredProduct) {
        filteredProduct.stock += amountToAdd;
    }
    
    // Fechar modal e atualizar a tabela
    closeModal();
    renderProducts();
    
    // Mostrar mensagem de sucesso mais detalhada
        showNotification(`✅ Estoque atualizado com sucesso!
        
Produto: ${product.title}
Acréscimo: +${amountToAdd} unidades
Estoque anterior: ${product.stock - amountToAdd}
Novo estoque: ${product.stock} unidades`, 'success');
        
    } catch (error) {
        console.error('Erro ao atualizar estoque:', error);
        errorMessage.textContent = 'Falha ao atualizar estoque. Tente novamente.';
        errorMessage.classList.add('show');
    }
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
            alert('Sua sessão expirou. Por favor, faça login novamente.');
            window.location.href = '../pages/login.html';
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

// Verificar timeout a cada minuto
setInterval(checkSessionTimeout, 60000);

// Verificar timeout ao carregar a página
checkSessionTimeout();