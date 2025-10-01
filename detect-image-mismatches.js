const fs = require('fs');

// Ler o database.js
const databaseContent = fs.readFileSync('./js/database.js', 'utf8');

// Extrair o objeto productsDatabase
const productsDatabaseMatch = databaseContent.match(/const productsDatabase = ({[\s\S]*?});[\s\S]*?(?=const|$)/);
if (!productsDatabaseMatch) {
    console.log('❌ Erro: Não foi possível encontrar o productsDatabase');
    process.exit(1);
}

// Avaliar o objeto productsDatabase
const productsDatabase = eval(`(${productsDatabaseMatch[1]})`);

// Converter para array único
let products = [];
Object.keys(productsDatabase).forEach(category => {
    if (Array.isArray(productsDatabase[category])) {
        products = products.concat(productsDatabase[category]);
    }
});

console.log('🔍 ANÁLISE DE INCOMPATIBILIDADES PRODUTO-IMAGEM');
console.log('==============================================');
console.log(`📊 Total de produtos: ${products.length}`);

// Palavras-chave para categorias
const categoryKeywords = {
    smartphone: ['iphone', 'galaxy', 'pixel', 'oneplus', 'xiaomi', 'huawei', 'motorola', 'lg', 'sony', 'nokia', 'phone', 'celular'],
    notebook: ['macbook', 'notebook', 'laptop', 'thinkpad', 'inspiron', 'pavilion', 'ideapad', 'aspire', 'zenbook', 'vivobook'],
    televisao: ['tv', 'televisão', 'smart tv', 'oled', 'qled', 'led', 'samsung tv', 'lg tv', 'sony tv'],
    monitor: ['monitor', 'display', 'gaming monitor', 'ultrawide'],
    eletrodomestico: ['geladeira', 'fogão', 'micro-ondas', 'microondas', 'cafeteira', 'liquidificador', 'batedeira', 'aspirador', 'ferro', 'lavadora', 'secadora'],
    roupa: ['camiseta', 'camisa', 'calça', 'jeans', 'vestido', 'saia', 'blusa', 'shorts', 'bermuda', 'moletom', 'jaqueta'],
    esporte: ['tênis', 'chuteira', 'bola', 'raquete', 'halteres', 'esteira', 'bicicleta', 'patins', 'skate'],
    relogio: ['relógio', 'smartwatch', 'apple watch', 'galaxy watch'],
    audio: ['fone', 'headphone', 'earbuds', 'airpods', 'speaker', 'caixa de som', 'soundbar']
};

// Palavras-chave para imagens (baseado nos IDs do Unsplash)
const imageKeywords = {
    phone: ['phone', 'smartphone', 'mobile', 'iphone', 'android', 'cellular'],
    laptop: ['laptop', 'notebook', 'computer', 'macbook', 'thinkpad'],
    tv: ['tv', 'television', 'display', 'screen', 'monitor'],
    appliance: ['kitchen', 'appliance', 'refrigerator', 'stove', 'microwave', 'coffee'],
    clothing: ['shirt', 'clothing', 'fashion', 'wear', 'apparel', 'textile'],
    sports: ['sport', 'fitness', 'gym', 'exercise', 'athletic', 'running'],
    watch: ['watch', 'time', 'wrist', 'smartwatch'],
    audio: ['headphone', 'speaker', 'audio', 'sound', 'music'],
    chair: ['chair', 'seat', 'furniture', 'office'],
    generic: ['product', 'item', 'object', 'thing']
};

let mismatches = [];
let totalMismatches = 0;

// Função para detectar categoria do produto
function detectProductCategory(name, category) {
    const text = (name + ' ' + category).toLowerCase();
    
    for (const [cat, keywords] of Object.entries(categoryKeywords)) {
        if (keywords.some(keyword => text.includes(keyword))) {
            return cat;
        }
    }
    return 'outros';
}

// Função para detectar tipo da imagem baseado no ID
function detectImageType(imageUrl) {
    if (!imageUrl) return 'unknown';
    
    const imageId = imageUrl.toLowerCase();
    
    // Verificar se é uma cadeira (problema conhecido)
    if (imageId.includes('chair') || imageId.includes('seat') || imageId.includes('furniture')) {
        return 'chair';
    }
    
    // Detectar outros tipos
    for (const [type, keywords] of Object.entries(imageKeywords)) {
        if (keywords.some(keyword => imageId.includes(keyword))) {
            return type;
        }
    }
    
    return 'generic';
}

// Função para verificar compatibilidade
function isCompatible(productCategory, imageType) {
    const compatibility = {
        smartphone: ['phone', 'generic'],
        notebook: ['laptop', 'generic'],
        televisao: ['tv', 'generic'],
        monitor: ['tv', 'laptop', 'generic'],
        eletrodomestico: ['appliance', 'generic'],
        roupa: ['clothing', 'generic'],
        esporte: ['sports', 'generic'],
        relogio: ['watch', 'generic'],
        audio: ['audio', 'generic'],
        outros: ['generic', 'phone', 'laptop', 'tv', 'appliance', 'clothing', 'sports', 'watch', 'audio']
    };
    
    return compatibility[productCategory]?.includes(imageType) || false;
}

// Analisar cada produto
products.forEach((product, index) => {
    const productCategory = detectProductCategory(product.title, product.category);
    const imageType = detectImageType(product.image);
    
    // Verificar se há incompatibilidade
    if (imageType === 'chair') {
        mismatches.push({
            index: index + 1,
            id: product.id,
            name: product.title,
            category: product.category,
            detectedCategory: productCategory,
            image: product.image,
            imageType: imageType,
            problem: 'CADEIRA_INCORRETA',
            severity: 'CRÍTICO'
        });
        totalMismatches++;
    } else if (!isCompatible(productCategory, imageType)) {
        mismatches.push({
            index: index + 1,
            id: product.id,
            name: product.title,
            category: product.category,
            detectedCategory: productCategory,
            image: product.image,
            imageType: imageType,
            problem: 'INCOMPATIBILIDADE',
            severity: 'ALTO'
        });
        totalMismatches++;
    }
});

// Relatório detalhado
console.log(`\n🚨 PRODUTOS COM PROBLEMAS: ${totalMismatches}`);
console.log('==========================================');

if (mismatches.length > 0) {
    // Agrupar por tipo de problema
    const chairProblems = mismatches.filter(m => m.problem === 'CADEIRA_INCORRETA');
    const incompatibilityProblems = mismatches.filter(m => m.problem === 'INCOMPATIBILIDADE');
    
    if (chairProblems.length > 0) {
        console.log(`\n🪑 CADEIRAS INCORRETAS: ${chairProblems.length}`);
        chairProblems.forEach((mismatch, i) => {
            console.log(`${i + 1}. ${mismatch.name} (ID: ${mismatch.id})`);
            console.log(`   Categoria: ${mismatch.category} → ${mismatch.detectedCategory}`);
            console.log(`   Imagem: ${mismatch.image}`);
            console.log('');
        });
    }
    
    if (incompatibilityProblems.length > 0) {
        console.log(`\n⚠️  INCOMPATIBILIDADES: ${incompatibilityProblems.length}`);
        incompatibilityProblems.forEach((mismatch, i) => {
            console.log(`${i + 1}. ${mismatch.name} (ID: ${mismatch.id})`);
            console.log(`   Categoria: ${mismatch.category} → ${mismatch.detectedCategory}`);
            console.log(`   Tipo de imagem: ${mismatch.imageType}`);
            console.log(`   Imagem: ${mismatch.image}`);
            console.log('');
        });
    }
    
    // Salvar relatório detalhado
    const report = {
        timestamp: new Date().toISOString(),
        totalProducts: products.length,
        totalMismatches: totalMismatches,
        chairProblems: chairProblems.length,
        incompatibilityProblems: incompatibilityProblems.length,
        mismatches: mismatches
    };
    
    fs.writeFileSync('image-mismatch-report.json', JSON.stringify(report, null, 2));
    console.log('📄 Relatório salvo em: image-mismatch-report.json');
    
} else {
    console.log('✅ Nenhuma incompatibilidade encontrada!');
}

console.log('\n🏁 Análise concluída!');