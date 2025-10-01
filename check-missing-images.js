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

console.log('🔍 Verificando produtos sem imagem...\n');

let missingImages = [];
let undefinedImages = [];
let nullImages = [];
let emptyImages = [];

database.forEach((product, index) => {
    if (!product.image) {
        missingImages.push({
            index: index,
            id: product.id,
            name: product.name,
            brand: product.brand,
            image: product.image
        });
    } else if (product.image === undefined) {
        undefinedImages.push({
            index: index,
            id: product.id,
            name: product.name,
            brand: product.brand,
            image: product.image
        });
    } else if (product.image === null) {
        nullImages.push({
            index: index,
            id: product.id,
            name: product.name,
            brand: product.brand,
            image: product.image
        });
    } else if (product.image === '') {
        emptyImages.push({
            index: index,
            id: product.id,
            name: product.name,
            brand: product.brand,
            image: product.image
        });
    }
});

console.log(`📊 Resumo de produtos sem imagem:`);
console.log(`❌ Produtos sem propriedade 'image': ${missingImages.length}`);
console.log(`❌ Produtos com image = undefined: ${undefinedImages.length}`);
console.log(`❌ Produtos com image = null: ${nullImages.length}`);
console.log(`❌ Produtos com image = '': ${emptyImages.length}`);

const totalProblemsWithImages = missingImages.length + undefinedImages.length + nullImages.length + emptyImages.length;
console.log(`\n🔢 Total de produtos com problemas de imagem: ${totalProblemsWithImages}`);
console.log(`✅ Produtos com imagens válidas: ${500 - totalProblemsWithImages}`);

if (totalProblemsWithImages > 0) {
    console.log('\n📋 Detalhes dos produtos problemáticos:');
    
    if (missingImages.length > 0) {
        console.log('\n❌ Produtos SEM propriedade image:');
        missingImages.slice(0, 10).forEach(product => {
            console.log(`  - [${product.index}] ${product.name} (${product.brand})`);
        });
        if (missingImages.length > 10) {
            console.log(`  ... e mais ${missingImages.length - 10} produtos`);
        }
    }
    
    if (undefinedImages.length > 0) {
        console.log('\n❌ Produtos com image = undefined:');
        undefinedImages.slice(0, 10).forEach(product => {
            console.log(`  - [${product.index}] ${product.name} (${product.brand})`);
        });
        if (undefinedImages.length > 10) {
            console.log(`  ... e mais ${undefinedImages.length - 10} produtos`);
        }
    }
    
    if (nullImages.length > 0) {
        console.log('\n❌ Produtos com image = null:');
        nullImages.slice(0, 10).forEach(product => {
            console.log(`  - [${product.index}] ${product.name} (${product.brand})`);
        });
        if (nullImages.length > 10) {
            console.log(`  ... e mais ${nullImages.length - 10} produtos`);
        }
    }
    
    if (emptyImages.length > 0) {
        console.log('\n❌ Produtos com image = \'\':');
        emptyImages.slice(0, 10).forEach(product => {
            console.log(`  - [${product.index}] ${product.name} (${product.brand})`);
        });
        if (emptyImages.length > 10) {
            console.log(`  ... e mais ${emptyImages.length - 10} produtos`);
        }
    }
    
    // Salvar lista de produtos problemáticos
    const allProblematicProducts = [
        ...missingImages.map(p => ({...p, issue: 'missing_image_property'})),
        ...undefinedImages.map(p => ({...p, issue: 'undefined_image'})),
        ...nullImages.map(p => ({...p, issue: 'null_image'})),
        ...emptyImages.map(p => ({...p, issue: 'empty_image'}))
    ];
    
    fs.writeFileSync('products-without-images.json', JSON.stringify(allProblematicProducts, null, 2));
    console.log('\n📁 Lista de produtos problemáticos salva em: products-without-images.json');
}

console.log('\n✅ Verificação concluída!');