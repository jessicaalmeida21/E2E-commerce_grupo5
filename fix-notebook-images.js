const fs = require('fs');

// Carregar o banco de dados
const database = require('./js/database.js');

// Imagens específicas para notebooks
const notebookImages = [
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop', // Laptop moderno
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop', // MacBook
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop', // Laptop aberto
    'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400&h=400&fit=crop', // Laptop em mesa
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=400&fit=crop', // Laptop gaming
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop', // Laptop Dell
    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=400&fit=crop', // Laptop HP
    'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&h=400&fit=crop', // Laptop Acer
    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop', // Laptop Lenovo
    'https://images.unsplash.com/photo-1587614295999-6c1c3a7b98d0?w=400&h=400&fit=crop'  // Laptop MSI
];

// Imagens específicas para tablets
const tabletImages = [
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop', // iPad
    'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=400&fit=crop', // Tablet moderno
    'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=400&h=400&fit=crop', // Tablet Samsung
    'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=400&h=400&fit=crop', // Tablet com teclado
    'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=400&fit=crop'  // Tablet profissional
];

// Imagens específicas para smartwatches
const smartwatchImages = [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', // Apple Watch
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=400&fit=crop', // Smartwatch moderno
    'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop', // Smartwatch esportivo
    'https://images.unsplash.com/photo-1579586337278-3f436f25d4d6?w=400&h=400&fit=crop', // Smartwatch Samsung
    'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop'  // Smartwatch elegante
];

// Imagens específicas para fones de ouvido
const headphoneImages = [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', // Fones over-ear
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop', // Fones wireless
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop', // AirPods
    'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=400&fit=crop', // Fones gaming
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop'  // Fones profissionais
];

function getRandomImageForCategory(category, usedImages = new Set()) {
    let images = [];
    
    switch(category.toLowerCase()) {
        case 'notebooks':
            images = notebookImages;
            break;
        case 'tablets':
            images = tabletImages;
            break;
        case 'smartwatches':
            images = smartwatchImages;
            break;
        case 'fones de ouvido':
            images = headphoneImages;
            break;
        default:
            images = notebookImages; // fallback
    }
    
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

// Identificar imagens problemáticas (smartphones sendo usadas para outros produtos)
const smartphoneImageUrls = [
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&h=400&fit=crop'
];

console.log('🔧 Corrigindo imagens de produtos não-smartphones...');

let corrections = 0;
const usedImages = new Set();
const correctionLog = [];

// Processar todas as categorias exceto smartphones
for (const [category, products] of Object.entries(database.productsDatabase)) {
    if (category.toLowerCase() === 'smartphones') {
        continue; // Pular smartphones
    }
    
    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        
        // Verificar se está usando imagem de smartphone
        if (smartphoneImageUrls.includes(product.image)) {
            const originalImage = product.image;
            const newImage = getRandomImageForCategory(category, usedImages);
            
            product.image = newImage;
            corrections++;
            
            correctionLog.push({
                id: product.id,
                title: product.title,
                category: category,
                brand: product.brand,
                originalImage: originalImage,
                newImage: newImage,
                reason: `Imagem de smartphone corrigida para ${category}`
            });
            
            console.log(`✅ ${product.title} (${category}) - Nova imagem atribuída`);
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
fs.writeFileSync('./notebook-image-corrections-log.json', JSON.stringify(correctionLog, null, 2), 'utf8');

console.log(`\n📊 Resumo das correções:`);
console.log(`🖼️ Imagens corrigidas: ${corrections}`);
console.log(`📁 Log salvo em: notebook-image-corrections-log.json`);
console.log(`💾 Banco de dados atualizado: js/database.js`);