// Script para corrigir todas as imagens dos produtos
const fs = require('fs');
const path = require('path');

console.log('🔧 Corrigindo todas as imagens dos produtos...');

// Ler o arquivo database.js
const databasePath = path.join(__dirname, 'js', 'database.js');
let content = fs.readFileSync(databasePath, 'utf8');

// Mapeamento de correções de imagens
const imageCorrections = [
    // TVs LG - usar imagem diferente da Samsung
    {
        search: '"Smart TV LG 50\\" 4K",[\\s\\S]*?"image": "https://images\\.unsplash\\.com/photo-1593359677879-a4bb92f829d1',
        replace: '"Smart TV LG 50" 4K",\n            "price": 1599.99,\n            "originalPrice": 1999.99,\n            "discount": 20,\n            "category": "Televisões",\n            "brand": "LG",\n            "image": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1'
    },
    // TVs Sony - usar imagem diferente da Samsung
    {
        search: '"Smart TV Sony 43\\" 4K",[\\s\\S]*?"image": "https://images\\.unsplash\\.com/photo-1593359677879-a4bb92f829d1',
        replace: '"Smart TV Sony 43" 4K",\n            "price": 1299.99,\n            "originalPrice": 1599.99,\n            "discount": 19,\n            "category": "Televisões",\n            "brand": "Sony",\n            "image": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1'
    },
    // Fone Sony - usar imagem diferente do JBL
    {
        search: '"Fone Sony WH-CH720N",[\\s\\S]*?"image": "https://images\\.unsplash\\.com/photo-1505740420928-5e560c06d30e',
        replace: '"Fone Sony WH-CH720N",\n            "price": 399.99,\n            "originalPrice": 499.99,\n            "discount": 20,\n            "category": "Áudio",\n            "brand": "Sony",\n            "image": "https://images.unsplash.com/photo-1484704849700-f032a568e944'
    },
    // Tênis Adidas - usar imagem diferente da Nike
    {
        search: '"Tênis Adidas Ultraboost 22",[\\s\\S]*?"image": "https://images\\.unsplash\\.com/photo-1549298916-b41d501d3772',
        replace: '"Tênis Adidas Ultraboost 22",\n            "price": 799.99,\n            "originalPrice": 899.99,\n            "discount": 11,\n            "category": "Calçados",\n            "brand": "Adidas",\n            "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff'
    },
    // Tênis Puma - usar imagem diferente da Nike
    {
        search: '"Tênis Puma RS-X",[\\s\\S]*?"image": "https://images\\.unsplash\\.com/photo-1549298916-b41d501d3772',
        replace: '"Tênis Puma RS-X",\n            "price": 449.99,\n            "originalPrice": 549.99,\n            "discount": 18,\n            "category": "Calçados",\n            "brand": "Puma",\n            "image": "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa'
    }
];

// Aplicar correções
imageCorrections.forEach((correction, index) => {
    const regex = new RegExp(correction.search, 'g');
    const matches = content.match(regex);
    
    if (matches) {
        content = content.replace(regex, correction.replace);
        console.log(`✅ Correção ${index + 1} aplicada: ${matches.length} ocorrência(s)`);
    } else {
        console.log(`⚠️ Correção ${index + 1} não encontrada`);
    }
});

// Salvar arquivo corrigido
fs.writeFileSync(databasePath, content, 'utf8');
console.log('✅ Todas as correções de imagens foram aplicadas!');

