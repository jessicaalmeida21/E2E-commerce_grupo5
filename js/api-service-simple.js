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

    // Função simplificada para gerar imagens baseadas no nome do produto
    getProductImage(product) {
        const title = product.title?.toLowerCase() || '';
        const productId = product.id.replace('PROD-', '');
        const imageNumber = parseInt(productId) % 1000;
        
        console.log('=== GERANDO IMAGEM ===');
        console.log('Título:', title);
        console.log('ID do produto:', productId);
        
        // Mapeamento simples e direto
        if (title.includes('smart tv') || title.includes('tv') || title.includes('lenovo')) {
            console.log('✓ Imagem TV encontrada');
            return 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
        }
        
        if (title.includes('calça') || title.includes('jeans') || title.includes('puma') || title.includes('oakley')) {
            console.log('✓ Imagem calça encontrada');
            return 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
        }
        
        if (title.includes('notebook') || title.includes('laptop') || title.includes('acer') || title.includes('dell') || title.includes('i5')) {
            console.log('✓ Imagem notebook encontrada');
            return 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
        }
        
        if (title.includes('fone') || title.includes('headphone') || title.includes('headset')) {
            console.log('✓ Imagem fone encontrada');
            return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
        }
        
        if (title.includes('camiseta') || title.includes('camisa') || title.includes('polo') || title.includes('blusa')) {
            console.log('✓ Imagem camiseta encontrada');
            return 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
        }
        
        if (title.includes('tênis') || title.includes('sapato') || title.includes('nike') || title.includes('adidas')) {
            console.log('✓ Imagem tênis encontrada');
            return 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
        }
        
        if (title.includes('smartphone') || title.includes('iphone') || title.includes('galaxy') || title.includes('apple') || title.includes('samsung')) {
            console.log('✓ Imagem smartphone encontrada');
            return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
        }
        
        if (title.includes('aspirador') || title.includes('robô') || title.includes('britânia')) {
            console.log('✓ Imagem aspirador encontrada');
            return 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2b4a4?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
        }
        
        if (title.includes('air fryer') || title.includes('fritadeira') || title.includes('brastemp')) {
            console.log('✓ Imagem air fryer encontrada');
            return 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
        }
        
        if (title.includes('liquidificador') || title.includes('philco')) {
            console.log('✓ Imagem liquidificador encontrada');
            return 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
        }
        
        if (title.includes('bicicleta') || title.includes('bike')) {
            console.log('✓ Imagem bicicleta encontrada');
            return 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
        }
        
        if (title.includes('halteres') || title.includes('peso')) {
            console.log('✓ Imagem halteres encontrada');
            return 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
        }
        
        if (title.includes('skate')) {
            console.log('✓ Imagem skate encontrada');
            return 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
        }
        
        if (title.includes('jaqueta') || title.includes('corta-vento')) {
            console.log('✓ Imagem jaqueta encontrada');
            return 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
        }
        
        if (title.includes('bola') || title.includes('futebol')) {
            console.log('✓ Imagem bola encontrada');
            return 'https://images.unsplash.com/photo-1431326005620-6d0e44b482f8?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
        }
        
        if (title.includes('monitor') || title.includes('lg')) {
            console.log('✓ Imagem monitor encontrada');
            return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
        }
        
        if (title.includes('cafeteira')) {
            console.log('✓ Imagem cafeteira encontrada');
            return 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2b4a4?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
        }
        
        // Fallback: usar Picsum com seed único
        const uniqueSeed = (imageNumber + title.length) % 10000;
        console.log(`⚠ Usando fallback Picsum para "${title}" com seed ${uniqueSeed}`);
        return `https://picsum.photos/400/400?random=${uniqueSeed}`;
    }
}

// Criar instância global
const apiService = new ApiService();
window.apiService = apiService;
