class ApiService {
    constructor() {
        this.baseUrl = 'https://catalogo-products.pages.dev/api';
        this.cache = new Map();
    }

    async getProducts(page = 1, pageSize = 500) {
        const cacheKey = `products_${page}_${pageSize}`;
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            const response = await fetch(`${this.baseUrl}/products?page=${page}&pageSize=${pageSize}`);
            const data = await response.json();
            
            this.cache.set(cacheKey, data);
            return data;
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            throw error;
        }
    }

    // Função para gerar imagens reais baseadas no produto
    getProductImage(product) {
        // Se o produto já tem uma imagem definida, usar ela
        if (product.image && product.image.startsWith('https://images.unsplash.com/')) {
            return product.image;
        }
        
        const title = product.title?.toLowerCase() || '';
        const brand = product.brand?.toLowerCase() || '';
        const category = product.category?.toLowerCase() || '';
        
        console.log('=== GERANDO IMAGEM REAL ===');
        console.log('Título:', title);
        console.log('Marca:', brand);
        console.log('Categoria:', category);
        
        // Smartphones - Imagens reais e únicas
        if (title.includes('smartphone') || title.includes('iphone') || title.includes('galaxy') || title.includes('xiaomi')) {
            if (title.includes('iphone') || title.includes('apple')) {
                console.log('✓ Imagem iPhone encontrada');
                return 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
            } else if (title.includes('galaxy') || title.includes('samsung')) {
                console.log('✓ Imagem Samsung Galaxy encontrada');
                return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
            } else if (title.includes('xiaomi') || title.includes('redmi')) {
                console.log('✓ Imagem Xiaomi encontrada');
                return 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
            } else {
                console.log('✓ Imagem smartphone genérico encontrada');
                return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
            }
        }
        
        // Smart TVs - Imagens reais e únicas (VERIFICAR PRIMEIRO!)
        if (title.includes('smart tv') || title.includes('tv') || title.includes('televisão')) {
            if (title.includes('samsung')) {
                console.log('✓ Imagem TV Samsung encontrada');
                return 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
            } else if (title.includes('lg')) {
                console.log('✓ Imagem TV LG encontrada');
                return 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
            } else if (title.includes('sony')) {
                console.log('✓ Imagem TV Sony encontrada');
                return 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
            } else if (title.includes('lenovo')) {
                console.log('✓ Imagem TV Lenovo encontrada');
                return 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
            } else if (title.includes('dell')) {
                console.log('✓ Imagem TV Dell encontrada');
                return 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
            } else {
                console.log('✓ Imagem TV genérico encontrada');
                return 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
            }
        }
        
        // Notebooks - Imagens reais e únicas (VERIFICAR DEPOIS!)
        if (title.includes('notebook') || title.includes('laptop')) {
            if (title.includes('acer')) {
                console.log('✓ Imagem notebook Acer encontrada');
                return 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
            } else if (title.includes('lenovo')) {
                console.log('✓ Imagem notebook Lenovo encontrada');
                return 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
            } else if (title.includes('dell')) {
                console.log('✓ Imagem notebook Dell encontrada');
                return 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
            } else {
                console.log('✓ Imagem notebook genérico encontrada');
                return 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
            }
        }
        
        // Fones de ouvido - Imagens reais e únicas (VERIFICAR ANTES DE DELL NOTEBOOK!)
        if (title.includes('fone') || title.includes('headphone') || title.includes('bluetooth')) {
            if (title.includes('jbl')) {
                console.log('✓ Imagem fone JBL encontrada');
                return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
            } else if (title.includes('sony')) {
                console.log('✓ Imagem fone Sony encontrada');
                return 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
            } else if (title.includes('dell')) {
                console.log('✓ Imagem fone Dell encontrada');
                return 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
            } else if (title.includes('apple')) {
                console.log('✓ Imagem fone Apple encontrada');
                return 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
            } else if (title.includes('acer')) {
                console.log('✓ Imagem fone Acer encontrada');
                return 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
            } else if (title.includes('lenovo')) {
                console.log('✓ Imagem fone Lenovo encontrada');
                return 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
            } else if (title.includes('samsung')) {
                console.log('✓ Imagem fone Samsung encontrada');
                return 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
            } else {
                console.log('✓ Imagem fone genérico encontrada');
                return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
            }
        }
        
        // Tênis - Imagens reais e únicas
        if (title.includes('tênis') || title.includes('sapato') || title.includes('calçado')) {
            if (title.includes('nike')) {
                console.log('✓ Imagem tênis Nike encontrada');
                return 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
            } else if (title.includes('adidas')) {
                console.log('✓ Imagem tênis Adidas encontrada');
                return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
            } else if (title.includes('puma')) {
                console.log('✓ Imagem tênis Puma encontrada');
                return 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
            } else {
                console.log('✓ Imagem tênis genérico encontrada');
                return 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
            }
        }
        
        // Roupas - Imagens reais
        if (title.includes('camiseta') || title.includes('camisa') || title.includes('blusa')) {
            console.log('✓ Imagem camiseta encontrada');
            return 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
        }
        
        if (title.includes('calça') || title.includes('jeans')) {
            console.log('✓ Imagem calça encontrada');
            return 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
        }
        
        if (title.includes('jaqueta') || title.includes('casaco')) {
            console.log('✓ Imagem jaqueta encontrada');
            return 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
        }
        
        // Eletrodomésticos - Imagens reais
        if (title.includes('liquidificador') || title.includes('mixer')) {
            console.log('✓ Imagem liquidificador encontrada');
            return 'https://images.unsplash.com/photo-15569091431326005620-6d0e44b482f8?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
        }
        
        if (title.includes('air fryer') || title.includes('fritadeira')) {
            console.log('✓ Imagem air fryer encontrada');
            return 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
        }
        
        if (title.includes('aspirador') || title.includes('robô')) {
            console.log('✓ Imagem aspirador encontrada');
            return 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2b4a4?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
        }
        
        if (title.includes('cafeteira') || title.includes('coffee') || title.includes('elétrica')) {
            console.log('✓ Imagem cafeteira encontrada');
            return 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
        }
        
        // Esportes - Imagens reais
        if (title.includes('bicicleta') || title.includes('bike')) {
            console.log('✓ Imagem bicicleta encontrada');
            return 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
        }
        
        if (title.includes('skate') || title.includes('skateboard')) {
            console.log('✓ Imagem skate encontrada');
            return 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
        }
        
        if (title.includes('halteres') || title.includes('peso')) {
            console.log('✓ Imagem halteres encontrada');
            return 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
        }
        
        if (title.includes('bola') || title.includes('futebol')) {
            console.log('✓ Imagem bola de futebol encontrada');
                return 'https://images.unsplash.com/photo-1431326005620-6d0e44b482f8?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
        }
        
        // Monitores - Imagens reais
        if (title.includes('monitor') || title.includes('tela')) {
            console.log('✓ Imagem monitor encontrada');
            return 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
        }
        
        // Relógios - Imagens reais
        if (title.includes('relógio') || title.includes('watch')) {
            console.log('✓ Imagem relógio encontrada');
            return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
        }
        
        // Fallback: usar imagem genérica de produto
        console.log(`⚠ Usando fallback genérico para "${title}"`);
        return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
    }

    // Função para clonar produto com imagens (sem alterar funcionalidade existente)
    async cloneProductWithImages(productId, options = {}) {
        try {
            // Buscar o produto original
            const response = await fetch(`${this.baseUrl}/products/${productId}`);
            if (!response.ok) {
                throw new Error('Produto não encontrado');
            }
            
            const originalProduct = await response.json();
            
            // Criar produto clonado com imagens
            const clonedProduct = {
                ...originalProduct,
                id: `PROD-${Date.now()}`, // Novo ID único
                title: options.newTitle || `${originalProduct.title} (Cópia)`,
                image: options.mainImage || this.getProductImage(originalProduct),
                additionalImages: options.additionalImages || [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            // Se não foi fornecida imagem principal, gerar uma nova
            if (!options.mainImage) {
                clonedProduct.image = this.getProductImage(clonedProduct);
            }
            
            console.log('Produto clonado com imagens:', clonedProduct);
            return clonedProduct;
            
        } catch (error) {
            console.error('Erro ao clonar produto com imagens:', error);
            throw error;
        }
    }

    // Função para gerar múltiplas imagens para um produto
    generateMultipleImages(product, count = 3) {
        const images = [];
        const baseImage = this.getProductImage(product);
        
        // Gerar variações da imagem base
        for (let i = 0; i < count; i++) {
            const variation = this.getImageVariation(baseImage, i);
            images.push(variation);
        }
        
        return images;
    }

    // Função para gerar variações de imagem
    getImageVariation(baseImage, variationIndex) {
        // Adicionar parâmetros diferentes para criar variações
        const variations = [
            '&auto=format&q=80&sat=1.2', // Mais saturado
            '&auto=format&q=80&brightness=1.1', // Mais brilhante
            '&auto=format&q=80&contrast=1.1', // Mais contraste
            '&auto=format&q=80&blur=1', // Levemente desfocado
            '&auto=format&q=80&hue=30' // Mudança de tom
        ];
        
        const variation = variations[variationIndex % variations.length];
        return baseImage + variation;
    }

    // Função para clonar produto mantendo imagens originais
    async cloneProductKeepImages(productId) {
        try {
            const response = await fetch(`${this.baseUrl}/products/${productId}`);
            if (!response.ok) {
                throw new Error('Produto não encontrado');
            }
            
            const originalProduct = await response.json();
            
            const clonedProduct = {
                ...originalProduct,
                id: `PROD-${Date.now()}`,
                title: `${originalProduct.title} (Cópia)`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            console.log('Produto clonado mantendo imagens originais:', clonedProduct);
            return clonedProduct;
            
        } catch (error) {
            console.error('Erro ao clonar produto:', error);
            throw error;
        }
    }

    // Método para obter produto por ID
    async getProductById(id) {
        try {
            // Primeiro tentar buscar na API
            const response = await fetch(`${this.baseUrl}/products/${id}`);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.log('Erro ao buscar produto na API:', error);
        }
        
        // Se não encontrar na API, buscar no database.js
        if (typeof productsDatabase !== 'undefined') {
            const allProducts = [];
            Object.values(productsDatabase).forEach(category => {
                if (Array.isArray(category)) {
                    allProducts.push(...category);
                }
            });
            const product = allProducts.find(p => p.id === id);
            if (product) {
                console.log('✅ Produto encontrado no database.js:', product);
                return product;
            }
        }
        
        console.log('❌ Produto não encontrado:', id);
        return null;
    }
}

// Criar instância global
const apiService = new ApiService();
window.apiService = apiService;
