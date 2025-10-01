const fs = require("fs");
const path = require("path");

console.log("🔍 Verificando erros no sistema E2E-commerce...\n");

// 1. Verificar se todos os arquivos principais existem
const criticalFiles = [
    "./js/database.js",
    "./js/catalog.js", 
    "./js/cart.js",
    "./js/checkout.js",
    "./js/login.js",
    "./js/main.js",
    "./pages/catalog.html",
    "./pages/cart.html",
    "./pages/checkout.html",
    "./pages/login.html",
    "./index.html"
];

console.log("📁 Verificando arquivos críticos:");
criticalFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ FALTANDO: ${file}`);
    }
});

// 2. Verificar sintaxe dos arquivos JavaScript principais
console.log("\n🔧 Verificando sintaxe dos arquivos JS:");
const jsFiles = [
    "./js/database.js",
    "./js/catalog.js",
    "./js/cart.js", 
    "./js/checkout.js",
    "./js/login.js"
];

jsFiles.forEach(file => {
    try {
        if (fs.existsSync(file)) {
            require(file);
            console.log(`✅ ${file} - Sintaxe OK`);
        }
    } catch (error) {
        console.log(`❌ ${file} - ERRO: ${error.message}`);
    }
});

// 3. Verificar database
console.log("\n📊 Verificando database:");
try {
    const database = require("./js/database.js");
    const products = database.getAllProducts();
    console.log(`✅ Database carregado: ${products.length} produtos`);
    
    // Verificar se produtos têm imagens
    const withImages = products.filter(p => p.image && p.image.startsWith("https://"));
    console.log(`✅ Produtos com imagens: ${withImages.length}/${products.length}`);
    
} catch (error) {
    console.log(`❌ Erro no database: ${error.message}`);
}

console.log("\n🎯 Verificação concluída!");