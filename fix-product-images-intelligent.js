// Script Inteligente para Correção de Imagens dos Produtos
// Mapeia imagens adequadas por categoria e palavras-chave

const fs = require('fs');
const path = require('path');

// Mapeamento inteligente de imagens por categoria
const categoryImageMapping = {
    'Smartphones': {
        keywords: ['phone', 'mobile', 'smartphone', 'iphone', 'android', 'cell'],
        images: [
            'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // smartphone
            'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // phone
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // mobile
            'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // iphone
            'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // android
        ]
    },
    'Notebooks': {
        keywords: ['laptop', 'notebook', 'computer', 'macbook', 'pc'],
        images: [
            'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // laptop
            'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // macbook
            'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // computer
            'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // notebook
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // pc
        ]
    },
    'Televisoes': {
        keywords: ['tv', 'television', 'smart tv', 'monitor', 'screen'],
        images: [
            'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // tv
            'https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // television
            'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // smart tv
            'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // monitor
            'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // screen
        ]
    },
    'Audio': {
        keywords: ['headphone', 'speaker', 'earphone', 'audio', 'sound'],
        images: [
            'https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // headphones
            'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // speaker
            'https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // earphones
            'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // audio
            'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // sound
        ]
    },
    'Calcados': {
        keywords: ['shoe', 'sneaker', 'boot', 'sandal', 'footwear'],
        images: [
            'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // sneakers
            'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // shoes
            'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // boots
            'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // sandals
            'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // footwear
        ]
    },
    'Roupas': {
        keywords: ['shirt', 'dress', 'jacket', 'pants', 'clothing'],
        images: [
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // shirt
            'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // dress
            'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // jacket
            'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // pants
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // clothing
        ]
    },
    'Eletrodomesticos': {
        keywords: ['appliance', 'kitchen', 'refrigerator', 'microwave', 'washing'],
        images: [
            'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // kitchen
            'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // appliance
            'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // refrigerator
            'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // microwave
            'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // washing
        ]
    },
    'Esportes': {
        keywords: ['sport', 'fitness', 'gym', 'exercise', 'athletic'],
        images: [
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // sport
            'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // fitness
            'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // gym
            'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // exercise
            'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // athletic
        ]
    },
    'Monitores': {
        keywords: ['monitor', 'display', 'screen', 'computer screen'],
        images: [
            'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // monitor
            'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // display
            'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // screen
            'https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // computer screen
            'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // monitor 2
        ]
    },
    'Relogios': {
        keywords: ['watch', 'smartwatch', 'clock', 'timepiece'],
        images: [
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // watch
            'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // smartwatch
            'https://images.unsplash.com/photo-1594576662059-c4e9b5d0e1b3?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // clock
            'https://images.unsplash.com/photo-1581578731548-c6a0c3f2b4a4?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // timepiece
            'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // watch 2
        ]
    }
};

// Função para obter imagem adequada por categoria
function getImageByCategory(category, index = 0) {
    const categoryData = categoryImageMapping[category];
    if (!categoryData || !categoryData.images.length) {
        // Fallback para imagem genérica
        return 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
    }
    
    // Rotaciona entre as imagens disponíveis para a categoria
    const imageIndex = index % categoryData.images.length;
    return categoryData.images[imageIndex];
}

// Função para detectar categoria por nome do produto
function detectCategoryFromName(productName, currentCategory) {
    const name = productName.toLowerCase();
    
    for (const [category, data] of Object.entries(categoryImageMapping)) {
        for (const keyword of data.keywords) {
            if (name.includes(keyword)) {
                return category;
            }
        }
    }
    
    return currentCategory; // Retorna categoria atual se não detectar nada
}

async function fixProductImages() {
    try {
        console.log('🔧 Iniciando correção inteligente de imagens dos produtos...');
        
        // Carregar database atual
        const databasePath = './js/database.js';
        const database = require(databasePath);
        const products = database.getAllProducts();
        
        console.log(`📊 Total de produtos encontrados: ${products.length}`);
        
        // Backup do database atual
        const backupPath = `./js/database-backup-before-image-fix-${Date.now()}.js`;
        fs.copyFileSync(databasePath, backupPath);
        console.log(`💾 Backup criado: ${backupPath}`);
        
        let fixedCount = 0;
        let categoryMismatchCount = 0;
        
        // Processar produtos por categoria
        const categorizedProducts = {};
        
        products.forEach((product, index) => {
            const detectedCategory = detectCategoryFromName(product.title, product.category);
            
            if (detectedCategory !== product.category) {
                categoryMismatchCount++;
                console.log(`⚠️  Incompatibilidade detectada: "${product.title}" está em "${product.category}" mas parece ser "${detectedCategory}"`);
            }
            
            // Usar categoria detectada ou atual
            const finalCategory = detectedCategory;
            
            if (!categorizedProducts[finalCategory]) {
                categorizedProducts[finalCategory] = [];
            }
            
            // Atribuir imagem adequada
            const categoryIndex = categorizedProducts[finalCategory].length;
            const appropriateImage = getImageByCategory(finalCategory, categoryIndex);
            
            // Atualizar produto com imagem correta
            product.image = appropriateImage;
            product.category = finalCategory; // Corrigir categoria se necessário
            
            categorizedProducts[finalCategory].push(product);
            fixedCount++;
        });
        
        console.log(`\n📈 Estatísticas da correção:`);
        console.log(`✅ Produtos corrigidos: ${fixedCount}`);
        console.log(`⚠️  Incompatibilidades de categoria detectadas: ${categoryMismatchCount}`);
        
        console.log(`\n📋 Distribuição por categoria:`);
        for (const [category, categoryProducts] of Object.entries(categorizedProducts)) {
            console.log(`   ${category}: ${categoryProducts.length} produtos`);
        }
        
        // Reorganizar database por categoria
        const newDatabase = {
            smartphones: categorizedProducts['Smartphones'] || [],
            notebooks: categorizedProducts['Notebooks'] || [],
            televisoes: categorizedProducts['Televisoes'] || [],
            audio: categorizedProducts['Audio'] || [],
            calcados: categorizedProducts['Calcados'] || [],
            roupas: categorizedProducts['Roupas'] || [],
            eletrodomesticos: categorizedProducts['Eletrodomesticos'] || [],
            esportes: categorizedProducts['Esportes'] || [],
            monitores: categorizedProducts['Monitores'] || [],
            relogios: categorizedProducts['Relogios'] || []
        };
        
        // Gerar novo conteúdo do database
        let newDatabaseContent = `// Banco de Dados de Produtos - 500 Produtos com Imagens Corrigidas\nconst productsDatabase = {\n`;
        
        for (const [key, products] of Object.entries(newDatabase)) {
            newDatabaseContent += `    "${key}": [\n`;
            
            products.forEach((product, index) => {
                newDatabaseContent += `        {\n`;
                newDatabaseContent += `            "id": "${product.id}",\n`;
                newDatabaseContent += `            "title": "${product.title}",\n`;
                newDatabaseContent += `            "price": ${product.price},\n`;
                newDatabaseContent += `            "originalPrice": ${product.originalPrice},\n`;
                newDatabaseContent += `            "discount": ${product.discount},\n`;
                newDatabaseContent += `            "category": "${product.category}",\n`;
                newDatabaseContent += `            "brand": "${product.brand}",\n`;
                newDatabaseContent += `            "description": "${product.description}",\n`;
                newDatabaseContent += `            "stock": ${product.stock},\n`;
                newDatabaseContent += `            "rating": ${product.rating},\n`;
                newDatabaseContent += `            "ratingCount": ${product.ratingCount},\n`;
                newDatabaseContent += `            "image": "${product.image}"\n`;
                newDatabaseContent += `        }${index < products.length - 1 ? ',' : ''}\n`;
            });
            
            newDatabaseContent += `    ]${key !== 'relogios' ? ',' : ''}\n`;
        }
        
        // Adicionar funções do database
        newDatabaseContent += `};

// Funções do Database
function getAllProducts() {
    const allProducts = [];
    for (const category in productsDatabase) {
        allProducts.push(...productsDatabase[category]);
    }
    return allProducts;
}

function getProductsByCategory(category) {
    const categoryKey = category.toLowerCase();
    return productsDatabase[categoryKey] || [];
}

function getProductById(id) {
    const allProducts = getAllProducts();
    return allProducts.find(product => product.id === id);
}

function searchProducts(query) {
    const allProducts = getAllProducts();
    const searchTerm = query.toLowerCase();
    
    return allProducts.filter(product => 
        product.title.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
}

function getProductsByPriceRange(minPrice, maxPrice) {
    const allProducts = getAllProducts();
    return allProducts.filter(product => 
        product.price >= minPrice && product.price <= maxPrice
    );
}

function getTopRatedProducts(limit = 10) {
    const allProducts = getAllProducts();
    return allProducts
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit);
}

function getProductsByBrand(brand) {
    const allProducts = getAllProducts();
    return allProducts.filter(product => 
        product.brand.toLowerCase() === brand.toLowerCase()
    );
}

function getFeaturedProducts(limit = 8) {
    const allProducts = getAllProducts();
    return allProducts
        .filter(product => product.rating >= 4.0)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit);
}

// Exportar para Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        productsDatabase,
        getAllProducts,
        getProductsByCategory,
        getProductById,
        searchProducts,
        getProductsByPriceRange,
        getTopRatedProducts,
        getProductsByBrand,
        getFeaturedProducts
    };
}
`;
        
        // Salvar novo database
        fs.writeFileSync(databasePath, newDatabaseContent, 'utf8');
        
        console.log(`\n✅ Database atualizado com sucesso!`);
        console.log(`📁 Arquivo: ${databasePath}`);
        console.log(`🖼️  Todas as imagens foram corrigidas para corresponder às categorias`);
        console.log(`🔄 Categorias reorganizadas automaticamente`);
        
        return {
            success: true,
            fixedCount,
            categoryMismatchCount,
            categorizedProducts
        };
        
    } catch (error) {
        console.error('❌ Erro ao corrigir imagens:', error);
        return { success: false, error: error.message };
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    fixProductImages().then(result => {
        if (result.success) {
            console.log('\n🎉 Correção de imagens concluída com sucesso!');
        } else {
            console.log('\n💥 Falha na correção:', result.error);
        }
    });
}

module.exports = { fixProductImages, getImageByCategory, detectCategoryFromName };