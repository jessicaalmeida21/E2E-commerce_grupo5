// Teste de produtos aleatórios
const db = require('./js/database.js');

console.log('🔍 Testando produtos aleatórios:');

const products = db.getAllProducts();
const testIndexes = [10, 50, 100, 200, 300, 450];

testIndexes.forEach(i => {
    const p = products[i];
    if (p) {
        console.log(`${i+1}. ${p.title} (${p.category})`);
        console.log(`   Imagem: ${p.image ? '✅ OK' : '❌ FALTANDO'}`);
        if (p.image) {
            console.log(`   URL válida: ${p.image.includes('unsplash') ? '✅' : '❌'}`);
            console.log(`   URL: ${p.image.substring(0, 60)}...`);
        }
        console.log('');
    }
});

console.log(`📊 Resumo final:`);
console.log(`   Total de produtos: ${products.length}`);
const withImages = products.filter(p => p.image).length;
console.log(`   Com imagens: ${withImages}`);
console.log(`   Sem imagens: ${products.length - withImages}`);
console.log(`   Sucesso: ${withImages === products.length ? '✅' : '❌'}`);