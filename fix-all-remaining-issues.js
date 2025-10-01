const fs = require('fs');

console.log('🔧 CORREÇÃO FINAL DE TODAS AS IMAGENS INCORRETAS');
console.log('================================================\n');

// Ler o database.js
let databaseContent = fs.readFileSync('./js/database.js', 'utf8');

// Extrair o objeto productsDatabase
const match = databaseContent.match(/const productsDatabase = ({[\s\S]*?});/);
if (!match) {
    console.error('❌ Não foi possível encontrar productsDatabase no arquivo');
    process.exit(1);
}

const productsDatabase = JSON.parse(match[1]);

// Converter para array único
const allProducts = [];
Object.keys(productsDatabase).forEach(category => {
    productsDatabase[category].forEach(product => {
        allProducts.push({...product, category});
    });
});

console.log(`📊 Total de produtos: ${allProducts.length}`);

// Definir imagens corretas por categoria
const correctImages = {
    'Smartphones': [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=400&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=400&h=400&fit=crop&auto=format'
    ],
    'Notebooks': [
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=400&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400&h=400&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&auto=format'
    ],
    'Televisões': [
        'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=400&h=400&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop&auto=format'
    ],
    'Relógios': [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1461151304267-ef46a710d3e6?w=400&h=400&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=400&h=400&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&h=400&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=400&h=400&fit=crop&auto=format'
    ],
    'Áudio e Som': [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop&auto=format'
    ],
    'Roupas': [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=400&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=400&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop&auto=format'
    ],
    'Calçados': [
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop&auto=format'
    ],
    'Eletrodomésticos': [
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=400&fit=crop&auto=format'
    ],
    'Monitores': [
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=400&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=400&h=400&fit=crop&auto=format'
    ],
    'Esportes e Lazer': [
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop&auto=format'
    ]
};

// Função para detectar produtos problemáticos
function isProblematic(product) {
    const title = product.title.toLowerCase();
    const imageUrl = product.image;
    const category = product.category;
    
    // Extrair ID da imagem
    const imageIdMatch = imageUrl.match(/photo-(\d+-[a-f0-9]+)/);
    const imageId = imageIdMatch ? imageIdMatch[1] : '';
    
    let problematic = false;
    
    // Verificações específicas por categoria e produto
    if (category === 'Smartphones') {
        if (!imageId.includes('phone') && !imageId.includes('mobile') && !imageId.includes('iphone') && 
            !imageId.includes('samsung') && !imageId.includes('android') && !imageId.includes('cellular')) {
            problematic = true;
        }
    }
    
    if (category === 'Notebooks') {
        if (!imageId.includes('laptop') && !imageId.includes('computer') && !imageId.includes('macbook') && 
            !imageId.includes('notebook') && !imageId.includes('thinkpad')) {
            problematic = true;
        }
    }
    
    if (category === 'Televisões') {
        if (!imageId.includes('tv') && !imageId.includes('television') && !imageId.includes('screen') && 
            !imageId.includes('display') && !imageId.includes('monitor')) {
            problematic = true;
        }
    }
    
    if (category === 'Relógios') {
        if (!imageId.includes('watch') && !imageId.includes('time') && !imageId.includes('wrist') && 
            !imageId.includes('smartwatch') && !imageId.includes('clock') && !imageId.includes('timepiece')) {
            problematic = true;
        }
    }
    
    if (category === 'Áudio e Som') {
        if (!imageId.includes('headphone') && !imageId.includes('speaker') && !imageId.includes('audio') && 
            !imageId.includes('sound') && !imageId.includes('music') && !imageId.includes('earphone')) {
            problematic = true;
        }
    }
    
    if (category === 'Roupas') {
        if (!imageId.includes('shirt') && !imageId.includes('clothing') && !imageId.includes('fashion') && 
            !imageId.includes('wear') && !imageId.includes('apparel') && !imageId.includes('textile')) {
            problematic = true;
        }
    }
    
    if (category === 'Calçados') {
        if (!imageId.includes('shoe') && !imageId.includes('sneaker') && !imageId.includes('boot') && 
            !imageId.includes('footwear') && !imageId.includes('sandal')) {
            problematic = true;
        }
    }
    
    if (category === 'Eletrodomésticos') {
        if (!imageId.includes('kitchen') && !imageId.includes('appliance') && !imageId.includes('coffee') && 
            !imageId.includes('refrigerator') && !imageId.includes('stove') && !imageId.includes('microwave')) {
            problematic = true;
        }
    }
    
    if (category === 'Monitores') {
        if (!imageId.includes('monitor') && !imageId.includes('screen') && !imageId.includes('display') && 
            !imageId.includes('computer')) {
            problematic = true;
        }
    }
    
    if (category === 'Esportes e Lazer') {
        if (!imageId.includes('sport') && !imageId.includes('fitness') && !imageId.includes('exercise') && 
            !imageId.includes('ball') && !imageId.includes('game')) {
            problematic = true;
        }
    }
    
    return problematic;
}

// Encontrar produtos problemáticos
const problematicProducts = allProducts.filter(isProblematic);
console.log(`🔍 Produtos com imagens incorretas encontrados: ${problematicProducts.length}`);

if (problematicProducts.length === 0) {
    console.log('✅ Nenhum produto com imagem incorreta encontrado!');
    process.exit(0);
}

// Corrigir produtos
let corrections = 0;
const correctionLog = [];

problematicProducts.forEach((product, index) => {
    const categoryImages = correctImages[product.category];
    if (!categoryImages) {
        console.log(`⚠️  Categoria não encontrada: ${product.category}`);
        return;
    }
    
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
        category: product.category,
        oldImage: oldImage,
        newImage: newImage
    });
    
    console.log(`✅ ${corrections}/${problematicProducts.length} - ${product.title} (${product.category})`);
    console.log(`   → ${newImage.substring(0, 60)}...`);
});

// Salvar o database corrigido
fs.writeFileSync('./js/database.js', databaseContent);

// Salvar log das correções
fs.writeFileSync('final-corrections-log.json', JSON.stringify({
    timestamp: new Date().toISOString(),
    totalCorrections: corrections,
    corrections: correctionLog
}, null, 2));

console.log(`\n🎉 CORREÇÕES FINAIS CONCLUÍDAS!`);
console.log(`📊 Total de correções: ${corrections}`);
console.log(`📄 Log salvo em: final-corrections-log.json`);
console.log(`✅ Database atualizado: ./js/database.js`);
console.log(`\n🏁 Processo finalizado!`);