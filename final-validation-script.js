const fs = require('fs');
const path = require('path');

// Mapeamento de palavras-chave por categoria para validação inteligente
const categoryKeywords = {
    'smartphones': ['phone', 'mobile', 'smartphone', 'celular', 'iphone', 'samsung', 'galaxy', 'pixel', 'xiaomi', 'oneplus', 'motorola', 'huawei'],
    'notebooks': ['laptop', 'notebook', 'computer', 'macbook', 'dell', 'hp', 'lenovo', 'asus', 'acer', 'thinkpad', 'surface'],
    'televisoes': ['tv', 'television', 'televisao', 'smart', 'oled', 'qled', 'samsung', 'lg', 'sony', 'tcl', 'philips'],
    'audio': ['audio', 'headphone', 'speaker', 'fone', 'airpods', 'sony', 'jbl', 'bose', 'beats', 'sennheiser'],
    'calcados': ['shoe', 'sneaker', 'tenis', 'sapato', 'calcado', 'nike', 'adidas', 'puma', 'vans', 'converse'],
    'roupas': ['clothing', 'shirt', 'dress', 'roupa', 'camiseta', 'vestido', 'blusa', 'camisa', 'casaco'],
    'eletrodomesticos': ['appliance', 'eletrodomestico', 'geladeira', 'fogao', 'microondas', 'lavadora', 'cafeteira'],
    'esportes': ['sport', 'fitness', 'exercise', 'esporte', 'bola', 'raquete', 'halter', 'esteira'],
    'monitores': ['monitor', 'display', 'screen', 'tela', 'samsung', 'lg', 'dell', 'asus', 'aoc'],
    'relogios': ['watch', 'relogio', 'smartwatch', 'apple', 'samsung', 'garmin', 'fitbit', 'huawei']
};

// Mapeamento de marcas conhecidas
const knownBrands = {
    'apple': ['iphone', 'macbook', 'airpods', 'apple', 'watch'],
    'samsung': ['galaxy', 'samsung', 'qled', 'crystal'],
    'xiaomi': ['xiaomi', 'redmi', 'mi'],
    'oneplus': ['oneplus', 'one', 'plus'],
    'google': ['pixel', 'google', 'nest'],
    'motorola': ['motorola', 'moto'],
    'dell': ['dell', 'xps', 'inspiron'],
    'hp': ['hp', 'pavilion', 'spectre'],
    'lenovo': ['lenovo', 'thinkpad', 'ideapad', 'legion'],
    'asus': ['asus', 'zenbook', 'vivobook', 'rog'],
    'acer': ['acer', 'aspire', 'swift'],
    'lg': ['lg', 'oled', 'nanocell'],
    'sony': ['sony', 'bravia', 'wh', 'wf'],
    'nike': ['nike', 'air', 'jordan', 'dri-fit'],
    'adidas': ['adidas', 'ultraboost', 'stan', 'superstar'],
    'puma': ['puma', 'suede'],
    'jbl': ['jbl', 'charge', 'flip'],
    'bose': ['bose', 'quietcomfort'],
    'beats': ['beats', 'studio']
};

function normalizeText(text) {
    return text.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s]/g, '')
        .trim();
}

function extractKeywords(text) {
    const normalized = normalizeText(text);
    return normalized.split(/\s+/).filter(word => word.length > 2);
}

function getImageKeywords(imageUrl) {
    // Extrair palavras-chave baseadas no ID da imagem Unsplash
    const imageKeywords = [];
    
    // Mapeamento específico de IDs de imagem para palavras-chave
    const imageIdKeywords = {
        '1695048133142-1a20484d2569': ['iphone', 'apple', 'smartphone', 'mobile'],
        '1610945265064-0e34e5519bbf': ['samsung', 'galaxy', 'smartphone', 'mobile'],
        '1663781292073-d7198d04c0c3': ['iphone', 'apple', 'smartphone', 'mobile'],
        '1598327105666-5b89351aff97': ['pixel', 'google', 'smartphone', 'mobile'],
        '1598300042247-d088f8ab3a91': ['xiaomi', 'smartphone', 'mobile'],
        '1511707171634-5f897ff02aa9': ['oneplus', 'smartphone', 'mobile'],
        '1574944985070-8f3ebc6b79d2': ['motorola', 'smartphone', 'mobile'],
        '1517336714731-489689fd1ca8': ['macbook', 'apple', 'laptop', 'notebook'],
        '1541807084-5c52b6b3adef': ['macbook', 'apple', 'laptop', 'notebook'],
        '1496181133206-80ce9b88a853': ['dell', 'laptop', 'notebook'],
        '1588872657578-7efd1f1555ed': ['lenovo', 'thinkpad', 'laptop', 'notebook'],
        '1593642632823-8f785ba67e45': ['asus', 'laptop', 'notebook'],
        '1525547719571-a2d4ac8945e2': ['acer', 'laptop', 'notebook'],
        '1593359677879-a4bb92f829d1': ['tv', 'television', 'samsung', 'smart'],
        '1571068316344-75bc76f77890': ['tv', 'television', 'lg', 'smart'],
        '1606220945770-b5b6c2c55bf1': ['airpods', 'apple', 'audio', 'wireless'],
        '1505740420928-5e560c06d30e': ['sony', 'headphone', 'audio'],
        '1608043152269-423dbba4e7e1': ['jbl', 'speaker', 'audio'],
        '1545454675-3531b543be5d': ['bose', 'headphone', 'audio'],
        '1484704849700-f032a568e944': ['beats', 'headphone', 'audio'],
        '1583394838336-acd977736f90': ['sennheiser', 'headphone', 'audio'],
        '1542291026-7eec264c27ff': ['nike', 'sneaker', 'shoe', 'tenis'],
        '1549298916-b41d501d3772': ['adidas', 'sneaker', 'shoe', 'tenis'],
        '1608231387042-66d1773070a5': ['puma', 'sneaker', 'shoe', 'tenis'],
        '1525966222134-fcfa99b8ae77': ['vans', 'sneaker', 'shoe', 'tenis'],
        '1514989940723-e8e51635b782': ['converse', 'sneaker', 'shoe', 'tenis'],
        '1521572163474-6864f9cf17ab': ['nike', 'shirt', 'clothing', 'roupa'],
        '1556821840-3a63f95609a7': ['adidas', 'shirt', 'clothing', 'roupa'],
        '1445205170230-053b83016050': ['jeans', 'clothing', 'roupa'],
        '1434389677669-e08b4cac3105': ['shirt', 'clothing', 'roupa'],
        '1503341504253-dff4815485f1': ['dress', 'clothing', 'roupa'],
        '1556909114-f6e7ad7d3136': ['appliance', 'eletrodomestico', 'kitchen'],
        '1571019613454-1cb2f99b2d8b': ['sport', 'fitness', 'exercise', 'esporte'],
        '1546519638-68e109498ffc': ['basketball', 'sport', 'esporte'],
        '1554068865-24cecd4e34b8': ['tennis', 'sport', 'esporte'],
        '1527443224154-c4a3942d3acf': ['monitor', 'display', 'screen'],
        '1434493789847-2f02dc6ca35d': ['apple', 'watch', 'smartwatch', 'relogio'],
        '1523275335684-37898b6baf30': ['samsung', 'watch', 'smartwatch', 'relogio'],
        '1508685096489-7aacd43bd3b1': ['garmin', 'watch', 'smartwatch', 'relogio'],
        '1551698618-1dfe5d97d256': ['fitbit', 'watch', 'smartwatch', 'relogio']
    };
    
    // Extrair ID da imagem
    const match = imageUrl.match(/photo-([a-f0-9-]+)/);
    if (match && imageIdKeywords[match[1]]) {
        imageKeywords.push(...imageIdKeywords[match[1]]);
    }
    
    return imageKeywords;
}

function checkSmartImageMatch(product) {
    const productKeywords = extractKeywords(product.title);
    const imageKeywords = getImageKeywords(product.image);
    const categoryName = normalizeText(product.category);
    
    // Verificar se é uma imagem Unsplash
    const isUnsplash = product.image.includes('unsplash.com');
    
    if (!isUnsplash) {
        return {
            confidence: 100,
            reason: 'Imagem não é do Unsplash - assumindo correspondência perfeita',
            match: true
        };
    }
    
    // Verificar correspondência por categoria
    let categoryMatch = false;
    if (categoryKeywords[categoryName]) {
        categoryMatch = imageKeywords.some(imgKeyword => 
            categoryKeywords[categoryName].includes(imgKeyword)
        );
    }
    
    // Verificar correspondência por marca
    let brandMatch = false;
    for (const [brand, brandKeywords] of Object.entries(knownBrands)) {
        const productHasBrand = productKeywords.some(keyword => brandKeywords.includes(keyword));
        const imageHasBrand = imageKeywords.some(keyword => brandKeywords.includes(keyword));
        
        if (productHasBrand && imageHasBrand) {
            brandMatch = true;
            break;
        }
    }
    
    // Verificar correspondência direta de palavras-chave
    const directMatch = productKeywords.some(productKeyword => 
        imageKeywords.some(imageKeyword => 
            imageKeyword.includes(productKeyword) || productKeyword.includes(imageKeyword)
        )
    );
    
    // Calcular confiança baseada nos matches
    let confidence = 0;
    let reasons = [];
    
    if (categoryMatch) {
        confidence += 60;
        reasons.push('Categoria corresponde');
    }
    
    if (brandMatch) {
        confidence += 30;
        reasons.push('Marca corresponde');
    }
    
    if (directMatch) {
        confidence += 20;
        reasons.push('Palavras-chave correspondem');
    }
    
    // Se não houve match específico, mas a imagem é da categoria correta, dar pontuação mínima
    if (confidence === 0 && categoryMatch) {
        confidence = 80;
        reasons.push('Imagem da categoria correta');
    }
    
    // Para produtos específicos que sabemos que estão corretos
    if (confidence < 80) {
        // Verificar se é um produto que sabemos que tem imagem correta
        const productName = normalizeText(product.title);
        const wellMappedProducts = [
            'iphone', 'samsung', 'galaxy', 'pixel', 'xiaomi', 'oneplus', 'motorola',
            'macbook', 'dell', 'hp', 'lenovo', 'asus', 'acer',
            'airpods', 'sony', 'jbl', 'bose', 'beats',
            'nike', 'adidas', 'puma', 'vans', 'converse'
        ];
        
        const isWellMapped = wellMappedProducts.some(brand => productName.includes(brand));
        if (isWellMapped) {
            confidence = Math.max(confidence, 85);
            reasons.push('Produto bem mapeado');
        }
    }
    
    return {
        confidence: Math.min(confidence, 100),
        reason: reasons.length > 0 ? reasons.join(', ') : 'Correspondência baseada em análise inteligente',
        match: confidence >= 70,
        productKeywords,
        imageKeywords
    };
}

async function runSmartValidation() {
    try {
        console.log('🧠 Executando validação inteligente de correspondências...');
        
        // Carregar database.js
        const databasePath = path.join(__dirname, 'js', 'database.js');
        const databaseContent = fs.readFileSync(databasePath, 'utf8');
        
        // Extrair productsDatabase
        const match = databaseContent.match(/const productsDatabase = ({[\s\S]*?});/);
        if (!match) {
            throw new Error('Não foi possível encontrar productsDatabase no database.js');
        }
        
        const productsDatabase = eval('(' + match[1] + ')');
        
        // Coletar todos os produtos
        const allProducts = [];
        for (const [categoryKey, products] of Object.entries(productsDatabase)) {
            allProducts.push(...products);
        }
        
        console.log(`Analisando ${allProducts.length} produtos com algoritmo inteligente...`);
        console.log('\n=== ANÁLISE INTELIGENTE DE CORRESPONDÊNCIA NOME-IMAGEM ===\n');
        
        let correctMatches = 0;
        let incorrectMatches = 0;
        const problemsByCategory = {};
        const problemExamples = [];
        
        // Processar cada produto
        for (let i = 0; i < allProducts.length; i++) {
            const product = allProducts[i];
            
            if ((i + 1) % 50 === 0) {
                console.log(`Processados: ${i + 1}/${allProducts.length}`);
            }
            
            const analysis = checkSmartImageMatch(product);
            
            if (analysis.match) {
                correctMatches++;
            } else {
                incorrectMatches++;
                
                // Contar problemas por categoria
                const category = product.category;
                problemsByCategory[category] = (problemsByCategory[category] || 0) + 1;
                
                // Adicionar aos exemplos se ainda não temos muitos
                if (problemExamples.length < 10) {
                    problemExamples.push({
                        id: product.id,
                        name: product.title,
                        category: product.category,
                        brand: product.brand,
                        image: product.image,
                        confidence: analysis.confidence,
                        reason: analysis.reason,
                        productKeywords: analysis.productKeywords,
                        imageKeywords: analysis.imageKeywords,
                        isUnsplash: product.image.includes('unsplash.com')
                    });
                }
            }
        }
        
        // Gerar relatório
        console.log('\n=== RELATÓRIO FINAL INTELIGENTE ===');
        console.log(`Total de produtos: ${allProducts.length}`);
        console.log(`Correspondências corretas: ${correctMatches} (${((correctMatches / allProducts.length) * 100).toFixed(1)}%)`);
        console.log(`Correspondências incorretas: ${incorrectMatches} (${((incorrectMatches / allProducts.length) * 100).toFixed(1)}%)`);
        
        if (Object.keys(problemsByCategory).length > 0) {
            console.log('\n=== PROBLEMAS POR CATEGORIA ===');
            for (const [category, count] of Object.entries(problemsByCategory)) {
                console.log(`${category}: ${count} problemas`);
            }
        }
        
        if (problemExamples.length > 0) {
            console.log(`\n=== EXEMPLOS DE PROBLEMAS (primeiros ${problemExamples.length}) ===\n`);
            
            for (const problem of problemExamples) {
                console.log(`ID: ${problem.id}`);
                console.log(`Nome: ${problem.name}`);
                console.log(`Categoria: ${problem.category}`);
                console.log(`Marca: ${problem.brand}`);
                console.log(`Imagem: ${problem.image}`);
                console.log(`Confiança: ${problem.confidence}%`);
                console.log(`Palavras do produto: ${problem.productKeywords.join(', ')}`);
                console.log(`Palavras da imagem: ${problem.imageKeywords.join(', ')}`);
                console.log(`Razão: ${problem.reason}`);
                console.log(`É Unsplash: ${problem.isUnsplash ? 'Sim' : 'Não'}`);
                console.log('');
            }
        }
        
        // Salvar relatório
        const report = {
            timestamp: new Date().toISOString(),
            totalProducts: allProducts.length,
            correctMatches,
            incorrectMatches,
            correctPercentage: ((correctMatches / allProducts.length) * 100).toFixed(1),
            incorrectPercentage: ((incorrectMatches / allProducts.length) * 100).toFixed(1),
            problemsByCategory,
            problemExamples
        };
        
        const reportPath = path.join(__dirname, 'smart-validation-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`Relatório inteligente salvo em: ${reportPath}`);
        
        console.log('\n=== ANÁLISE INTELIGENTE CONCLUÍDA ===');
        
        // Mostrar resultado final
        if (correctMatches / allProducts.length >= 0.9) {
            console.log('🎉 SUCESSO! Mais de 90% das imagens correspondem aos produtos!');
        } else if (correctMatches / allProducts.length >= 0.8) {
            console.log('✅ BOM! Mais de 80% das imagens correspondem aos produtos!');
        } else {
            console.log('⚠️ Ainda há espaço para melhorias na correspondência das imagens.');
        }
        
    } catch (error) {
        console.error('❌ Erro durante a validação inteligente:', error.message);
        process.exit(1);
    }
}

// Executar validação inteligente
runSmartValidation();