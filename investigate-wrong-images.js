// Investigação de produtos com imagens incorretas
const db = require('./js/database.js');

console.log('🔍 Investigando produtos com imagens incorretas...\n');

const products = db.getAllProducts();

// Função para detectar incompatibilidade entre nome e categoria
function detectMismatch(product) {
    const title = product.title.toLowerCase();
    const category = product.category.toLowerCase();
    
    // Palavras-chave por categoria
    const categoryKeywords = {
        'smartphones': ['phone', 'iphone', 'samsung', 'xiaomi', 'motorola', 'sony', 'pixel', 'galaxy', 'xperia', 'moto', 'celular', 'smartphone'],
        'notebooks': ['notebook', 'laptop', 'macbook', 'thinkpad', 'dell', 'hp', 'lenovo', 'asus', 'acer', 'gaming'],
        'televisões': ['tv', 'televisão', 'smart tv', 'oled', 'qled', 'led', 'samsung', 'lg', 'sony', 'tcl', 'hisense'],
        'áudio e som': ['headphone', 'fone', 'speaker', 'caixa', 'som', 'beats', 'jbl', 'sony', 'bose', 'audio'],
        'calçados': ['tênis', 'sapato', 'bota', 'sandália', 'chinelo', 'nike', 'adidas', 'puma', 'vans', 'converse'],
        'roupas': ['camisa', 'camiseta', 'blusa', 'calça', 'jeans', 'vestido', 'saia', 'shorts', 'polo', 'cropped'],
        'eletrodomésticos': ['geladeira', 'fogão', 'micro', 'lava', 'máquina', 'ar condicionado', 'ventilador'],
        'monitores': ['monitor', 'display', 'tela', 'gaming', 'ultrawide', 'curvo', '4k', 'full hd'],
        'relógios': ['relógio', 'watch', 'smartwatch', 'apple watch', 'galaxy watch', 'fitbit', 'garmin']
    };
    
    // Verificar se o título contém palavras da categoria correta
    const correctKeywords = categoryKeywords[category] || [];
    const hasCorrectKeyword = correctKeywords.some(keyword => title.includes(keyword));
    
    // Verificar se contém palavras de outras categorias
    let wrongCategory = null;
    for (const [cat, keywords] of Object.entries(categoryKeywords)) {
        if (cat !== category) {
            const hasWrongKeyword = keywords.some(keyword => title.includes(keyword));
            if (hasWrongKeyword) {
                wrongCategory = cat;
                break;
            }
        }
    }
    
    return {
        hasCorrectKeyword,
        wrongCategory,
        shouldBeCategory: wrongCategory
    };
}

// Analisar produtos problemáticos
const problematicProducts = [];
const categoryMismatches = [];

products.forEach((product, index) => {
    const analysis = detectMismatch(product);
    
    if (!analysis.hasCorrectKeyword || analysis.wrongCategory) {
        problematicProducts.push({
            index: index + 1,
            id: product.id,
            title: product.title,
            currentCategory: product.category,
            suggestedCategory: analysis.shouldBeCategory,
            hasCorrectKeyword: analysis.hasCorrectKeyword,
            image: product.image
        });
    }
    
    if (analysis.wrongCategory) {
        categoryMismatches.push({
            title: product.title,
            current: product.category,
            suggested: analysis.wrongCategory
        });
    }
});

console.log(`📊 Análise completa:`);
console.log(`   Total de produtos: ${products.length}`);
console.log(`   Produtos problemáticos: ${problematicProducts.length}`);
console.log(`   Incompatibilidades de categoria: ${categoryMismatches.length}\n`);

if (problematicProducts.length > 0) {
    console.log('🚨 PRODUTOS PROBLEMÁTICOS (primeiros 10):');
    problematicProducts.slice(0, 10).forEach(p => {
        console.log(`${p.index}. "${p.title}"`);
        console.log(`   Categoria atual: ${p.currentCategory}`);
        if (p.suggestedCategory) {
            console.log(`   Categoria sugerida: ${p.suggestedCategory}`);
        }
        console.log(`   Tem palavra-chave correta: ${p.hasCorrectKeyword ? '✅' : '❌'}`);
        console.log(`   Imagem: ${p.image ? p.image.substring(0, 50) + '...' : 'SEM IMAGEM'}`);
        console.log('');
    });
}

if (categoryMismatches.length > 0) {
    console.log('🔄 SUGESTÕES DE RECATEGORIZAÇÃO:');
    const suggestions = {};
    categoryMismatches.forEach(m => {
        const key = `${m.current} → ${m.suggested}`;
        suggestions[key] = (suggestions[key] || 0) + 1;
    });
    
    Object.entries(suggestions).forEach(([change, count]) => {
        console.log(`   ${change}: ${count} produtos`);
    });
}

// Salvar lista de produtos problemáticos
const fs = require('fs');
fs.writeFileSync('./problematic-products.json', JSON.stringify(problematicProducts, null, 2));
console.log('\n💾 Lista de produtos problemáticos salva em: problematic-products.json');