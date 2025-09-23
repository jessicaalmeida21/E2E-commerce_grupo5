// Verificação de autenticação e perfil
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o usuário está logado e é um vendedor
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.profile !== 'seller') {
        alert('Acesso restrito. Você precisa estar logado como vendedor.');
        window.location.href = '../pages/login.html';
        return;
    }

    // Exibir nome do usuário
    document.getElementById('user-name').textContent = currentUser.name;

    // Configurar logout
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('sessionTimeout');
        window.location.href = '../pages/login.html';
    });

    // Inicializar a página
    loadProducts();
    setupEventListeners();
});

// Variáveis globais
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 10;

// Carregar produtos
function loadProducts() {
    // Usar os produtos do arquivo products.js
    allProducts = products.map(product => {
        return {
            ...product,
            stock: product.stock || Math.floor(Math.random() * 50) + 1 // Garantir que todos os produtos tenham estoque
        };
    });
    
    filteredProducts = [...allProducts];
    applyFiltersAndSort();
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
    
    // Modal de estoque
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    document.getElementById('cancel-add-stock').addEventListener('click', closeModal);
    document.getElementById('confirm-add-stock').addEventListener('click', confirmAddStock);
}

// Aplicar filtros e ordenação
function applyFiltersAndSort() {
    const searchTerm = document.getElementById('product-search').value.toLowerCase();
    const categoryFilter = document.getElementById('category-filter').value.toLowerCase();
    const sortBy = document.getElementById('sort-by').value;
    
    // Filtrar produtos
    filteredProducts = allProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                             product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = categoryFilter === '' || product.category.toLowerCase() === categoryFilter;
        
        return matchesSearch && matchesCategory;
    });
    
    // Ordenar produtos
    filteredProducts.sort((a, b) => {
        switch(sortBy) {
            case 'name-asc':
                return a.name.localeCompare(b.name);
            case 'name-desc':
                return b.name.localeCompare(a.name);
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
    const productsList = document.getElementById('products-list');
    const noProducts = document.getElementById('no-products');
    
    // Limpar lista atual
    productsList.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productsList.innerHTML = '';
        noProducts.style.display = 'block';
        return;
    }
    
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
        
        // Determinar status baseado no estoque
        const status = product.stock > 0 ? 'Ativo' : 'Inativo';
        const statusClass = product.stock > 0 ? 'status-active' : 'status-inactive';
        
        row.innerHTML = `
            <td><img src="${product.image}" alt="${product.name}"></td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${formattedPrice}</td>
            <td>${product.stock}</td>
            <td><span class="product-status ${statusClass}">${status}</span></td>
            <td class="product-actions">
                <button class="action-btn view-btn" onclick="viewProduct(${product.id})">Ver</button>
                <button class="action-btn stock-btn" onclick="openStockModal(${product.id})">Estoque</button>
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
    window.location.href = `../pages/product.html?id=${productId}`;
}

// Variável para armazenar o ID do produto atual no modal
let currentProductId = null;

// Abrir modal para adicionar estoque
function openStockModal(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    currentProductId = productId;
    
    document.getElementById('modal-product-name').textContent = product.name;
    document.getElementById('modal-current-stock').textContent = product.stock;
    document.getElementById('stock-error-message').textContent = '';
    
    document.getElementById('stock-modal').style.display = 'block';
}

// Fechar modal
function closeModal() {
    document.getElementById('stock-modal').style.display = 'none';
    currentProductId = null;
}

// Confirmar adição de estoque
function confirmAddStock() {
    if (currentProductId === null) return;
    
    const product = allProducts.find(p => p.id === currentProductId);
    if (!product) return;
    
    const amountToAdd = parseInt(document.getElementById('stock-amount').value);
    
    if (isNaN(amountToAdd) || amountToAdd <= 0) {
        document.getElementById('stock-error-message').textContent = 'Quantidade inválida.';
        return;
    }
    
    // Adicionar estoque ao produto
    product.stock += amountToAdd;
    
    // Atualizar a lista filtrada também
    const filteredProduct = filteredProducts.find(p => p.id === currentProductId);
    if (filteredProduct) {
        filteredProduct.stock += amountToAdd;
    }
    
    // Salvar no localStorage para persistência
    saveProductsToLocalStorage();
    
    // Fechar modal e atualizar a tabela
    closeModal();
    renderProducts();
    
    // Mostrar mensagem de sucesso
    alert(`Estoque do produto "${product.name}" aumentado em ${amountToAdd} unidades.`);
}

// Salvar produtos no localStorage
function saveProductsToLocalStorage() {
    localStorage.setItem('products', JSON.stringify(allProducts));
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