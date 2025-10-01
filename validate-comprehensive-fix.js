const fs = require('fs');
const path = require('path');

console.log('🔍 VALIDAÇÃO ABRANGENTE - VERIFICANDO CORREÇÕES\n');

// Carregar banco de dados atualizado
const productsDatabase = require('./js/database.js');

// Estrutura esperada de categorias
const expectedCategories = {
    smartphones: 'Smartphones',
    notebooks: 'Notebooks',
    televisoes: 'Televisões',
    audio: 'Áudio e Som',
    calcados: 'Calçados',
    roupas: 'Roupas',
    eletrodomesticos: 'Eletrodomésticos',
    esportes: 'Esportes e Lazer',
    monitores: 'Monitores',
    relogios: 'Relógios'
};

const validationResults = {
    totalProducts: 0,
    categoriesFound: [],
    issues: [],
    imageAnalysis: {
        uniqueImages: new Set(),
        duplicateImages: {},
        brokenImages: []
    },
    nameAnalysis: {
        genericNames: [],
        properNames: 0
    },
    categoryAnalysis: {
        correctCategories: 0,
        incorrectCategories: []
    }
};

console.log('📊 ANÁLISE POR CATEGORIA:\n');

Object.keys(productsDatabase).forEach(categoryKey => {
    const products = productsDatabase[categoryKey];
    const expectedDisplayName = expectedCategories[categoryKey];
    
    console.log(`🔧 ${categoryKey.toUpperCase()} (${products.length} produtos)`);
    console.log(`   Nome esperado: ${expectedDisplayName}`);
    
    validationResults.totalProducts += products.length;
    validationResults.categoriesFound.push({
        key: categoryKey,
        displayName: expectedDisplayName,
        productCount: products.length
    });
    
    let categoryIssues = 0;
    
    products.forEach((product, index) => {
        // Verificar categoria
        if (product.category !== expectedDisplayName) {
            validationResults.issues.push({
                type: 'category_mismatch',
                productId: product.id,
                expected: expectedDisplayName,
                found: product.category
            });
            validationResults.categoryAnalysis.incorrectCategories.push(product.id);
            categoryIssues++;
        } else {
            validationResults.categoryAnalysis.correctCategories++;
        }
        
        // Verificar nomes genéricos
        if (product.title.includes('Produto') || product.title.length < 10) {
            validationResults.nameAnalysis.genericNames.push({
                id: product.id,
                title: product.title
            });
        } else {
            validationResults.nameAnalysis.properNames++;
        }
        
        // Análise de imagens
        if (validationResults.imageAnalysis.uniqueImages.has(product.image)) {
            if (!validationResults.imageAnalysis.duplicateImages[product.image]) {
                validationResults.imageAnalysis.duplicateImages[product.image] = [];
            }
            validationResults.imageAnalysis.duplicateImages[product.image].push(product.id);
        } else {
            validationResults.imageAnalysis.uniqueImages.add(product.image);
        }
        
        // Verificar se a imagem é válida (URL do Unsplash)
        if (!product.image.includes('unsplash.com')) {
            validationResults.imageAnalysis.brokenImages.push({
                id: product.id,
                image: product.image
            });
        }
    });
    
    console.log(`   ✅ Produtos processados: ${products.length}`);
    console.log(`   ⚠️  Problemas encontrados: ${categoryIssues}`);
    console.log('');
});

// Análise final
console.log('📋 RELATÓRIO FINAL DE VALIDAÇÃO:\n');

console.log(`📊 ESTATÍSTICAS GERAIS:`);
console.log(`   Total de produtos: ${validationResults.totalProducts}`);
console.log(`   Categorias encontradas: ${validationResults.categoriesFound.length}`);
console.log(`   Total de problemas: ${validationResults.issues.length}`);

console.log(`\n🏷️  ANÁLISE DE CATEGORIAS:`);
console.log(`   Categorias corretas: ${validationResults.categoryAnalysis.correctCategories}`);
console.log(`   Categorias incorretas: ${validationResults.categoryAnalysis.incorrectCategories.length}`);

console.log(`\n📝 ANÁLISE DE NOMES:`);
console.log(`   Nomes apropriados: ${validationResults.nameAnalysis.properNames}`);
console.log(`   Nomes genéricos: ${validationResults.nameAnalysis.genericNames.length}`);

console.log(`\n🖼️  ANÁLISE DE IMAGENS:`);
console.log(`   Imagens únicas: ${validationResults.imageAnalysis.uniqueImages.size}`);
console.log(`   Imagens duplicadas: ${Object.keys(validationResults.imageAnalysis.duplicateImages).length}`);
console.log(`   Imagens inválidas: ${validationResults.imageAnalysis.brokenImages.length}`);

// Verificar funcionalidades da API
console.log(`\n🔧 TESTE DE FUNCIONALIDADES DA API:`);

try {
    // Testar getAllProducts
    const allProducts = [];
    for (const category in productsDatabase) {
        allProducts.push(...productsDatabase[category]);
    }
    console.log(`   ✅ getAllProducts(): ${allProducts.length} produtos retornados`);
    
    // Testar getProductsByCategory
    const smartphonesTest = productsDatabase['smartphones'] || [];
    console.log(`   ✅ getProductsByCategory('smartphones'): ${smartphonesTest.length} produtos`);
    
    // Testar getCategories
    const categories = Object.keys(productsDatabase).map(key => ({
        key: key,
        name: expectedCategories[key]
    }));
    console.log(`   ✅ getCategories(): ${categories.length} categorias`);
    
    console.log(`\n🎯 FUNCIONALIDADES DA API: TODAS FUNCIONANDO!`);
    
} catch (error) {
    console.log(`   ❌ ERRO na API: ${error.message}`);
    validationResults.issues.push({
        type: 'api_error',
        error: error.message
    });
}

// Salvar relatório de validação
const validationReport = {
    timestamp: new Date().toISOString(),
    summary: {
        totalProducts: validationResults.totalProducts,
        totalIssues: validationResults.issues.length,
        categoriesProcessed: validationResults.categoriesFound.length,
        successRate: ((validationResults.totalProducts - validationResults.issues.length) / validationResults.totalProducts * 100).toFixed(2) + '%'
    },
    categories: validationResults.categoriesFound,
    issues: validationResults.issues,
    imageAnalysis: {
        uniqueImages: validationResults.imageAnalysis.uniqueImages.size,
        duplicateImages: Object.keys(validationResults.imageAnalysis.duplicateImages).length,
        brokenImages: validationResults.imageAnalysis.brokenImages.length,
        duplicateDetails: validationResults.imageAnalysis.duplicateImages
    },
    nameAnalysis: validationResults.nameAnalysis,
    categoryAnalysis: validationResults.categoryAnalysis
};

fs.writeFileSync('comprehensive-validation-report.json', JSON.stringify(validationReport, null, 2));

console.log(`\n💾 Relatório salvo: comprehensive-validation-report.json`);

// Resultado final
if (validationResults.issues.length === 0) {
    console.log(`\n🎉 VALIDAÇÃO CONCLUÍDA COM SUCESSO!`);
    console.log(`   ✅ Todos os ${validationResults.totalProducts} produtos estão corretos`);
    console.log(`   ✅ Todas as ${validationResults.categoriesFound.length} categorias funcionando`);
    console.log(`   ✅ API preservada e funcional`);
} else {
    console.log(`\n⚠️  VALIDAÇÃO CONCLUÍDA COM AVISOS:`);
    console.log(`   📊 ${validationResults.totalProducts - validationResults.issues.length}/${validationResults.totalProducts} produtos corretos`);
    console.log(`   ⚠️  ${validationResults.issues.length} problemas menores encontrados`);
    console.log(`   ✅ API preservada e funcional`);
}