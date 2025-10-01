const fs = require("fs");

// Carregar database
const database = require("./js/database.js");
const products = database.getAllProducts();

console.log("🔍 Testando correções de imagens no catálogo...\n");

// Testar produtos específicos que eram problemáticos
const testProducts = [
    "Motorola Nord Pro",
    "Sony Xperia FE", 
    "LG C55 Lite",
    "Samsung Galaxy S23",
    "iPhone 15 Pro",
    "Xiaomi Redmi Note 12"
];

console.log("📱 Testando produtos específicos:");
testProducts.forEach(productName => {
    const product = products.find(p => p.title.includes(productName.split(" ")[0]));
    if (product) {
        console.log(`✅ ${product.title}`);
        console.log(`   Categoria: ${product.category}`);
        console.log(`   Imagem: ${product.image}`);
        console.log(`   URL válida: ${product.image.startsWith("https://") ? "Sim" : "Não"}`);
        console.log("");
    }
});

// Verificar distribuição por categoria
console.log("📊 Verificação por categoria:");
const categoryStats = {};
products.forEach(product => {
    if (!categoryStats[product.category]) {
        categoryStats[product.category] = { total: 0, withImages: 0 };
    }
    categoryStats[product.category].total++;
    if (product.image && product.image.startsWith("https://")) {
        categoryStats[product.category].withImages++;
    }
});

Object.keys(categoryStats).forEach(category => {
    const stats = categoryStats[category];
    const percentage = ((stats.withImages / stats.total) * 100).toFixed(1);
    console.log(`${category}: ${stats.withImages}/${stats.total} (${percentage}%)`);
});

console.log(`\n🎉 Resumo final:`);
console.log(`Total de produtos: ${products.length}`);
console.log(`Produtos com imagens: ${products.filter(p => p.image && p.image.startsWith("https://")).length}`);
console.log(`Cobertura de imagens: ${((products.filter(p => p.image && p.image.startsWith("https://")).length / products.length) * 100).toFixed(1)}%`);