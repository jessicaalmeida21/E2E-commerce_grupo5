// Script para atualizar todas as imagens dos produtos com URLs do Unsplash que funcionam
const fs = require('fs');

// URLs do Unsplash organizadas por categoria
const imageUrls = {
    smartphones: [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=400&fit=crop&crop=center&auto=format&q=80'
    ],
    notebooks: [
        'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop&crop=center&auto=format&q=80'
    ],
    televisoes: [
        'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&crop=center&auto=format&q=80'
    ],
    audio: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop&crop=center&auto=format&q=80'
    ],
    calcados: [
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=center&auto=format&q=80'
    ],
    roupas: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80'
    ],
    eletrodomesticos: [
        'https://images.unsplash.com/photo-15569091431326005620-6d0e44b482f8?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1581578731548-c6a0c3f2b4a4?w=400&h=400&fit=crop&crop=center&auto=format&q=80'
    ],
    esportes: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1431326005620-6d0e44b482f8?w=400&h=400&fit=crop&crop=center&auto=format&q=80'
    ],
    monitores: [
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&crop=center&auto=format&q=80'
    ],
    relogios: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center&auto=format&q=80'
    ]
};

// Ler o arquivo database.js
const databaseContent = fs.readFileSync('js/database.js', 'utf8');

// Atualizar cada categoria
let updatedContent = databaseContent;
let index = 0;

Object.keys(imageUrls).forEach(category => {
    const urls = imageUrls[category];
    urls.forEach((url, urlIndex) => {
        // Encontrar e substituir a próxima ocorrência de image: na categoria
        const regex = new RegExp(`(image:\\s*")([^"]+)(")`, 'g');
        let match;
        let count = 0;
        
        updatedContent = updatedContent.replace(regex, (match, prefix, oldUrl, suffix) => {
            count++;
            // Só substituir se for da categoria atual
            if (count > index) {
                index++;
                return prefix + url + suffix;
            }
            return match;
        });
    });
});

// Salvar o arquivo atualizado
fs.writeFileSync('js/database.js', updatedContent);

console.log('✅ Todas as imagens foram atualizadas com sucesso!');
console.log('📁 Arquivo salvo: js/database.js');
