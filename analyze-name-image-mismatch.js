const fs = require('fs');

console.log('🔍 ANÁLISE DE INCOMPATIBILIDADE NOME-IMAGEM');
console.log('==========================================');

// Ler database.js
const databaseContent = fs.readFileSync('./js/database.js', 'utf8');

// Extrair produtos de todas as categorias
const categories = ['smartphones', 'notebooks', 'televisoes', 'audio', 'calcados', 'roupas', 'eletrodomesticos', 'esportes', 'monitores', 'relogios'];

let totalProducts = 0;
let mismatches = [];
let imageUsage = {};

categories.forEach(category => {
  console.log(`\n📱 Analisando categoria: ${category}`);
  
  const categoryRegex = new RegExp(`"${category}":\\s*\\[([\\s\\S]*?)\\](?=\\s*[,}])`, 'i');
  const categoryMatch = databaseContent.match(categoryRegex);
  
  if (categoryMatch) {
    const categoryContent = categoryMatch[1];
    
    // Extrair produtos da categoria
    const productRegex = /\{[^}]*?"title":\s*"([^"]+)"[^}]*?"image":\s*"([^"]+)"[^}]*?\}/g;
    let match;
    let categoryCount = 0;
    
    while ((match = productRegex.exec(categoryContent)) !== null) {
      const productName = match[1];
      const imageUrl = match[2];
      const imageId = imageUrl.split('/').pop().split('?')[0];
      
      totalProducts++;
      categoryCount++;
      
      // Contar uso da imagem
      if (!imageUsage[imageId]) {
        imageUsage[imageId] = [];
      }
      imageUsage[imageId].push({
        name: productName,
        category: category,
        url: imageUrl
      });
      
      // Verificar incompatibilidades específicas
      let mismatch = false;
      let reason = '';
      
      // iPhone com imagem não-iPhone
      if (productName.toLowerCase().includes('iphone') && 
          !imageId.includes('1695048133142') && // iPhone específico
          !imageId.includes('1663781292073') && // iPhone 14
          !imageId.includes('1574944985070')) { // iPhone genérico
        mismatch = true;
        reason = 'iPhone com imagem não-iPhone';
      }
      
      // Samsung com imagem não-Samsung
      if (productName.toLowerCase().includes('samsung') && 
          !imageId.includes('1610945265064')) { // Samsung específico
        mismatch = true;
        reason = 'Samsung com imagem não-Samsung';
      }
      
      // MacBook com imagem não-MacBook
      if (productName.toLowerCase().includes('macbook') && 
          !imageId.includes('1517336714731') && // MacBook Pro
          !imageId.includes('1611186871348')) { // MacBook Air
        mismatch = true;
        reason = 'MacBook com imagem não-MacBook';
      }
      
      // TV com imagem não-TV
      if ((productName.toLowerCase().includes('tv') || 
           productName.toLowerCase().includes('televisão')) && 
          !imageId.includes('1542291026') && // TV Samsung
          !imageId.includes('1556909114') && // TV LG
          !imageId.includes('1571019613')) { // TV Sony
        mismatch = true;
        reason = 'TV com imagem não-TV';
      }
      
      // Tênis com imagem não-tênis
      if (productName.toLowerCase().includes('tênis') && 
          !imageId.includes('1549298916') && // Nike
          !imageId.includes('1595950653')) { // Adidas
        mismatch = true;
        reason = 'Tênis com imagem não-tênis';
      }
      
      if (mismatch) {
        mismatches.push({
          name: productName,
          category: category,
          imageId: imageId,
          imageUrl: imageUrl,
          reason: reason
        });
      }
    }
    
    console.log(`  📊 ${categoryCount} produtos analisados`);
  }
});

console.log('\n📊 RESULTADOS DA ANÁLISE');
console.log('========================');
console.log(`Total de produtos: ${totalProducts}`);
console.log(`Incompatibilidades encontradas: ${mismatches.length}`);

if (mismatches.length > 0) {
  console.log('\n❌ INCOMPATIBILIDADES DETECTADAS:');
  mismatches.forEach((item, index) => {
    console.log(`${index + 1}. ${item.name} (${item.category})`);
    console.log(`   Motivo: ${item.reason}`);
    console.log(`   Imagem: ${item.imageId}`);
  });
}

// Analisar imagens mais usadas
console.log('\n🔥 IMAGENS MAIS UTILIZADAS:');
const sortedImages = Object.entries(imageUsage)
  .sort((a, b) => b[1].length - a[1].length)
  .slice(0, 10);

sortedImages.forEach(([imageId, products]) => {
  console.log(`${products.length}x: ${imageId}`);
  if (products.length > 10) {
    console.log(`   ⚠️  Imagem muito repetida!`);
  }
});

// Salvar relatório detalhado
const report = {
  totalProducts,
  mismatches: mismatches.length,
  details: mismatches,
  imageUsage: Object.fromEntries(
    Object.entries(imageUsage).map(([id, products]) => [
      id, 
      { count: products.length, products: products.slice(0, 5) }
    ])
  )
};

fs.writeFileSync('./name-image-mismatch-report.json', JSON.stringify(report, null, 2));

console.log('\n✅ Relatório salvo em: name-image-mismatch-report.json');

if (mismatches.length > 0) {
  console.log('\n🔧 CORREÇÕES NECESSÁRIAS:');
  console.log('- Atualizar imagens dos produtos com incompatibilidades');
  console.log('- Garantir correspondência entre nome e imagem');
  console.log('- Reduzir repetição excessiva de imagens');
} else {
  console.log('\n✅ Nenhuma incompatibilidade crítica encontrada!');
}