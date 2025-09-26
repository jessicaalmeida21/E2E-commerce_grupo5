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
    async getProducts(page = 1, pageSize = 500) {
        try {
            console.log(`Fazendo requisição para: /products?page=${page}&pageSize=${pageSize}`);
            const response = await this.request(`/products?page=${page}&pageSize=${pageSize}`);
            console.log('Resposta da API:', response);
            
            if (response && response.products && Array.isArray(response.products)) {
                const convertedProducts = response.products.map(product => this.convertProduct(product));
                console.log('Produtos convertidos:', convertedProducts.length);
                console.log('Primeiro produto convertido:', convertedProducts[0]);
                return {
                    products: convertedProducts,
                    pagination: response.meta || { total: response.products.length, page: page, pageSize: pageSize }
                };
            } else {
                console.error('Resposta da API inválida:', response);
                return { products: [], pagination: { total: 0, page: 1, pageSize: 200 } };
            }
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            return { products: [], pagination: { total: 0, page: 1, pageSize: 200 } };
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

    // Gerar URL da imagem do produto com imagens específicas baseadas no nome
    getProductImage(product) {
        const title = product.title?.toLowerCase() || '';
        const category = product.category?.toLowerCase() || 'casa';
        const productId = product.id.replace('PROD-', '');
        const imageNumber = parseInt(productId) % 1000;
        
        console.log('Gerando imagem para:', title, 'categoria:', category);
        
        // Mapear palavras-chave do título para imagens específicas
        const imageMap = {
            // Eletrônicos - TVs (prioridade alta)
            'smart tv': 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center',
            'tv': 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center',
            'televisão': 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center',
            'lenovo': 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center',
            '4k': 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center',
            'uhd': 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center',
            
            // Eletrônicos - Fones (prioridade alta)
            'fone bluetooth': 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop&crop=center',
            'fone': 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop&crop=center',
            'headphone': 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop&crop=center',
            'headset': 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop&crop=center',
            'bluetooth': 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop&crop=center',
            'jbl': 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop&crop=center',
            'dell': 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop&crop=center',
            'cancelamento': 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop&crop=center',
            'ruído': 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop&crop=center',
            
            // Casa - Aspiradores (prioridade alta)
            'aspirador robô': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=center',
            'aspirador': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=center',
            'robô': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=center',
            'britânia': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=center',
            'mondial': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=center',
            'wi-fi': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=center',
            'mapeamento': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=center',
            
            // Casa - Liquidificadores (prioridade alta)
            'liquidificador': 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=400&fit=crop&crop=center',
            'philco': 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=400&fit=crop&crop=center',
            'inox': 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=400&fit=crop&crop=center',
            '800w': 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=400&fit=crop&crop=center',
            
            // Esportes - Bicicletas (prioridade alta)
            'bicicleta': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center',
            'bike': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center',
            'puma': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center',
            'penalty': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center',
            'aro 29': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center',
            'aro': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center',
            '21v': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center',
            
            // Esportes - Halteres (prioridade alta)
            'halteres': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center',
            'peso': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center',
            'kg': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center',
            'revestidos': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center',
            '4kg': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center',
            
            // Esportes - Skate (prioridade alta)
            'skate': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center',
            'maple': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center',
            '8.0': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center',
            
            // Eletrônicos - Smartphones
            'smartphone': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center',
            'celular': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center',
            'iphone': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center',
            'galaxy': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center',
            
            // Eletrônicos - Notebooks
            'notebook': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop&crop=center',
            'laptop': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop&crop=center',
            'macbook': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop&crop=center',
            
            // Eletrônicos - Monitores
            'monitor': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center',
            'lg': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center',
            
            // Eletrônicos - Tablets
            'tablet': 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=400&fit=crop&crop=center',
            'ipad': 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=400&fit=crop&crop=center',
            
            // Eletrônicos - Câmeras
            'câmera': 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop&crop=center',
            'camera': 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop&crop=center',
            'canon': 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop&crop=center',
            'nikon': 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop&crop=center',
            
            // Eletrônicos - Videogames
            'videogame': 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop&crop=center',
            'playstation': 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop&crop=center',
            'xbox': 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop&crop=center',
            'nintendo': 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop&crop=center',
            
            // Casa e Eletrodomésticos
            'air fryer': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center',
            'fritadeira': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center',
            'cafeteira': 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2b4a4?w=400&h=400&fit=crop&crop=center',
            'microondas': 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center',
            'geladeira': 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=400&fit=crop&crop=center',
            'fogão': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=center',
            'máquina de lavar': 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2b4a4?w=400&h=400&fit=crop&crop=center',
            'secadora': 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center',
            'ventilador': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=center',
            'ar condicionado': 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2b4a4?w=400&h=400&fit=crop&crop=center',
            
            // Moda e Roupas
            'tênis': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&crop=center',
            'sapato': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&crop=center',
            'nike': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&crop=center',
            'adidas': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&crop=center',
            'camiseta': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center',
            'polo': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center',
            'lacoste': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center',
            'calça': 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center',
            'jeans': 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center',
            'jaqueta': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center',
            'blusa': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center',
            'vestido': 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center',
            'relógio': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center',
            'watch': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center',
            'bolsa': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&crop=center',
            'mochila': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&crop=center',
            
            // Móveis
            'mesa': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&crop=center',
            'cadeira': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&crop=center',
            'sofá': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&crop=center',
            'sofa': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&crop=center',
            'cama': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&crop=center',
            'armário': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&crop=center',
            'estante': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&crop=center',
            'prateleira': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&crop=center',
            
            // Livros
            'livro': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop&crop=center',
            'book': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop&crop=center',
            'revista': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop&crop=center',
            'mangá': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop&crop=center',
            'quadrinho': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop&crop=center',
            
            // Beleza e Saúde
            'perfume': 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop&crop=center',
            'maquiagem': 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop&crop=center',
            'batom': 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop&crop=center',
            'creme': 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop&crop=center',
            'shampoo': 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop&crop=center',
            'condicionador': 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop&crop=center',
            'vitamina': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop&crop=center',
            'suplemento': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop&crop=center',
            
            // Automotivo
            'pneu': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center',
            'óleo': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center',
            'bateria': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center',
            'filtro': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center',
            'peça': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center'
        };
        
        // Buscar imagem específica baseada no título
        for (const [keyword, imageUrl] of Object.entries(imageMap)) {
            if (title.includes(keyword)) {
                console.log('Imagem encontrada para:', keyword, '->', imageUrl);
                return imageUrl;
            }
        }
        
        console.log('Nenhuma imagem específica encontrada, usando fallback');
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

// Disponibilizar globalmente
window.apiService = apiService;
