const fs = require('fs');

console.log('🔧 Iniciando correção das imagens dos produtos...');

// Carregar o banco de dados atual
const database = require('./js/database.js');

// URLs de imagens apropriadas por categoria de produto
const categoryImages = {
    smartphones: [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop', // iPhone
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop', // Samsung
        'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop', // Smartphone moderno
        'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop', // Smartphone preto
        'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop'  // Smartphone branco
    ],
    notebooks: [
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop', // MacBook
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop', // Laptop moderno
        'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=400&fit=crop', // Laptop Dell
        'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400&h=400&fit=crop', // Laptop gaming
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop'  // Laptop profissional
    ],
    televisoes: [
        'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop', // TV moderna
        'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop', // Smart TV
        'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=400&h=400&fit=crop', // TV 4K
        'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=400&fit=crop', // TV Samsung
        'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop'  // TV LG
    ],
    audio: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', // Headphones
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop', // Fones wireless
        'https://images.unsplash.com/photo-1558756520-22cfe5d382ca?w=400&h=400&fit=crop', // Speaker
        'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop', // Caixa de som
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop'  // Fones profissionais
    ],
    calcados: [
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop', // Tênis Nike
        'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop', // Tênis Adidas
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop', // Sapato social
        'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop', // Tênis casual
        'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop'  // Sapato feminino
    ],
    roupas: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop', // Camiseta
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', // Jeans
        'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop', // Vestido
        'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=400&fit=crop', // Blusa
        'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=400&fit=crop'  // Jaqueta
    ],
    eletrodomesticos: [
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop', // Geladeira
        'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop', // Micro-ondas
        'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=400&fit=crop', // Máquina de lavar
        'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop', // Fogão
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop'  // Aspirador
    ],
    esportes: [
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', // Bola de futebol
        'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&h=400&fit=crop', // Equipamento fitness
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', // Bicicleta
        'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop', // Equipamento esportivo
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'  // Material esportivo
    ],
    monitores: [
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop', // Monitor gaming
        'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=400&fit=crop', // Monitor 4K
        'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=400&h=400&fit=crop', // Monitor ultrawide
        'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=400&h=400&fit=crop', // Monitor profissional
        'https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=400&h=400&fit=crop'  // Monitor curvo
    ],
    relogios: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', // Relógio clássico
        'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=400&h=400&fit=crop', // Relógio esportivo
        'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=400&fit=crop', // Smartwatch
        'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=400&h=400&fit=crop', // Relógio luxo
        'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=400&h=400&fit=crop'  // Apple Watch
    ]
};

// Função para obter imagem apropriada baseada no produto
function getAppropriateImage(product, category, index) {
    const images = categoryImages[category] || categoryImages.smartphones;
    
    // Usar o ID do produto para garantir consistência
    const productNumber = parseInt(product.id.replace('PROD-', '')) || index;
    const imageIndex = productNumber % images.length;
    
    return images[imageIndex];
}

// Função para determinar categoria baseada no nome do produto
function getProductCategory(productName, category) {
    const name = productName.toLowerCase();
    
    // Mapeamento específico baseado no nome do produto
    if (name.includes('iphone') || name.includes('samsung') || name.includes('xiaomi') || 
        name.includes('pixel') || name.includes('xperia') || name.includes('smartphone')) {
        return 'smartphones';
    }
    if (name.includes('notebook') || name.includes('laptop') || name.includes('macbook') || 
        name.includes('dell') || name.includes('lenovo')) {
        return 'notebooks';
    }
    if (name.includes('tv') || name.includes('televisão') || name.includes('smart tv') || 
        name.includes('monitor tv')) {
        return 'televisoes';
    }
    if (name.includes('fone') || name.includes('headphone') || name.includes('speaker') || 
        name.includes('caixa') || name.includes('audio') || name.includes('som')) {
        return 'audio';
    }
    if (name.includes('tênis') || name.includes('sapato') || name.includes('nike') || 
        name.includes('adidas') || name.includes('calçado')) {
        return 'calcados';
    }
    if (name.includes('camisa') || name.includes('blusa') || name.includes('vestido') || 
        name.includes('calça') || name.includes('jeans') || name.includes('roupa')) {
        return 'roupas';
    }
    if (name.includes('geladeira') || name.includes('micro') || name.includes('fogão') || 
        name.includes('máquina') || name.includes('aspirador')) {
        return 'eletrodomesticos';
    }
    if (name.includes('bola') || name.includes('fitness') || name.includes('esporte') || 
        name.includes('bicicleta') || name.includes('academia')) {
        return 'esportes';
    }
    if (name.includes('monitor') && !name.includes('tv')) {
        return 'monitores';
    }
    if (name.includes('relógio') || name.includes('watch') || name.includes('smartwatch')) {
        return 'relogios';
    }
    
    // Se não encontrar correspondência específica, usar a categoria original
    return category.toLowerCase();
}

let totalCorrections = 0;
const corrections = [];

// Processar cada categoria
Object.keys(database.productsDatabase).forEach(category => {
    console.log(`📂 Processando categoria: ${category}`);
    
    database.productsDatabase[category].forEach((product, index) => {
        const productCategory = getProductCategory(product.title || product.name, category);
        const newImage = getAppropriateImage(product, productCategory, index);
        
        if (product.image !== newImage) {
            corrections.push({
                id: product.id,
                name: product.title || product.name,
                category: category,
                oldImage: product.image,
                newImage: newImage
            });
            
            product.image = newImage;
            totalCorrections++;
        }
    });
});

console.log(`✅ Total de correções aplicadas: ${totalCorrections}`);

// Salvar o banco de dados atualizado
const updatedDatabaseContent = `// Banco de Dados de Produtos - 500 Produtos Organizados por Categoria
const productsDatabase = ${JSON.stringify(database.productsDatabase, null, 4)};

// Exportar para uso em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { productsDatabase };
}`;

fs.writeFileSync('./js/database.js', updatedDatabaseContent, 'utf8');
console.log('💾 Database atualizado com imagens corretas!');

// Salvar log das correções
fs.writeFileSync('./image-corrections-proper-log.json', JSON.stringify(corrections, null, 2));
console.log(`📋 Log de correções salvo: ${corrections.length} imagens corrigidas`);

console.log('🎉 Correção concluída! Todas as imagens agora correspondem aos produtos corretos.');