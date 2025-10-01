const fs = require('fs');

// Ler o arquivo database.js
const databaseContent = fs.readFileSync('./js/database.js', 'utf8');

// Extrair todas as URLs de imagens
const imageUrls = [];
const imageRegex = /"image":\s*"([^"]+)"/g;
let match;

while ((match = imageRegex.exec(databaseContent)) !== null) {
    imageUrls.push(match[1]);
}

console.log('🔍 ANÁLISE DAS IMAGENS DO E2E-COMMERCE');
console.log('=====================================');
console.log(`📊 Total de imagens encontradas: ${imageUrls.length}`);

// Contar imagens únicas
const uniqueImages = [...new Set(imageUrls)];
console.log(`🎯 Imagens únicas: ${uniqueImages.length}`);

// Verificar se todas são do Unsplash
const unsplashImages = uniqueImages.filter(url => url.includes('unsplash.com'));
console.log(`📸 Imagens do Unsplash: ${unsplashImages.length}/${uniqueImages.length}`);

// Verificar se há imagens repetidas demais
const imageCount = {};
imageUrls.forEach(url => {
    imageCount[url] = (imageCount[url] || 0) + 1;
});

console.log('\n🔥 IMAGENS MAIS UTILIZADAS:');
Object.entries(imageCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([url, count]) => {
        const shortUrl = url.split('?')[0].split('/').pop();
        console.log(`  ${count.toString().padStart(3)}x: ${shortUrl}`);
    });

// Verificar problemas específicos
console.log('\n⚠️  PROBLEMAS IDENTIFICADOS:');

// 1. Imagens muito repetidas (mais de 30 vezes)
const overusedImages = Object.entries(imageCount)
    .filter(([url, count]) => count > 30)
    .sort((a, b) => b[1] - a[1]);

if (overusedImages.length > 0) {
    console.log('\n❌ Imagens excessivamente repetidas (>30 vezes):');
    overusedImages.forEach(([url, count]) => {
        const shortUrl = url.split('?')[0].split('/').pop();
        console.log(`  ${count}x: ${shortUrl}`);
    });
} else {
    console.log('\n✅ Nenhuma imagem excessivamente repetida');
}

// 2. Verificar diversidade de imagens
const diversityRatio = uniqueImages.length / imageUrls.length;
console.log(`\n📈 Taxa de diversidade: ${(diversityRatio * 100).toFixed(1)}%`);

if (diversityRatio < 0.3) {
    console.log('❌ BAIXA diversidade de imagens - muitas repetições');
} else if (diversityRatio < 0.6) {
    console.log('⚠️  MÉDIA diversidade de imagens - algumas repetições');
} else {
    console.log('✅ BOA diversidade de imagens');
}