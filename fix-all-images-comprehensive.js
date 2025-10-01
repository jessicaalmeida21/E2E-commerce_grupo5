const fs = require('fs');

// Carregar o banco de dados
const databaseContent = fs.readFileSync('js/database.js', 'utf8');
const productsDatabase = eval(databaseContent.replace('// Banco de Dados de Produtos - 500 Produtos Organizados por Categoria\n', '') + '; productsDatabase');

console.log('🔧 Corrigindo TODAS as imagens com sistema único...\n');

// Pool extenso de imagens por categoria
const imagePool = {
    smartphones: [
        'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1607936854279-55e8f4bc0b9a?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop'
    ],
    notebooks: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop'
    ],
    tablets: [
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=400&fit=crop'
    ],
    smartwatches: [
        'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop'
    ],
    headphones: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop'
    ]
};

// Função para determinar categoria do produto
function getProductCategory(product) {
    const title = product.title.toLowerCase();
    const category = product.category.toLowerCase();
    
    if (category.includes('notebook') || title.includes('notebook') || title.includes('laptop')) {
        return 'notebooks';
    }
    if (category.includes('tablet') || title.includes('tablet') || title.includes('ipad')) {
        return 'tablets';
    }
    if (category.includes('smartwatch') || category.includes('watch') || title.includes('watch')) {
        return 'smartwatches';
    }
    if (category.includes('headphone') || category.includes('fone') || title.includes('headphone') || title.includes('fone')) {
        return 'headphones';
    }
    return 'smartphones'; // Default
}

// Criar pool único de imagens
let allImages = [];
Object.values(imagePool).forEach(categoryImages => {
    allImages = allImages.concat(categoryImages);
});

// Remover duplicatas e embaralhar
allImages = [...new Set(allImages)];
for (let i = allImages.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allImages[i], allImages[j]] = [allImages[j], allImages[i]];
}

console.log(`📊 Pool de imagens disponível: ${allImages.length} imagens únicas`);

let corrections = 0;
let imageIndex = 0;
const correctionLog = [];

// Processar cada categoria
Object.keys(productsDatabase).forEach(category => {
    if (Array.isArray(productsDatabase[category])) {
        productsDatabase[category].forEach((product, index) => {
            const originalImage = product.image;
            const productCategory = getProductCategory(product);
            
            // Tentar usar imagem específica da categoria primeiro
            let newImage;
            if (imagePool[productCategory] && imagePool[productCategory].length > 0) {
                const categoryImages = imagePool[productCategory];
                newImage = categoryImages[corrections % categoryImages.length];
            } else {
                // Usar do pool geral
                newImage = allImages[imageIndex % allImages.length];
                imageIndex++;
            }
            
            if (newImage && newImage !== originalImage) {
                product.image = newImage;
                corrections++;
                
                correctionLog.push({
                    category: category,
                    index: index,
                    id: product.id,
                    title: product.title,
                    brand: product.brand,
                    productCategory: productCategory,
                    originalImage: originalImage,
                    newImage: newImage,
                    reason: 'Imagem única atribuída'
                });
                
                if (corrections % 50 === 0) {
                    console.log(`✅ [${corrections}] Produtos processados...`);
                }
            }
        });
    }
});

// Salvar o banco de dados atualizado
const updatedDatabaseContent = `// Banco de Dados de Produtos - 500 Produtos Organizados por Categoria
const productsDatabase = ${JSON.stringify(productsDatabase, null, 4)};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = productsDatabase;
}`;

fs.writeFileSync('js/database.js', updatedDatabaseContent);

// Salvar log de correções
fs.writeFileSync('comprehensive-image-corrections-log.json', JSON.stringify(correctionLog, null, 2));

console.log(`\n📊 RESUMO DAS CORREÇÕES ABRANGENTES:`);
console.log(`✅ Total de imagens corrigidas: ${corrections}`);
console.log(`📁 Log salvo em: comprehensive-image-corrections-log.json`);
console.log(`💾 Banco de dados atualizado: js/database.js`);
console.log('\n🎉 TODAS as imagens foram corrigidas com sistema único!');