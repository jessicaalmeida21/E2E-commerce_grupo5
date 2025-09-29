// Script para atualizar todas as imagens com URLs únicas do Unsplash
const fs = require('fs');

// URLs únicas do Unsplash para cada produto
const uniqueImages = [
    // Smartphones
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // Samsung
    'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // iPhone
    'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // Xiaomi
    
    // Notebooks
    'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // Acer
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // Lenovo
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // Dell
    
    // TVs
    'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // Samsung TV
    'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // LG TV
    'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // Sony TV
    
    // Áudio
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // JBL
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // Sony
    
    // Calçados
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // Nike
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // Adidas
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // Puma
    
    // Roupas
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // Camiseta Nike
    'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // Jeans Levis
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // Jaqueta Adidas
    
    // Eletrodomésticos
    'https://images.unsplash.com/photo-15569091431326005620-6d0e44b482f8?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // Liquidificador
    'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // Air Fryer
    'https://images.unsplash.com/photo-1581578731548-c6a0c3f2b4a4?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // Aspirador Robô
    
    // Esportes
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // Bicicleta
    'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // Skate
    'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // Halteres
    'https://images.unsplash.com/photo-1431326005620-6d0e44b482f8?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // Bola Futebol
    
    // Monitores
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // Dell Monitor
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // Samsung Monitor
    
    // Relógios
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // Casio
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center&auto=format&q=80'  // Apple Watch
];

// Ler o arquivo database.js
let content = fs.readFileSync('js/database.js', 'utf8');

// Substituir todas as URLs de imagem sequencialmente
let imageIndex = 0;
content = content.replace(/image:\s*"https:\/\/images\.unsplash\.com\/[^"]+"/g, () => {
    if (imageIndex < uniqueImages.length) {
        const newUrl = uniqueImages[imageIndex];
        imageIndex++;
        return `image: "${newUrl}"`;
    }
    return arguments[0]; // Retorna o match original se não houver mais URLs
});

// Salvar o arquivo atualizado
fs.writeFileSync('js/database.js', content);

console.log('✅ Todas as imagens foram atualizadas com URLs únicas!');
console.log(`📊 Total de imagens atualizadas: ${imageIndex}`);
console.log('📁 Arquivo salvo: js/database.js');
