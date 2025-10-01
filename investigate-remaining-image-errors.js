const fs = require('fs');

// Carregar o banco de dados
const { productsDatabase, getAllProducts } = require('./js/database.js');

console.log('🔍 INVESTIGANDO IMAGENS INCORRETAS RESTANTES...\n');

// Função para verificar se a imagem corresponde ao produto
function checkImageMatch(product) {
    const productName = product.title.toLowerCase(); // Mudança: usar 'title' em vez de 'name'
    const imageUrl = product.image.toLowerCase();
    
    // Extrair palavras-chave do nome do produto
    const productWords = productName.split(/[\s\-_]+/).filter(word => word.length > 2);
    
    // Verificar se pelo menos uma palavra-chave está na URL da imagem
    const hasMatch = productWords.some(word => imageUrl.includes(word));
    
    return {
        hasMatch,
        productWords,
        imageUrl: product.image
    };
}

// Analisar todos os produtos
let incorrectImages = [];
let totalProducts = 0;

Object.keys(productsDatabase).forEach(category => {
    productsDatabase[category].forEach(product => {
        totalProducts++;
        const check = checkImageMatch(product);
        
        if (!check.hasMatch) {
            incorrectImages.push({
                id: product.id,
                name: product.title, // Mudança: usar 'title' em vez de 'name'
                category: category,
                currentImage: product.image,
                productWords: check.productWords,
                reason: 'Nenhuma palavra-chave do produto encontrada na URL da imagem'
            });
        }
    });
});

console.log(`📊 RESUMO DA ANÁLISE:`);
console.log(`Total de produtos: ${totalProducts}`);
console.log(`Produtos com imagens incorretas: ${incorrectImages.length}`);
console.log(`Porcentagem de imagens corretas: ${((totalProducts - incorrectImages.length) / totalProducts * 100).toFixed(1)}%\n`);

if (incorrectImages.length > 0) {
    console.log('❌ PRODUTOS COM IMAGENS INCORRETAS:\n');
    
    // Agrupar por categoria
    const byCategory = {};
    incorrectImages.forEach(item => {
        if (!byCategory[item.category]) byCategory[item.category] = [];
        byCategory[item.category].push(item);
    });
    
    Object.keys(byCategory).forEach(category => {
        console.log(`📂 ${category.toUpperCase()} (${byCategory[category].length} produtos):`);
        byCategory[category].forEach(item => {
            console.log(`  • ${item.name}`);
            console.log(`    ID: ${item.id}`);
            console.log(`    Imagem atual: ${item.currentImage}`);
            console.log(`    Palavras-chave: ${item.productWords.join(', ')}`);
            console.log('');
        });
    });
    
    // Salvar lista detalhada
    fs.writeFileSync('./remaining-incorrect-images.json', JSON.stringify(incorrectImages, null, 2));
    console.log('💾 Lista detalhada salva em: remaining-incorrect-images.json');
    
} else {
    console.log('✅ Todas as imagens estão corretas!');
}

console.log('\n🔍 Investigação concluída.');