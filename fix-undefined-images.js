const fs = require('fs');
const path = require('path');

// Carregar database
const databasePath = path.join(__dirname, 'js', 'database.js');
let databaseContent = fs.readFileSync(databasePath, 'utf8');

// URLs de imagens confiáveis e funcionais
const workingImageUrls = {
    smartphones: [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
        'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400',
        'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400',
        'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400',
        'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400'
    ],
    
    notebooks: [
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
        'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400',
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400',
        'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400',
        'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400',
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'
    ],
    
    televisoes: [
        'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400',
        'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=400',
        'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400',
        'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400',
        'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=400',
        'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400'
    ],
    
    audio: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400',
        'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400',
        'https://images.unsplash.com/photo-1558756520-22cfe5d382ca?w=400',
        'https://images.unsplash.com/photo-1577174881658-0f30ed549adc?w=400'
    ],
    
    calcados: [
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
        'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400',
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400',
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
        'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400',
        'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400'
    ],
    
    roupas: [
        'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400',
        'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=400',
        'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400',
        'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400',
        'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400',
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400'
    ],
    
    eletrodomesticos: [
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
        'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400',
        'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400'
    ],
    
    esportes: [
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
        'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
        'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400'
    ],
    
    monitores: [
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400',
        'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400',
        'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=400',
        'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400',
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400',
        'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=400'
    ],
    
    relogios: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
        'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=400',
        'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400',
        'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400',
        'https://images.unsplash.com/photo-1579586337278-3f436f25d4d6?w=400',
        'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400'
    ]
};

console.log('🔧 Iniciando correção de imagens undefined...');

let corrections = 0;
let currentIndex = 0;

// Substituir todas as ocorrências de "image": "undefined"
for (const category in workingImageUrls) {
    const categoryImages = workingImageUrls[category];
    
    // Contar quantas imagens undefined existem para esta categoria
    const categoryRegex = new RegExp(`"${category}":[\\s\\S]*?(?="[a-z]+":)`, 'g');
    const categoryMatch = databaseContent.match(categoryRegex);
    
    if (categoryMatch) {
        const categoryContent = categoryMatch[0];
        const undefinedCount = (categoryContent.match(/"image": "undefined"/g) || []).length;
        
        console.log(`📂 Categoria ${category}: ${undefinedCount} imagens undefined encontradas`);
        
        // Substituir imagens undefined nesta categoria
        let categoryUpdated = categoryContent;
        let imageIndex = 0;
        
        categoryUpdated = categoryUpdated.replace(/"image": "undefined"/g, () => {
            const imageUrl = categoryImages[imageIndex % categoryImages.length];
            imageIndex++;
            corrections++;
            return `"image": "${imageUrl}"`;
        });
        
        // Substituir no conteúdo principal
        databaseContent = databaseContent.replace(categoryContent, categoryUpdated);
    }
}

// Salvar database corrigido
fs.writeFileSync(databasePath, databaseContent, 'utf8');

console.log(`✅ Correção concluída!`);
console.log(`📊 Total de correções: ${corrections}`);
console.log(`💾 Database atualizado: ${databasePath}`);

// Verificar se ainda existem imagens undefined
const remainingUndefined = (databaseContent.match(/"image": "undefined"/g) || []).length;
console.log(`🔍 Imagens undefined restantes: ${remainingUndefined}`);

if (remainingUndefined === 0) {
    console.log('🎉 Todas as imagens foram corrigidas com sucesso!');
} else {
    console.log('⚠️  Ainda existem algumas imagens undefined. Executando correção adicional...');
    
    // Correção adicional para imagens restantes
    const fallbackImage = 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400';
    databaseContent = databaseContent.replace(/"image": "undefined"/g, `"image": "${fallbackImage}"`);
    
    fs.writeFileSync(databasePath, databaseContent, 'utf8');
    console.log('🔧 Correção adicional aplicada com imagem padrão.');
}