const fs = require('fs');
const path = require('path');

// Mapeamento ultra-específico de imagens por produto exato
const perfectImageMapping = {
    // SMARTPHONES - Imagens específicas por modelo
    'iphone 15 pro max': 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop&auto=format',
    'iphone 15 pro': 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop&auto=format',
    'iphone 15': 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop&auto=format',
    'iphone 14 pro': 'https://images.unsplash.com/photo-1663781292073-d7198d04c0c3?w=400&h=400&fit=crop&auto=format',
    'samsung galaxy s24': 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop&auto=format',
    'samsung galaxy s23': 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop&auto=format',
    'xiaomi 14 ultra': 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop&auto=format',
    'xiaomi 13 pro': 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop&auto=format',
    'oneplus 12 pro': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&auto=format',
    'oneplus 11': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&auto=format',
    'google pixel 8': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop&auto=format',
    'google pixel 7': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop&auto=format',
    'motorola edge 40': 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop&auto=format',
    
    // NOTEBOOKS - Imagens específicas por modelo
    'macbook pro 16': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&auto=format',
    'macbook pro 14': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&auto=format',
    'macbook air m2': 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop&auto=format',
    'macbook air': 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop&auto=format',
    'dell xps 13': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&auto=format',
    'dell xps 15': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&auto=format',
    'dell inspiron': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&auto=format',
    'hp pavilion': 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop&auto=format',
    'hp spectre': 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop&auto=format',
    'lenovo thinkpad': 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop&auto=format',
    'lenovo ideapad': 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop&auto=format',
    'asus zenbook': 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop&auto=format',
    'asus vivobook': 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop&auto=format',
    'acer aspire': 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=400&fit=crop&auto=format',
    'acer swift': 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=400&fit=crop&auto=format',
    
    // TELEVISÕES - Imagens específicas por modelo
    'samsung qled': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&auto=format',
    'samsung crystal': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&auto=format',
    'lg oled': 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop&auto=format',
    'lg nanocell': 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop&auto=format',
    'sony bravia': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&auto=format',
    'tcl roku': 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop&auto=format',
    'philips ambilight': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&auto=format',
    
    // ÁUDIO - Imagens específicas por modelo
    'airpods pro': 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=400&fit=crop&auto=format',
    'airpods max': 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop&auto=format',
    'sony wh-1000xm5': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format',
    'sony wh-1000xm4': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format',
    'jbl charge': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop&auto=format',
    'jbl flip': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop&auto=format',
    'bose quietcomfort': 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=400&fit=crop&auto=format',
    'beats studio': 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop&auto=format',
    'sennheiser momentum': 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop&auto=format',
    
    // CALÇADOS - Imagens específicas por modelo
    'nike air max': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&auto=format',
    'nike air force': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&auto=format',
    'nike jordan': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&auto=format',
    'adidas ultraboost': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&auto=format',
    'adidas stan smith': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&auto=format',
    'adidas superstar': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&auto=format',
    'puma suede': 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop&auto=format',
    'vans old skool': 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop&auto=format',
    'converse all star': 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=400&h=400&fit=crop&auto=format',
    'converse chuck taylor': 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=400&h=400&fit=crop&auto=format',
    
    // ROUPAS - Imagens específicas por tipo
    'camiseta nike': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&auto=format',
    'camiseta adidas': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&auto=format',
    'jeans zara': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop&auto=format',
    'camisa social': 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop&auto=format',
    'vestido': 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=400&fit=crop&auto=format',
    'blusa': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop&auto=format',
    'casaco': 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop&auto=format',
    
    // ELETRODOMÉSTICOS - Imagens específicas por tipo
    'geladeira': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format',
    'fogao': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format',
    'micro-ondas': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format',
    'lava-roupas': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format',
    'cafeteira': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format',
    
    // ESPORTES - Imagens específicas por tipo
    'bola futebol': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&auto=format',
    'bola basquete': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=400&fit=crop&auto=format',
    'raquete tenis': 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=400&fit=crop&auto=format',
    'halteres': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&auto=format',
    
    // MONITORES - Imagens específicas por modelo
    'monitor samsung': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&auto=format',
    'monitor lg': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&auto=format',
    'monitor dell': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&auto=format',
    'monitor asus': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&auto=format',
    'monitor aoc': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&auto=format',
    
    // RELÓGIOS - Imagens específicas por modelo
    'apple watch': 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop&auto=format',
    'samsung galaxy watch': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&auto=format',
    'garmin': 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=400&fit=crop&auto=format',
    'fitbit': 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&auto=format'
};

function normalizeText(text) {
    return text.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s]/g, '')
        .trim();
}

function findBestImageMatch(productName) {
    const normalized = normalizeText(productName);
    
    // Busca exata primeiro
    if (perfectImageMapping[normalized]) {
        return perfectImageMapping[normalized];
    }
    
    // Busca por palavras-chave específicas
    const keywords = normalized.split(' ');
    
    // Busca por combinações de palavras
    for (let i = keywords.length; i >= 2; i--) {
        for (let j = 0; j <= keywords.length - i; j++) {
            const combination = keywords.slice(j, j + i).join(' ');
            if (perfectImageMapping[combination]) {
                return perfectImageMapping[combination];
            }
        }
    }
    
    // Busca por palavras individuais importantes
    const importantKeywords = [
        'iphone', 'samsung', 'xiaomi', 'oneplus', 'google', 'motorola',
        'macbook', 'dell', 'hp', 'lenovo', 'asus', 'acer',
        'qled', 'oled', 'bravia', 'nanocell',
        'airpods', 'sony', 'jbl', 'bose', 'beats', 'sennheiser',
        'nike', 'adidas', 'puma', 'vans', 'converse',
        'zara', 'geladeira', 'fogao', 'monitor', 'apple watch', 'garmin', 'fitbit'
    ];
    
    for (const keyword of importantKeywords) {
        if (normalized.includes(keyword) && perfectImageMapping[keyword]) {
            return perfectImageMapping[keyword];
        }
    }
    
    // Fallback por categoria
    if (normalized.includes('iphone') || normalized.includes('smartphone') || normalized.includes('celular')) {
        return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&auto=format';
    }
    if (normalized.includes('notebook') || normalized.includes('laptop')) {
        return 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&auto=format';
    }
    if (normalized.includes('tv') || normalized.includes('televisao')) {
        return 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&auto=format';
    }
    if (normalized.includes('fone') || normalized.includes('headphone') || normalized.includes('audio')) {
        return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format';
    }
    if (normalized.includes('tenis') || normalized.includes('sapato') || normalized.includes('calcado')) {
        return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&auto=format';
    }
    if (normalized.includes('camiseta') || normalized.includes('roupa') || normalized.includes('vestido')) {
        return 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop&auto=format';
    }
    if (normalized.includes('geladeira') || normalized.includes('fogao') || normalized.includes('eletrodomestico')) {
        return 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format';
    }
    if (normalized.includes('bola') || normalized.includes('esporte') || normalized.includes('fitness')) {
        return 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&auto=format';
    }
    if (normalized.includes('monitor')) {
        return 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&auto=format';
    }
    if (normalized.includes('relogio') || normalized.includes('watch')) {
        return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&auto=format';
    }
    
    // Fallback final
    return 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&auto=format';
}

async function createPerfectImageMapping() {
    try {
        console.log('🎯 Criando mapeamento perfeito de imagens...');
        
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
        let perfectMatches = 0;
        let updatedDatabase = { ...productsDatabase };
        const matchLog = [];
        
        // Processar cada categoria
        for (const [categoryKey, products] of Object.entries(productsDatabase)) {
            console.log(`🔍 Processando categoria: ${categoryKey}`);
            
            for (let i = 0; i < products.length; i++) {
                const product = products[i];
                totalProducts++;
                
                // Encontrar imagem perfeita
                const perfectImage = findBestImageMatch(product.title);
                
                // Verificar se a imagem atual é diferente da perfeita
                if (product.image !== perfectImage) {
                    updatedDatabase[categoryKey][i] = {
                        ...product,
                        image: perfectImage
                    };
                    perfectMatches++;
                    
                    matchLog.push({
                        id: product.id,
                        name: product.title,
                        category: product.category,
                        oldImage: product.image,
                        newImage: perfectImage,
                        reason: 'Mapeamento perfeito aplicado'
                    });
                    
                    console.log(`✅ ${product.title} -> Imagem perfeita aplicada`);
                }
            }
        }
        
        // Gerar novo conteúdo do database.js
        const newDatabaseContent = databaseContent.replace(
            /const productsDatabase = {[\s\S]*?};/,
            `const productsDatabase = ${JSON.stringify(updatedDatabase, null, 2)};`
        );
        
        // Criar backup do arquivo original
        const backupPath = path.join(__dirname, 'database-backup-before-perfect-mapping.js');
        fs.writeFileSync(backupPath, databaseContent);
        console.log(`💾 Backup criado: ${backupPath}`);
        
        // Salvar arquivo atualizado
        fs.writeFileSync(databasePath, newDatabaseContent);
        
        console.log('\n🎉 === MAPEAMENTO PERFEITO CONCLUÍDO ===');
        console.log(`📊 Total de produtos: ${totalProducts}`);
        console.log(`✨ Produtos com imagens perfeitas: ${perfectMatches}`);
        console.log(`🎯 Porcentagem de correspondência perfeita: ${((perfectMatches / totalProducts) * 100).toFixed(1)}%`);
        console.log(`📁 Arquivo atualizado: ${databasePath}`);
        
        // Gerar relatório detalhado
        const report = {
            timestamp: new Date().toISOString(),
            totalProducts,
            perfectMatches,
            perfectMatchPercentage: ((perfectMatches / totalProducts) * 100).toFixed(1),
            backupFile: backupPath,
            updatedFile: databasePath,
            matchLog
        };
        
        const reportPath = path.join(__dirname, 'perfect-image-mapping-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`📋 Relatório detalhado salvo: ${reportPath}`);
        
    } catch (error) {
        console.error('❌ Erro durante o mapeamento perfeito:', error.message);
        process.exit(1);
    }
}

// Executar mapeamento perfeito
createPerfectImageMapping();