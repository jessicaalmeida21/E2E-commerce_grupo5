const fs = require('fs');

// Carregar o banco de dados
const databaseContent = fs.readFileSync('js/database.js', 'utf8');
const productsDatabase = eval(databaseContent.replace('// Banco de Dados de Produtos - 500 Produtos Organizados por Categoria\n', '') + '; productsDatabase');

// Converter para array plano
let database = [];
Object.keys(productsDatabase).forEach(category => {
    if (Array.isArray(productsDatabase[category])) {
        database = database.concat(productsDatabase[category]);
    }
});

console.log('🔍 Análise detalhada de imagens...\n');

let imageProblems = [];
let duplicateImages = {};
let genericImages = [];
let brandMismatches = [];

// Verificar cada produto
database.forEach((product, index) => {
    const issues = [];
    
    // 1. Verificar se a imagem existe
    if (!product.image || product.image === '' || product.image === null || product.image === undefined) {
        issues.push('Sem imagem');
    } else {
        // 2. Verificar imagens duplicadas
        if (duplicateImages[product.image]) {
            duplicateImages[product.image].push({
                index: index,
                id: product.id,
                title: product.title,
                brand: product.brand,
                category: product.category
            });
        } else {
            duplicateImages[product.image] = [{
                index: index,
                id: product.id,
                title: product.title,
                brand: product.brand,
                category: product.category
            }];
        }
        
        // 3. Verificar imagens genéricas (Unsplash sem contexto específico)
        if (product.image.includes('unsplash.com') && 
            !product.image.includes('phone') && 
            !product.image.includes('laptop') && 
            !product.image.includes('tablet') && 
            !product.image.includes('watch') && 
            !product.image.includes('headphone')) {
            genericImages.push({
                index: index,
                id: product.id,
                title: product.title,
                brand: product.brand,
                category: product.category,
                image: product.image
            });
        }
        
        // 4. Verificar incompatibilidade de marca na imagem
        const imageLower = product.image.toLowerCase();
        const brandLower = product.brand.toLowerCase();
        
        // Lista de marcas conhecidas para verificar conflitos
        const knownBrands = ['apple', 'samsung', 'xiaomi', 'google', 'oneplus', 'sony', 'lg', 'motorola', 'huawei', 'nokia'];
        const conflictingBrands = knownBrands.filter(brand => 
            brand !== brandLower && imageLower.includes(brand)
        );
        
        if (conflictingBrands.length > 0) {
            brandMismatches.push({
                index: index,
                id: product.id,
                title: product.title,
                brand: product.brand,
                category: product.category,
                image: product.image,
                conflictingBrands: conflictingBrands
            });
        }
    }
    
    if (issues.length > 0) {
        imageProblems.push({
            index: index,
            id: product.id,
            title: product.title,
            brand: product.brand,
            category: product.category,
            image: product.image,
            issues: issues
        });
    }
});

// Analisar duplicatas (mais de 1 produto com a mesma imagem)
const duplicatedImages = Object.keys(duplicateImages).filter(imageUrl => 
    duplicateImages[imageUrl].length > 1
);

console.log('📊 RESUMO DA ANÁLISE DETALHADA:');
console.log(`❌ Produtos sem imagem: ${imageProblems.length}`);
console.log(`🔄 Imagens duplicadas: ${duplicatedImages.length} imagens usadas por ${duplicatedImages.reduce((total, img) => total + duplicateImages[img].length, 0)} produtos`);
console.log(`🎭 Imagens genéricas (Unsplash): ${genericImages.length}`);
console.log(`⚠️  Incompatibilidades de marca: ${brandMismatches.length}`);

// Mostrar detalhes dos problemas
if (imageProblems.length > 0) {
    console.log('\n❌ PRODUTOS SEM IMAGEM:');
    imageProblems.slice(0, 10).forEach(product => {
        console.log(`  - [${product.index}] ${product.title} (${product.brand}) - ${product.issues.join(', ')}`);
    });
    if (imageProblems.length > 10) {
        console.log(`  ... e mais ${imageProblems.length - 10} produtos`);
    }
}

if (duplicatedImages.length > 0) {
    console.log('\n🔄 IMAGENS MAIS DUPLICADAS:');
    duplicatedImages.slice(0, 5).forEach(imageUrl => {
        const products = duplicateImages[imageUrl];
        console.log(`\n  📷 Imagem: ${imageUrl}`);
        console.log(`  🔢 Usada por ${products.length} produtos:`);
        products.slice(0, 3).forEach(product => {
            console.log(`    - ${product.title} (${product.brand})`);
        });
        if (products.length > 3) {
            console.log(`    ... e mais ${products.length - 3} produtos`);
        }
    });
}

if (genericImages.length > 0) {
    console.log('\n🎭 IMAGENS GENÉRICAS (primeiros 10):');
    genericImages.slice(0, 10).forEach(product => {
        console.log(`  - [${product.index}] ${product.title} (${product.brand}) - ${product.category}`);
    });
    if (genericImages.length > 10) {
        console.log(`  ... e mais ${genericImages.length - 10} produtos`);
    }
}

if (brandMismatches.length > 0) {
    console.log('\n⚠️  INCOMPATIBILIDADES DE MARCA:');
    brandMismatches.slice(0, 10).forEach(product => {
        console.log(`  - [${product.index}] ${product.title} (${product.brand}) - Conflito com: ${product.conflictingBrands.join(', ')}`);
    });
    if (brandMismatches.length > 10) {
        console.log(`  ... e mais ${brandMismatches.length - 10} produtos`);
    }
}

// Salvar relatório detalhado
const report = {
    summary: {
        totalProducts: database.length,
        productsWithoutImages: imageProblems.length,
        duplicatedImages: duplicatedImages.length,
        genericImages: genericImages.length,
        brandMismatches: brandMismatches.length
    },
    productsWithoutImages: imageProblems,
    duplicatedImages: duplicatedImages.map(imageUrl => ({
        imageUrl: imageUrl,
        products: duplicateImages[imageUrl]
    })),
    genericImages: genericImages,
    brandMismatches: brandMismatches
};

fs.writeFileSync('detailed-image-analysis-report.json', JSON.stringify(report, null, 2));
console.log('\n📁 Relatório detalhado salvo em: detailed-image-analysis-report.json');

const totalIssues = imageProblems.length + duplicatedImages.length + genericImages.length + brandMismatches.length;
console.log(`\n🎯 TOTAL DE PROBLEMAS IDENTIFICADOS: ${totalIssues}`);
console.log('✅ Análise concluída!');