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

    // Função para gerar imagens baseadas no nome do produto - Mapeamento específico baseado na API
    getProductImage(product) {
        const title = product.title?.toLowerCase() || '';
        const brand = product.brand?.toLowerCase() || '';
        const category = product.category?.toLowerCase() || '';
        const productId = product.id.replace('PROD-', '');
        const imageNumber = parseInt(productId) % 1000;
        
        console.log('=== GERANDO IMAGEM ===');
        console.log('Título:', title);
        console.log('Marca:', brand);
        console.log('Categoria:', category);
        console.log('ID do produto:', productId);
        
        // Mapeamento específico baseado nos produtos reais da API
        // Smart TVs - Imagens funcionais
        if (title.includes('smart tv') || (title.includes('tv') && (title.includes('lenovo') || title.includes('philco') || title.includes('sony') || title.includes('acer') || title.includes('asus') || title.includes('motorola') || title.includes('jbl') || title.includes('lg')))) {
            console.log('✓ Imagem Smart TV encontrada');
            return 'https://picsum.photos/400/400?random=10';
        }
        
        // Calças Jeans - Mapeamento específico
        if (title.includes('calça') && title.includes('jeans')) {
            console.log('✓ Imagem calça jeans encontrada');
            return 'https://picsum.photos/400/400?random=11';
        }
        
        // Notebooks - Mapeamento específico
        if (title.includes('notebook') || (title.includes('acer') && title.includes('i5')) || (title.includes('lenovo') && title.includes('i5'))) {
            console.log('✓ Imagem notebook encontrada');
            return 'https://picsum.photos/400/400?random=12';
        }
        
        // Fones de ouvido - Imagens funcionais
        if (title.includes('fone') && title.includes('bluetooth')) {
            console.log('✓ Imagem fone bluetooth encontrada');
            return 'https://picsum.photos/400/400?random=13';
        }
        
        // Aspiradores robô - Imagens funcionais
        if (title.includes('aspirador') && title.includes('robô')) {
            console.log('✓ Imagem aspirador robô encontrada');
            return 'https://picsum.photos/400/400?random=14';
        }
        
        // Camisetas - Mapeamento específico
        if (title.includes('camiseta') && title.includes('algodão')) {
            console.log('✓ Imagem camiseta encontrada');
            return 'https://picsum.photos/400/400?random=15';
        }
        
        // Tênis - Imagens específicas por marca
        if (title.includes('tênis')) {
            if (title.includes('oakley')) {
                console.log('✓ Imagem tênis Oakley encontrada');
                return 'https://picsum.photos/400/400?random=1';
            } else if (title.includes('puma')) {
                console.log('✓ Imagem tênis Puma encontrada');
                return 'https://picsum.photos/400/400?random=2';
            } else if (title.includes('nike')) {
                console.log('✓ Imagem tênis Nike encontrada');
                return 'https://picsum.photos/400/400?random=3';
            } else if (title.includes('adidas')) {
                console.log('✓ Imagem tênis Adidas encontrada');
                return 'https://picsum.photos/400/400?random=4';
            } else {
                console.log('✓ Imagem tênis genérico encontrada');
                return 'https://picsum.photos/400/400?random=5';
            }
        }
        
        // Smartphones - Mapeamento específico
        if (title.includes('smartphone') || (title.includes('apple') && title.includes('512gb')) || (title.includes('lenovo') && title.includes('128gb'))) {
            console.log('✓ Imagem smartphone encontrada');
            return 'https://picsum.photos/400/400?random=20';
        }
        
        // Air Fryers - Imagem funcional
        if (title.includes('air fryer') || (title.includes('fritadeira') && title.includes('antiaderente'))) {
            console.log('✓ Imagem air fryer encontrada');
            return 'https://picsum.photos/400/400?random=21';
        }
        
        // Liquidificadores - Mapeamento específico
        if (title.includes('liquidificador') && title.includes('inox')) {
            console.log('✓ Imagem liquidificador encontrada');
            return 'https://picsum.photos/400/400?random=22';
        }
        
        // Bicicletas - Imagens específicas por marca
        if (title.includes('bicicleta')) {
            if (title.includes('nike')) {
                console.log('✓ Imagem bicicleta Nike encontrada');
                return 'https://picsum.photos/400/400?random=30';
            } else if (title.includes('puma')) {
                console.log('✓ Imagem bicicleta Puma encontrada');
                return 'https://picsum.photos/400/400?random=31';
            } else {
                console.log('✓ Imagem bicicleta genérico encontrada');
                return 'https://picsum.photos/400/400?random=32';
            }
        }
        
        // Halteres - Imagem funcional
        if (title.includes('halteres') && title.includes('revestidos')) {
            console.log('✓ Imagem halteres encontrada');
            return 'https://picsum.photos/400/400?random=33';
        }
        
        // Skates - Imagens específicas por marca
        if (title.includes('skate')) {
            if (title.includes('nike')) {
                console.log('✓ Imagem skate Nike encontrada');
                return 'https://picsum.photos/400/400?random=34';
            } else if (title.includes('puma')) {
                console.log('✓ Imagem skate Puma encontrada');
                return 'https://picsum.photos/400/400?random=35';
            } else {
                console.log('✓ Imagem skate genérico encontrada');
                return 'https://picsum.photos/400/400?random=36';
            }
        }
        
        // Jaquetas - Mapeamento específico
        if (title.includes('jaqueta') && title.includes('corta-vento')) {
            console.log('✓ Imagem jaqueta encontrada');
            return 'https://picsum.photos/400/400?random=37';
        }
        
        // Bolas de futebol - Imagens específicas por marca
        if (title.includes('bola') && title.includes('futebol')) {
            if (title.includes('puma')) {
                console.log('✓ Imagem bola de futebol Puma encontrada');
                return 'https://picsum.photos/400/400?random=38';
            } else if (title.includes('nike')) {
                console.log('✓ Imagem bola de futebol Nike encontrada');
                return 'https://picsum.photos/400/400?random=39';
            } else {
                console.log('✓ Imagem bola de futebol genérico encontrada');
                return 'https://picsum.photos/400/400?random=40';
            }
        }
        
        // Monitores - Imagens funcionais
        if (title.includes('monitor') && (title.includes('dell') || title.includes('samsung') || title.includes('philips') || title.includes('sony') || title.includes('acer') || title.includes('apple') || title.includes('lenovo') || title.includes('motorola'))) {
            console.log('✓ Imagem monitor encontrada');
            return 'https://picsum.photos/400/400?random=50';
        }
        
        // Notebooks - Imagens reais funcionais
        if (title.includes('notebook')) {
            console.log('✓ Imagem notebook encontrada');
            return 'https://picsum.photos/400/400?random=photo-1498049794561-7780e7231661';
        }
        
        // Smartphones - Imagens reais funcionais
        if (title.includes('smartphone')) {
            console.log('✓ Imagem smartphone encontrada');
            return 'https://picsum.photos/400/400?random=photo-1511707171634-5f897ff02aa9';
        }
        
        // Liquidificadores - Imagens específicas por marca
        if (title.includes('liquidificador')) {
            if (title.includes('philips') || title.includes('walita')) {
                console.log('✓ Imagem liquidificador Philips Walita encontrada');
                return 'https://picsum.photos/400/400?random=photo-1556909114-f6e7ad7d3136';
            } else if (title.includes('philco')) {
                console.log('✓ Imagem liquidificador Philco encontrada');
                return 'https://picsum.photos/400/400?random=photo-1556909114-f6e7ad7d3136';
            } else {
                console.log('✓ Imagem liquidificador genérico encontrada');
                return 'https://picsum.photos/400/400?random=photo-1556909114-f6e7ad7d3136';
            }
        }
        
        // Cafeteiras - Imagens reais funcionais
        if (title.includes('cafeteira') && title.includes('elétrica')) {
            console.log('✓ Imagem cafeteira encontrada');
            return 'https://picsum.photos/400/400?random=photo-1581578731548-c6a0c3f2b4a4';
        }
        
        // Mapeamento adicional para outras marcas comuns
        if (title.includes('oakley')) {
            console.log('✓ Imagem Oakley encontrada');
            return 'https://picsum.photos/400/400?random=photo-1549298916-b41d501d3772';
        }
        
        if (title.includes('adidas')) {
            console.log('✓ Imagem Adidas encontrada');
            return 'https://picsum.photos/400/400?random=photo-1549298916-b41d501d3772';
        }
        
        if (title.includes('converse')) {
            console.log('✓ Imagem Converse encontrada');
            return 'https://picsum.photos/400/400?random=photo-1549298916-b41d501d3772';
        }
        
        if (title.includes('vans')) {
            console.log('✓ Imagem Vans encontrada');
            return 'https://picsum.photos/400/400?random=photo-1549298916-b41d501d3772';
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
