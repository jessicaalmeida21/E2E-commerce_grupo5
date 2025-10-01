const fs = require('fs');
const path = require('path');

console.log('🔧 CORREÇÃO FINAL - NOMES DE CATEGORIA\n');

// Criar backup do banco de dados
const databasePath = path.join(__dirname, 'js', 'database.js');
const backupPath = path.join(__dirname, 'js', `database-backup-category-fix-${Date.now()}.js`);
fs.copyFileSync(databasePath, backupPath);
console.log(`✅ Backup criado: ${path.basename(backupPath)}`);

// Carregar banco de dados atual
const productsDatabase = require('./js/database.js');

// Mapeamento correto de categorias
const categoryMapping = {
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

let totalCorrections = 0;

console.log('🔧 CORRIGINDO NOMES DE CATEGORIA:\n');

// Corrigir cada categoria
Object.keys(productsDatabase).forEach(categoryKey => {
    const products = productsDatabase[categoryKey];
    const correctCategoryName = categoryMapping[categoryKey];
    
    console.log(`🔧 ${categoryKey.toUpperCase()} -> "${correctCategoryName}"`);
    
    let categoryCorrections = 0;
    
    products.forEach(product => {
        if (product.category !== correctCategoryName) {
            product.category = correctCategoryName;
            categoryCorrections++;
            totalCorrections++;
        }
    });
    
    console.log(`   ✅ ${categoryCorrections} produtos corrigidos`);
});

// Salvar banco de dados atualizado
const newDatabaseContent = `// Banco de Dados de Produtos - 500 Produtos com Correspondência Perfeita Nome-Imagem
const productsDatabase = ${JSON.stringify(productsDatabase, null, 2)};

// Funções do Database
function getAllProducts() {
    const allProducts = [];
    for (const category in productsDatabase) {
        allProducts.push(...productsDatabase[category]);
    }
    return allProducts;
}

function getProductsByCategory(category) {
    const categoryKey = category.toLowerCase();
    return productsDatabase[categoryKey] || [];
}

function getCategories() {
    return Object.keys(productsDatabase).map(key => ({
        key: key,
        name: getCategoryDisplayName(key)
    }));
}

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

// Exportar para uso em outros módulos
if (typeof window !== 'undefined') {
    window.productsDatabase = productsDatabase;
    window.getAllProducts = getAllProducts;
    window.getProductsByCategory = getProductsByCategory;
    window.getCategories = getCategories;
    window.getCategoryDisplayName = getCategoryDisplayName;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = productsDatabase;
}`;

fs.writeFileSync(databasePath, newDatabaseContent);

console.log(`\n✅ CORREÇÃO DE CATEGORIAS CONCLUÍDA!`);
console.log(`   🔧 Total de correções: ${totalCorrections}`);
console.log(`   💾 Backup salvo: ${path.basename(backupPath)}`);
console.log(`   🗃️ Database atualizado: js/database.js`);

console.log(`\n🎯 CATEGORIAS CORRIGIDAS:`);
Object.keys(categoryMapping).forEach(key => {
    console.log(`   ✅ ${key} -> "${categoryMapping[key]}"`);
});