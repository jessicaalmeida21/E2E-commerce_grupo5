// Módulo de gerenciamento de produtos
const productsModule = (() => {
    let products = [];
    let apiService;
    
    // Funções para gerenciar carrinho específico por usuário
    function getCurrentUserId() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        return currentUser ? currentUser.id : 'guest';
    }
    
    function getUserCart() {
        const userId = getCurrentUserId();
        const cartKey = `cart_${userId}`;
        return JSON.parse(localStorage.getItem(cartKey)) || [];
    }
    
    function saveUserCart(cart) {
        const userId = getCurrentUserId();
        const cartKey = `cart_${userId}`;
        localStorage.setItem(cartKey, JSON.stringify(cart));
        console.log(`Carrinho salvo para usuário ${userId}:`, cart);
    }
    
    function clearUserCart() {
        const userId = getCurrentUserId();
        const cartKey = `cart_${userId}`;
        localStorage.removeItem(cartKey);
        console.log(`Carrinho limpo para usuário ${userId}`);
    }

    // Inicializar o módulo
    function init() {
        if (window.apiService) {
            apiService = window.apiService;
            console.log('ApiService inicializado com sucesso');
        } else {
            console.error('ApiService não encontrado, tentando novamente...');
            // Tentar novamente após um delay
            setTimeout(() => {
                if (window.apiService) {
                    apiService = window.apiService;
                    console.log('ApiService inicializado com delay');
                } else {
                    console.error('ApiService ainda não disponível');
                }
            }, 1000);
        }
    }

    // Inicializar automaticamente
    init();

    // Carregar produtos da API
    async function loadProducts(page = 1, pageSize = 500) {
        try {
            console.log('=== INÍCIO loadProducts ===');
            console.log('Parâmetros:', { page, pageSize });
            console.log('apiService disponível:', typeof apiService);
            console.log('window.apiService disponível:', typeof window.apiService);
            
            if (!apiService) {
                console.log('ApiService não encontrado, tentando inicializar...');
                init();
                if (!apiService) {
                    console.log('ApiService não disponível após init, usando produtos locais...');
                    return loadLocalProducts();
                }
            }
            
            console.log('Carregando produtos da API...');
            const response = await apiService.getProducts(page, pageSize);
            console.log('Resposta da API:', response);
            console.log('Tipo da resposta:', typeof response);
            console.log('response.products existe:', !!response.products);
            console.log('response.products é array:', Array.isArray(response.products));
            
            if (response && response.products && Array.isArray(response.products)) {
                // Transformar produtos da API para incluir imagens geradas e corrigir preços
                products = response.products.map(product => {
                    // Extrair preço da estrutura aninhada da API
                    const price = (product.price && typeof product.price === 'object') 
                        ? (product.price.final ?? product.price.price_final ?? 0) 
                        : (product.price_final ?? product.priceFinal ?? product.price ?? 0);
                    
                    const originalPrice = (product.price && typeof product.price === 'object') 
                        ? (product.price.original ?? product.price.price_original ?? price) 
                        : (product.price_original ?? product.priceOriginal ?? price);
                    
                    const discount = (product.price && typeof product.price === 'object') 
                        ? (product.price.discount_percent ?? product.price.discountPercent ?? 0) 
                        : (product.discount_percent ?? product.discountPercent ?? 0);
                    
                    // Extrair estoque da estrutura aninhada
                    const stock = (product.stock && typeof product.stock === 'object') 
                        ? (product.stock.quantity ?? product.stock.stock_quantity ?? 0) 
                        : (product.stock_quantity ?? product.stockQuantity ?? 0);
                    
                    // Extrair rating da estrutura aninhada
                    const rating = (product.rating && typeof product.rating === 'object') 
                        ? (product.rating.average ?? product.rating.rating_average ?? 0) 
                        : (product.rating_average ?? product.ratingAverage ?? 0);
                    
                    return {
                        id: product.id,
                        title: product.title,
                        description: product.description || 'Produto de qualidade',
                        price: parseFloat(price) || 0,
                        originalPrice: parseFloat(originalPrice) || parseFloat(price) || 0,
                        discount: parseFloat(discount) || 0,
                        category: product.category || 'geral',
                        brand: product.brand || 'Marca',
                        rating: parseFloat(rating) || 0,
                        stock: parseInt(stock) || 0,
                        image: apiService.getProductImage(product),
                        createdAt: product.created_at || product.createdAt || new Date().toISOString(),
                        updatedAt: product.updated_at || product.updatedAt || new Date().toISOString()
                    };
                });
                console.log('Produtos carregados da API:', products.length);
                console.log('Primeiro produto da API:', products[0]);
                console.log('=== FIM loadProducts (API) ===');
                return products; // Retornar produtos transformados
            } else {
                console.log('Resposta da API inválida, usando fallback...');
                console.log('Resposta recebida:', response);
                console.log('=== FIM loadProducts (fallback) ===');
                return loadLocalProducts();
            }
        } catch (error) {
            console.error('Erro ao carregar produtos da API:', error);
            console.log('Usando produtos locais como fallback...');
            console.log('=== FIM loadProducts (erro) ===');
            return loadLocalProducts();
        }
    }

    // Carregar produtos locais como fallback
    function loadLocalProducts() {
        console.log('=== INÍCIO loadLocalProducts ===');
        console.log('getAllProducts disponível:', typeof getAllProducts);
        
        // Usar o banco de dados atualizado se disponível
        if (typeof getAllProducts === 'function') {
            console.log('Usando database.js atualizado');
            products = getAllProducts();
            console.log('Produtos carregados do database.js:', products.length);
            console.log('Primeiro produto do database.js:', products[0]);
            console.log('=== FIM loadLocalProducts (database.js) ===');
            return products;
        }
        
        console.log('database.js não disponível, usando fallback hardcoded');
        
        // Fallback para produtos básicos se database.js não estiver disponível
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
            },
            {
                id: 'PROD-003',
                title: 'TV Samsung 55" 4K',
                description: 'Smart TV com resolução 4K Ultra HD',
                price: 2200.00,
                originalPrice: 2800.00,
                discount: 21,
                image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center',
                category: 'eletrônicos',
                brand: 'Samsung',
                stock: 15,
                rating: 4.7,
                ratingCount: 200
            },
            {
                id: 'PROD-004',
                title: 'Fone de Ouvido Sony WH-1000XM4',
                description: 'Fone de ouvido com cancelamento de ruído',
                price: 1200.00,
                originalPrice: 1500.00,
                discount: 20,
                image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop&crop=center',
                category: 'eletrônicos',
                brand: 'Sony',
                stock: 30,
                rating: 4.8,
                ratingCount: 150
            },
            {
                id: 'PROD-005',
                title: 'Monitor LG 27" 4K',
                description: 'Monitor profissional 4K IPS',
                price: 1800.00,
                originalPrice: 2200.00,
                discount: 18,
                image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center',
                category: 'eletrônicos',
                brand: 'LG',
                stock: 20,
                rating: 4.6,
                ratingCount: 95
            },
            {
                id: 'PROD-006',
                title: 'Air Fryer Mondial 4L',
                description: 'Fritadeira sem óleo com capacidade de 4 litros',
                price: 350.00,
                originalPrice: 450.00,
                discount: 22,
                image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center',
                category: 'casa',
                brand: 'Mondial',
                stock: 40,
                rating: 4.3,
                ratingCount: 180
            },
            {
                id: 'PROD-007',
                title: 'Liquidificador Oster 500W',
                description: 'Liquidificador com 500W de potência',
                price: 180.00,
                originalPrice: 220.00,
                discount: 18,
                image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=400&fit=crop&crop=center',
                category: 'casa',
                brand: 'Oster',
                stock: 60,
                rating: 4.1,
                ratingCount: 120
            },
            {
                id: 'PROD-008',
                title: 'Aspirador de Pó Electrolux',
                description: 'Aspirador de pó vertical 2 em 1',
                price: 280.00,
                originalPrice: 350.00,
                discount: 20,
                image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=center',
                category: 'casa',
                brand: 'Electrolux',
                stock: 25,
                rating: 4.4,
                ratingCount: 90
            },
            {
                id: 'PROD-009',
                title: 'Tênis Nike Air Max 270',
                description: 'Tênis esportivo com tecnologia Air Max',
                price: 450.00,
                originalPrice: 550.00,
                discount: 18,
                image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&crop=center',
                category: 'moda',
                brand: 'Nike',
                stock: 35,
                rating: 4.5,
                ratingCount: 200
            },
            {
                id: 'PROD-010',
                title: 'Camiseta Polo Lacoste',
                description: 'Camiseta polo de algodão penteado',
                price: 120.00,
                originalPrice: 150.00,
                discount: 20,
                image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&crop=center',
                category: 'moda',
                brand: 'Lacoste',
                stock: 50,
                rating: 4.2,
                ratingCount: 85
            },
            {
                id: 'PROD-011',
                title: 'Bicicleta Caloi Aro 26',
                description: 'Bicicleta mountain bike aro 26',
                price: 800.00,
                originalPrice: 1000.00,
                discount: 20,
                image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center',
                category: 'esportes',
                brand: 'Caloi',
                stock: 15,
                rating: 4.6,
                ratingCount: 75
            },
            {
                id: 'PROD-012',
                title: 'Kit de Halteres 20kg',
                description: 'Kit com 2 halteres de 10kg cada',
                price: 200.00,
                originalPrice: 250.00,
                discount: 20,
                image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center',
                category: 'esportes',
                brand: 'Kikos',
                stock: 30,
                rating: 4.3,
                ratingCount: 110
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

    // Adicionar ao carrinho - VERSÃO CORRIGIDA DEFINITIVA
    async function addToCart(productId) {
        console.log('=== ADICIONANDO PRODUTO AO CARRINHO ===');
        console.log('ProductId:', productId);
        console.log('Produtos disponíveis:', products.length);
        console.log('IDs dos produtos:', products.map(p => p.id));
        
        // Verificar usuário atual
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        console.log('Usuário atual:', currentUser ? currentUser.name : 'guest');
        
        // Se não há produtos carregados, tentar carregar
        if (products.length === 0) {
            console.log('Nenhum produto carregado, tentando carregar...');
            const loadedProducts = await loadProducts();
            if (loadedProducts && loadedProducts.length > 0) {
                products = loadedProducts;
                console.log('Produtos carregados:', products.length);
            }
        }
        
        // Tentar encontrar o produto por ID exato primeiro
        let product = products.find(p => p.id === productId);
        console.log('Produto encontrado nos produtos carregados:', !!product);
        
        // Se não encontrou, tentar encontrar por ID sem prefixo
        if (!product) {
            const idWithoutPrefix = productId.replace('PROD-', '');
            product = products.find(p => p.id === idWithoutPrefix || p.id === productId);
            console.log('Produto encontrado sem prefixo:', !!product);
        }
        
        // Se ainda não encontrou, tentar carregar produtos da API novamente
        if (!product) {
            console.log('Produto não encontrado, tentando recarregar produtos...');
            try {
                const response = await apiService.getProducts(1, 500);
                if (response && response.products && Array.isArray(response.products)) {
                    products = response.products.map(p => ({
                        ...p,
                        image: apiService.getProductImage(p)
                    }));
                    product = products.find(p => p.id === productId || p.id === productId.replace('PROD-', ''));
                    console.log('Produto encontrado após recarregar da API:', !!product);
                }
            } catch (error) {
                console.error('Erro ao recarregar produtos:', error);
            }
        }
        
        // Se ainda não encontrou, tentar database.js diretamente
        if (!product && typeof getAllProducts === 'function') {
            console.log('Tentando carregar do database.js diretamente...');
            const allProducts = getAllProducts();
            product = allProducts.find(p => p.id === productId);
            console.log('Produto encontrado no database.js:', !!product);
            if (product) {
                console.log('Produto do database.js:', {
                    id: product.id,
                    title: product.title,
                    price: product.price
                });
            }
        }
        
        if (!product) {
            console.error('❌ Produto não encontrado após todas as tentativas:', productId);
            console.log('Produtos disponíveis:', products.map(p => ({ id: p.id, title: p.title })));
            throw new Error('Produto não encontrado');
        }
        
        if (product.stock === 0) {
            throw new Error('Produto fora de estoque');
        }
        
        console.log('✅ Produto encontrado para adicionar ao carrinho:', {
            id: product.id,
            title: product.title,
            price: product.price,
            stock: product.stock
        });
        
        // Obter carrinho atual do usuário usando função sincronizada
        let cart = getUserCart();
        console.log('Carrinho atual antes da adição:', cart);
        
        // Verificar se o produto já está no carrinho
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            // Incrementar quantidade
            existingItem.quantity += 1;
            // Atualizar preço também
            existingItem.price = parseFloat(product.price) || 0;
            existingItem.title = product.title || existingItem.title;
            existingItem.image = product.image || existingItem.image;
            existingItem.description = product.description || existingItem.description;
            existingItem.brand = product.brand || existingItem.brand;
            console.log('Quantidade incrementada para item existente:', existingItem);
        } else {
            // Adicionar novo item
            const newItem = {
                id: productId,
                title: product.title,
                price: parseFloat(product.price) || 0,
                image: product.image,
                quantity: 1,
                description: product.description || '',
                brand: product.brand || 'Marca'
            };
            cart.push(newItem);
            console.log('Novo item adicionado ao carrinho:', newItem);
        }
        
        // Salvar carrinho do usuário usando função sincronizada
        saveUserCart(cart);
        console.log('Carrinho salvo:', cart);
        
        // Atualizar contador do carrinho
        updateCartCounter();
        
        // Verificar se foi salvo corretamente
        const savedCart = getUserCart();
        console.log('Verificação: carrinho após salvar:', savedCart);
        
        console.log('✅ Produto adicionado ao carrinho com sucesso:', product.title);
        return true;
    }
    
    // Atualizar contador do carrinho
    function updateCartCounter() {
        const cart = getUserCart();
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
        addToCart,
        updateCartCounter
    };
})();

// Disponibilizar globalmente
window.productsModule = productsModule;