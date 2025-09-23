// Funcionalidades para a página de busca de produtos

document.addEventListener('DOMContentLoaded', function() {
    // Elementos da página
    const searchInput = document.getElementById('search-input');
    const searchTermDisplay = document.getElementById('search-term');
    const resultsCountDisplay = document.getElementById('results-count');
    const searchResultsContainer = document.getElementById('search-results');
    const noResultsContainer = document.getElementById('no-results');
    const paginationContainer = document.getElementById('pagination');
    const sortSelect = document.getElementById('sort-select');
    const categoryFiltersContainer = document.getElementById('category-filters');
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    const applyPriceButton = document.getElementById('apply-price');
    const clearFiltersButton = document.getElementById('clear-filters');
    
    // Configurações de paginação
    const itemsPerPage = 12;
    let currentPage = 1;
    
    // Estado dos filtros
    let filters = {
        categories: [],
        minPrice: null,
        maxPrice: null,
        rating: null,
        condition: [],
        freeShipping: false
    };
    
    // Obter parâmetros da URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q') || '';
    
    // Inicializar a página
    initPage();
    
    // Função para inicializar a página
    function initPage() {
        // Preencher o campo de busca e exibir o termo buscado
        searchInput.value = searchQuery;
        searchTermDisplay.textContent = searchQuery ? `"${searchQuery}"` : 'Todos os produtos';
        
        // Carregar categorias para filtros
        loadCategories();
        
        // Configurar eventos
        setupEventListeners();
        
        // Realizar a busca inicial
        performSearch();
    }
    
    // Carregar categorias para os filtros
    function loadCategories() {
        const categories = getAllCategories();
        
        categoryFiltersContainer.innerHTML = '';
        
        categories.forEach(category => {
            const li = document.createElement('li');
            
            const label = document.createElement('label');
            label.className = 'checkbox-label';
            
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.value = category;
            input.dataset.category = category;
            input.addEventListener('change', handleCategoryFilter);
            
            label.appendChild(input);
            label.appendChild(document.createTextNode(category));
            
            li.appendChild(label);
            categoryFiltersContainer.appendChild(li);
        });
    }
    
    // Obter todas as categorias únicas dos produtos
    function getAllCategories() {
        const categories = new Set();
        
        getAllProducts().forEach(product => {
            categories.add(product.category);
        });
        
        return Array.from(categories);
    }
    
    // Configurar eventos
    function setupEventListeners() {
        // Ordenação
        sortSelect.addEventListener('change', performSearch);
        
        // Filtros de preço
        applyPriceButton.addEventListener('click', handlePriceFilter);
        
        // Filtros de avaliação
        document.querySelectorAll('.rating-filters input').forEach(input => {
            input.addEventListener('change', handleRatingFilter);
        });
        
        // Filtros de condição
        document.querySelectorAll('input[value="new"], input[value="used"]').forEach(input => {
            input.addEventListener('change', handleConditionFilter);
        });
        
        // Filtro de frete grátis
        document.querySelector('input[value="free_shipping"]').addEventListener('change', handleShippingFilter);
        
        // Limpar filtros
        clearFiltersButton.addEventListener('click', clearAllFilters);
    }
    
    // Manipuladores de eventos para filtros
    function handleCategoryFilter(e) {
        const category = e.target.dataset.category;
        
        if (e.target.checked) {
            if (!filters.categories.includes(category)) {
                filters.categories.push(category);
            }
        } else {
            filters.categories = filters.categories.filter(cat => cat !== category);
        }
        
        performSearch();
    }
    
    function handlePriceFilter() {
        const minPrice = minPriceInput.value ? parseFloat(minPriceInput.value) : null;
        const maxPrice = maxPriceInput.value ? parseFloat(maxPriceInput.value) : null;
        
        filters.minPrice = minPrice;
        filters.maxPrice = maxPrice;
        
        performSearch();
    }
    
    function handleRatingFilter(e) {
        // Desmarcar outros filtros de avaliação
        document.querySelectorAll('.rating-filters input').forEach(input => {
            if (input !== e.target) {
                input.checked = false;
            }
        });
        
        filters.rating = e.target.checked ? parseInt(e.target.value) : null;
        
        performSearch();
    }
    
    function handleConditionFilter(e) {
        const condition = e.target.value;
        
        if (e.target.checked) {
            if (!filters.condition.includes(condition)) {
                filters.condition.push(condition);
            }
        } else {
            filters.condition = filters.condition.filter(cond => cond !== condition);
        }
        
        performSearch();
    }
    
    function handleShippingFilter(e) {
        filters.freeShipping = e.target.checked;
        
        performSearch();
    }
    
    function clearAllFilters() {
        // Limpar estado dos filtros
        filters = {
            categories: [],
            minPrice: null,
            maxPrice: null,
            rating: null,
            condition: [],
            freeShipping: false
        };
        
        // Limpar inputs
        document.querySelectorAll('input[type="checkbox"]').forEach(input => {
            input.checked = false;
        });
        
        minPriceInput.value = '';
        maxPriceInput.value = '';
        
        // Realizar nova busca
        performSearch();
    }
    
    // Realizar busca com filtros
    function performSearch() {
        // Resetar paginação
        currentPage = 1;
        
        // Obter produtos filtrados
        const filteredProducts = filterProducts(searchQuery, filters);
        
        // Ordenar produtos
        const sortedProducts = sortProducts(filteredProducts, sortSelect.value);
        
        // Atualizar contador de resultados
        updateResultsCount(sortedProducts.length);
        
        // Exibir produtos ou mensagem de nenhum resultado
        if (sortedProducts.length > 0) {
            displayProducts(sortedProducts);
            displayPagination(sortedProducts.length);
            noResultsContainer.style.display = 'none';
            searchResultsContainer.style.display = 'grid';
            paginationContainer.style.display = 'flex';
        } else {
            noResultsContainer.style.display = 'block';
            searchResultsContainer.style.display = 'none';
            paginationContainer.style.display = 'none';
        }
    }
    
    // Filtrar produtos com base na busca e filtros
    function filterProducts(query, filters) {
        let products = getAllProducts();
        
        // Filtrar por termo de busca
        if (query) {
            const searchTerms = query.toLowerCase().split(' ');
            
            products = products.filter(product => {
                const productText = `${product.name} ${product.description} ${product.category}`.toLowerCase();
                return searchTerms.every(term => productText.includes(term));
            });
        }
        
        // Aplicar filtros
        
        // Filtro de categorias
        if (filters.categories.length > 0) {
            products = products.filter(product => filters.categories.includes(product.category));
        }
        
        // Filtro de preço
        if (filters.minPrice !== null) {
            products = products.filter(product => product.price >= filters.minPrice);
        }
        
        if (filters.maxPrice !== null) {
            products = products.filter(product => product.price <= filters.maxPrice);
        }
        
        // Filtro de avaliação
        if (filters.rating !== null) {
            products = products.filter(product => product.rating >= filters.rating);
        }
        
        // Filtro de condição
        if (filters.condition.length > 0) {
            products = products.filter(product => filters.condition.includes(product.condition));
        }
        
        // Filtro de frete grátis
        if (filters.freeShipping) {
            products = products.filter(product => product.freeShipping);
        }
        
        return products;
    }
    
    // Ordenar produtos
    function sortProducts(products, sortBy) {
        const sortedProducts = [...products];
        
        switch (sortBy) {
            case 'price_asc':
                sortedProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price_desc':
                sortedProducts.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                sortedProducts.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
                sortedProducts.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'relevance':
            default:
                // Manter a ordem padrão (relevância)
                break;
        }
        
        return sortedProducts;
    }
    
    // Atualizar contador de resultados
    function updateResultsCount(count) {
        resultsCountDisplay.textContent = `${count} produto${count !== 1 ? 's' : ''} encontrado${count !== 1 ? 's' : ''}`;
    }
    
    // Exibir produtos com paginação
    function displayProducts(products) {
        // Calcular produtos da página atual
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentProducts = products.slice(startIndex, endIndex);
        
        // Limpar container
        searchResultsContainer.innerHTML = '';
        
        // Adicionar produtos
        currentProducts.forEach(product => {
            const productCard = createProductCard(product);
            searchResultsContainer.appendChild(productCard);
        });
    }
    
    // Criar card de produto
    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        // Verificar se o produto está na lista de desejos
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        const isInWishlist = wishlist.includes(product.id);
        
        card.innerHTML = `
            <div class="product-image">
                <a href="product.html?id=${product.id}">
                    <img src="${product.image}" alt="${product.name}">
                </a>
                <button class="wishlist-btn ${isInWishlist ? 'active' : ''}" data-id="${product.id}">
                    <i class="fas fa-heart"></i>
                </button>
                ${product.freeShipping ? '<span class="free-shipping">Frete grátis</span>' : ''}
            </div>
            <div class="product-info">
                <a href="product.html?id=${product.id}" class="product-name">${product.name}</a>
                <div class="product-price">
                    ${product.oldPrice ? `<span class="old-price">${formatPrice(product.oldPrice)}</span>` : ''}
                    <span class="current-price">${formatPrice(product.price)}</span>
                </div>
                <div class="product-rating">
                    ${generateStarRating(product.rating)}
                    <span class="rating-count">(${product.ratingCount})</span>
                </div>
                <button class="add-to-cart-btn" data-id="${product.id}">
                    <i class="fas fa-shopping-cart"></i> Adicionar
                </button>
            </div>
        `;
        
        // Adicionar evento para botão de lista de desejos
        const wishlistBtn = card.querySelector('.wishlist-btn');
        wishlistBtn.addEventListener('click', function() {
            toggleWishlist(product.id);
            this.classList.toggle('active');
        });
        
        // Adicionar evento para botão de adicionar ao carrinho
        const addToCartBtn = card.querySelector('.add-to-cart-btn');
        addToCartBtn.addEventListener('click', function() {
            addToCart(product.id, 1);
            showNotification(`${product.name} adicionado ao carrinho!`);
        });
        
        return card;
    }
    
    // Gerar HTML para avaliação em estrelas
    function generateStarRating(rating) {
        let stars = '';
        
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="fas fa-star"></i>';
            } else if (i - 0.5 <= rating) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        
        return stars;
    }
    
    // Exibir paginação
    function displayPagination(totalItems) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        
        // Limpar container
        paginationContainer.innerHTML = '';
        
        // Botão anterior
        const prevBtn = document.createElement('button');
        prevBtn.className = 'prev-btn';
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.disabled = currentPage === 1;
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                performSearch();
            }
        });
        paginationContainer.appendChild(prevBtn);
        
        // Botões de página
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.textContent = i;
            pageBtn.className = i === currentPage ? 'active' : '';
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                performSearch();
            });
            paginationContainer.appendChild(pageBtn);
        }
        
        // Botão próximo
        const nextBtn = document.createElement('button');
        nextBtn.className = 'next-btn';
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                performSearch();
            }
        });
        paginationContainer.appendChild(nextBtn);
    }
    
    // Mostrar notificação
    function showNotification(message, type = 'success') {
        // Verificar se já existe uma notificação
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Adicionar ao corpo do documento
        document.body.appendChild(notification);
        
        // Adicionar classe para animar entrada
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Configurar botão de fechar
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
        
        // Auto-fechar após 3 segundos
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 3000);
    }
});