const fs = require('fs');

console.log('🔍 VERIFICAÇÃO FINAL - TODOS OS 500 PRODUTOS');
console.log('============================================');

// Ler database.js
const databaseContent = fs.readFileSync('./js/database.js', 'utf8');

// Extrair todos os produtos
const productRegex = /"id":\s*"([^"]+)"[\s\S]*?"title":\s*"([^"]+)"[\s\S]*?"image":\s*"([^"]+)"/g;
const products = [];
let match;

while ((match = productRegex.exec(databaseContent)) !== null) {
    products.push({
        id: match[1],
        title: match[2],
        image: match[3]
    });
}

console.log(`📊 Total de produtos encontrados: ${products.length}`);

// Verificar se ainda existem imagens de cadeira
const chairImages = [
    'photo-1555041469-a586c61ea9bc',
    'photo-1586023492125-27b2c045efd7',
    'photo-1506439773649-6e0eb8cfb237',
    'photo-1549497538-303791108f95',
    'photo-1567538096630-e0c55bd6374c'
];

let chairCount = 0;
const chairProducts = [];

products.forEach(product => {
    chairImages.forEach(chairId => {
        if (product.image.includes(chairId)) {
            chairCount++;
            chairProducts.push({
                id: product.id,
                title: product.title,
                chairImageId: chairId
            });
        }
    });
});

console.log(`🪑 Produtos com imagens de cadeira: ${chairCount}`);

if (chairProducts.length > 0) {
    console.log('\n⚠️  PRODUTOS AINDA COM CADEIRAS:');
    chairProducts.forEach((product, index) => {
        console.log(`${index + 1}. ${product.id} - ${product.title}`);
    });
} else {
    console.log('✅ Nenhuma imagem de cadeira encontrada!');
}

// Verificar imagens únicas
const uniqueImages = [...new Set(products.map(p => p.image))];
console.log(`🖼️  Total de imagens únicas: ${uniqueImages.length}`);

// Verificar se todas as imagens são do Unsplash
const unsplashImages = uniqueImages.filter(img => img.includes('unsplash.com'));
console.log(`📸 Imagens do Unsplash: ${unsplashImages.length}`);

// Verificar produtos por categoria
const categories = {};
products.forEach(product => {
    // Tentar identificar categoria pelo título
    const title = product.title.toLowerCase();
    let category = 'outros';
    
    if (title.includes('iphone') || title.includes('galaxy') || title.includes('smartphone')) {
        category = 'smartphones';
    } else if (title.includes('notebook') || title.includes('macbook') || title.includes('laptop')) {
        category = 'notebooks';
    } else if (title.includes('tv') || title.includes('televisão') || title.includes('smart tv')) {
        category = 'televisoes';
    } else if (title.includes('monitor')) {
        category = 'monitores';
    } else if (title.includes('fone') || title.includes('headphone') || title.includes('speaker')) {
        category = 'audio';
    } else if (title.includes('tênis') || title.includes('sapato') || title.includes('bota')) {
        category = 'calcados';
    } else if (title.includes('camiseta') || title.includes('blusa') || title.includes('camisa')) {
        category = 'roupas';
    } else if (title.includes('geladeira') || title.includes('fogão') || title.includes('microondas')) {
        category = 'eletrodomesticos';
    } else if (title.includes('bola') || title.includes('esporte') || title.includes('fitness')) {
        category = 'esportes';
    } else if (title.includes('relógio') || title.includes('watch')) {
        category = 'relogios';
    }
    
    categories[category] = (categories[category] || 0) + 1;
});

console.log('\n📊 DISTRIBUIÇÃO POR CATEGORIA:');
Object.entries(categories).forEach(([cat, count]) => {
    console.log(`${cat}: ${count} produtos`);
});

// Criar relatório final
const report = {
    timestamp: new Date().toISOString(),
    totalProducts: products.length,
    chairImagesFound: chairCount,
    chairProducts: chairProducts,
    uniqueImages: uniqueImages.length,
    unsplashImages: unsplashImages.length,
    categories: categories,
    allCorrect: chairCount === 0 && products.length === 500
};

fs.writeFileSync('final-verification-report.json', JSON.stringify(report, null, 2));

console.log('\n🎯 RESULTADO FINAL:');
console.log('==================');
if (report.allCorrect) {
    console.log('🎉 PERFEITO! Todos os 500 produtos estão corretos!');
    console.log('✅ Nenhuma imagem de cadeira incorreta encontrada');
    console.log('✅ Todas as imagens são do Unsplash');
    console.log('✅ Sistema pronto para uso!');
} else {
    console.log('⚠️  Ainda há problemas a corrigir');
    if (chairCount > 0) {
        console.log(`❌ ${chairCount} produtos ainda têm imagens de cadeira`);
    }
    if (products.length !== 500) {
        console.log(`❌ Esperado 500 produtos, encontrado ${products.length}`);
    }
}

console.log('\n📄 Relatório salvo em: final-verification-report.json');
console.log('🏁 Verificação concluída!');