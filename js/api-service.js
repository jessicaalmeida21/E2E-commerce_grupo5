// Serviço para consumir a API de produtos
class ApiService {
    constructor() {
        this.baseUrl = 'https://catalogo-products.pages.dev/api';
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutos
    }

    // Fazer requisição com cache
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const cacheKey = `${url}_${JSON.stringify(options)}`;
        
        // Verificar cache
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }

        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Armazenar no cache
            this.cache.set(cacheKey, {
                data,
                timestamp: Date.now()
            });

            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Buscar produtos com paginação
    async getProducts(page = 1, pageSize = 20) {
        try {
            const response = await this.request(`/products?page=${page}&pageSize=${pageSize}`);
            return {
                products: response.products.map(product => this.convertProduct(product)),
                pagination: response.meta
            };
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            return { products: [], pagination: { total: 0, page: 1, pageSize: 20 } };
        }
    }

    // Buscar produto por ID
    async getProductById(id) {
        try {
            const response = await this.request(`/products/${id}`);
            return this.convertProduct(response);
        } catch (error) {
            console.error('Erro ao buscar produto:', error);
            return null;
        }
    }

    // Obter categorias disponíveis
    async getCategories() {
        try {
            // Buscar todos os produtos para extrair categorias
            const response = await this.request('/products?page=1&pageSize=500');
            const categories = [...new Set(response.products.map(p => p.category))];
            return categories.sort();
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
            return ['casa', 'eletrônicos', 'eletrodomésticos', 'móveis', 'roupas', 'esportes', 'livros', 'beleza', 'saúde', 'automotivo'];
        }
    }

    // Criar pedido
    async createOrder(orderData) {
        return await this.request('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    }

    // Limpar cache
    clearCache() {
        this.cache.clear();
    }

    // Converter produto da API para formato interno
    convertProduct(apiProduct) {
        return {
            id: apiProduct.id,
            title: apiProduct.title,
            description: apiProduct.description,
            price: apiProduct.price.final,
            originalPrice: apiProduct.price.original,
            discount: apiProduct.price.discount_percent,
            image: this.getProductImage(apiProduct),
            category: apiProduct.category,
            brand: apiProduct.brand,
            stock: apiProduct.stock.quantity,
            sku: apiProduct.stock.sku,
            rating: apiProduct.rating.average,
            ratingCount: apiProduct.rating.count,
            slug: apiProduct.slug,
            warehouse: apiProduct.stock.warehouse,
            createdAt: apiProduct.created_at,
            updatedAt: apiProduct.updated_at
        };
    }

    // Gerar URL da imagem do produto com imagens reais baseadas na categoria
    getProductImage(product) {
        const category = product.category?.toLowerCase() || 'casa';
        const productId = product.id.replace('PROD-', '');
        const imageNumber = parseInt(productId) % 1000;
        
        // Mapear categorias para imagens específicas do Unsplash
        const categoryImages = {
            'casa': [
                'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&crop=center',
                'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop&crop=center',
                'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=400&fit=crop&crop=center',
                'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&crop=center',
                'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop&crop=center'
            ],
            'eletrônicos': [
                'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop&crop=center',
                'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center',
                'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center',
                'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop&crop=center',
                'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center'
            ],
            'eletrodomésticos': [
                'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center',
                'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=400&fit=crop&crop=center',
                'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=center',
                'https://images.unsplash.com/photo-1581578731548-c6a0c3f2b4a4?w=400&h=400&fit=crop&crop=center',
                'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center'
            ],
            'móveis': [
                'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&crop=center',
                'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop&crop=center',
                'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=400&fit=crop&crop=center',
                'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&crop=center',
                'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop&crop=center'
            ],
            'roupas': [
                'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&crop=center',
                'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&crop=center',
                'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&crop=center',
                'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&crop=center',
                'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&crop=center'
            ],
            'esportes': [
                'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center',
                'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center',
                'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center',
                'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center',
                'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center'
            ],
            'livros': [
                'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop&crop=center',
                'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop&crop=center',
                'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop&crop=center',
                'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop&crop=center',
                'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop&crop=center'
            ],
            'beleza': [
                'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&crop=center',
                'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&crop=center',
                'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&crop=center',
                'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&crop=center',
                'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&crop=center'
            ],
            'saúde': [
                'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop&crop=center',
                'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop&crop=center',
                'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop&crop=center',
                'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop&crop=center',
                'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop&crop=center'
            ],
            'automotivo': [
                'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center',
                'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center',
                'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center',
                'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center',
                'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center'
            ]
        };

        // Se a categoria existe no mapeamento, usar uma imagem específica
        if (categoryImages[category]) {
            const images = categoryImages[category];
            const index = imageNumber % images.length;
            return images[index];
        }
        
        // Fallback: usar Picsum baseado no ID do produto
        return `https://picsum.photos/400/400?random=${imageNumber}`;
    }

    // Formatar preço
    formatPrice(price) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    }
}

// Instância global do serviço
const apiService = new ApiService();