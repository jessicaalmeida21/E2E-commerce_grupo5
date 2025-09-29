// Script para gerar 500 URLs de imagens do Unsplash para os produtos da API
const fs = require('fs');

// URLs base do Unsplash para diferentes categorias
const imageCategories = {
    electronics: [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // smartphone
        'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // notebook
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // TV
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // fone
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // monitor
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // relógio
        'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // liquidificador
        'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // air fryer
        'https://images.unsplash.com/photo-1581578731548-c6a0c3f2b4a4?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // aspirador
    ],
    jewelry: [
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // anel
        'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // colar
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // brinco
        'https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // pulseira
    ],
    "men's clothing": [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // camiseta
        'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // calça
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // jaqueta
        'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // terno
    ],
    "women's clothing": [
        'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // vestido
        'https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // blusa
        'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // saia
        'https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80', // bolsa
    ]
};

// Gerar 500 URLs de imagens
const allImages = [];
let imageIndex = 0;

// Gerar 500 imagens distribuindo entre as categorias
for (let i = 0; i < 500; i++) {
    const categoryKeys = Object.keys(imageCategories);
    const randomCategory = categoryKeys[imageIndex % categoryKeys.length];
    const categoryImages = imageCategories[randomCategory];
    const randomImage = categoryImages[Math.floor(Math.random() * categoryImages.length)];
    
    allImages.push(randomImage);
    imageIndex++;
}

// Criar um objeto com todas as imagens indexadas
const imageDatabase = {};
allImages.forEach((url, index) => {
    imageDatabase[`image_${index + 1}`] = url;
});

// Salvar em arquivo JSON
fs.writeFileSync('500-images-database.json', JSON.stringify(imageDatabase, null, 2));

console.log('✅ 500 URLs de imagens do Unsplash geradas com sucesso!');
console.log('📁 Arquivo salvo: 500-images-database.json');
console.log('📊 Total de imagens: 500');
