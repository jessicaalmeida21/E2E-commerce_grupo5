const fs = require('fs');
const https = require('https');

console.log('🔍 TESTANDO CARREGAMENTO DAS IMAGENS');
console.log('===================================');

// Ler database.js
const databaseContent = fs.readFileSync('./js/database.js', 'utf8');

// Extrair todas as URLs de imagens
const imageMatches = databaseContent.match(/"image":\s*"([^"]+)"/g);
if (!imageMatches) {
  console.log('❌ Nenhuma imagem encontrada no database.js');
  return;
}

const imageUrls = [...new Set(imageMatches.map(match => {
  const url = match.match(/"image":\s*"([^"]+)"/)[1];
  return url;
}).filter(url => url && url.startsWith('https://')))];

console.log(`📊 Testando ${imageUrls.length} imagens únicas...`);

if (imageUrls.length === 0) {
  console.log('❌ Nenhuma URL válida encontrada');
  return;
}

let testedCount = 0;
let successCount = 0;
let errorCount = 0;

function testImage(url) {
  return new Promise((resolve) => {
    const request = https.get(url, (response) => {
      if (response.statusCode === 200) {
        successCount++;
        console.log(`✅ ${url.split('/').pop()}`);
      } else {
        errorCount++;
        console.log(`❌ ${url.split('/').pop()} - Status: ${response.statusCode}`);
      }
      testedCount++;
      resolve();
    });
    
    request.on('error', (error) => {
      errorCount++;
      console.log(`❌ ${url.split('/').pop()} - Erro: ${error.message}`);
      testedCount++;
      resolve();
    });
    
    request.setTimeout(5000, () => {
      errorCount++;
      console.log(`❌ ${url.split('/').pop()} - Timeout`);
      testedCount++;
      resolve();
    });
  });
}

async function testAllImages() {
  for (const url of imageUrls) {
    await testImage(url);
  }
  
  console.log('\n🎉 TESTE CONCLUÍDO!');
  console.log(`✅ Imagens funcionando: ${successCount}`);
  console.log(`❌ Imagens com erro: ${errorCount}`);
  console.log(`📈 Taxa de sucesso: ${((successCount / imageUrls.length) * 100).toFixed(1)}%`);
}

testAllImages();