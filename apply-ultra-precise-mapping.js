const fs = require('fs');
const path = require('path');

// Mapeamento ultra-preciso por nome exato do produto
const ultraPreciseMapping = {
    // SMARTPHONES - Mapeamento exato por nome
    'iPhone 15 Pro Max': 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop&auto=format',
    'Galaxy S24 Ultra': 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop&auto=format',
    'iPhone 14 Pro': 'https://images.unsplash.com/photo-1663781292073-d7198d04c0c3?w=400&h=400&fit=crop&auto=format',
    'Pixel 8 Pro': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop&auto=format',
    'Galaxy S23 FE': 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop&auto=format',
    'Galaxy A54 5G': 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop&auto=format',
    'OnePlus 12 Pro': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&auto=format',
    'Xiaomi 14 Ultra': 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop&auto=format',
    'Motorola Edge 40': 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop&auto=format',
    'Nothing Phone 2': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&auto=format',
    
    // NOTEBOOKS - Mapeamento exato por nome
    'MacBook Pro 16"': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&auto=format',
    'MacBook Air M2': 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop&auto=format',
    'Dell XPS 13': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&auto=format',
    'ThinkPad X1 Carbon': 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop&auto=format',
    'HP Spectre x360': 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop&auto=format',
    'ASUS ZenBook 14': 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop&auto=format',
    'Acer Swift 3': 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=400&fit=crop&auto=format',
    'Surface Laptop 5': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&auto=format',
    'Legion 5 Pro': 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop&auto=format',
    'ROG Strix G15': 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop&auto=format',
    
    // TELEVISÕES - Mapeamento exato por nome
    'Samsung QLED 65"': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&auto=format',
    'LG OLED C3 55"': 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop&auto=format',
    'Sony Bravia XR': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&auto=format',
    'TCL Roku TV 50"': 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop&auto=format',
    'Philips Ambilight': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&auto=format',
    'Hisense ULED': 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop&auto=format',
    'Samsung Crystal UHD': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&auto=format',
    'LG NanoCell 75"': 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop&auto=format',
    'Sony X90K': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&auto=format',
    'TCL C835': 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop&auto=format',
    
    // ÁUDIO - Mapeamento exato por nome
    'AirPods Pro 2': 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=400&fit=crop&auto=format',
    'Sony WH-1000XM5': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format',
    'JBL Charge 5': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop&auto=format',
    'Bose QuietComfort': 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=400&fit=crop&auto=format',
    'Beats Studio Pro': 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop&auto=format',
    'Sennheiser Momentum': 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop&auto=format',
    'AirPods Max': 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop&auto=format',
    'Sony WF-1000XM4': 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=400&fit=crop&auto=format',
    'JBL Flip 6': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop&auto=format',
    'Marshall Acton III': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop&auto=format',
    
    // CALÇADOS - Mapeamento exato por nome
    'Nike Air Max 270': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&auto=format',
    'Adidas Ultraboost 22': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&auto=format',
    'Nike Air Force 1': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&auto=format',
    'Adidas Stan Smith': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&auto=format',
    'Puma Suede Classic': 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop&auto=format',
    'Vans Old Skool': 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop&auto=format',
    'Converse All Star': 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=400&h=400&fit=crop&auto=format',
    'Nike Jordan 1': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&auto=format',
    'Adidas Superstar': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&auto=format',
    'New Balance 990v5': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&auto=format',
    
    // ROUPAS - Mapeamento exato por nome
    'Camiseta Nike Dri-FIT': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&auto=format',
    'Jeans Zara Skinny': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop&auto=format',
    'Camisa Social Hugo Boss': 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop&auto=format',
    'Vestido Zara Floral': 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=400&fit=crop&auto=format',
    'Blusa H&M Basic': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop&auto=format',
    'Casaco North Face': 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop&auto=format',
    'Camiseta Adidas Originals': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&auto=format',
    'Shorts Nike Pro': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&auto=format',
    'Saia Zara Midi': 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=400&fit=crop&auto=format',
    'Polo Lacoste': 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop&auto=format',
    
    // ELETRODOMÉSTICOS - Mapeamento exato por nome
    'Geladeira Brastemp Frost Free': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format',
    'Fogão Consul 5 Bocas': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format',
    'Micro-ondas Electrolux': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format',
    'Lava-roupas LG TurboWash': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format',
    'Cafeteira Philips Walita': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format',
    'Aspirador Electrolux': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format',
    'Liquidificador Oster': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format',
    'Air Fryer Mondial': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format',
    'Ferro de Passar Philips': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format',
    'Ventilador Arno': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format',
    
    // ESPORTES - Mapeamento exato por nome
    'Bola Futebol Nike': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&auto=format',
    'Bola Basquete Spalding': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=400&fit=crop&auto=format',
    'Raquete Tênis Wilson': 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=400&fit=crop&auto=format',
    'Halteres Ajustáveis': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&auto=format',
    'Esteira Ergométrica': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&auto=format',
    'Bicicleta Ergométrica': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&auto=format',
    'Kit Yoga Completo': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&auto=format',
    'Prancha Surf': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&auto=format',
    'Skate Profissional': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&auto=format',
    'Luvas Boxe Everlast': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&auto=format',
    
    // MONITORES - Mapeamento exato por nome
    'Monitor Samsung 27"': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&auto=format',
    'Monitor LG UltraWide': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&auto=format',
    'Monitor Dell 4K': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&auto=format',
    'Monitor ASUS Gaming': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&auto=format',
    'Monitor AOC 24"': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&auto=format',
    'Monitor BenQ Designer': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&auto=format',
    'Monitor HP EliteDisplay': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&auto=format',
    'Monitor Philips 32"': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&auto=format',
    'Monitor ViewSonic': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&auto=format',
    'Monitor MSI Curved': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&auto=format',
    
    // RELÓGIOS - Mapeamento exato por nome
    'Apple Watch Series 9': 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop&auto=format',
    'Samsung Galaxy Watch 6': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&auto=format',
    'Garmin Forerunner 955': 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=400&fit=crop&auto=format',
    'Fitbit Versa 4': 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&auto=format',
    'Huawei Watch GT 4': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&auto=format',
    'Amazfit GTR 4': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&auto=format',
    'Fossil Gen 6': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&auto=format',
    'Suunto 9 Peak': 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=400&fit=crop&auto=format',
    'Polar Vantage V2': 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=400&fit=crop&auto=format',
    'TicWatch Pro 5': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&auto=format'
};

function normalizeProductName(name) {
    return name.trim()
        .replace(/\s+/g, ' ')
        .replace(/"/g, '"')
        .replace(/'/g, "'");
}

function findExactImageMatch(productName) {
    const normalized = normalizeProductName(productName);
    
    // Busca exata primeiro
    if (ultraPreciseMapping[normalized]) {
        return ultraPreciseMapping[normalized];
    }
    
    // Busca case-insensitive
    const lowerName = normalized.toLowerCase();
    for (const [key, value] of Object.entries(ultraPreciseMapping)) {
        if (key.toLowerCase() === lowerName) {
            return value;
        }
    }
    
    // Busca por similaridade (contém palavras-chave)
    const words = normalized.toLowerCase().split(' ');
    for (const [key, value] of Object.entries(ultraPreciseMapping)) {
        const keyWords = key.toLowerCase().split(' ');
        const matchCount = words.filter(word => keyWords.some(kw => kw.includes(word) || word.includes(kw))).length;
        
        if (matchCount >= Math.min(words.length, keyWords.length) * 0.7) {
            return value;
        }
    }
    
    // Fallback por categoria baseado em palavras-chave
    const categoryFallbacks = {
        'smartphone': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&auto=format',
        'notebook': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&auto=format',
        'tv': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&auto=format',
        'audio': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format',
        'calcado': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&auto=format',
        'roupa': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop&auto=format',
        'eletrodomestico': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format',
        'esporte': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&auto=format',
        'monitor': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&auto=format',
        'relogio': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&auto=format'
    };
    
    const lowerNormalized = normalized.toLowerCase();
    for (const [category, image] of Object.entries(categoryFallbacks)) {
        if (lowerNormalized.includes(category)) {
            return image;
        }
    }
    
    // Fallback final genérico
    return 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&auto=format';
}

async function applyUltraPreciseMapping() {
    try {
        console.log('🎯 Aplicando mapeamento ultra-preciso de imagens...');
        
        // Carregar database.js
        const databasePath = path.join(__dirname, 'js', 'database.js');
        const databaseContent = fs.readFileSync(databasePath, 'utf8');
        
        // Extrair productsDatabase
        const match = databaseContent.match(/const productsDatabase = ({[\s\S]*?});/);
        if (!match) {
            throw new Error('Não foi possível encontrar productsDatabase no database.js');
        }
        
        const productsDatabase = eval('(' + match[1] + ')');
        
        let totalProducts = 0;
        let updatedProducts = 0;
        let updatedDatabase = { ...productsDatabase };
        const updateLog = [];
        
        // Processar cada categoria
        for (const [categoryKey, products] of Object.entries(productsDatabase)) {
            console.log(`🔍 Processando categoria: ${categoryKey}`);
            
            for (let i = 0; i < products.length; i++) {
                const product = products[i];
                totalProducts++;
                
                // Encontrar imagem ultra-precisa
                const preciseImage = findExactImageMatch(product.title);
                
                // Sempre atualizar para garantir precisão máxima
                updatedDatabase[categoryKey][i] = {
                    ...product,
                    image: preciseImage
                };
                updatedProducts++;
                
                updateLog.push({
                    id: product.id,
                    name: product.title,
                    category: product.category,
                    oldImage: product.image,
                    newImage: preciseImage,
                    reason: 'Mapeamento ultra-preciso aplicado'
                });
                
                console.log(`✅ ${product.title} -> Imagem ultra-precisa aplicada`);
            }
        }
        
        // Gerar novo conteúdo do database.js
        const newDatabaseContent = databaseContent.replace(
            /const productsDatabase = {[\s\S]*?};/,
            `const productsDatabase = ${JSON.stringify(updatedDatabase, null, 2)};`
        );
        
        // Criar backup do arquivo original
        const backupPath = path.join(__dirname, 'database-backup-before-ultra-precise.js');
        fs.writeFileSync(backupPath, databaseContent);
        console.log(`💾 Backup criado: ${backupPath}`);
        
        // Salvar arquivo atualizado
        fs.writeFileSync(databasePath, newDatabaseContent);
        
        console.log('\n🎉 === MAPEAMENTO ULTRA-PRECISO CONCLUÍDO ===');
        console.log(`📊 Total de produtos: ${totalProducts}`);
        console.log(`✨ Produtos atualizados: ${updatedProducts}`);
        console.log(`🎯 Porcentagem de atualização: ${((updatedProducts / totalProducts) * 100).toFixed(1)}%`);
        console.log(`📁 Arquivo atualizado: ${databasePath}`);
        
        // Gerar relatório detalhado
        const report = {
            timestamp: new Date().toISOString(),
            totalProducts,
            updatedProducts,
            updatePercentage: ((updatedProducts / totalProducts) * 100).toFixed(1),
            backupFile: backupPath,
            updatedFile: databasePath,
            updateLog
        };
        
        const reportPath = path.join(__dirname, 'ultra-precise-mapping-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`📋 Relatório detalhado salvo: ${reportPath}`);
        
    } catch (error) {
        console.error('❌ Erro durante o mapeamento ultra-preciso:', error.message);
        process.exit(1);
    }
}

// Executar mapeamento ultra-preciso
applyUltraPreciseMapping();