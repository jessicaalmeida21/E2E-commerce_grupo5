const fs = require('fs');
const path = require('path');

console.log('🔍 INVESTIGAÇÃO DE ERROS - NOMES E IMAGENS\n');

// Carregar banco de dados atual
const productsDatabase = require('./js/database.js');

const investigation = {
    totalProducts: 0,
    errorsByCategory: {},
    nameImageMismatches: [],
    genericNames: [],
    brokenImages: [],
    duplicateImages: {},
    categoryProblems: []
};

console.log('📊 ANÁLISE DETALHADA POR CATEGORIA:\n');

Object.keys(productsDatabase).forEach(categoryKey => {
    const products = productsDatabase[categoryKey];
    const categoryErrors = {
        nameProblems: [],
        imageProblems: [],
        mismatches: []
    };
    
    console.log(`🔧 ${categoryKey.toUpperCase()} (${products.length} produtos)`);
    
    investigation.totalProducts += products.length;
    
    products.forEach((product, index) => {
        // Verificar nomes genéricos ou problemáticos
        if (product.title.includes('Produto') || 
            product.title.includes('Item') || 
            product.title.length < 10 ||
            !product.brand ||
            product.title === product.brand) {
            categoryErrors.nameProblems.push({
                id: product.id,
                title: product.title,
                brand: product.brand,
                issue: 'Nome genérico ou incompleto'
            });
            investigation.genericNames.push({
                id: product.id,
                category: categoryKey,
                title: product.title,
                brand: product.brand
            });
        }
        
        // Verificar imagens problemáticas
        if (!product.image || 
            product.image.includes('placeholder') ||
            product.image.includes('example') ||
            !product.image.includes('unsplash.com')) {
            categoryErrors.imageProblems.push({
                id: product.id,
                image: product.image,
                issue: 'Imagem inválida ou placeholder'
            });
            investigation.brokenImages.push({
                id: product.id,
                category: categoryKey,
                image: product.image
            });
        }
        
        // Verificar correspondência nome-imagem
        const productType = categoryKey.toLowerCase();
        let expectedImageKeywords = [];
        
        switch (productType) {
            case 'smartphones':
                expectedImageKeywords = ['phone', 'mobile', 'smartphone', 'iphone', 'android'];
                break;
            case 'notebooks':
                expectedImageKeywords = ['laptop', 'notebook', 'computer', 'macbook'];
                break;
            case 'televisoes':
                expectedImageKeywords = ['tv', 'television', 'screen', 'display'];
                break;
            case 'audio':
                expectedImageKeywords = ['headphone', 'speaker', 'audio', 'sound'];
                break;
            case 'calcados':
                expectedImageKeywords = ['shoe', 'sneaker', 'boot', 'footwear'];
                break;
            case 'roupas':
                expectedImageKeywords = ['clothing', 'shirt', 'dress', 'fashion'];
                break;
            case 'eletrodomesticos':
                expectedImageKeywords = ['appliance', 'kitchen', 'home'];
                break;
            case 'esportes':
                expectedImageKeywords = ['sport', 'fitness', 'exercise', 'gym'];
                break;
            case 'monitores':
                expectedImageKeywords = ['monitor', 'screen', 'display', 'computer'];
                break;
            case 'relogios':
                expectedImageKeywords = ['watch', 'clock', 'time'];
                break;
        }
        
        const imageMatchesCategory = expectedImageKeywords.some(keyword => 
            product.image.toLowerCase().includes(keyword)
        );
        
        if (!imageMatchesCategory && product.image.includes('unsplash.com')) {
            categoryErrors.mismatches.push({
                id: product.id,
                title: product.title,
                image: product.image,
                expectedKeywords: expectedImageKeywords,
                issue: 'Imagem não corresponde à categoria'
            });
            investigation.nameImageMismatches.push({
                id: product.id,
                category: categoryKey,
                title: product.title,
                image: product.image,
                expectedKeywords: expectedImageKeywords
            });
        }
        
        // Verificar imagens duplicadas
        if (investigation.duplicateImages[product.image]) {
            investigation.duplicateImages[product.image].push({
                id: product.id,
                category: categoryKey,
                title: product.title
            });
        } else {
            investigation.duplicateImages[product.image] = [{
                id: product.id,
                category: categoryKey,
                title: product.title
            }];
        }
    });
    
    investigation.errorsByCategory[categoryKey] = categoryErrors;
    
    const totalCategoryErrors = categoryErrors.nameProblems.length + 
                               categoryErrors.imageProblems.length + 
                               categoryErrors.mismatches.length;
    
    console.log(`   📝 Problemas de nome: ${categoryErrors.nameProblems.length}`);
    console.log(`   🖼️  Problemas de imagem: ${categoryErrors.imageProblems.length}`);
    console.log(`   🔗 Incompatibilidades nome-imagem: ${categoryErrors.mismatches.length}`);
    console.log(`   ⚠️  Total de erros: ${totalCategoryErrors}\n`);
});

// Filtrar apenas imagens realmente duplicadas
const realDuplicates = {};
Object.keys(investigation.duplicateImages).forEach(imageUrl => {
    if (investigation.duplicateImages[imageUrl].length > 1) {
        realDuplicates[imageUrl] = investigation.duplicateImages[imageUrl];
    }
});
investigation.duplicateImages = realDuplicates;

console.log('📋 RESUMO GERAL DOS PROBLEMAS:\n');
console.log(`📊 Total de produtos analisados: ${investigation.totalProducts}`);
console.log(`📝 Nomes genéricos/problemáticos: ${investigation.genericNames.length}`);
console.log(`🖼️  Imagens quebradas/inválidas: ${investigation.brokenImages.length}`);
console.log(`🔗 Incompatibilidades nome-imagem: ${investigation.nameImageMismatches.length}`);
console.log(`🔄 Imagens duplicadas: ${Object.keys(investigation.duplicateImages).length}`);

// Mostrar exemplos dos problemas mais críticos
if (investigation.nameImageMismatches.length > 0) {
    console.log(`\n🚨 EXEMPLOS DE INCOMPATIBILIDADES CRÍTICAS:`);
    investigation.nameImageMismatches.slice(0, 5).forEach((mismatch, index) => {
        console.log(`   ${index + 1}. ID: ${mismatch.id}`);
        console.log(`      Categoria: ${mismatch.category}`);
        console.log(`      Nome: ${mismatch.title}`);
        console.log(`      Imagem: ${mismatch.image}`);
        console.log(`      Esperado: palavras-chave relacionadas a ${mismatch.expectedKeywords.join(', ')}\n`);
    });
}

// Salvar relatório detalhado
const reportData = {
    timestamp: new Date().toISOString(),
    summary: {
        totalProducts: investigation.totalProducts,
        totalErrors: investigation.genericNames.length + 
                    investigation.brokenImages.length + 
                    investigation.nameImageMismatches.length,
        genericNames: investigation.genericNames.length,
        brokenImages: investigation.brokenImages.length,
        nameImageMismatches: investigation.nameImageMismatches.length,
        duplicateImages: Object.keys(investigation.duplicateImages).length
    },
    detailedAnalysis: {
        errorsByCategory: investigation.errorsByCategory,
        genericNames: investigation.genericNames,
        brokenImages: investigation.brokenImages,
        nameImageMismatches: investigation.nameImageMismatches,
        duplicateImages: investigation.duplicateImages
    }
};

fs.writeFileSync('name-image-errors-investigation.json', JSON.stringify(reportData, null, 2));

console.log(`\n💾 Relatório detalhado salvo: name-image-errors-investigation.json`);

// Determinar prioridades de correção
const totalErrors = investigation.genericNames.length + 
                   investigation.brokenImages.length + 
                   investigation.nameImageMismatches.length;

if (totalErrors > 0) {
    console.log(`\n🎯 PRIORIDADES DE CORREÇÃO:`);
    console.log(`   1. Corrigir ${investigation.genericNames.length} nomes genéricos`);
    console.log(`   2. Substituir ${investigation.brokenImages.length} imagens inválidas`);
    console.log(`   3. Alinhar ${investigation.nameImageMismatches.length} incompatibilidades nome-imagem`);
    console.log(`   4. Resolver ${Object.keys(investigation.duplicateImages).length} duplicatas de imagem`);
    console.log(`\n⚠️  CORREÇÃO COMPLETA NECESSÁRIA!`);
} else {
    console.log(`\n✅ NENHUM ERRO CRÍTICO ENCONTRADO!`);
}