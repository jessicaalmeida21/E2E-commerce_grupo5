const fs = require('fs');

console.log('🔧 CORREÇÃO DE IMAGENS QUEBRADAS');
console.log('================================');

// Ler database.js
let databaseContent = fs.readFileSync('./js/database.js', 'utf8');

// Imagens quebradas identificadas e suas substituições
const brokenImages = {
  'https://images.unsplash.com/photo-1663781292073-d7198d04c0c3?w=400&h=400&fit=crop&auto=format': 
    'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop&auto=format', // iPhone alternativo
  
  'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop&auto=format': 
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&auto=format', // TV alternativa
  
  'https://images.unsplash.com/photo-1639006570490-2d7c4c27cb6d?w=400&h=400&fit=crop&auto=format': 
    'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop&auto=format'  // Watch alternativo
};

let totalReplacements = 0;

console.log('🔄 Substituindo imagens quebradas...');

// Substituir cada imagem quebrada
Object.entries(brokenImages).forEach(([brokenUrl, replacementUrl]) => {
  const escapedBrokenUrl = brokenUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escapedBrokenUrl, 'g');
  
  const matches = databaseContent.match(regex);
  if (matches) {
    console.log(`📸 Substituindo ${matches.length} ocorrências de imagem quebrada`);
    console.log(`  De: ${brokenUrl.split('/').pop()}`);
    console.log(`  Para: ${replacementUrl.split('/').pop()}`);
    
    databaseContent = databaseContent.replace(regex, replacementUrl);
    totalReplacements += matches.length;
  }
});

// Salvar o arquivo corrigido
fs.writeFileSync('./js/database.js', databaseContent);

console.log('\n🎉 CORREÇÃO DE IMAGENS QUEBRADAS CONCLUÍDA!');
console.log('==========================================');
console.log(`📊 Total de substituições: ${totalReplacements}`);

if (totalReplacements > 0) {
  console.log('✅ Todas as imagens quebradas foram substituídas!');
  console.log('✅ Agora todas as imagens devem carregar corretamente!');
} else {
  console.log('ℹ️  Nenhuma imagem quebrada encontrada para substituir');
}

console.log('\n🔍 Verificação rápida das substituições...');

// Verificar se as imagens quebradas ainda existem
let stillBroken = 0;
Object.keys(brokenImages).forEach(brokenUrl => {
  if (databaseContent.includes(brokenUrl)) {
    stillBroken++;
    console.log(`❌ Ainda encontrada: ${brokenUrl}`);
  }
});

if (stillBroken === 0) {
  console.log('✅ Nenhuma imagem quebrada restante!');
} else {
  console.log(`⚠️  ${stillBroken} imagens quebradas ainda presentes`);
}