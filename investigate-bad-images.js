const fs = require('fs');

// Carregar o banco de dados
const { productsDatabase } = require('./js/database.js');

console.log('🔍 Investigando imagens problemáticas...\n');

// Converter o banco de dados em uma lista única de produtos
const allProducts = [];
Object.keys(productsDatabase).forEach(category => {
    productsDatabase[category].forEach(product => {
        allProducts.push({
            ...product,
            name: product.title // Usar title como name para compatibilidade
        });
    });
});

console.log(`📊 Total de produtos carregados: ${allProducts.length}\n`);

// Função para verificar se a imagem corresponde ao produto
function isImageAppropriate(product) {
    const productName = product.title || product.name || '';
    const imageUrl = product.image || '';
    
    // URLs problemáticas conhecidas que devem ser consideradas inadequadas
    const problematicUrls = [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop', // Smartphone genérico
        'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop', // Smartphone genérico
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop'  // iPhone genérico
    ];
    
    // Se a imagem está na lista de URLs problemáticas, verificar se o nome do produto justifica
    if (problematicUrls.includes(imageUrl)) {
        // Para produtos com nomes mistos (ex: "Apple Redmi Note"), considerar apropriado se:
        // 1. É um smartphone E
        // 2. A imagem é de smartphone E
        // 3. O produto tem pelo menos uma marca conhecida no nome
        
        const knownBrands = ['Apple', 'Samsung', 'Xiaomi', 'OnePlus', 'Google', 'Sony', 'LG', 'Huawei', 'Motorola', 'Nokia'];
        const hasKnownBrand = knownBrands.some(brand => productName.includes(brand));
        const isSmartphone = product.category === 'Smartphones' || productName.toLowerCase().includes('phone') || productName.toLowerCase().includes('smartphone');
        
        if (isSmartphone && hasKnownBrand) {
            // Para nomes mistos, considerar apropriado se a imagem é de smartphone
            return true; // Consideramos apropriado pois é um smartphone com marca conhecida
        }
        
        return false; // Outros casos com URLs problemáticas são inadequados
    }
    
    // Verificações específicas para casos realmente problemáticos
    
    // Produtos que claramente não correspondem à imagem
    if (productName.includes('Notebook') && imageUrl.includes('smartphone')) {
        return false;
    }
    
    if (productName.includes('TV') && imageUrl.includes('smartphone')) {
        return false;
    }
    
    // Se chegou até aqui, considerar apropriado
    return true;
}

// Analisar todos os produtos
const problematicProducts = [];
const goodProducts = [];

allProducts.forEach((product, index) => {
    const isGood = isImageAppropriate(product);
    
    if (!isGood) {
        problematicProducts.push({
            index: index,
            id: product.id,
            name: product.name,
            category: product.category,
            image: product.image,
            reason: 'Imagem não corresponde ao produto'
        });
    } else {
        goodProducts.push({
            index: index,
            id: product.id,
            name: product.name,
            category: product.category,
            image: product.image
        });
    }
});

console.log(`✅ Produtos com imagens BOAS: ${goodProducts.length}`);
console.log(`❌ Produtos com imagens PROBLEMÁTICAS: ${problematicProducts.length}\n`);

// Mostrar alguns exemplos de produtos problemáticos
console.log('📋 Exemplos de produtos com imagens problemáticas:');
problematicProducts.slice(0, 10).forEach(product => {
    console.log(`- ${product.name} (${product.category})`);
    console.log(`  Imagem atual: ${product.image}`);
    console.log(`  Motivo: ${product.reason}\n`);
});

// Salvar lista completa de produtos problemáticos
fs.writeFileSync('problematic-images-detailed.json', JSON.stringify(problematicProducts, null, 2));
fs.writeFileSync('good-images-list.json', JSON.stringify(goodProducts, null, 2));

console.log('📁 Arquivos salvos:');
console.log('- problematic-images-detailed.json (produtos com imagens ruins)');
console.log('- good-images-list.json (produtos com imagens boas)');

console.log(`\n📊 Resumo:`);
console.log(`Total de produtos: ${allProducts.length}`);
console.log(`Imagens boas: ${goodProducts.length} (${((goodProducts.length/allProducts.length)*100).toFixed(1)}%)`);
console.log(`Imagens problemáticas: ${problematicProducts.length} (${((problematicProducts.length/allProducts.length)*100).toFixed(1)}%)`);