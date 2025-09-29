// Script para corrigir todas as imagens dos produtos
const fs = require('fs');
const path = require('path');

// Ler o arquivo database.js
const databasePath = path.join(__dirname, 'js', 'database.js');
let content = fs.readFileSync(databasePath, 'utf8');

console.log('🔧 Corrigindo imagens dos produtos...');

// Mapeamento de imagens corretas por marca/produto
const imageMappings = {
    // TVs
    'PROD-008': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // LG
    'PROD-009': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // Sony
    
    // Fones
    'PROD-011': 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // Sony
    
    // Tênis
    'PROD-013': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // Adidas
    'PROD-014': 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // Puma
};

// Aplicar correções
Object.keys(imageMappings).forEach(productId => {
    const newImage = imageMappings[productId];
    const regex = new RegExp(`(id: "${productId}"[\\s\\S]*?image: ")[^"]*(")`, 'g');
    content = content.replace(regex, `$1${newImage}$2`);
    console.log(`✅ Corrigida imagem do produto ${productId}`);
});

// Salvar arquivo corrigido
fs.writeFileSync(databasePath, content, 'utf8');
console.log('✅ Todas as imagens foram corrigidas!');

