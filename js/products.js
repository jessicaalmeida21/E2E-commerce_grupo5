// Módulo de gerenciamento de produtos
const productsModule = (() => {
    let products = [];
    let apiService;

    // Inicializar o módulo
    function init() {
        if (window.apiService) {
            apiService = window.apiService;
        } else {
            console.error('ApiService não encontrado');
            return;
        }
    }

    // Inicializar automaticamente
    init();

    // Carregar produtos da API
    async function loadProducts(page = 1, pageSize = 200) {
        try {
            if (!apiService) {
                init();
                if (!apiService) {
                    console.log('ApiService não disponível, usando produtos locais...');
                    return loadLocalProducts();
                }
            }
            
            console.log('Carregando produtos da API...');
            const response = await apiService.getProducts(page, pageSize);
            console.log('Resposta da API:', response);
            
            if (response && response.products && Array.isArray(response.products)) {
                products = response.products;
                console.log('Produtos carregados da API:', products.length);
                console.log('Primeiro produto da API:', products[0]);
                return products;
            } else {
                console.log('Resposta da API inválida, usando fallback...');
                console.log('Resposta recebida:', response);
                return loadLocalProducts();
            }
        } catch (error) {
            console.error('Erro ao carregar produtos da API:', error);
            console.log('Usando produtos locais como fallback...');
            return loadLocalProducts();
        }
    }

    // Carregar produtos locais como fallback
    function loadLocalProducts() {
        console.log('Carregando produtos locais como fallback...');
        products = [
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
        return products;
    }

    // Obter todos os produtos
    function getProducts() {
        return products;
    }

    // Obter produto por ID
    async function getProductById(id) {
        try {
            if (apiService) {
                return await apiService.getProductById(id);
            }
        } catch (error) {
            console.error('Erro ao buscar produto por ID:', error);
        }
        
        return products.find(product => product.id === id);
    }

    // Obter produtos em destaque
    async function getFeaturedProducts(limit = 4) {
        await loadProducts();
        return products.slice(0, limit);
    }

    // Buscar produtos por termo
    function searchProducts(term) {
        const searchTerm = term.toLowerCase();
    return products.filter(product => 
            product.title.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm) ||
            product.brand.toLowerCase().includes(searchTerm)
        );
    }

    // Filtrar produtos por categoria
    function getProductsByCategory(category) {
        return products.filter(product => 
            product.category.toLowerCase() === category.toLowerCase()
        );
    }

    // Obter categorias
    async function getCategories() {
        try {
            if (!apiService) {
                init();
                if (!apiService) {
                    console.log('ApiService não disponível para categorias, usando fallback...');
                    return ['casa', 'eletrônicos', 'eletrodomésticos', 'móveis', 'roupas', 'esportes', 'livros', 'beleza', 'saúde', 'automotivo'];
                }
            }
            
            const categories = await apiService.getCategories();
            console.log('Categorias carregadas:', categories);
            return categories;
        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
            return ['casa', 'eletrônicos', 'eletrodomésticos', 'móveis', 'roupas', 'esportes', 'livros', 'beleza', 'saúde', 'automotivo'];
        }
    }

    // Ordenar produtos
    function sortProducts(products, sortBy) {
        const sortedProducts = [...products];
        
        switch(sortBy) {
            case 'name-asc':
                return sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
            case 'name-desc':
                return sortedProducts.sort((a, b) => b.title.localeCompare(a.title));
            case 'price-asc':
                return sortedProducts.sort((a, b) => a.price - b.price);
            case 'price-desc':
                return sortedProducts.sort((a, b) => b.price - a.price);
            case 'rating-asc':
                return sortedProducts.sort((a, b) => (a.rating || 0) - (b.rating || 0));
            case 'rating-desc':
                return sortedProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            default:
                return sortedProducts;
        }
    }

    // Formatar preço
    function formatPrice(price) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    }

    // Adicionar ao carrinho
function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) {
            throw new Error('Produto não encontrado');
        }
        
        if (product.stock === 0) {
            throw new Error('Produto fora de estoque');
        }
        
        // Obter carrinho atual
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Verificar se o produto já está no carrinho
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            // Incrementar quantidade
            existingItem.quantity += 1;
        } else {
            // Adicionar novo item
            cart.push({
                id: productId,
                title: product.title,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        // Salvar carrinho
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Atualizar contador do carrinho
        updateCartCounter();
        
        console.log('Produto adicionado ao carrinho:', product.title);
        return true;
    }
    
    // Atualizar contador do carrinho
function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
        const cartCounters = document.querySelectorAll('#cart-count, .cart-count, .cart-counter');
        cartCounters.forEach(counter => {
            counter.textContent = totalItems;
            counter.style.display = totalItems > 0 ? 'flex' : 'none';
        });
    }
    
    // Inicializar quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    return {
        loadProducts,
        loadLocalProducts,
        getProducts,
        getProductById,
        getFeaturedProducts,
        searchProducts,
        getProductsByCategory,
        getCategories,
        sortProducts,
    formatPrice,
        addToCart
    };
})();