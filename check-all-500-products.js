const fs = require('fs');
const https = require('https');

console.log('🔍 VERIFICAÇÃO COMPLETA DOS 500 PRODUTOS');
console.log('========================================');

// Ler database.js
const databaseContent = fs.readFileSync('./js/database.js', 'utf8');

// Extrair todos os produtos com suas informações
function extractAllProducts() {
    const categories = ['smartphones', 'notebooks', 'televisoes', 'audio', 'calcados', 'roupas', 'eletrodomesticos', 'esportes', 'monitores', 'relogios'];
    const allProducts = [];
    
    categories.forEach(category => {
        const categoryRegex = new RegExp(`"${category}":\\s*\\[([\\s\\S]*?)\\](?=\\s*[,}])`, 'i');
        const categoryMatch = databaseContent.match(categoryRegex);
        
        if (categoryMatch) {
            const categoryContent = categoryMatch[1];
            // Regex mais robusta para capturar produtos completos
            const productRegex = /\\{[\\s\\S]*?"title":\\s*"([^"]+)"[\\s\\S]*?"image":\\s*"([^"]+)"[\\s\\S]*?"price":\\s*([\\d.]+)[\\s\\S]*?\\}/g;
            let match;
            
            while ((match = productRegex.exec(categoryContent)) !== null) {
                allProducts.push({
                    category: category,
                    title: match[1],
                    image: match[2],
                    price: parseFloat(match[3]),
                    imageId: match[2].split('/').pop().split('?')[0]
                });
            }
        }
    });
    
    return allProducts;
}

// Identificar imagens problemáticas
function identifyProblematicImages(products) {
    const problematicImages = [];
    
    // Imagens que são claramente cadeiras/móveis
    const chairImageIds = [
        'photo-1586023492125-27b2c045efd7', // cadeira
        'photo-1555041469-a586c61ea9bc', // cadeira
        'photo-1571068316344-75bc76f77890', // móvel
        'photo-1506439773649-6e0eb8cfb237', // móvel/decoração
        'photo-1434056886845-dac89ffe9b56'  // móvel
    ];
    
    products.forEach((product, index) => {
        const title = product.title.toLowerCase();
        const imageId = product.imageId;
        
        // Verificar se produto não é móvel/decoração mas tem imagem de cadeira
        const isNotFurniture = !title.includes('cadeira') && 
                              !title.includes('mesa') && 
                              !title.includes('sofá') && 
                              !title.includes('móvel') && 
                              !title.includes('decoração') &&
                              product.category !== 'eletrodomesticos';
        
        if (isNotFurniture && chairImageIds.includes(imageId)) {
            problematicImages.push({
                index: index + 1,
                category: product.category,
                title: product.title,
                image: product.image,
                imageId: imageId,
                issue: 'Produto não-móvel com imagem de cadeira/móvel'
            });
        }
        
        // Verificar outras incompatibilidades específicas
        if (title.includes('iphone') && !imageId.includes('1695048133142') && !imageId.includes('1574944985070')) {
            problematicImages.push({
                index: index + 1,
                category: product.category,
                title: product.title,
                image: product.image,
                imageId: imageId,
                issue: 'iPhone com imagem não-iPhone'
            });
        }
        
        if (title.includes('samsung') && title.includes('galaxy') && !title.includes('watch') && !imageId.includes('1610945265064')) {
            problematicImages.push({
                index: index + 1,
                category: product.category,
                title: product.title,
                image: product.image,
                imageId: imageId,
                issue: 'Samsung Galaxy com imagem incorreta'
            });
        }
        
        if (title.includes('macbook') && !imageId.includes('1517336714731') && !imageId.includes('1611186871348')) {
            problematicImages.push({
                index: index + 1,
                category: product.category,
                title: product.title,
                image: product.image,
                imageId: imageId,
                issue: 'MacBook com imagem incorreta'
            });
        }
        
        if (title.includes('tênis') && chairImageIds.includes(imageId)) {
            problematicImages.push({
                index: index + 1,
                category: product.category,
                title: product.title,
                image: product.image,
                imageId: imageId,
                issue: 'Tênis com imagem de cadeira'
            });
        }
        
        if (title.includes('tv') && chairImageIds.includes(imageId)) {
            problematicImages.push({
                index: index + 1,
                category: product.category,
                title: product.title,
                image: product.image,
                imageId: imageId,
                issue: 'TV com imagem de cadeira'
            });
        }
    });
    
    return problematicImages;
}

// Função para testar carregamento de imagem
function testImageUrl(url) {
    return new Promise((resolve) => {
        const timeout = setTimeout(() => {
            resolve({ url, status: 'timeout' });
        }, 10000);

        const req = https.get(url, (res) => {
            clearTimeout(timeout);
            resolve({ 
                url, 
                status: res.statusCode === 200 ? 'success' : 'error', 
                statusCode: res.statusCode 
            });
            res.destroy();
        });

        req.on('error', (error) => {
            clearTimeout(timeout);
            resolve({ url, status: 'error', error: error.message });
        });
    });
}

// Executar verificação completa
async function runCompleteCheck() {
    console.log('📊 Extraindo todos os produtos...');
    const allProducts = extractAllProducts();
    console.log(`✅ ${allProducts.length} produtos encontrados`);
    
    console.log('\\n🔍 Identificando imagens problemáticas...');
    const problematicImages = identifyProblematicImages(allProducts);
    
    if (problematicImages.length > 0) {
        console.log(`❌ ${problematicImages.length} produtos com imagens incorretas encontrados:`);
        console.log('='.repeat(60));
        
        problematicImages.forEach((item, index) => {
            console.log(`${index + 1}. ${item.title} (${item.category})`);
            console.log(`   Problema: ${item.issue}`);
            console.log(`   Imagem: ${item.imageId}`);
            console.log('');
        });
    } else {
        console.log('✅ Nenhuma imagem problemática encontrada!');
    }
    
    // Testar carregamento de imagens únicas
    console.log('\\n🔄 Testando carregamento das imagens...');
    const uniqueImages = [...new Set(allProducts.map(p => p.image))];
    console.log(`📊 Testando ${uniqueImages.length} imagens únicas...`);
    
    let loadingErrors = 0;
    const brokenImages = [];
    
    for (let i = 0; i < uniqueImages.length; i++) {
        const url = uniqueImages[i];
        const imageId = url.split('/').pop().split('?')[0];
        
        process.stdout.write(`[${i + 1}/${uniqueImages.length}] ${imageId}... `);
        
        const result = await testImageUrl(url);
        
        if (result.status === 'success') {
            console.log('✅');
        } else {
            console.log(`❌ ${result.error || result.statusCode}`);
            loadingErrors++;
            brokenImages.push({
                url: url,
                imageId: imageId,
                error: result.error || result.statusCode
            });
        }
    }
    
    // Relatório final
    console.log('\\n📊 RELATÓRIO FINAL:');
    console.log('===================');
    console.log(`📱 Total de produtos: ${allProducts.length}`);
    console.log(`🖼️  Imagens únicas: ${uniqueImages.length}`);
    console.log(`❌ Imagens com problemas de carregamento: ${loadingErrors}`);
    console.log(`🔧 Produtos com imagens incorretas: ${problematicImages.length}`);
    
    const successRate = ((uniqueImages.length - loadingErrors) / uniqueImages.length * 100).toFixed(1);
    console.log(`📈 Taxa de carregamento: ${successRate}%`);
    
    // Salvar relatório detalhado
    const report = {
        timestamp: new Date().toISOString(),
        totalProducts: allProducts.length,
        uniqueImages: uniqueImages.length,
        loadingErrors: loadingErrors,
        problematicImages: problematicImages.length,
        successRate: successRate,
        brokenImages: brokenImages,
        problematicImagesList: problematicImages,
        recommendations: []
    };
    
    if (problematicImages.length > 0) {
        report.recommendations.push('Corrigir imagens que não correspondem aos produtos');
        console.log('\\n🔧 AÇÕES NECESSÁRIAS:');
        console.log('- Substituir imagens de cadeiras em produtos não-móveis');
        console.log('- Corrigir correspondência nome-imagem');
    }
    
    if (loadingErrors > 0) {
        report.recommendations.push('Substituir imagens que não carregam');
        console.log('- Substituir imagens quebradas por alternativas funcionais');
    }
    
    if (problematicImages.length === 0 && loadingErrors === 0) {
        console.log('\\n🎉 TUDO PERFEITO! Todos os 500 produtos estão com imagens corretas e funcionais!');
    }
    
    fs.writeFileSync('complete-500-products-report.json', JSON.stringify(report, null, 2));
    console.log('\\n📄 Relatório completo salvo em: complete-500-products-report.json');
    
    return { problematicImages, brokenImages, allProducts };
}

// Executar
runCompleteCheck().catch(console.error);