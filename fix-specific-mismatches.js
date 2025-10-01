const fs = require('fs');

console.log('🔧 CORREÇÃO ESPECÍFICA DE INCOMPATIBILIDADES');
console.log('==========================================');

// Ler database.js
let databaseContent = fs.readFileSync('./js/database.js', 'utf8');

// Mapeamento específico de correções
const specificCorrections = {
  // iPhones
  'iPhone 15 Pro Max': 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop&auto=format',
  'iPhone 15 Pro': 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop&auto=format',
  'iPhone 14 Pro': 'https://images.unsplash.com/photo-1663781292073-d7198d04c0c3?w=400&h=400&fit=crop&auto=format',
  'iPhone 13': 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop&auto=format',
  'iPhone 12': 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop&auto=format',
  
  // Samsung Smartphones
  'Galaxy S24 Ultra': 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop&auto=format',
  'Galaxy S23': 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop&auto=format',
  'Galaxy A54': 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop&auto=format',
  
  // MacBooks
  'MacBook Pro M3': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&auto=format',
  'MacBook Air M2': 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&h=400&fit=crop&auto=format',
  'MacBook Pro 16': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&auto=format',
  
  // TVs
  'Smart TV Samsung': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&auto=format',
  'Smart TV LG': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format',
  'Smart TV Sony': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&auto=format',
  
  // Samsung Watches
  'Samsung Galaxy Watch': 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop&auto=format',
  
  // Tênis
  'Tênis Nike': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&auto=format',
  'Tênis Adidas': 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop&auto=format'
};

function correctProductImage(productName) {
  // Buscar correspondência exata primeiro
  for (const [key, image] of Object.entries(specificCorrections)) {
    if (productName.includes(key)) {
      return image;
    }
  }
  
  // Buscar por palavras-chave
  const name = productName.toLowerCase();
  
  if (name.includes('iphone 15')) {
    return 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop&auto=format';
  }
  if (name.includes('iphone 14')) {
    return 'https://images.unsplash.com/photo-1663781292073-d7198d04c0c3?w=400&h=400&fit=crop&auto=format';
  }
  if (name.includes('iphone')) {
    return 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop&auto=format';
  }
  
  if (name.includes('galaxy') || name.includes('samsung')) {
    if (name.includes('watch')) {
      return 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop&auto=format';
    }
    return 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop&auto=format';
  }
  
  if (name.includes('macbook pro')) {
    return 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&auto=format';
  }
  if (name.includes('macbook air')) {
    return 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&h=400&fit=crop&auto=format';
  }
  if (name.includes('macbook')) {
    return 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&auto=format';
  }
  
  if (name.includes('smart tv samsung') || (name.includes('tv') && name.includes('samsung'))) {
    return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&auto=format';
  }
  if (name.includes('smart tv lg') || (name.includes('tv') && name.includes('lg'))) {
    return 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format';
  }
  if (name.includes('smart tv sony') || (name.includes('tv') && name.includes('sony'))) {
    return 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&auto=format';
  }
  
  if (name.includes('tênis nike') || (name.includes('tênis') && name.includes('nike'))) {
    return 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&auto=format';
  }
  if (name.includes('tênis adidas') || (name.includes('tênis') && name.includes('adidas'))) {
    return 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop&auto=format';
  }
  
  return null; // Não precisa de correção
}

let totalCorrections = 0;
let categoryCorrections = {};

// Processar cada categoria
const categories = ['smartphones', 'notebooks', 'televisoes', 'audio', 'calcados', 'roupas', 'eletrodomesticos', 'esportes', 'monitores', 'relogios'];

categories.forEach(category => {
  console.log(`\n📱 Corrigindo categoria: ${category}`);
  
  const categoryRegex = new RegExp(`"${category}":\\s*\\[([\\s\\S]*?)\\](?=\\s*[,}])`, 'i');
  const categoryMatch = databaseContent.match(categoryRegex);
  
  if (categoryMatch) {
    let categoryContent = categoryMatch[1];
    let corrections = 0;
    
    // Encontrar e corrigir produtos
    const productRegex = /(\{[^}]*?"title":\s*"([^"]+)"[^}]*?"image":\s*")([^"]+)("[^}]*?\})/g;
    
    categoryContent = categoryContent.replace(productRegex, (match, before, title, currentImage, after) => {
      const correctImage = correctProductImage(title);
      
      if (correctImage && correctImage !== currentImage) {
        corrections++;
        totalCorrections++;
        console.log(`  ✅ ${title}: imagem corrigida`);
        return before + correctImage + after;
      }
      
      return match;
    });
    
    // Atualizar o conteúdo da categoria
    databaseContent = databaseContent.replace(categoryMatch[0], 
      `"${category}": [${categoryContent}]`);
    
    categoryCorrections[category] = corrections;
    console.log(`  📊 ${corrections} correções nesta categoria`);
  }
});

// Salvar o arquivo corrigido
fs.writeFileSync('./js/database.js', databaseContent);

console.log('\n🎉 CORREÇÕES ESPECÍFICAS CONCLUÍDAS!');
console.log('===================================');
console.log(`📊 Total de correções: ${totalCorrections}`);

Object.entries(categoryCorrections).forEach(([category, count]) => {
  if (count > 0) {
    console.log(`  ${category}: ${count} correções`);
  }
});

if (totalCorrections > 0) {
  console.log('\n✅ Incompatibilidades corrigidas com sucesso!');
  console.log('✅ Correspondência nome-imagem restaurada!');
} else {
  console.log('\n✅ Nenhuma correção necessária - tudo já estava correto!');
}

// Verificar se ainda há problemas
console.log('\n🔍 Verificação final...');
const remainingIssues = [];

categories.forEach(category => {
  const categoryRegex = new RegExp(`"${category}":\\s*\\[([\\s\\S]*?)\\](?=\\s*[,}])`, 'i');
  const categoryMatch = databaseContent.match(categoryRegex);
  
  if (categoryMatch) {
    const categoryContent = categoryMatch[1];
    const productRegex = /\{[^}]*?"title":\s*"([^"]+)"[^}]*?"image":\s*"([^"]+)"[^}]*?\}/g;
    let match;
    
    while ((match = productRegex.exec(categoryContent)) !== null) {
      const title = match[1];
      const image = match[2];
      
      // Verificar se ainda há problemas óbvios
      if (title.toLowerCase().includes('iphone') && !image.includes('1695048133142') && !image.includes('1663781292073') && !image.includes('1574944985070')) {
        remainingIssues.push(`${title} ainda com imagem incorreta`);
      }
    }
  }
});

if (remainingIssues.length > 0) {
  console.log(`⚠️  ${remainingIssues.length} problemas ainda detectados`);
} else {
  console.log('✅ Nenhum problema detectado na verificação final!');
}