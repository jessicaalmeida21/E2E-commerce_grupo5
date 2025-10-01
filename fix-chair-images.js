const fs = require('fs');

console.log('🪑 CORREÇÃO DE IMAGENS DE CADEIRA INCORRETAS');
console.log('============================================');

// Ler database.js
let databaseContent = fs.readFileSync('./js/database.js', 'utf8');

// Imagens de cadeira que precisam ser substituídas
const chairImages = {
    'photo-1586023492125-27b2c045efd7': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&auto=format',
    'photo-1555041469-a586c61ea9bc': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop&auto=format',
    'photo-1571068316344-75bc76f77890': 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop&auto=format',
    'photo-1506439773649-6e0eb8cfb237': 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop&auto=format',
    'photo-1434056886845-dac89ffe9b56': 'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=400&h=400&fit=crop&auto=format'
};

// Imagens de substituição por categoria
const replacementImages = {
    smartphones: [
        'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop&auto=format', // iPhone
        'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop&auto=format', // Samsung
        'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&h=400&fit=crop&auto=format', // Pixel
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop&auto=format', // OnePlus
        'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=400&h=400&fit=crop&auto=format'  // Xiaomi
    ],
    notebooks: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&auto=format', // MacBook
        'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&h=400&fit=crop&auto=format', // Laptop
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&auto=format', // Notebook
        'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop&auto=format', // Gaming
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop&auto=format'  // Dell
    ],
    televisoes: [
        'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&auto=format', // TV Samsung
        'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=400&h=400&fit=crop&auto=format', // Smart TV
        'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop&auto=format', // TV LG
        'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=400&fit=crop&auto=format', // TV Sony
        'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&auto=format'  // TV TCL
    ],
    audio: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format', // Headphones
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop&auto=format', // Speaker
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&auto=format', // Earbuds
        'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop&auto=format', // Soundbar
        'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=400&fit=crop&auto=format'  // Microphone
    ],
    calcados: [
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&auto=format', // Nike
        'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop&auto=format', // Adidas
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop&auto=format', // Sneakers
        'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop&auto=format', // Running
        'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop&auto=format'  // Casual
    ],
    roupas: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&auto=format', // T-shirt
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&auto=format', // Jeans
        'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&auto=format', // Dress
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&auto=format', // Jacket
        'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=400&fit=crop&auto=format'  // Hoodie
    ],
    eletrodomesticos: [
        'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop&auto=format', // Geladeira
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format', // Microondas
        'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&auto=format', // Fogão
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&auto=format', // Aspirador
        'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&h=400&fit=crop&auto=format'  // Lava-louças
    ],
    esportes: [
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&auto=format', // Bola
        'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop&auto=format', // Equipamento
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&auto=format', // Fitness
        'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&h=400&fit=crop&auto=format', // Gym
        'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop&auto=format'  // Sports
    ],
    monitores: [
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&auto=format', // Monitor
        'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=400&fit=crop&auto=format', // Gaming Monitor
        'https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=400&h=400&fit=crop&auto=format', // Ultrawide
        'https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=400&h=400&fit=crop&auto=format', // 4K Monitor
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&auto=format'  // Professional
    ],
    relogios: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&auto=format', // Apple Watch
        'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=400&h=400&fit=crop&auto=format', // Samsung Watch
        'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=400&fit=crop&auto=format', // Classic Watch
        'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=400&fit=crop&auto=format', // Smart Watch
        'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=400&h=400&fit=crop&auto=format'  // Luxury Watch
    ]
};

// Função para obter uma imagem aleatória da categoria
function getRandomImageForCategory(category) {
    const images = replacementImages[category];
    if (!images || images.length === 0) {
        // Imagem padrão se categoria não encontrada
        return 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&auto=format';
    }
    return images[Math.floor(Math.random() * images.length)];
}

// Função para substituir imagens de cadeira
function replaceChairImages() {
    let totalReplacements = 0;
    const categories = ['smartphones', 'notebooks', 'televisoes', 'audio', 'calcados', 'roupas', 'eletrodomesticos', 'esportes', 'monitores', 'relogios'];
    
    categories.forEach(category => {
        console.log(`\\n🔧 Processando categoria: ${category}`);
        
        const categoryRegex = new RegExp(`("${category}":\\s*\\[)([\\s\\S]*?)(\\](?=\\s*[,}]))`, 'i');
        const categoryMatch = databaseContent.match(categoryRegex);
        
        if (categoryMatch) {
            let categoryContent = categoryMatch[2];
            let categoryReplacements = 0;
            
            // Substituir cada imagem de cadeira
            Object.keys(chairImages).forEach(chairId => {
                const chairUrl = chairImages[chairId];
                
                if (categoryContent.includes(chairUrl)) {
                    const replacementImage = getRandomImageForCategory(category);
                    
                    // Contar quantas vezes aparece antes da substituição
                    const beforeCount = (categoryContent.match(new RegExp(chairUrl.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'), 'g')) || []).length;
                    
                    if (beforeCount > 0) {
                        console.log(`   🪑 Substituindo ${beforeCount}x imagem ${chairId}`);
                        console.log(`   ➡️  Nova imagem: ${replacementImage.split('/').pop().split('?')[0]}`);
                        
                        // Substituir todas as ocorrências
                        categoryContent = categoryContent.replace(new RegExp(chairUrl.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'), 'g'), replacementImage);
                        categoryReplacements += beforeCount;
                        totalReplacements += beforeCount;
                    }
                }
            });
            
            // Atualizar o conteúdo da categoria no database
            if (categoryReplacements > 0) {
                databaseContent = databaseContent.replace(categoryMatch[0], categoryMatch[1] + categoryContent + categoryMatch[3]);
                console.log(`   ✅ ${categoryReplacements} substituições na categoria ${category}`);
            } else {
                console.log(`   ✅ Nenhuma imagem de cadeira encontrada em ${category}`);
            }
        }
    });
    
    return totalReplacements;
}

// Executar correções
console.log('🚀 Iniciando correção de imagens de cadeira...');
const totalFixed = replaceChairImages();

console.log('\\n📊 RESULTADO FINAL:');
console.log('===================');
console.log(`🔧 Total de substituições: ${totalFixed}`);

if (totalFixed > 0) {
    // Salvar arquivo corrigido
    fs.writeFileSync('./js/database.js', databaseContent);
    console.log('✅ Arquivo database.js atualizado com sucesso!');
    
    // Verificar se ainda existem imagens de cadeira
    console.log('\\n🔍 Verificação pós-correção...');
    Object.keys(chairImages).forEach(chairId => {
        const remaining = (databaseContent.match(new RegExp(chairId, 'g')) || []).length;
        if (remaining > 0) {
            console.log(`⚠️  Ainda restam ${remaining} ocorrências de ${chairId}`);
        } else {
            console.log(`✅ ${chairId} completamente removido`);
        }
    });
} else {
    console.log('ℹ️  Nenhuma correção necessária - não foram encontradas imagens de cadeira incorretas');
}

console.log('\\n🎉 Correção de imagens de cadeira finalizada!');