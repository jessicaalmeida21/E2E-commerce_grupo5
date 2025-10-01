// Teste das imagens dos produtos
const db = require('./js/database.js');

console.log('🔍 Verificando imagens por categoria:');

const products = db.getAllProducts();
console.log(`📊 Total de produtos: ${products.length}`);

const categories = ['Smartphones', 'Notebooks', 'Televisões', 'Calçados', 'Relógios'];

categories.forEach(cat => {
    const catProducts = products.filter(p => p.category === cat).slice(0, 2);
    console.log(`\n📱 ${cat}:`);
    catProducts.forEach(p => {
        const hasImage = p.image ? '✅ TEM IMAGEM' : '❌ SEM IMAGEM';
        console.log(`  - ${p.title}: ${hasImage}`);
        if (p.image) {
            console.log(`    URL: ${p.image.substring(0, 50)}...`);
        }
    });
});

// Estatísticas gerais
const withImages = products.filter(p => p.image).length;
console.log(`\n📈 Estatísticas:`);
console.log(`   Produtos com imagens: ${withImages}/${products.length}`);
console.log(`   Porcentagem: ${((withImages/products.length)*100).toFixed(1)}%`);