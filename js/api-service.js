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
    async getProducts(page = 1, limit = 20) {
        try {
            const response = await this.request(`/products?page=${page}&limit=${limit}`);
            return {
                products: response.data.map(product => this.convertProduct(product)),
                pagination: response.pagination
            };
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            return { products: [], pagination: { page: 1, limit: 20, total: 0, pages: 0 } };
        }
    }

    // Buscar produto por ID
    async getProductById(id) {
        try {
            const response = await this.request(`/products/${id}`);
            return this.convertProduct(response.data);
        } catch (error) {
            console.error('Erro ao buscar produto:', error);
            return null;
        }
    }

    // Obter categorias disponíveis
    async getCategories() {
        const products = await this.getProducts(1, 500);
        const categories = [...new Set(products.products.map(p => p.category))];
        return categories.sort();
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

    // Gerar URL da imagem do produto com imagens reais
    getProductImage(product) {
        // Usar Picsum para imagens reais baseadas no ID do produto
        const imageId = product.id.replace('PROD-', '');
        const imageNumber = parseInt(imageId) % 1000;
        
        // Usar Picsum que é mais confiável
        return `https://picsum.photos/400/400?random=${imageNumber}`;
    }

    // Obter palavras-chave para imagens baseadas na categoria
    getImageKeywords(category) {
        const keywords = {
            'casa': 'home,house,interior',
            'eletrônicos': 'electronics,technology,gadgets',
            'eletrodomésticos': 'appliances,home,kitchen',
            'móveis': 'furniture,home,decor',
            'roupas': 'fashion,clothing,style',
            'esportes': 'sports,fitness,exercise',
            'livros': 'books,reading,education',
            'beleza': 'beauty,cosmetics,skincare',
            'saúde': 'health,medical,wellness',
            'automotivo': 'car,automotive,vehicle'
        };
        
        return keywords[category.toLowerCase()] || 'product,item,shopping';
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