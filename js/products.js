// Sistema de Produtos com API
const productsModule = (function() {
    // Cache local de produtos
    let productsCache = [];
    let categoriesCache = [];
    let currentPage = 1;
    let totalPages = 1;
    let isLoading = false;

    // Carregar produtos da API
    async function loadProducts(page = 1, pageSize = 12, category = null, search = null) {
        if (isLoading) return;
        
        isLoading = true;
        try {
            const response = await apiService.getProducts(page, pageSize, category, search);
            
            productsCache = response.products.map(apiService.convertProduct);
            currentPage = response.meta.page;
            totalPages = Math.ceil(response.meta.total / response.meta.pageSize);
            
            return {
                products: productsCache,
                meta: response.meta
            };
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            // Fallback para produtos locais em caso de erro
            return loadLocalProducts();
        } finally {
            isLoading = false;
        }
    }

    // Carregar produtos locais (fallback)
    function loadLocalProducts() {
        const localProducts = [
            {
                id: "PROD-0001",
                title: "Smartphone Galaxy S23",
                description: "Smartphone Samsung Galaxy S23 com 128GB, tela de 6.1 polegadas e câmera de 50MP.",
                price: 2999.99,
                originalPrice: 3299.99,
                discount: 9,
                image: "https://images.samsung.com/is/image/samsung/p6pim/br/sm-s911bzkkzto/gallery/galaxy-s23-ultra-5g-sm-s911b-421866-sm-s911bzkkzto-537406421?$650_519_PNG$",
                category: "eletrônicos",
                brand: "Samsung",
                stock: 15,
                rating: 4.5,
                ratingCount: 128,
                sku: "SM-S911BZKKZTO",
                warehouse: "SP"
            },
            {
                id: "PROD-0002",
                title: "Notebook Dell Inspiron 15",
                description: "Notebook Dell Inspiron 15 3000 com Intel Core i5, 8GB RAM e 256GB SSD.",
                price: 2499.99,
                originalPrice: 2799.99,
                discount: 11,
                image: "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/inspiron-notebooks/15-3520/media-gallery/in3520-cnb-00000ff090-gy.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=402&qlt=100,1&resMode=sharp2&size=402,402",
                category: "eletrônicos",
                brand: "Dell",
                stock: 8,
                rating: 4.2,
                ratingCount: 67,
                sku: "INSP-15-3520",
                warehouse: "RJ"
            }
        ];
        
        productsCache = localProducts;
        currentPage = 1;
        totalPages = 1;
        
        return {
            products: productsCache,
            meta: {
                total: localProducts.length,
                page: 1,
                pageSize: localProducts.length
            }
        };
    }

    // Obter produtos
    function getProducts() {
        return productsCache;
    }

    // Obter produto por ID
    async function getProductById(id) {
        // Primeiro verificar no cache
        let product = productsCache.find(p => p.id === id);
        
        if (!product) {
            // Buscar na API
            try {
                product = await apiService.getProductById(id);
                if (product) {
                    product = apiService.convertProduct(product);
                }
            } catch (error) {
                console.error('Erro ao buscar produto:', error);
            }
        }
        
        return product;
    }

    // Buscar produtos
    async function searchProducts(query, page = 1) {
        return await loadProducts(page, 12, null, query);
    }

    // Filtrar por categoria
    async function getProductsByCategory(category, page = 1) {
        return await loadProducts(page, 12, category);
    }

    // Obter categorias
    async function getCategories() {
        if (categoriesCache.length > 0) {
            return categoriesCache;
        }
        
        try {
            categoriesCache = await apiService.getCategories();
            return categoriesCache;
        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
            return ['eletrônicos', 'eletrodomésticos', 'móveis', 'roupas', 'esportes'];
        }
    }

    // Obter produtos em destaque
    async function getFeaturedProducts(limit = 8) {
        const result = await loadProducts(1, limit);
        return result.products;
    }

    // Obter produtos em promoção
    function getDiscountedProducts() {
        return productsCache.filter(product => product.discount > 0);
    }

    // Obter produtos por faixa de preço
    function getProductsByPriceRange(minPrice, maxPrice) {
        return productsCache.filter(product => 
            product.price >= minPrice && product.price <= maxPrice
        );
    }

    // Ordenar produtos
    function sortProducts(products, sortBy) {
        const sorted = [...products];
        
        switch (sortBy) {
            case 'price-asc':
                return sorted.sort((a, b) => a.price - b.price);
            case 'price-desc':
                return sorted.sort((a, b) => b.price - a.price);
            case 'name-asc':
                return sorted.sort((a, b) => a.title.localeCompare(b.title));
            case 'name-desc':
                return sorted.sort((a, b) => b.title.localeCompare(a.title));
            case 'rating-desc':
                return sorted.sort((a, b) => b.rating - a.rating);
            case 'discount-desc':
                return sorted.sort((a, b) => b.discount - a.discount);
            default:
                return sorted;
        }
    }

    // Formatar preço
    function formatPrice(price) {
        return price.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }

    // Calcular desconto
    function calculateDiscount(originalPrice, finalPrice) {
        return Math.round(((originalPrice - finalPrice) / originalPrice) * 100);
    }

    // Verificar se produto está em estoque
    function isInStock(product) {
        return product.stock > 0;
    }

    // Obter informações de paginação
    function getPaginationInfo() {
        return {
            currentPage,
            totalPages,
            hasNextPage: currentPage < totalPages,
            hasPrevPage: currentPage > 1
        };
    }

    // Limpar cache
    function clearCache() {
        productsCache = [];
        categoriesCache = [];
        apiService.clearCache();
    }

    // Adicionar produto ao carrinho
    function addToCart(productId, quantity = 1) {
        const product = productsCache.find(p => p.id === productId);
        if (!product) {
            throw new Error('Produto não encontrado');
        }

        if (!isInStock(product)) {
            throw new Error('Produto fora de estoque');
        }

        if (quantity > product.stock) {
            throw new Error('Quantidade solicitada maior que o estoque disponível');
        }

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                quantity: quantity,
                stock: product.stock
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCounter();
        
        return true;
    }

    // Remover produto do carrinho
    function removeFromCart(productId) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCounter();
    }

    // Atualizar contador do carrinho
    function updateCartCounter() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        const counter = document.getElementById('cart-count');
        if (counter) {
            counter.textContent = totalItems;
            counter.style.display = totalItems > 0 ? 'inline' : 'none';
        }
    }

    // Inicializar sistema de produtos
    async function init() {
        try {
            await loadProducts();
            updateCartCounter();
        } catch (error) {
            console.error('Erro ao inicializar sistema de produtos:', error);
        }
    }

    // API pública
    return {
        // Carregamento
        loadProducts,
        getProducts,
        getProductById,
        searchProducts,
        getProductsByCategory,
        getCategories,
        getFeaturedProducts,
        getDiscountedProducts,
        getProductsByPriceRange,
        
        // Utilitários
        sortProducts,
        formatPrice,
        calculateDiscount,
        isInStock,
        getPaginationInfo,
        clearCache,
        
        // Carrinho
        addToCart,
        removeFromCart,
        updateCartCounter,
        
        // Inicialização
        init,
        
        // Propriedades
        get currentPage() { return currentPage; },
        get totalPages() { return totalPages; },
        get isLoading() { return isLoading; }
    };
})();

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar o apiService estar disponível
    if (typeof apiService !== 'undefined') {
        productsModule.init();
    } else {
        // Aguardar um pouco e tentar novamente
        setTimeout(() => {
            if (typeof apiService !== 'undefined') {
                productsModule.init();
            }
        }, 1000);
    }
});