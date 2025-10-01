// Script para adicionar estoque variado aos produtos
const fs = require('fs');

console.log('🔄 Iniciando adição de estoque aos produtos...');

// Ler o arquivo database.js
const databasePath = './js/database.js';
let databaseContent = fs.readFileSync(databasePath, 'utf8');

// Extrair o array de produtos
const productsMatch = databaseContent.match(/const products = (\[[\s\S]*?\]);/);
if (!productsMatch) {
    console.error('❌ Não foi possível encontrar o array de produtos');
    process.exit(1);
}

let products;
try {
    products = eval(productsMatch[1]);
    console.log(`📦 ${products.length} produtos encontrados`);
} catch (error) {
    console.error('❌ Erro ao parsear produtos:', error.message);
    process.exit(1);
}

// Configurar diferentes níveis de estoque
let produtosComEstoque = 0;
let produtosEstoqueBaixo = 0;
let produtosSemEstoque = 0;

products.forEach((product, index) => {
    const random = Math.random();
    
    if (random < 0.6) {
        // 60% dos produtos com estoque normal (10-50 unidades)
        product.stock = Math.floor(Math.random() * 41) + 10; // 10-50
        produtosComEstoque++;
    } else if (random < 0.8) {
        // 20% dos produtos com estoque baixo (1-5 unidades)
        product.stock = Math.floor(Math.random() * 5) + 1; // 1-5
        produtosEstoqueBaixo++;
    } else {
        // 20% dos produtos sem estoque (0 unidades)
        product.stock = 0;
        produtosSemEstoque++;
    }
});

console.log(`📊 Distribuição de estoque:`);
console.log(`   ✅ Com estoque (>5): ${produtosComEstoque} produtos`);
console.log(`   ⚠️  Estoque baixo (1-5): ${produtosEstoqueBaixo} produtos`);
console.log(`   ❌ Sem estoque (0): ${produtosSemEstoque} produtos`);

// Garantir que alguns produtos específicos tenham estoque para demonstração
const produtosEspeciais = [
    { nome: 'iPhone 15 Pro Max', estoque: 25 },
    { nome: 'Galaxy S24 Ultra', estoque: 15 },
    { nome: 'iPhone 14 Pro', estoque: 3 },
    { nome: 'MacBook Pro', estoque: 8 },
    { nome: 'iPad Pro', estoque: 0 },
    { nome: 'AirPods Pro', estoque: 45 },
    { nome: 'Samsung Galaxy Watch', estoque: 2 },
    { nome: 'PlayStation 5', estoque: 12 }
];

produtosEspeciais.forEach(especial => {
    const produto = products.find(p => p.name && p.name.toLowerCase().includes(especial.nome.toLowerCase()));
    if (produto) {
        produto.stock = especial.estoque;
        console.log(`🎯 ${produto.name}: ${especial.estoque} unidades`);
    }
});

// Gerar novo conteúdo do database.js
const newProductsString = JSON.stringify(products, null, 2);
const newDatabaseContent = databaseContent.replace(
    /const products = \[[\s\S]*?\];/,
    `const products = ${newProductsString};`
);

// Salvar o arquivo atualizado
fs.writeFileSync(databasePath, newDatabaseContent, 'utf8');

console.log('✅ Estoque adicionado com sucesso!');
console.log('🔄 Atualize o navegador para ver as mudanças');

// Criar relatório de estoque
const relatorio = {
    timestamp: new Date().toISOString(),
    totalProdutos: products.length,
    comEstoque: produtosComEstoque,
    estoqueBaixo: produtosEstoqueBaixo,
    semEstoque: produtosSemEstoque,
    produtosEspeciais: produtosEspeciais
};

fs.writeFileSync('./relatorio-estoque-atualizado.json', JSON.stringify(relatorio, null, 2));
console.log('📋 Relatório salvo em: relatorio-estoque-atualizado.json');