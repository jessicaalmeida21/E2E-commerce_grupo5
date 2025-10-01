const fs = require('fs');

console.log('🔍 DEBUG DA ESTRUTURA DO DATABASE.JS');
console.log('====================================');

// Ler database.js
const databaseContent = fs.readFileSync('./js/database.js', 'utf8');

console.log('📊 Tamanho do arquivo:', databaseContent.length, 'caracteres');
console.log('📊 Número de linhas:', databaseContent.split('\n').length);

// Procurar por diferentes padrões
console.log('\n🔍 Procurando por padrões...');

// Verificar se existe productsDatabase
if (databaseContent.includes('productsDatabase')) {
    console.log('✅ Encontrado: productsDatabase');
} else {
    console.log('❌ Não encontrado: productsDatabase');
}

// Verificar categorias
const categories = ['smartphones', 'notebooks', 'televisoes', 'audio', 'calcados', 'roupas', 'eletrodomesticos', 'esportes', 'monitores', 'relogios'];

categories.forEach(category => {
    if (databaseContent.includes(`"${category}"`)) {
        console.log(`✅ Categoria encontrada: ${category}`);
        
        // Tentar extrair alguns produtos desta categoria
        const categoryRegex = new RegExp(`"${category}":\\s*\\[([\\s\\S]*?)\\](?=\\s*[,}])`, 'i');
        const categoryMatch = databaseContent.match(categoryRegex);
        
        if (categoryMatch) {
            const categoryContent = categoryMatch[1];
            console.log(`   📊 Conteúdo da categoria ${category}: ${categoryContent.length} caracteres`);
            
            // Contar produtos usando diferentes métodos
            const titleMatches = (categoryContent.match(/"title":/g) || []).length;
            const imageMatches = (categoryContent.match(/"image":/g) || []).length;
            const priceMatches = (categoryContent.match(/"price":/g) || []).length;
            
            console.log(`   📱 Títulos encontrados: ${titleMatches}`);
            console.log(`   🖼️  Imagens encontradas: ${imageMatches}`);
            console.log(`   💰 Preços encontrados: ${priceMatches}`);
            
            // Mostrar primeiro produto como exemplo
            const firstProductMatch = categoryContent.match(/\\{[\\s\\S]*?"title":\\s*"([^"]+)"[\\s\\S]*?"image":\\s*"([^"]+)"[\\s\\S]*?"price":\\s*([\\d.]+)[\\s\\S]*?\\}/);
            if (firstProductMatch) {
                console.log(`   📝 Primeiro produto: ${firstProductMatch[1]}`);
                console.log(`   🖼️  Primeira imagem: ${firstProductMatch[2].substring(0, 50)}...`);
                console.log(`   💰 Primeiro preço: ${firstProductMatch[3]}`);
            } else {
                console.log('   ❌ Não foi possível extrair o primeiro produto');
                // Mostrar uma amostra do conteúdo
                console.log('   📄 Amostra do conteúdo:');
                console.log('   ' + categoryContent.substring(0, 200) + '...');
            }
        } else {
            console.log(`   ❌ Não foi possível extrair conteúdo da categoria ${category}`);
        }
    } else {
        console.log(`❌ Categoria não encontrada: ${category}`);
    }
});

// Procurar por padrões de produtos em geral
console.log('\n🔍 Análise geral de produtos...');
const allTitles = (databaseContent.match(/"title":/g) || []).length;
const allImages = (databaseContent.match(/"image":/g) || []).length;
const allPrices = (databaseContent.match(/"price":/g) || []).length;

console.log(`📱 Total de títulos no arquivo: ${allTitles}`);
console.log(`🖼️  Total de imagens no arquivo: ${allImages}`);
console.log(`💰 Total de preços no arquivo: ${allPrices}`);

// Procurar por imagens de cadeira especificamente
console.log('\n🪑 Procurando por imagens de cadeira...');
const chairImages = [
    'photo-1586023492125-27b2c045efd7',
    'photo-1555041469-a586c61ea9bc',
    'photo-1571068316344-75bc76f77890',
    'photo-1506439773649-6e0eb8cfb237',
    'photo-1434056886845-dac89ffe9b56'
];

chairImages.forEach(chairId => {
    if (databaseContent.includes(chairId)) {
        console.log(`🪑 Imagem de cadeira encontrada: ${chairId}`);
        
        // Contar quantas vezes aparece
        const matches = (databaseContent.match(new RegExp(chairId, 'g')) || []).length;
        console.log(`   📊 Aparece ${matches} vezes`);
    } else {
        console.log(`✅ Imagem de cadeira NÃO encontrada: ${chairId}`);
    }
});

console.log('\n📄 Debug completo finalizado!');