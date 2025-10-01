const fs = require('fs');
const path = require('path');

// Carregar banco de dados
const databasePath = path.join(__dirname, 'js', 'database.js');
const databaseContent = fs.readFileSync(databasePath, 'utf8');

// Extrair dados do banco
const productsDatabase = require('./js/database.js');

console.log('🔍 ANÁLISE COMPLETA DOS PRODUTOS E CATEGORIAS\n');

// 1. Análise das categorias
console.log('📊 ESTRUTURA DAS CATEGORIAS:');
const categories = Object.keys(productsDatabase);
categories.forEach(category => {
    const products = productsDatabase[category];
    console.log(`  ${category}: ${products.length} produtos`);
});

console.log('\n🔍 PROBLEMAS IDENTIFICADOS:\n');

// 2. Análise dos nomes dos produtos
const productNameIssues = [];
const brandIssues = [];
const categoryMismatches = [];
const duplicateNames = [];
const nameMap = new Map();

let totalProducts = 0;

categories.forEach(categoryKey => {
    const products = productsDatabase[categoryKey];
    totalProducts += products.length;
    
    products.forEach(product => {
        // Verificar nomes duplicados
        if (nameMap.has(product.title)) {
            duplicateNames.push({
                name: product.title,
                ids: [nameMap.get(product.title), product.id],
                category: categoryKey
            });
        } else {
            nameMap.set(product.title, product.id);
        }
        
        // Verificar inconsistências nos nomes
        const title = product.title.toLowerCase();
        const brand = product.brand.toLowerCase();
        const category = product.category;
        
        // Problemas nos nomes
        if (title.includes('lite') && !title.includes(brand)) {
            productNameIssues.push({
                id: product.id,
                title: product.title,
                brand: product.brand,
                issue: 'Nome genérico com "Lite" sem marca específica',
                category: categoryKey
            });
        }
        
        if (title.includes('fe') && !title.includes(brand)) {
            productNameIssues.push({
                id: product.id,
                title: product.title,
                brand: product.brand,
                issue: 'Nome genérico com "FE" sem marca específica',
                category: categoryKey
            });
        }
        
        // Verificar se a marca no nome corresponde à marca do produto
        if (!title.includes(brand) && brand !== 'genérico') {
            brandIssues.push({
                id: product.id,
                title: product.title,
                brand: product.brand,
                issue: 'Marca no título não corresponde à marca do produto',
                category: categoryKey
            });
        }
        
        // Verificar se a categoria do produto corresponde à seção
        const expectedCategory = getCategoryDisplayName(categoryKey);
        if (category !== expectedCategory) {
            categoryMismatches.push({
                id: product.id,
                title: product.title,
                expectedCategory: expectedCategory,
                actualCategory: category,
                section: categoryKey
            });
        }
    });
});

// Função para obter nome de exibição da categoria
function getCategoryDisplayName(key) {
    const displayNames = {
        'smartphones': 'Smartphones',
        'notebooks': 'Notebooks',
        'televisoes': 'Televisões',
        'audio': 'Áudio e Som',
        'calcados': 'Calçados',
        'roupas': 'Roupas',
        'eletrodomesticos': 'Eletrodomésticos',
        'esportes': 'Esportes e Lazer',
        'monitores': 'Monitores',
        'relogios': 'Relógios'
    };
    return displayNames[key] || key.charAt(0).toUpperCase() + key.slice(1);
}

// Relatório de problemas
console.log(`1. NOMES GENÉRICOS/PROBLEMÁTICOS: ${productNameIssues.length} produtos`);
if (productNameIssues.length > 0) {
    productNameIssues.slice(0, 10).forEach(issue => {
        console.log(`   - ${issue.id}: "${issue.title}" (${issue.brand}) - ${issue.issue}`);
    });
    if (productNameIssues.length > 10) {
        console.log(`   ... e mais ${productNameIssues.length - 10} produtos`);
    }
}

console.log(`\n2. INCONSISTÊNCIAS DE MARCA: ${brandIssues.length} produtos`);
if (brandIssues.length > 0) {
    brandIssues.slice(0, 10).forEach(issue => {
        console.log(`   - ${issue.id}: "${issue.title}" (marca: ${issue.brand})`);
    });
    if (brandIssues.length > 10) {
        console.log(`   ... e mais ${brandIssues.length - 10} produtos`);
    }
}

console.log(`\n3. CATEGORIAS INCORRETAS: ${categoryMismatches.length} produtos`);
if (categoryMismatches.length > 0) {
    categoryMismatches.slice(0, 10).forEach(issue => {
        console.log(`   - ${issue.id}: "${issue.title}" - Esperado: "${issue.expectedCategory}", Atual: "${issue.actualCategory}"`);
    });
    if (categoryMismatches.length > 10) {
        console.log(`   ... e mais ${categoryMismatches.length - 10} produtos`);
    }
}

console.log(`\n4. NOMES DUPLICADOS: ${duplicateNames.length} casos`);
if (duplicateNames.length > 0) {
    duplicateNames.slice(0, 5).forEach(issue => {
        console.log(`   - "${issue.name}" (IDs: ${issue.ids.join(', ')})`);
    });
    if (duplicateNames.length > 5) {
        console.log(`   ... e mais ${duplicateNames.length - 5} casos`);
    }
}

// Salvar relatório detalhado
const report = {
    summary: {
        totalProducts,
        totalCategories: categories.length,
        productNameIssues: productNameIssues.length,
        brandIssues: brandIssues.length,
        categoryMismatches: categoryMismatches.length,
        duplicateNames: duplicateNames.length
    },
    categories: categories.map(cat => ({
        key: cat,
        name: getCategoryDisplayName(cat),
        productCount: productsDatabase[cat].length
    })),
    issues: {
        productNameIssues,
        brandIssues,
        categoryMismatches,
        duplicateNames
    }
};

fs.writeFileSync('product-analysis-report.json', JSON.stringify(report, null, 2));

console.log(`\n📋 RESUMO:`);
console.log(`   Total de produtos: ${totalProducts}`);
console.log(`   Total de categorias: ${categories.length}`);
console.log(`   Problemas nos nomes: ${productNameIssues.length}`);
console.log(`   Inconsistências de marca: ${brandIssues.length}`);
console.log(`   Categorias incorretas: ${categoryMismatches.length}`);
console.log(`   Nomes duplicados: ${duplicateNames.length}`);

console.log(`\n✅ Relatório detalhado salvo em: product-analysis-report.json`);