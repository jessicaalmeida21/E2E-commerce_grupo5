// Script para investigar imagens que não correspondem aos nomes dos produtos
const fs = require('fs');
const path = require('path');

// Função para normalizar texto para comparação
function normalizeText(text) {
    return text.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .replace(/[^a-z0-9\s]/g, '') // Remove caracteres especiais
        .replace(/\s+/g, ' ')
        .trim();
}

// Função para extrair palavras-chave do nome do produto
function extractKeywords(productName) {
    const normalized = normalizeText(productName);
    const words = normalized.split(' ');
    
    // Filtrar palavras muito comuns que não são úteis para matching
    const stopWords = ['de', 'da', 'do', 'com', 'para', 'em', 'e', 'o', 'a', 'os', 'as', 'um', 'uma'];
    
    return words.filter(word => 
        word.length > 2 && 
        !stopWords.includes(word)
    );
}

// Função para verificar se a imagem corresponde ao produto
function checkImageMatch(product) {
    const productKeywords = extractKeywords(product.name);
    const imageUrl = product.image;
    
    if (!imageUrl || imageUrl.includes('placeholder') || imageUrl.includes('undefined')) {
        return {
            match: false,
            reason: 'Imagem placeholder ou undefined',
            confidence: 0
        };
    }
    
    // Para imagens do Unsplash, verificar se a URL contém palavras relacionadas
    if (imageUrl.includes('unsplash.com')) {
        // Para imagens do Unsplash, vamos verificar se o produto tem palavras-chave relacionadas à categoria
        const categoryKeywords = {
            'smartphones': ['phone', 'mobile', 'iphone', 'samsung', 'galaxy', 'pixel'],
            'notebooks': ['laptop', 'notebook', 'computer', 'macbook', 'dell', 'hp'],
            'televisoes': ['tv', 'television', 'smart', 'samsung', 'lg'],
            'audio': ['headphone', 'speaker', 'audio', 'sound', 'music'],
            'calcados': ['shoe', 'sneaker', 'boot', 'nike', 'adidas'],
            'roupas': ['shirt', 'dress', 'clothing', 'fashion'],
            'eletrodomesticos': ['appliance', 'kitchen', 'home'],
            'esportes': ['sport', 'fitness', 'gym', 'exercise'],
            'monitores': ['monitor', 'display', 'screen'],
            'relogios': ['watch', 'time', 'clock']
        };
        
        const productCategory = normalizeText(product.category);
        const expectedKeywords = categoryKeywords[productCategory] || [];
        
        // Verificar se o nome do produto contém palavras da categoria esperada
        let categoryMatch = false;
        for (const keyword of expectedKeywords) {
            if (productKeywords.some(pk => pk.includes(keyword) || keyword.includes(pk))) {
                categoryMatch = true;
                break;
            }
        }
        
        return {
            match: categoryMatch,
            confidence: categoryMatch ? 70 : 20,
            reason: categoryMatch ? 'Produto compatível com categoria' : 'Produto pode não corresponder à categoria da imagem',
            productKeywords,
            imageKeywords: expectedKeywords,
            isUnsplash: true
        };
    }
    
    // Para outras imagens, usar análise de nome de arquivo
    const imageName = path.basename(imageUrl, path.extname(imageUrl));
    const imageKeywords = extractKeywords(imageName);
    
    // Calcular correspondência
    let matchCount = 0;
    let totalKeywords = productKeywords.length;
    
    for (const keyword of productKeywords) {
        if (imageKeywords.some(imgKeyword => 
            imgKeyword.includes(keyword) || keyword.includes(imgKeyword)
        )) {
            matchCount++;
        }
    }
    
    const confidence = totalKeywords > 0 ? (matchCount / totalKeywords) * 100 : 0;
    
    return {
        match: confidence > 30, // Considerar match se > 30% das palavras correspondem
        confidence: Math.round(confidence),
        reason: confidence <= 30 ? 'Baixa correspondência entre nome e imagem' : 'Boa correspondência',
        productKeywords,
        imageKeywords,
        matchCount,
        totalKeywords,
        isUnsplash: false
    };
}

// Carregar o database atual
const databasePath = path.join(__dirname, 'js', 'database.js');
const databaseContent = fs.readFileSync(databasePath, 'utf8');

// Extrair os produtos do database - nova estrutura
const databaseMatch = databaseContent.match(/const productsDatabase = ({[\s\S]*?});/);
if (!databaseMatch) {
    console.error('Não foi possível encontrar o productsDatabase no database.js');
    process.exit(1);
}

let productsDatabase;
try {
    // Usar eval para extrair o objeto (cuidado: só use em scripts de desenvolvimento)
    eval(`productsDatabase = ${databaseMatch[1]}`);
} catch (error) {
    console.error('Erro ao parsear productsDatabase:', error);
    process.exit(1);
}

// Converter estrutura de categorias em array de produtos
const products = [];
Object.keys(productsDatabase).forEach(category => {
    if (Array.isArray(productsDatabase[category])) {
        productsDatabase[category].forEach(product => {
            products.push({
                ...product,
                name: product.title, // Usar title como name
                category: product.category
            });
        });
    }
});

console.log(`Analisando ${products.length} produtos...`);

// Analisar todos os produtos
const analysis = {
    total: products.length,
    matches: 0,
    mismatches: 0,
    problems: []
};

console.log('\n=== ANÁLISE DE CORRESPONDÊNCIA NOME-IMAGEM ===\n');

products.forEach((product, index) => {
    const result = checkImageMatch(product);
    
    if (result.match) {
        analysis.matches++;
    } else {
        analysis.mismatches++;
        analysis.problems.push({
            id: product.id,
            name: product.name,
            category: product.category,
            image: product.image,
            confidence: result.confidence,
            reason: result.reason,
            productKeywords: result.productKeywords,
            imageKeywords: result.imageKeywords,
            brand: product.brand,
            isUnsplash: result.isUnsplash
        });
    }
    
    // Mostrar progresso
    if ((index + 1) % 50 === 0) {
        console.log(`Processados: ${index + 1}/${products.length}`);
    }
});

// Relatório final
console.log('\n=== RELATÓRIO FINAL ===');
console.log(`Total de produtos: ${analysis.total}`);
console.log(`Correspondências corretas: ${analysis.matches} (${Math.round((analysis.matches/analysis.total)*100)}%)`);
console.log(`Correspondências incorretas: ${analysis.mismatches} (${Math.round((analysis.mismatches/analysis.total)*100)}%)`);

// Agrupar problemas por categoria
const problemsByCategory = {};
analysis.problems.forEach(problem => {
    if (!problemsByCategory[problem.category]) {
        problemsByCategory[problem.category] = [];
    }
    problemsByCategory[problem.category].push(problem);
});

console.log('\n=== PROBLEMAS POR CATEGORIA ===');
Object.keys(problemsByCategory).forEach(category => {
    const count = problemsByCategory[category].length;
    console.log(`${category}: ${count} problemas`);
});

// Mostrar alguns exemplos de problemas
console.log('\n=== EXEMPLOS DE PROBLEMAS (primeiros 10) ===');
analysis.problems.slice(0, 10).forEach(problem => {
    console.log(`\nID: ${problem.id}`);
    console.log(`Nome: ${problem.name}`);
    console.log(`Categoria: ${problem.category}`);
    console.log(`Marca: ${problem.brand}`);
    console.log(`Imagem: ${problem.image}`);
    console.log(`Confiança: ${problem.confidence}%`);
    console.log(`Palavras do produto: ${problem.productKeywords.join(', ')}`);
    console.log(`Palavras da imagem: ${problem.imageKeywords.join(', ')}`);
    console.log(`Razão: ${problem.reason}`);
    console.log(`É Unsplash: ${problem.isUnsplash ? 'Sim' : 'Não'}`);
});

// Salvar relatório detalhado
const reportPath = path.join(__dirname, 'image-name-mismatch-report.json');
fs.writeFileSync(reportPath, JSON.stringify({
    summary: {
        total: analysis.total,
        matches: analysis.matches,
        mismatches: analysis.mismatches,
        matchPercentage: Math.round((analysis.matches/analysis.total)*100),
        mismatchPercentage: Math.round((analysis.mismatches/analysis.total)*100)
    },
    problemsByCategory,
    allProblems: analysis.problems
}, null, 2));

console.log(`\nRelatório detalhado salvo em: ${reportPath}`);
console.log('\n=== ANÁLISE CONCLUÍDA ===');