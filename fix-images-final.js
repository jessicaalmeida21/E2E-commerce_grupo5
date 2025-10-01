const fs = require('fs');
const path = require('path');

// Carregar database
const databasePath = path.join(__dirname, 'js', 'database.js');
const databaseContent = fs.readFileSync(databasePath, 'utf8');

// Carregar productsDatabase do módulo
const { productsDatabase } = require('./js/database.js');

// URLs de imagens confiáveis organizadas por categoria e tipo de produto
const reliableImageUrls = {
    // Smartphones
    smartphones: [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
        'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400',
        'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400',
        'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400',
        'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400',
        'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=400',
        'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400'
    ],
    
    // Laptops
    laptops: [
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
        'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400',
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400',
        'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400',
        'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400',
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
        'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400',
        'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400'
    ],
    
    // Tablets
    tablets: [
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
        'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400',
        'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=400',
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400',
        'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=400',
        'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400'
    ],
    
    // Headphones
    headphones: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400',
        'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400',
        'https://images.unsplash.com/photo-1558756520-22cfe5d382ca?w=400',
        'https://images.unsplash.com/photo-1577174881658-0f30ed549adc?w=400'
    ],
    
    // Watches
    watches: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
        'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=400',
        'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400',
        'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400',
        'https://images.unsplash.com/photo-1579586337278-3f436f25d4d6?w=400',
        'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400'
    ],
    
    // Cameras
    cameras: [
        'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400',
        'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400',
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400',
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400',
        'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400',
        'https://images.unsplash.com/photo-1606983340075-6fa6b7d4b6b7?w=400'
    ],
    
    // Gaming
    gaming: [
        'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400',
        'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400',
        'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400',
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400',
        'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400',
        'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=400'
    ],
    
    // Default/Technology
    technology: [
        'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400',
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400',
        'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400',
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400',
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400',
        'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400'
    ]
};

function getImageCategory(productTitle, category) {
    const title = productTitle.toLowerCase();
    
    // Mapear baseado no nome do produto
    if (title.includes('iphone') || title.includes('samsung') || title.includes('pixel') || 
        title.includes('smartphone') || title.includes('phone') || title.includes('mobile')) {
        return 'smartphones';
    }
    
    if (title.includes('macbook') || title.includes('laptop') || title.includes('notebook') || 
        title.includes('thinkpad') || title.includes('surface')) {
        return 'laptops';
    }
    
    if (title.includes('ipad') || title.includes('tablet') || title.includes('tab ')) {
        return 'tablets';
    }
    
    if (title.includes('headphone') || title.includes('earphone') || title.includes('airpods') || 
        title.includes('beats') || title.includes('audio') || title.includes('fone')) {
        return 'headphones';
    }
    
    if (title.includes('watch') || title.includes('relógio') || title.includes('smartwatch')) {
        return 'watches';
    }
    
    if (title.includes('camera') || title.includes('canon') || title.includes('nikon') || 
        title.includes('sony') && title.includes('camera')) {
        return 'cameras';
    }
    
    if (title.includes('gaming') || title.includes('game') || title.includes('console') || 
        title.includes('playstation') || title.includes('xbox') || title.includes('nintendo')) {
        return 'gaming';
    }
    
    // Mapear baseado na categoria
    if (category && category.toLowerCase().includes('smartphone')) return 'smartphones';
    if (category && category.toLowerCase().includes('laptop')) return 'laptops';
    if (category && category.toLowerCase().includes('tablet')) return 'tablets';
    if (category && category.toLowerCase().includes('audio')) return 'headphones';
    if (category && category.toLowerCase().includes('watch')) return 'watches';
    if (category && category.toLowerCase().includes('camera')) return 'cameras';
    if (category && category.toLowerCase().includes('gaming')) return 'gaming';
    
    return 'technology';
}

function getReliableImageUrl(productTitle, category, productId) {
    const imageCategory = getImageCategory(productTitle, category);
    const availableImages = reliableImageUrls[imageCategory] || reliableImageUrls.technology;
    
    // Usar o ID do produto para selecionar uma imagem consistente
    const imageIndex = parseInt(productId) % availableImages.length;
    return availableImages[imageIndex];
}

// Processar todos os produtos
let corrections = [];
let updatedDatabase = databaseContent;

console.log('Iniciando correção final de imagens...');

for (const category in productsDatabase) {
    console.log(`Processando categoria: ${category}`);
    
    for (const product of productsDatabase[category]) {
        const newImageUrl = getReliableImageUrl(product.title, category, product.id);
        
        if (product.image !== newImageUrl) {
            // Escapar caracteres especiais na URL antiga
            const oldImageEscaped = product.image.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`"image":\\s*"${oldImageEscaped}"`, 'g');
            
            updatedDatabase = updatedDatabase.replace(regex, `"image": "${newImageUrl}"`);
            
            corrections.push({
                id: product.id,
                title: product.title,
                category: category,
                oldImage: product.image,
                newImage: newImageUrl,
                reason: `Imagem atualizada para URL confiável baseada no produto: ${product.title}`
            });
        }
    }
}

// Salvar database atualizado
fs.writeFileSync(databasePath, updatedDatabase, 'utf8');

// Salvar log de correções
fs.writeFileSync('image-corrections-final-log.json', JSON.stringify(corrections, null, 2), 'utf8');

console.log(`✅ Correção final concluída!`);
console.log(`📊 Total de correções: ${corrections.length}`);
console.log(`💾 Database atualizado: ${databasePath}`);
console.log(`📋 Log salvo em: image-corrections-final-log.json`);

// Verificar se todas as imagens foram corrigidas
let totalProducts = 0;
for (const category in productsDatabase) {
    totalProducts += productsDatabase[category].length;
}

console.log(`\n📈 Estatísticas:`);
console.log(`- Total de produtos: ${totalProducts}`);
console.log(`- Produtos corrigidos: ${corrections.length}`);
console.log(`- Taxa de correção: ${((corrections.length/totalProducts)*100).toFixed(1)}%`);