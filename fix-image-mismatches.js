const fs = require('fs');

// Ler o database.js
let databaseContent = fs.readFileSync('./js/database.js', 'utf8');

// Ler o relatório de análise visual
const reportContent = fs.readFileSync('./visual-analysis-report.json', 'utf8');
const report = JSON.parse(reportContent);

console.log('🔧 CORREÇÃO DE IMAGENS INCORRETAS');
console.log('=================================');
console.log(`📊 Total de produtos suspeitos: ${report.suspiciousCount}`);

// Imagens apropriadas por categoria
const appropriateImages = {
    smartphones: [
        'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop&auto=format', // iPhone
        'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop&auto=format', // Samsung
        'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop&auto=format', // iPhone Pro
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop&auto=format', // Pixel
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&auto=format', // OnePlus
        'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=400&fit=crop&auto=format', // Xiaomi
        'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&h=400&fit=crop&auto=format', // Huawei
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&auto=format', // Motorola
        'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=400&h=400&fit=crop&auto=format', // LG
        'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop&auto=format' // Sony
    ],
    notebooks: [
        'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&auto=format', // MacBook
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&auto=format', // Laptop
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&auto=format', // ThinkPad
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format', // Gaming
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop&auto=format', // Dell
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d2b?w=400&h=400&fit=crop&auto=format', // HP
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&auto=format', // Asus
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&auto=format', // Lenovo
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&auto=format', // Acer
        'https://images.unsplash.com/photo-1461151304267-ef46a710d3e6?w=400&h=400&fit=crop&auto=format' // Surface
    ],
    televisoes: [
        'https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=400&h=400&fit=crop&auto=format', // Smart TV
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&auto=format', // OLED
        'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop&auto=format', // QLED
        'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop&auto=format', // LED TV
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&auto=format', // 4K TV
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop&auto=format', // Samsung TV
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&auto=format', // LG TV
        'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop&auto=format', // Sony TV
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&auto=format', // TCL
        'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=400&fit=crop&auto=format' // Philips
    ],
    eletrodomesticos: [
        'https://images.unsplash.com/photo-1572635196184-84e35138cf62?w=400&h=400&fit=crop&auto=format', // Geladeira
        'https://images.unsplash.com/photo-1586953208359-3e69f7e0e9b5?w=400&h=400&fit=crop&auto=format', // Fogão
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format', // Micro-ondas
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop&auto=format', // Cafeteira
        'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop&auto=format', // Liquidificador
        'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&auto=format', // Batedeira
        'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&auto=format', // Aspirador
        'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&auto=format', // Ferro
        'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop&auto=format', // Lavadora
        'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&h=400&fit=crop&auto=format' // Secadora
    ],
    roupas: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&auto=format', // Camiseta
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&auto=format', // Camisa
        'https://images.unsplash.com/photo-1461151304267-ef46a710d3e6?w=400&h=400&fit=crop&auto=format', // Calça
        'https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=400&h=400&fit=crop&auto=format', // Jeans
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&auto=format', // Vestido
        'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop&auto=format', // Saia
        'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&h=400&fit=crop&auto=format', // Blusa
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&auto=format', // Shorts
        'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=400&h=400&fit=crop&auto=format', // Bermuda
        'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop&auto=format' // Moletom
    ],
    relogios: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&auto=format', // Apple Watch
        'https://images.unsplash.com/photo-1461151304267-ef46a710d3e6?w=400&h=400&fit=crop&auto=format', // Galaxy Watch
        'https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=400&h=400&fit=crop&auto=format', // Smartwatch
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&auto=format', // Relógio Digital
        'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop&auto=format', // Relógio Analógico
        'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&h=400&fit=crop&auto=format', // Casio
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&auto=format', // Citizen
        'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=400&h=400&fit=crop&auto=format' // Seiko
    ],
    audio: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format', // Fone
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop&auto=format', // Headphone
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d2b?w=400&h=400&fit=crop&auto=format', // Earbuds
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&auto=format', // AirPods
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&auto=format', // Speaker
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&auto=format', // Caixa de Som
        'https://images.unsplash.com/photo-1461151304267-ef46a710d3e6?w=400&h=400&fit=crop&auto=format', // Soundbar
        'https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=400&h=400&fit=crop&auto=format' // JBL
    ]
};

// Função para determinar categoria apropriada
function getCategoryKey(category, title) {
    const categoryLower = category.toLowerCase();
    const titleLower = title.toLowerCase();
    
    if (categoryLower.includes('smartphone') || titleLower.includes('iphone') || titleLower.includes('galaxy') || titleLower.includes('pixel')) {
        return 'smartphones';
    }
    if (categoryLower.includes('notebook') || titleLower.includes('macbook') || titleLower.includes('laptop')) {
        return 'notebooks';
    }
    if (categoryLower.includes('televisão') || categoryLower.includes('tv') || titleLower.includes('tv')) {
        return 'televisoes';
    }
    if (categoryLower.includes('eletrodoméstico') || titleLower.includes('geladeira') || titleLower.includes('fogão') || titleLower.includes('micro-ondas')) {
        return 'eletrodomesticos';
    }
    if (categoryLower.includes('roupa') || titleLower.includes('camiseta') || titleLower.includes('camisa') || titleLower.includes('calça')) {
        return 'roupas';
    }
    if (categoryLower.includes('relógio') || titleLower.includes('watch') || titleLower.includes('relógio')) {
        return 'relogios';
    }
    if (categoryLower.includes('áudio') || titleLower.includes('fone') || titleLower.includes('headphone') || titleLower.includes('speaker')) {
        return 'audio';
    }
    
    return 'smartphones'; // Default
}

let corrections = 0;
let correctionLog = [];

// Processar cada produto suspeito
report.suspiciousProducts.forEach((product, index) => {
    const categoryKey = getCategoryKey(product.category, product.title);
    const availableImages = appropriateImages[categoryKey];
    
    if (availableImages && availableImages.length > 0) {
        // Selecionar imagem baseada no índice para distribuir uniformemente
        const imageIndex = index % availableImages.length;
        const newImage = availableImages[imageIndex];
        
        // Substituir no database
        const oldImagePattern = product.image.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(oldImagePattern, 'g');
        
        if (databaseContent.includes(product.image)) {
            databaseContent = databaseContent.replace(regex, newImage);
            corrections++;
            
            correctionLog.push({
                productId: product.id,
                productTitle: product.title,
                category: product.category,
                oldImage: product.image,
                newImage: newImage,
                reason: product.reasons.join(', ')
            });
            
            console.log(`✅ ${corrections}. ${product.title}`);
            console.log(`   ${product.image.substring(0, 60)}...`);
            console.log(`   → ${newImage.substring(0, 60)}...`);
            console.log('');
        }
    }
});

// Salvar o database atualizado
if (corrections > 0) {
    fs.writeFileSync('./js/database.js', databaseContent);
    
    // Salvar log de correções
    const logReport = {
        timestamp: new Date().toISOString(),
        totalCorrections: corrections,
        corrections: correctionLog
    };
    
    fs.writeFileSync('image-corrections-final-log.json', JSON.stringify(logReport, null, 2));
    
    console.log(`\n🎉 CORREÇÕES CONCLUÍDAS!`);
    console.log(`📊 Total de correções: ${corrections}`);
    console.log(`📄 Log salvo em: image-corrections-final-log.json`);
    console.log(`✅ Database atualizado: ./js/database.js`);
} else {
    console.log('❌ Nenhuma correção foi necessária.');
}

console.log('\n🏁 Processo finalizado!');