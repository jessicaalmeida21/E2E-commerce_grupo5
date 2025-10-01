// Script para adicionar estoque variado aos produtos
const fs = require('fs');

console.log('🔄 Iniciando adição de estoque aos produtos...');

// Ler o arquivo database.js
const databasePath = './js/database.js';
let databaseContent = fs.readFileSync(databasePath, 'utf8');

// Extrair o objeto productsDatabase
const databaseMatch = databaseContent.match(/const productsDatabase = ({[\s\S]*?});/);
if (!databaseMatch) {
    console.error('❌ Não foi possível encontrar o objeto productsDatabase');
    process.exit(1);
}

let productsDatabase;
try {
    productsDatabase = eval('(' + databaseMatch[1] + ')');
    console.log(`📦 Banco de dados carregado com ${Object.keys(productsDatabase).length} categorias`);
} catch (error) {
    console.error('❌ Erro ao parsear banco de dados:', error.message);
    process.exit(1);
}

// Contar produtos totais
let totalProdutos = 0;
for (const category in productsDatabase) {
    totalProdutos += productsDatabase[category].length;
}
console.log(`📊 Total de produtos: ${totalProdutos}`);

// Configurar diferentes níveis de estoque
let produtosComEstoque = 0;
let produtosEstoqueBaixo = 0;
let produtosSemEstoque = 0;

// Processar cada categoria
for (const categoryKey in productsDatabase) {
    const products = productsDatabase[categoryKey];
    
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
}

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
    // Procurar em todas as categorias
    for (const categoryKey in productsDatabase) {
        const produto = productsDatabase[categoryKey].find(p => 
            p.title && p.title.toLowerCase().includes(especial.nome.toLowerCase())
        );
        if (produto) {
            produto.stock = especial.estoque;
            console.log(`🎯 ${produto.title}: ${especial.estoque} unidades`);
            break;
        }
    }
});

// Gerar novo conteúdo do database.js
const newDatabaseString = JSON.stringify(productsDatabase, null, 2);
const newDatabaseContent = databaseContent.replace(
    /const productsDatabase = {[\s\S]*?};/,
    `const productsDatabase = ${newDatabaseString};`
);

// Salvar o arquivo atualizado
fs.writeFileSync(databasePath, newDatabaseContent, 'utf8');

console.log('✅ Estoque adicionado com sucesso!');
console.log('🔄 Atualize o navegador (Ctrl+Shift+R) para ver as mudanças');

// Criar relatório de estoque
const relatorio = {
    timestamp: new Date().toISOString(),
    totalProdutos: totalProdutos,
    comEstoque: produtosComEstoque,
    estoqueBaixo: produtosEstoqueBaixo,
    semEstoque: produtosSemEstoque,
    produtosEspeciais: produtosEspeciais,
    categorias: Object.keys(productsDatabase).length
};

fs.writeFileSync('./relatorio-estoque-atualizado.json', JSON.stringify(relatorio, null, 2));
console.log('📋 Relatório salvo em: relatorio-estoque-atualizado.json');

// Mostrar alguns exemplos
console.log('\n📋 Exemplos de produtos atualizados:');
let exemplos = 0;
for (const categoryKey in productsDatabase) {
    if (exemplos >= 5) break;
    const produto = productsDatabase[categoryKey][0];
    if (produto) {
        console.log(`   ${produto.title}: ${produto.stock} unidades`);
        exemplos++;
    }
}