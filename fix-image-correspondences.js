const fs = require('fs');
const path = require('path');

// Mapeamento de imagens corretas por categoria e marca
const imageMapping = {
    smartphones: {
        apple: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop&auto=format',
        samsung: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop&auto=format',
        xiaomi: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop&auto=format',
        oneplus: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&auto=format',
        google: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop&auto=format',
        motorola: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop&auto=format',
        default: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&auto=format'
    },
    notebooks: {
        apple: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&auto=format',
        dell: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&auto=format',
        hp: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop&auto=format',
        lenovo: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop&auto=format',
        asus: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop&auto=format',
        acer: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=400&fit=crop&auto=format',
        default: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&auto=format'
    },
    televisoes: {
        samsung: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&auto=format',
        lg: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop&auto=format',
        sony: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&auto=format',
        tcl: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop&auto=format',
        philips: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&auto=format',
        default: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&auto=format'
    },
    audio: {
        sony: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format',
        jbl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop&auto=format',
        bose: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=400&fit=crop&auto=format',
        beats: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop&auto=format',
        sennheiser: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop&auto=format',
        default: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format'
    },
    calcados: {
        nike: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&auto=format',
        adidas: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&auto=format',
        puma: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop&auto=format',
        vans: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop&auto=format',
        converse: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=400&h=400&fit=crop&auto=format',
        default: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&auto=format'
    },
    roupas: {
        nike: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&auto=format',
        adidas: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&auto=format',
        zara: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop&auto=format',
        hm: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop&auto=format',
        uniqlo: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=400&fit=crop&auto=format',
        default: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop&auto=format'
    },
    eletrodomesticos: {
        brastemp: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format',
        electrolux: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format',
        consul: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format',
        lg: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format',
        samsung: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format',
        default: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format'
    },
    esportes: {
        nike: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&auto=format',
        adidas: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&auto=format',
        wilson: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=400&fit=crop&auto=format',
        spalding: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=400&fit=crop&auto=format',
        default: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&auto=format'
    },
    monitores: {
        samsung: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&auto=format',
        lg: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&auto=format',
        dell: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&auto=format',
        asus: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&auto=format',
        aoc: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&auto=format',
        default: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&auto=format'
    },
    relogios: {
        apple: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop&auto=format',
        samsung: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&auto=format',
        garmin: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=400&fit=crop&auto=format',
        fitbit: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&auto=format',
        default: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&auto=format'
    }
};

function normalizeText(text) {
    return text.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s]/g, '')
        .trim();
}

function getBrandFromName(productName) {
    const normalized = normalizeText(productName);
    const brands = [
        'apple', 'samsung', 'xiaomi', 'oneplus', 'google', 'motorola',
        'dell', 'hp', 'lenovo', 'asus', 'acer', 'lg', 'sony', 'tcl', 'philips',
        'jbl', 'bose', 'beats', 'sennheiser', 'nike', 'adidas', 'puma', 'vans', 'converse',
        'zara', 'hm', 'uniqlo', 'brastemp', 'electrolux', 'consul', 'wilson', 'spalding',
        'aoc', 'garmin', 'fitbit'
    ];
    
    for (const brand of brands) {
        if (normalized.includes(brand)) {
            return brand;
        }
    }
    return null;
}

function getCategoryKey(category) {
    const categoryMap = {
        'smartphones': 'smartphones',
        'notebooks': 'notebooks',
        'televisões': 'televisoes',
        'áudio e som': 'audio',
        'calçados': 'calcados',
        'roupas': 'roupas',
        'eletrodomésticos': 'eletrodomesticos',
        'esportes e lazer': 'esportes',
        'monitores': 'monitores',
        'relógios': 'relogios'
    };
    
    return categoryMap[normalizeText(category)] || 'default';
}

function getCorrectImage(product) {
    const categoryKey = getCategoryKey(product.category);
    const brand = getBrandFromName(product.title);
    
    if (imageMapping[categoryKey]) {
        if (brand && imageMapping[categoryKey][brand]) {
            return imageMapping[categoryKey][brand];
        }
        return imageMapping[categoryKey].default;
    }
    
    // Fallback para categoria não mapeada
    return 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&auto=format';
}

async function fixImageCorrespondences() {
    try {
        console.log('Iniciando correção das correspondências nome-imagem...');
        
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
        let fixedProducts = 0;
        let updatedDatabase = { ...productsDatabase };
        
        // Processar cada categoria
        for (const [categoryKey, products] of Object.entries(productsDatabase)) {
            console.log(`Processando categoria: ${categoryKey}`);
            
            for (let i = 0; i < products.length; i++) {
                const product = products[i];
                totalProducts++;
                
                // Obter imagem correta
                const correctImage = getCorrectImage(product);
                
                // Verificar se a imagem atual é diferente da correta
                if (product.image !== correctImage) {
                    updatedDatabase[categoryKey][i] = {
                        ...product,
                        image: correctImage
                    };
                    fixedProducts++;
                    
                    console.log(`Corrigido: ${product.title} - Nova imagem: ${correctImage}`);
                }
            }
        }
        
        // Gerar novo conteúdo do database.js
        const newDatabaseContent = databaseContent.replace(
            /const productsDatabase = {[\s\S]*?};/,
            `const productsDatabase = ${JSON.stringify(updatedDatabase, null, 2)};`
        );
        
        // Criar backup do arquivo original
        const backupPath = path.join(__dirname, 'database-backup-before-image-fix.js');
        fs.writeFileSync(backupPath, databaseContent);
        console.log(`Backup criado: ${backupPath}`);
        
        // Salvar arquivo atualizado
        fs.writeFileSync(databasePath, newDatabaseContent);
        
        console.log('\n=== CORREÇÃO CONCLUÍDA ===');
        console.log(`Total de produtos: ${totalProducts}`);
        console.log(`Produtos corrigidos: ${fixedProducts}`);
        console.log(`Porcentagem corrigida: ${((fixedProducts / totalProducts) * 100).toFixed(1)}%`);
        console.log(`Arquivo atualizado: ${databasePath}`);
        
        // Gerar relatório de correções
        const report = {
            timestamp: new Date().toISOString(),
            totalProducts,
            fixedProducts,
            fixedPercentage: ((fixedProducts / totalProducts) * 100).toFixed(1),
            backupFile: backupPath,
            updatedFile: databasePath
        };
        
        const reportPath = path.join(__dirname, 'image-fix-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`Relatório salvo: ${reportPath}`);
        
    } catch (error) {
        console.error('Erro durante a correção:', error.message);
        process.exit(1);
    }
}

// Executar correção
fixImageCorrespondences();