const fs = require('fs');

console.log('🔍 BUSCA DETALHADA POR PRODUTOS COM IMAGENS DE CADEIRA');
console.log('=====================================================');

// Ler database.js
const databaseContent = fs.readFileSync('./js/database.js', 'utf8');

// IDs das imagens de cadeira identificadas
const chairImageIds = [
    'photo-1586023492125-27b2c045efd7',
    'photo-1555041469-a586c61ea9bc', 
    'photo-1571068316344-75bc76f77890',
    'photo-1506439773649-6e0eb8cfb237',
    'photo-1434056886845-dac89ffe9b56'
];

console.log('🪑 Imagens de cadeira a serem procuradas:');
chairImageIds.forEach((id, index) => {
    console.log(`${index + 1}. ${id}`);
});

// Função para extrair produtos com imagens de cadeira
function findProductsWithChairImages() {
    const problematicProducts = [];
    
    // Dividir o arquivo em linhas para análise mais precisa
    const lines = databaseContent.split('\\n');
    
    let currentProduct = null;
    let inProduct = false;
    let braceCount = 0;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Detectar início de produto
        if (line.includes('"id":') && line.includes('PROD-')) {
            inProduct = true;
            braceCount = 0;
            currentProduct = {
                lineStart: i + 1,
                id: '',
                title: '',
                category: '',
                image: '',
                imageId: ''
            };
            
            // Extrair ID se estiver na mesma linha
            const idMatch = line.match(/"id":\\s*"([^"]+)"/);
            if (idMatch) {
                currentProduct.id = idMatch[1];
            }
        }
        
        if (inProduct) {
            // Contar chaves para saber quando o produto termina
            braceCount += (line.match(/\\{/g) || []).length;
            braceCount -= (line.match(/\\}/g) || []).length;
            
            // Extrair informações do produto
            if (line.includes('"title":')) {
                const titleMatch = line.match(/"title":\\s*"([^"]+)"/);
                if (titleMatch) {
                    currentProduct.title = titleMatch[1];
                }
            }
            
            if (line.includes('"category":')) {
                const categoryMatch = line.match(/"category":\\s*"([^"]+)"/);
                if (categoryMatch) {
                    currentProduct.category = categoryMatch[1];
                }
            }
            
            if (line.includes('"image":')) {
                const imageMatch = line.match(/"image":\\s*"([^"]+)"/);
                if (imageMatch) {
                    currentProduct.image = imageMatch[1];
                    currentProduct.imageId = imageMatch[1].split('/').pop().split('?')[0];
                }
            }
            
            // Verificar se o produto terminou
            if (braceCount <= 0 && currentProduct.id) {
                currentProduct.lineEnd = i + 1;
                
                // Verificar se este produto usa imagem de cadeira
                if (chairImageIds.includes(currentProduct.imageId)) {
                    problematicProducts.push({
                        ...currentProduct,
                        chairImageId: currentProduct.imageId,
                        isChairProduct: currentProduct.title.toLowerCase().includes('cadeira') || 
                                       currentProduct.title.toLowerCase().includes('mesa') ||
                                       currentProduct.title.toLowerCase().includes('móvel') ||
                                       currentProduct.category.toLowerCase().includes('móvel')
                    });
                }
                
                inProduct = false;
                currentProduct = null;
            }
        }
    }
    
    return problematicProducts;
}

// Executar busca
console.log('\\n🔍 Analisando produtos...');
const problematicProducts = findProductsWithChairImages();

console.log(`\\n📊 RESULTADOS ENCONTRADOS: ${problematicProducts.length} produtos`);
console.log('='.repeat(60));

if (problematicProducts.length > 0) {
    // Agrupar por imagem de cadeira
    const groupedByImage = {};
    chairImageIds.forEach(id => {
        groupedByImage[id] = problematicProducts.filter(p => p.chairImageId === id);
    });
    
    Object.keys(groupedByImage).forEach(imageId => {
        const products = groupedByImage[imageId];
        if (products.length > 0) {
            console.log(`\\n🪑 IMAGEM: ${imageId}`);
            console.log(`📊 Usada em ${products.length} produtos:`);
            
            products.forEach((product, index) => {
                const isCorrect = product.isChairProduct ? '✅ CORRETO' : '❌ INCORRETO';
                console.log(`${index + 1}. ${product.title} (${product.category}) - ${isCorrect}`);
                console.log(`   ID: ${product.id} | Linhas: ${product.lineStart}-${product.lineEnd}`);
            });
        }
    });
    
    // Estatísticas
    const incorrectProducts = problematicProducts.filter(p => !p.isChairProduct);
    const correctProducts = problematicProducts.filter(p => p.isChairProduct);
    
    console.log('\\n📈 ESTATÍSTICAS:');
    console.log('================');
    console.log(`🪑 Total de produtos com imagens de cadeira: ${problematicProducts.length}`);
    console.log(`✅ Produtos corretos (móveis/cadeiras): ${correctProducts.length}`);
    console.log(`❌ Produtos incorretos (não-móveis): ${incorrectProducts.length}`);
    
    if (incorrectProducts.length > 0) {
        console.log('\\n🔧 PRODUTOS QUE PRECISAM SER CORRIGIDOS:');
        console.log('========================================');
        incorrectProducts.forEach((product, index) => {
            console.log(`${index + 1}. ${product.title} (${product.category})`);
            console.log(`   Usando imagem: ${product.chairImageId}`);
            console.log(`   Localização: Linhas ${product.lineStart}-${product.lineEnd}`);
            console.log('');
        });
    }
    
    // Salvar relatório
    const report = {
        timestamp: new Date().toISOString(),
        totalProductsWithChairImages: problematicProducts.length,
        correctProducts: correctProducts.length,
        incorrectProducts: incorrectProducts.length,
        chairImagesUsage: {},
        productsToFix: incorrectProducts.map(p => ({
            id: p.id,
            title: p.title,
            category: p.category,
            chairImageId: p.chairImageId,
            lineStart: p.lineStart,
            lineEnd: p.lineEnd
        }))
    };
    
    chairImageIds.forEach(id => {
        const count = problematicProducts.filter(p => p.chairImageId === id).length;
        report.chairImagesUsage[id] = count;
    });
    
    fs.writeFileSync('chair-images-analysis.json', JSON.stringify(report, null, 2));
    console.log('📄 Relatório detalhado salvo em: chair-images-analysis.json');
    
} else {
    console.log('✅ Nenhum produto encontrado usando imagens de cadeira!');
}

console.log('\\n🎉 Análise completa finalizada!');