// Script para atualizar api-service.js com sistema de 500 imagens do Unsplash
const fs = require('fs');

// Ler o arquivo 500-images-database.json
const imageDatabase = JSON.parse(fs.readFileSync('500-images-database.json', 'utf8'));
const imageUrls = Object.values(imageDatabase);

// Novo código para api-service.js com sistema de 500 imagens
const newApiServiceCode = `// Serviço de API para produtos
class ApiService {
    constructor() {
        this.baseUrl = 'https://fakestoreapi.com';
        this.imageCache = new Map();
        this.imageIndex = 0;
        
        // 500 URLs de imagens do Unsplash organizadas por categoria
        this.imageUrls = ${JSON.stringify(imageUrls, null, 8)};
        
        console.log('ApiService inicializado com', this.imageUrls.length, 'imagens');
    }

    // Método para obter produto por ID
    async getProductById(id) {
        try {
            // Primeiro tentar buscar na API
            const response = await fetch(\`\${this.baseUrl}/products/\${id}\`);
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

    // Método para obter imagem do produto com sistema de 500 imagens
    getProductImage(product) {
        if (!product) return this.getFallbackImage();
        
        // Se o produto já tem imagem, usar ela
        if (product.image && product.image !== '') {
            console.log('✓ Usando imagem existente do produto');
            return product.image;
        }
        
        const title = product.title?.toLowerCase() || '';
        const brand = product.brand?.toLowerCase() || '';
        const category = product.category?.toLowerCase() || '';
        
        console.log('=== GERANDO IMAGEM REAL ===');
        console.log('Título:', title);
        console.log('Marca:', brand);
        console.log('Categoria:', category);
        
        // Sistema inteligente de seleção de imagens
        let selectedImage = null;
        
        // Smartphones
        if (title.includes('smartphone') || title.includes('iphone') || title.includes('galaxy') || title.includes('xiaomi') || title.includes('phone')) {
            selectedImage = this.getImageByCategory('smartphone');
        }
        // Notebooks/Laptops
        else if (title.includes('notebook') || title.includes('laptop') || title.includes('macbook') || title.includes('pc')) {
            selectedImage = this.getImageByCategory('notebook');
        }
        // TVs
        else if (title.includes('smart tv') || title.includes('tv') || title.includes('televisão') || title.includes('television')) {
            selectedImage = this.getImageByCategory('tv');
        }
        // Fones de ouvido
        else if (title.includes('fone') || title.includes('headphone') || title.includes('headset') || title.includes('bluetooth')) {
            selectedImage = this.getImageByCategory('headphone');
        }
        // Tênis/Calçados
        else if (title.includes('tênis') || title.includes('sneaker') || title.includes('shoe') || title.includes('nike') || title.includes('adidas')) {
            selectedImage = this.getImageByCategory('shoe');
        }
        // Roupas
        else if (title.includes('camiseta') || title.includes('shirt') || title.includes('dress') || title.includes('clothing')) {
            selectedImage = this.getImageByCategory('clothing');
        }
        // Eletrodomésticos
        else if (title.includes('liquidificador') || title.includes('blender') || title.includes('air fryer') || title.includes('aspirador')) {
            selectedImage = this.getImageByCategory('appliance');
        }
        // Esportes
        else if (title.includes('bicicleta') || title.includes('bike') || title.includes('skate') || title.includes('halteres')) {
            selectedImage = this.getImageByCategory('sports');
        }
        // Joias
        else if (title.includes('anel') || title.includes('ring') || title.includes('colar') || title.includes('necklace')) {
            selectedImage = this.getImageByCategory('jewelry');
        }
        // Monitores
        else if (title.includes('monitor') || title.includes('display') || title.includes('screen')) {
            selectedImage = this.getImageByCategory('monitor');
        }
        // Relógios
        else if (title.includes('relógio') || title.includes('watch') || title.includes('smartwatch')) {
            selectedImage = this.getImageByCategory('watch');
        }
        // Fallback genérico
        else {
            selectedImage = this.getRandomImage();
        }
        
        console.log('✓ Imagem selecionada:', selectedImage);
        return selectedImage;
    }
    
    // Método para obter imagem por categoria
    getImageByCategory(category) {
        const categoryImages = {
            smartphone: [0, 1, 2], // índices das imagens de smartphone
            notebook: [3, 4, 5],   // índices das imagens de notebook
            tv: [6, 7, 8],         // índices das imagens de TV
            headphone: [9, 10, 11], // índices das imagens de fone
            shoe: [12, 13, 14],    // índices das imagens de tênis
            clothing: [15, 16, 17], // índices das imagens de roupas
            appliance: [18, 19, 20], // índices das imagens de eletrodomésticos
            sports: [21, 22, 23],  // índices das imagens de esportes
            jewelry: [24, 25, 26], // índices das imagens de joias
            monitor: [27, 28, 29], // índices das imagens de monitor
            watch: [30, 31, 32]    // índices das imagens de relógio
        };
        
        if (categoryImages[category]) {
            const randomIndex = categoryImages[category][Math.floor(Math.random() * categoryImages[category].length)];
            return this.imageUrls[randomIndex] || this.getRandomImage();
        }
        
        return this.getRandomImage();
    }
    
    // Método para obter imagem aleatória
    getRandomImage() {
        const randomIndex = Math.floor(Math.random() * this.imageUrls.length);
        return this.imageUrls[randomIndex];
    }
    
    // Método para obter imagem de fallback
    getFallbackImage() {
        return 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
    }
}

// Criar instância global
window.apiService = new ApiService();
console.log('=== API SERVICE COM 500 IMAGENS CARREGADO ===');`;

// Salvar o novo código
fs.writeFileSync('js/api-service.js', newApiServiceCode);

console.log('✅ api-service.js atualizado com sistema de 500 imagens!');
console.log('📁 Arquivo salvo: js/api-service.js');
console.log('📊 Total de imagens disponíveis: 500');
