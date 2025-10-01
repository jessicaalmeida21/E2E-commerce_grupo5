const fs = require('fs');

// Carregar o banco de dados e a lista de produtos problemáticos
const { productsDatabase } = require('./js/database.js');
const problematicProducts = JSON.parse(fs.readFileSync('problematic-images-detailed.json', 'utf8'));

console.log('🎯 Corrigindo APENAS as imagens problemáticas...\n');
console.log(`📊 Produtos problemáticos encontrados: ${problematicProducts.length}`);

// Mapeamento inteligente de imagens por categoria e nome do produto
const getAppropriateImage = (productName, category) => {
    const name = productName.toLowerCase();
    
    // Smartphones - URLs específicas baseadas no nome
    if (category === 'Smartphones') {
        if (name.includes('iphone')) {
            const iphoneImages = [
                'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
                'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop',
                'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop'
            ];
            return iphoneImages[Math.floor(Math.random() * iphoneImages.length)];
        }
        if (name.includes('samsung')) {
            return 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop';
        }
        if (name.includes('google') || name.includes('pixel')) {
            return 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop';
        }
        if (name.includes('oneplus')) {
            return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop';
        }
        if (name.includes('motorola')) {
            return 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&h=400&fit=crop';
        }
        if (name.includes('sony')) {
            return 'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=400&h=400&fit=crop';
        }
        // Smartphone genérico
        return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop';
    }
    
    // Notebooks
    if (category === 'Notebooks') {
        if (name.includes('macbook') || name.includes('apple')) {
            return 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop';
        }
        if (name.includes('dell')) {
            return 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop';
        }
        if (name.includes('gaming') || name.includes('gamer')) {
            return 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=400&fit=crop';
        }
        // Notebook genérico
        return 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop';
    }
    
    // TVs
    if (category === 'TVs') {
        if (name.includes('smart')) {
            return 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop';
        }
        if (name.includes('4k')) {
            return 'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=400&h=400&fit=crop';
        }
        // TV genérica
        return 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop';
    }
    
    // Áudio
    if (category === 'Áudio') {
        if (name.includes('headphone') || name.includes('fone')) {
            return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop';
        }
        if (name.includes('speaker') || name.includes('caixa')) {
            return 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop';
        }
        // Áudio genérico
        return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop';
    }
    
    // Calçados
    if (category === 'Calçados') {
        if (name.includes('nike')) {
            return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop';
        }
        if (name.includes('adidas')) {
            return 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=400&fit=crop';
        }
        if (name.includes('social')) {
            return 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop';
        }
        // Tênis genérico
        return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop';
    }
    
    // Roupas
    if (category === 'Roupas') {
        if (name.includes('camiseta') || name.includes('camisa')) {
            return 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop';
        }
        if (name.includes('jeans') || name.includes('calça')) {
            return 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop';
        }
        if (name.includes('vestido')) {
            return 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop';
        }
        // Roupa genérica
        return 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop';
    }
    
    // Eletrodomésticos
    if (category === 'Eletrodomésticos') {
        if (name.includes('geladeira')) {
            return 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=400&fit=crop';
        }
        if (name.includes('micro-ondas') || name.includes('microondas')) {
            return 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop';
        }
        if (name.includes('fogão')) {
            return 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop';
        }
        // Eletrodoméstico genérico
        return 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=400&fit=crop';
    }
    
    // Esportes
    if (category === 'Esportes') {
        if (name.includes('bola')) {
            return 'https://images.unsplash.com/photo-1614632537190-23e4b2468c6d?w=400&h=400&fit=crop';
        }
        if (name.includes('bicicleta')) {
            return 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop';
        }
        // Esporte genérico
        return 'https://images.unsplash.com/photo-1614632537190-23e4b2468c6d?w=400&h=400&fit=crop';
    }
    
    // Monitores
    if (category === 'Monitores') {
        if (name.includes('gaming')) {
            return 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop';
        }
        if (name.includes('4k')) {
            return 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=400&fit=crop';
        }
        // Monitor genérico
        return 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop';
    }
    
    // Relógios
    if (category === 'Relógios') {
        if (name.includes('apple') || name.includes('smartwatch')) {
            return 'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=400&h=400&fit=crop';
        }
        if (name.includes('clássico') || name.includes('classico')) {
            return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop';
        }
        // Relógio genérico
        return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop';
    }
    
    // Fallback - imagem genérica
    return 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop';
};

// Aplicar correções apenas nos produtos problemáticos
let correctionsApplied = 0;
const correctionLog = [];

// Criar um mapa de IDs problemáticos para acesso rápido
const problematicIds = new Set(problematicProducts.map(p => p.id));

// Percorrer todas as categorias e produtos
Object.keys(productsDatabase).forEach(categoryKey => {
    productsDatabase[categoryKey].forEach((product, index) => {
        // Verificar se este produto está na lista de problemáticos
        if (problematicIds.has(product.id)) {
            const oldImage = product.image;
            const newImage = getAppropriateImage(product.title, product.category);
            
            // Aplicar a correção
            product.image = newImage;
            correctionsApplied++;
            
            correctionLog.push({
                id: product.id,
                name: product.title,
                category: product.category,
                oldImage: oldImage,
                newImage: newImage,
                timestamp: new Date().toISOString()
            });
            
            console.log(`✅ ${product.title} (${product.category})`);
            console.log(`   Antiga: ${oldImage.substring(0, 60)}...`);
            console.log(`   Nova: ${newImage.substring(0, 60)}...\n`);
        }
    });
});

// Salvar o banco de dados atualizado
const updatedDatabaseContent = `// Banco de Dados de Produtos - 500 Produtos Organizados por Categoria
const productsDatabase = ${JSON.stringify(productsDatabase, null, 4)};

// Exportar para uso em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { productsDatabase };
}`;

fs.writeFileSync('./js/database.js', updatedDatabaseContent);

// Salvar log das correções
fs.writeFileSync('selective-image-corrections-log.json', JSON.stringify(correctionLog, null, 2));

console.log(`\n🎉 Correção seletiva concluída!`);
console.log(`📊 Estatísticas:`);
console.log(`- Produtos problemáticos identificados: ${problematicProducts.length}`);
console.log(`- Correções aplicadas: ${correctionsApplied}`);
console.log(`- Produtos com imagens boas mantidos: ${500 - correctionsApplied}`);
console.log(`\n📁 Arquivos atualizados:`);
console.log(`- js/database.js (banco de dados com correções seletivas)`);
console.log(`- selective-image-corrections-log.json (log das correções)`);

console.log(`\n✅ Agora todas as 500 imagens devem estar apropriadas!`);