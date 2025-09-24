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
            
            // Salvar no cache
            this.cache.set(cacheKey, {
                data: data,
                timestamp: Date.now()
            });

            return data;
        } catch (error) {
            console.error('Erro na requisição:', error);
            throw error;
        }
    }

    // Listar produtos com paginação
    async getProducts(page = 1, pageSize = 12, category = null, search = null) {
        let endpoint = `/products?page=${page}&pageSize=${pageSize}`;
        
        if (category) {
            endpoint += `&category=${encodeURIComponent(category)}`;
        }
        
        if (search) {
            endpoint += `&search=${encodeURIComponent(search)}`;
        }

        return await this.request(endpoint);
    }

    // Buscar produto por ID
    async getProductById(productId) {
        const products = await this.getProducts(1, 500); // Buscar todos para encontrar por ID
        return products.products.find(p => p.id === productId);
    }

    // Buscar produtos por categoria
    async getProductsByCategory(category, page = 1, pageSize = 12) {
        return await this.getProducts(page, pageSize, category);
    }

    // Buscar produtos
    async searchProducts(query, page = 1, pageSize = 12) {
        return await this.getProducts(page, pageSize, null, query);
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

    // Gerar URL da imagem do produto
    getProductImage(product) {
        // Usar placeholder ou gerar imagem baseada no ID
        const imageId = product.id.replace('PROD-', '');
        return `https://picsum.photos/300/300?random=${imageId}`;
    }

    // Formatar preço
    formatPrice(price) {
        return price.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }

    // Verificar se produto está em promoção
    isOnSale(product) {
        return product.discount > 0;
    }

    // Calcular preço com desconto
    calculateDiscountedPrice(originalPrice, discountPercent) {
        return originalPrice * (1 - discountPercent / 100);
    }
}

// Instância global
window.apiService = new ApiService();
