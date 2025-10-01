const fs = require('fs');

console.log('🔧 CORREÇÃO ESPECÍFICA DOS PRODUTOS PROBLEMÁTICOS');
console.log('=================================================\n');

// Ler o database.js
let databaseContent = fs.readFileSync('./js/database.js', 'utf8');

// Lista de imagens problemáticas que precisam ser substituídas
const problematicImages = [
    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&h=400&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=400&h=400&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1461151304267-ef46a710d3e6?w=400&h=400&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=400&h=400&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=400&h=400&fit=crop&auto=format'
];

// Imagens corretas por categoria
const correctImagesByCategory = {
    'smartphones': [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop&auto=format'
    ],
    'notebooks': [
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=400&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400&h=400&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&auto=format'
    ],
    'televisoes': [
        'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&auto=format'
    ],
    'relogios': [
        'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=400&h=400&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=400&h=400&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=400&fit=crop&auto=format'
    ],
    'audio': [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop&auto=format'
    ],
    'roupas': [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=400&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=400&fit=crop&auto=format'
    ],
    'calcados': [
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop&auto=format'
    ],
    'eletrodomesticos': [
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=400&fit=crop&auto=format'
    ],
    'monitores': [
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=400&fit=crop&auto=format'
    ],
    'esportes': [
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=400&fit=crop&auto=format'
    ]
};

// Extrair o objeto productsDatabase
const match = databaseContent.match(/const productsDatabase = ({[\s\S]*?});/);
if (!match) {
    console.error('❌ Não foi possível encontrar productsDatabase no arquivo');
    process.exit(1);
}

const productsDatabase = JSON.parse(match[1]);
let corrections = 0;
const correctionLog = [];

// Processar cada categoria
Object.keys(productsDatabase).forEach(category => {
    const categoryImages = correctImagesByCategory[category];
    if (!categoryImages) {
        console.log(`⚠️  Categoria não mapeada: ${category}`);
        return;
    }
    
    productsDatabase[category].forEach(product => {
        // Verificar se o produto tem uma imagem problemática
        if (problematicImages.includes(product.image)) {
            // Escolher uma imagem aleatória da categoria
            const randomIndex = Math.floor(Math.random() * categoryImages.length);
            const newImage = categoryImages[randomIndex];
            
            // Substituir no conteúdo do database
            const oldImage = product.image;
            databaseContent = databaseContent.replace(oldImage, newImage);
            
            corrections++;
            correctionLog.push({
                productId: product.id,
                title: product.title,
                category: category,
                oldImage: oldImage,
                newImage: newImage
            });
            
            console.log(`✅ ${corrections} - ${product.title} (${category})`);
            console.log(`   → ${newImage.substring(0, 60)}...`);
        }
    });
});

// Salvar o database corrigido
fs.writeFileSync('./js/database.js', databaseContent);

// Salvar log das correções
fs.writeFileSync('specific-corrections-log.json', JSON.stringify({
    timestamp: new Date().toISOString(),
    totalCorrections: corrections,
    corrections: correctionLog
}, null, 2));

console.log(`\n🎉 CORREÇÕES ESPECÍFICAS CONCLUÍDAS!`);
console.log(`📊 Total de correções: ${corrections}`);
console.log(`📄 Log salvo em: specific-corrections-log.json`);
console.log(`✅ Database atualizado: ./js/database.js`);
console.log(`\n🏁 Processo finalizado!`);