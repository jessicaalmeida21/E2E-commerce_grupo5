// Módulo de gerenciamento de produtos
const productsModule = (() => {
    let products = [];
    let apiService;

    // Inicializar o módulo
    function init() {
        apiService = window.apiService;
        if (!apiService) {
            console.error('ApiService não encontrado');
            return;
        }
    }

    // Carregar produtos da API
    async function loadProducts() {
        try {
            if (!apiService) {
                init();
            }
            
            const response = await apiService.getProducts(1, 100);
            products = response.products || [];
            console.log('Produtos carregados:', products.length);
            return products;
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            return loadLocalProducts();
        }
    }

    // Carregar produtos locais como fallback
    function loadLocalProducts() {
        products = [
            {
                id: 'PROD-001',
                title: 'Smartphone Galaxy S21',
                description: 'Smartphone com tela de 6.2 polegadas',
                price: 2500.00,
                originalPrice: 3000.00,
                discount: 17,
                image: 'https://picsum.photos/400/400?random=1',
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
                image: 'https://picsum.photos/400/400?random=2',
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
    function getCategories() {
        const categories = [...new Set(products.map(product => product.category))];
        return categories.sort();
    }

    // Inicializar quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    return {
        loadProducts,
        getProducts,
        getProductById,
        getFeaturedProducts,
    searchProducts,
        getProductsByCategory,
        getCategories
    };
})();