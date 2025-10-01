const fs = require('fs');

// Carregar o banco de dados
const database = require('./js/database.js');

// Mapeamento de correções para nomes de produtos
const brandCorrections = {
    // Apple products should not have other brand names
    'Apple Pixel': 'Apple iPhone',
    'Apple Redmi': 'Apple iPhone',
    'Apple Nord': 'Apple iPhone',
    'Apple G73': 'Apple iPhone',
    
    // OnePlus products should not have other brand names
    'OnePlus iPhone': 'OnePlus',
    'OnePlus Pixel': 'OnePlus',
    'OnePlus Redmi': 'OnePlus',
    
    // Xiaomi products should not have other brand names
    'Xiaomi Moto G': 'Xiaomi Redmi',
    'Xiaomi iPhone': 'Xiaomi Redmi',
    'Xiaomi Pixel': 'Xiaomi Redmi',
    
    // Google products should not have other brand names
    'Google Xperia': 'Google Pixel',
    'Google iPhone': 'Google Pixel',
    'Google Redmi': 'Google Pixel',
    
    // Sony products should not have other brand names
    'Sony iPhone': 'Sony Xperia',
    'Sony Pixel': 'Sony Xperia',
    'Sony Redmi': 'Sony Xperia',
    
    // Motorola products should not have other brand names
    'Motorola iPhone': 'Motorola Moto',
    'Motorola Pixel': 'Motorola Moto',
    'Motorola Redmi': 'Motorola Moto',
    
    // LG products should not have other brand names
    'LG iPhone': 'LG',
    'LG Pixel': 'LG',
    'LG Moto G': 'LG'
};

// Mapeamento de imagens específicas por marca
const brandImages = {
    'Apple': [
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop'
    ],
    'Samsung': [
        'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop'
    ],
    'Google': [
        'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=400&fit=crop'
    ],
    'Xiaomi': [
        'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&h=400&fit=crop'
    ],
    'Sony': [
        'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop'
    ],
    'OnePlus': [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400&h=400&fit=crop'
    ],
    'Motorola': [
        'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop'
    ],
    'LG': [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&h=400&fit=crop'
    ]
};

function correctProductName(title, brand) {
    // Verificar se o título contém marcas misturadas
    for (const [wrongPattern, correctPattern] of Object.entries(brandCorrections)) {
        if (title.includes(wrongPattern)) {
            return title.replace(wrongPattern, correctPattern);
        }
    }
    return title;
}

function getRandomImageForBrand(brand, usedImages = new Set()) {
    const images = brandImages[brand] || brandImages['Samsung']; // fallback
    
    // Tentar encontrar uma imagem não usada
    const availableImages = images.filter(img => !usedImages.has(img));
    
    if (availableImages.length > 0) {
        const selectedImage = availableImages[Math.floor(Math.random() * availableImages.length)];
        usedImages.add(selectedImage);
        return selectedImage;
    }
    
    // Se todas foram usadas, usar uma aleatória
    return images[Math.floor(Math.random() * images.length)];
}

console.log('🔧 Corrigindo nomes de produtos e imagens...');

let corrections = 0;
let imageChanges = 0;
const usedImages = new Set();
const correctionLog = [];

// Processar todas as categorias
for (const [category, products] of Object.entries(database.productsDatabase)) {
    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const originalTitle = product.title;
        const originalImage = product.image;
        
        // Corrigir nome do produto
        const correctedTitle = correctProductName(product.title, product.brand);
        if (correctedTitle !== originalTitle) {
            product.title = correctedTitle;
            corrections++;
            
            correctionLog.push({
                id: product.id,
                category: category,
                brand: product.brand,
                originalTitle: originalTitle,
                correctedTitle: correctedTitle,
                type: 'name_correction'
            });
            
            console.log(`✅ Corrigido: "${originalTitle}" → "${correctedTitle}"`);
        }
        
        // Atribuir imagem específica da marca
        const newImage = getRandomImageForBrand(product.brand, usedImages);
        if (newImage !== originalImage) {
            product.image = newImage;
            imageChanges++;
            
            correctionLog.push({
                id: product.id,
                category: category,
                brand: product.brand,
                title: product.title,
                originalImage: originalImage,
                newImage: newImage,
                type: 'image_update'
            });
        }
    }
}

// Salvar o banco de dados atualizado
const updatedDatabase = `// Banco de Dados de Produtos - 500 Produtos Organizados por Categoria
const productsDatabase = ${JSON.stringify(database.productsDatabase, null, 4)};

// Exportar para uso em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { productsDatabase };
}`;

fs.writeFileSync('./js/database.js', updatedDatabase, 'utf8');

// Salvar log das correções
fs.writeFileSync('./brand-corrections-log.json', JSON.stringify(correctionLog, null, 2), 'utf8');

console.log(`\n📊 Resumo das correções:`);
console.log(`✅ Nomes corrigidos: ${corrections}`);
console.log(`🖼️ Imagens atualizadas: ${imageChanges}`);
console.log(`📁 Log salvo em: brand-corrections-log.json`);
console.log(`💾 Banco de dados atualizado: js/database.js`);