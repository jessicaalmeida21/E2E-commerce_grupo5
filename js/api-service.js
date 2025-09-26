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

    // Gerar URL da imagem do produto com imagens únicas baseadas no nome
    getProductImage(product) {
        const title = product.title?.toLowerCase() || '';
        const category = product.category?.toLowerCase() || 'casa';
        const productId = product.id.replace('PROD-', '');
        const imageNumber = parseInt(productId) % 1000;
        
        console.log('Gerando imagem para:', title, 'categoria:', category);
        
        // Gerar hash único baseado no título para garantir imagem única
        const titleHash = this.generateHash(title);
        const uniqueSeed = (imageNumber + titleHash) % 10000;
        
        // Mapear categorias para coleções específicas do Unsplash com imagens mais precisas
        const categoryCollections = {
            'eletronicos': {
                'tv': '1593359677879', // TVs
                'smartphone': '1511707171634', // Smartphones
                'fone': '1505740420928', // Fones
                'monitor': '1505740420928', // Monitores
                'notebook': '1498049794561', // Notebooks
                'tablet': '1561154464', // Tablets
                'camera': '1502920917128', // Câmeras
                'videogame': '1606144042614', // Videogames
                'controle': '1606144042614', // Controles
                'playstation': '1606144042614', // PlayStation
                'xbox': '1606144042614' // Xbox
            },
            'casa': {
                'aspirador': '1581578731548', // Aspiradores
                'liquidificador': '1556909114', // Liquidificadores
                'air fryer': '1574269909862', // Air Fryers
                'fritadeira': '1574269909862', // Fritadeiras
                'cafeteira': '1581578731548', // Cafeteiras
                'microondas': '1574269909862', // Microondas
                'geladeira': '1556909114', // Geladeiras
                'fogão': '1556909114', // Fogões
                'ventilador': '1556909114', // Ventiladores
                'britânia': '1574269909862', // Britânia
                'mondial': '1556909114', // Mondial
                'oster': '1581578731548', // Oster
                'electrolux': '1574269909862' // Electrolux
            },
            'esportes': {
                'bicicleta nike': '1558618666', // Bicicletas Nike
                'bicicleta': '1558618666', // Bicicletas
                'bike': '1558618666', // Bikes
                'aro 29': '1558618666', // Aro 29
                '21v': '1558618666', // 21 velocidades
                'halteres': '1571019613454', // Halteres
                'skate spalding': '1606144042614', // Skate Spalding
                'skate': '1606144042614', // Skates
                'maple': '1606144042614', // Maple
                '8.0': '1606144042614', // 8.0
                'bola': '1431326005620', // Bolas
                'futebol': '1431326005620', // Futebol
                'basquete': '1431326005620', // Basquete
                'equipamento': '1571019613454', // Equipamentos
                'nike': '1558618666', // Nike esportes
                'spalding': '1431326005620', // Spalding
                'penalty': '1431326005620', // Penalty
                'puma': '1558618666' // Puma esportes
            },
            'moda': {
                'tênis': '1441986300917', // Tênis
                'sapato': '1441986300917', // Sapatos
                'camiseta': '1521572163474', // Camisetas
                'calça': '1594633312681', // Calças
                'jaqueta': '1551028719', // Jaquetas
                'relógio': '1523275335684', // Relógios
                'bolsa': '1553062407', // Bolsas
                'mochila': '1553062407', // Mochilas
                'nike': '1441986300917', // Nike moda
                'adidas': '1441986300917', // Adidas
                'lacoste': '1521572163474', // Lacoste
                'calvin klein': '1521572163474', // Calvin Klein
                'hering': '1521572163474', // Hering
                'reserva': '1594633312681', // Reserva
                'oakley': '1551028719' // Oakley
            },
            'móveis': {
                'mesa': '1586023492125', // Mesas
                'cadeira': '1586023492125', // Cadeiras
                'sofá': '1586023492125', // Sofás
                'cama': '1586023492125', // Camas
                'armário': '1586023492125', // Armários
                'estante': '1586023492125' // Estantes
            },
            'beleza': {
                'perfume': '1541643600914', // Perfumes
                'maquiagem': '1541643600914', // Maquiagem
                'creme': '1541643600914', // Cremes
                'shampoo': '1541643600914', // Shampoos
                'vitamina': '1584308666744' // Vitaminas
            }
        };
        
        // Determinar tipo específico do produto com prioridade para palavras mais específicas
        let productType = 'default';
        const categoryMap = categoryCollections[category] || {};
        
        // Ordenar palavras-chave por especificidade (mais longas primeiro)
        const sortedKeywords = Object.keys(categoryMap).sort((a, b) => b.length - a.length);
        
        for (const keyword of sortedKeywords) {
            if (title.includes(keyword)) {
                productType = keyword;
                console.log(`Palavra-chave encontrada: "${keyword}" para produto: "${title}"`);
                break;
            }
        }
        
        // Se não encontrou na categoria, tentar em todas as categorias
        if (productType === 'default') {
            for (const [cat, catMap] of Object.entries(categoryCollections)) {
                const sortedCatKeywords = Object.keys(catMap).sort((a, b) => b.length - a.length);
                for (const keyword of sortedCatKeywords) {
                    if (title.includes(keyword)) {
                        productType = keyword;
                        console.log(`Palavra-chave encontrada em ${cat}: "${keyword}" para produto: "${title}"`);
                        break;
                    }
                }
                if (productType !== 'default') break;
            }
        }
        
        // Se não encontrou tipo específico, usar categoria geral
        if (productType === 'default') {
            const generalCollections = {
                'eletronicos': '1511707171634',
                'casa': '1556909114',
                'esportes': '1571019613454',
                'moda': '1441986300917',
                'móveis': '1586023492125',
                'beleza': '1541643600914'
            };
            const collectionId = generalCollections[category] || '1511707171634';
            console.log(`Usando categoria geral ${category} para produto: "${title}"`);
            return `https://images.unsplash.com/photo-${collectionId}?w=400&h=400&fit=crop&crop=center&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&seed=${uniqueSeed}`;
        }
        
        // Encontrar a coleção correta para o tipo de produto
        let collectionId = categoryMap[productType];
        if (!collectionId) {
            // Se não encontrou na categoria atual, buscar em todas as categorias
            for (const [cat, catMap] of Object.entries(categoryCollections)) {
                if (catMap[productType]) {
                    collectionId = catMap[productType];
                    console.log(`Encontrada coleção em ${cat} para "${productType}": ${collectionId}`);
                    break;
                }
            }
        }
        
        if (!collectionId) {
            collectionId = '1511707171634'; // Fallback
            console.log(`Usando fallback para produto: "${title}"`);
        }
        
        console.log(`Imagem final para "${title}": coleção ${collectionId}, seed ${uniqueSeed}`);
        return `https://images.unsplash.com/photo-${collectionId}?w=400&h=400&fit=crop&crop=center&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&seed=${uniqueSeed}`;
    }
    
    // Gerar hash simples baseado no título
    generateHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
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
