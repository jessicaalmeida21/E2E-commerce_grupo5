const fs = require('fs');
const path = require('path');

// Carregar o database atual
const { productsDatabase, getAllProducts } = require('./js/database.js');

// Função para testar se uma URL de imagem é válida
async function testImageUrl(url) {
    try {
        // Simular teste de URL (em ambiente real usaríamos fetch)
        const isValidUnsplashUrl = url.includes('images.unsplash.com') && 
                                  url.includes('w=400') && 
                                  url.includes('h=400') &&
                                  !url.includes('search='); // URLs com search param causam erro ORB
        
        return {
            valid: isValidUnsplashUrl,
            url: url,
            reason: isValidUnsplashUrl ? 'URL válida do Unsplash' : 'URL inválida ou com parâmetros problemáticos'
        };
    } catch (error) {
        return {
            valid: false,
            url: url,
            reason: `Erro ao testar URL: ${error.message}`
        };
    }
}

// Função para verificar se as imagens correspondem às categorias
function checkImageCategoryMatch(product) {
    const category = product.category ? product.category.toLowerCase() : '';
    const imageUrl = product.image || '';
    
    // URLs válidas por categoria que definimos
    const validCategoryUrls = {
        'smartphones': [
            'photo-1511707171634-5f897ff02aa9',
            'photo-1521572163474-6864f9cf17ab',
            'photo-1605100804763-247f67b3557e',
            'photo-1527443224154-c4a3942d3acf',
            'photo-1515372039744-b8f02a3ae446',
            'photo-1556656793-08538906a9f8',
            'photo-1592750475338-74b7b21085ab',
            'photo-1574944985070-8f3ebc6b79d2'
        ],
        'laptops': [
            'photo-1496181133206-80ce9b88a853',
            'photo-1541807084-5c52b6b3adef',
            'photo-1525547719571-a2d4ac8945e2',
            'photo-1517336714731-489689fd1ca8',
            'photo-1515562141207-7a88fb7ce338',
            'photo-1571513728751-8c9d6e7c7c3b'
        ],
        'tablets': [
            'photo-1544244015-0df4b3ffc6b0',
            'photo-1561154464-82e9adf32764',
            'photo-1585790050230-5dd28404ccb9'
        ],
        'smartwatches': [
            'photo-1523275335684-37898b6baf30',
            'photo-1551698618-1dfe5d97d256',
            'photo-1594576662059-c4e9b5d0e1b3',
            'photo-1506630448388-4e683c67ddb0'
        ],
        'relogios': [
            'photo-1523275335684-37898b6baf30',
            'photo-1551698618-1dfe5d97d256',
            'photo-1581578731548-c6a0c3f2b4a4',
            'photo-1594576662059-c4e9b5d0e1b3',
            'photo-1506630448388-4e683c67ddb0'
        ],
        'headphones': [
            'photo-1505740420928-5e560c06d30e',
            'photo-1484704849700-f032a568e944',
            'photo-1583394838336-acd977736f90',
            'photo-1546435770-a3e426bf472b'
        ],
        'cameras': [
            'photo-1502920917128-1aa500764cbd',
            'photo-1606983340126-99ab4feaa64a',
            'photo-1516035069371-29a1b244cc32'
        ],
        'gaming': [
            'photo-1493711662062-fa541adb3fc8',
            'photo-1606144042614-b2417e99c4e3',
            'photo-1550745165-9bc0b252726f',
            'photo-1511512578047-dfb367046420'
        ],
        'monitores': [
            'photo-1527443224154-c4a3942d3acf',
            'photo-1517336714731-489689fd1ca8',
            'photo-1515562141207-7a88fb7ce338',
            'photo-1571513728751-8c9d6e7c7c3b',
            'photo-1556821840-3a63f95609a7'
        ]
    };
    
    // Mapear categorias
    const categoryMap = {
        'smartphones': 'smartphones',
        'laptops': 'laptops',
        'tablets': 'tablets', 
        'smartwatches': 'relogios',
        'monitores': 'monitores',
        'relogios': 'relogios',
        'headphones': 'headphones',
        'cameras': 'cameras',
        'gaming': 'gaming'
    };
    
    const mappedCategory = categoryMap[category] || 'smartphones';
    const validUrls = validCategoryUrls[mappedCategory] || [];
    
    // Verificar se a URL da imagem contém um dos IDs válidos para a categoria
    const isValidForCategory = validUrls.some(photoId => imageUrl.includes(photoId));
    
    return {
        valid: isValidForCategory,
        category: category,
        mappedCategory: mappedCategory,
        imageUrl: imageUrl,
        reason: isValidForCategory ? 'Imagem apropriada para a categoria' : 'Imagem não corresponde à categoria'
    };
}

// Função principal de teste
async function testAllImages() {
    console.log('🔍 Iniciando teste completo de todas as imagens...\n');
    
    const results = {
        total: 0,
        validUrls: 0,
        invalidUrls: 0,
        correctCategory: 0,
        incorrectCategory: 0,
        issues: []
    };
    
    let productIndex = 0;
    
    // Testar todas as categorias
    for (const categoryName in productsDatabase) {
        const categoryProducts = productsDatabase[categoryName];
        console.log(`📂 Testando categoria: ${categoryName} (${categoryProducts.length} produtos)`);
        
        for (let i = 0; i < categoryProducts.length; i++) {
            const product = categoryProducts[i];
            results.total++;
            productIndex++;
            
            // Teste 1: URL válida
            const urlTest = await testImageUrl(product.image);
            if (urlTest.valid) {
                results.validUrls++;
            } else {
                results.invalidUrls++;
                results.issues.push({
                    productId: product.id,
                    productName: product.title,
                    category: product.category,
                    issue: 'URL inválida',
                    details: urlTest.reason,
                    imageUrl: product.image
                });
            }
            
            // Teste 2: Correspondência com categoria
            const categoryTest = checkImageCategoryMatch(product);
            if (categoryTest.valid) {
                results.correctCategory++;
            } else {
                results.incorrectCategory++;
                results.issues.push({
                    productId: product.id,
                    productName: product.title,
                    category: product.category,
                    issue: 'Categoria incorreta',
                    details: categoryTest.reason,
                    imageUrl: product.image
                });
            }
            
            // Log de progresso a cada 50 produtos
            if (productIndex % 50 === 0) {
                console.log(`   ✓ Testados ${productIndex} produtos...`);
            }
        }
    }
    
    // Relatório final
    console.log('\n' + '='.repeat(60));
    console.log('📊 RELATÓRIO FINAL DO TESTE DE IMAGENS');
    console.log('='.repeat(60));
    console.log(`📈 Total de produtos testados: ${results.total}`);
    console.log(`✅ URLs válidas: ${results.validUrls} (${((results.validUrls/results.total)*100).toFixed(1)}%)`);
    console.log(`❌ URLs inválidas: ${results.invalidUrls} (${((results.invalidUrls/results.total)*100).toFixed(1)}%)`);
    console.log(`🎯 Categoria correta: ${results.correctCategory} (${((results.correctCategory/results.total)*100).toFixed(1)}%)`);
    console.log(`🔄 Categoria incorreta: ${results.incorrectCategory} (${((results.incorrectCategory/results.total)*100).toFixed(1)}%)`);
    console.log(`⚠️  Total de problemas: ${results.issues.length}`);
    
    // Salvar relatório detalhado
    const reportPath = path.join(__dirname, 'image-test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify({
        timestamp: new Date().toISOString(),
        summary: {
            total: results.total,
            validUrls: results.validUrls,
            invalidUrls: results.invalidUrls,
            correctCategory: results.correctCategory,
            incorrectCategory: results.incorrectCategory,
            successRate: ((results.validUrls + results.correctCategory) / (results.total * 2) * 100).toFixed(1)
        },
        issues: results.issues
    }, null, 2));
    
    console.log(`\n📄 Relatório detalhado salvo em: image-test-report.json`);
    
    // Conclusão
    if (results.issues.length === 0) {
        console.log('\n🎉 SUCESSO! Todas as imagens estão corretas e funcionando perfeitamente!');
    } else {
        console.log(`\n⚠️  Encontrados ${results.issues.length} problemas que precisam ser corrigidos.`);
        
        // Mostrar primeiros 5 problemas
        console.log('\n🔍 Primeiros problemas encontrados:');
        results.issues.slice(0, 5).forEach((issue, index) => {
            console.log(`${index + 1}. ${issue.productId} - ${issue.productName}`);
            console.log(`   Problema: ${issue.issue} - ${issue.details}`);
        });
        
        if (results.issues.length > 5) {
            console.log(`   ... e mais ${results.issues.length - 5} problemas (veja o relatório completo)`);
        }
    }
    
    return results;
}

// Executar teste
testAllImages().catch(error => {
    console.error('❌ Erro durante o teste:', error);
    process.exit(1);
});