const fs = require('fs');

// Ler o database.js
const databaseContent = fs.readFileSync('./js/database.js', 'utf8');

// Extrair o objeto productsDatabase
const productsDatabaseMatch = databaseContent.match(/const productsDatabase = ({[\s\S]*?});[\s\S]*?(?=const|$)/);
if (!productsDatabaseMatch) {
    console.log('❌ Erro: Não foi possível encontrar o productsDatabase');
    process.exit(1);
}

const productsDatabase = eval(`(${productsDatabaseMatch[1]})`);

// Converter para array único
let products = [];
Object.keys(productsDatabase).forEach(category => {
    if (Array.isArray(productsDatabase[category])) {
        products = products.concat(productsDatabase[category]);
    }
});

console.log('🔍 ANÁLISE VISUAL DETALHADA DOS PRODUTOS');
console.log('======================================');
console.log(`📊 Total de produtos: ${products.length}`);

// Função para extrair ID da imagem Unsplash
function extractImageId(imageUrl) {
    if (!imageUrl) return 'NO_IMAGE';
    const match = imageUrl.match(/photo-([a-zA-Z0-9_-]+)/);
    return match ? match[1] : 'UNKNOWN_ID';
}

// Análise por categoria
const categoryAnalysis = {};
let suspiciousProducts = [];

products.forEach((product, index) => {
    const category = product.category || 'Sem Categoria';
    
    if (!categoryAnalysis[category]) {
        categoryAnalysis[category] = {
            count: 0,
            products: [],
            images: new Set()
        };
    }
    
    categoryAnalysis[category].count++;
    categoryAnalysis[category].images.add(extractImageId(product.image));
    
    // Adicionar produto para análise detalhada
    categoryAnalysis[category].products.push({
        id: product.id,
        title: product.title,
        brand: product.brand,
        image: product.image,
        imageId: extractImageId(product.image)
    });
    
    // Detectar produtos suspeitos baseado em palavras-chave específicas
    const title = product.title.toLowerCase();
    const imageId = extractImageId(product.image).toLowerCase();
    
    // Verificações específicas
    let suspicious = false;
    let reasons = [];
    
    // Smartphone com imagem não relacionada
    if (title.includes('iphone') || title.includes('galaxy') || title.includes('pixel')) {
        if (!imageId.includes('phone') && !imageId.includes('mobile') && !imageId.includes('iphone') && 
            !imageId.includes('samsung') && !imageId.includes('android') && !imageId.includes('cellular')) {
            suspicious = true;
            reasons.push('Smartphone com imagem não relacionada a telefone');
        }
    }
    
    // Notebook/Laptop com imagem não relacionada
    if (title.includes('macbook') || title.includes('notebook') || title.includes('laptop')) {
        if (!imageId.includes('laptop') && !imageId.includes('computer') && !imageId.includes('macbook') && 
            !imageId.includes('notebook') && !imageId.includes('thinkpad')) {
            suspicious = true;
            reasons.push('Notebook com imagem não relacionada a computador');
        }
    }
    
    // TV com imagem não relacionada
    if (title.includes('tv') || title.includes('televisão') || title.includes('smart tv')) {
        if (!imageId.includes('tv') && !imageId.includes('television') && !imageId.includes('screen') && 
            !imageId.includes('display') && !imageId.includes('monitor')) {
            suspicious = true;
            reasons.push('TV com imagem não relacionada a televisão');
        }
    }
    
    // Eletrodomésticos
    if (title.includes('geladeira') || title.includes('fogão') || title.includes('micro-ondas') || 
        title.includes('cafeteira') || title.includes('liquidificador')) {
        if (!imageId.includes('kitchen') && !imageId.includes('appliance') && !imageId.includes('coffee') && 
            !imageId.includes('refrigerator') && !imageId.includes('stove') && !imageId.includes('microwave')) {
            suspicious = true;
            reasons.push('Eletrodoméstico com imagem não relacionada');
        }
    }
    
    // Roupas
    if (title.includes('camiseta') || title.includes('camisa') || title.includes('calça') || 
        title.includes('vestido') || title.includes('jeans')) {
        if (!imageId.includes('shirt') && !imageId.includes('clothing') && !imageId.includes('fashion') && 
            !imageId.includes('wear') && !imageId.includes('apparel') && !imageId.includes('textile')) {
            suspicious = true;
            reasons.push('Roupa com imagem não relacionada a vestuário');
        }
    }
    
    // Relógios e Smartwatches - CORREÇÃO AQUI
    if (title.includes('watch') || title.includes('relógio') || title.includes('galaxy watch') || title.includes('apple watch')) {
        if (!imageId.includes('watch') && !imageId.includes('time') && !imageId.includes('wrist') && 
            !imageId.includes('smartwatch') && !imageId.includes('clock') && !imageId.includes('timepiece')) {
            suspicious = true;
            reasons.push('Relógio com imagem não relacionada a relógio');
        }
    }
    
    if (suspicious) {
        suspiciousProducts.push({
            index: index + 1,
            id: product.id,
            title: product.title,
            category: product.category,
            brand: product.brand,
            image: product.image,
            imageId: extractImageId(product.image),
            reasons: reasons
        });
    }
});

// Relatório por categoria
console.log('\n📊 ANÁLISE POR CATEGORIA:');
console.log('========================');
Object.keys(categoryAnalysis).forEach(category => {
    const data = categoryAnalysis[category];
    console.log(`\n📁 ${category}: ${data.count} produtos`);
    console.log(`🖼️  Imagens únicas: ${data.images.size}`);
    
    // Mostrar alguns exemplos
    console.log('📋 Exemplos:');
    data.products.slice(0, 3).forEach((product, i) => {
        console.log(`   ${i + 1}. ${product.title} (${product.brand})`);
        console.log(`      ID Imagem: ${product.imageId}`);
    });
});

// Produtos suspeitos
console.log(`\n🚨 PRODUTOS SUSPEITOS: ${suspiciousProducts.length}`);
console.log('====================================');

if (suspiciousProducts.length > 0) {
    suspiciousProducts.forEach((product, i) => {
        console.log(`\n${i + 1}. ${product.title} (ID: ${product.id})`);
        console.log(`   Categoria: ${product.category}`);
        console.log(`   Marca: ${product.brand}`);
        console.log(`   ID da Imagem: ${product.imageId}`);
        console.log(`   Problemas:`);
        product.reasons.forEach(reason => {
            console.log(`   - ${reason}`);
        });
        console.log(`   URL: ${product.image}`);
    });
    
    // Salvar relatório
    const report = {
        timestamp: new Date().toISOString(),
        totalProducts: products.length,
        suspiciousCount: suspiciousProducts.length,
        categoryAnalysis: Object.keys(categoryAnalysis).map(cat => ({
            category: cat,
            count: categoryAnalysis[cat].count,
            uniqueImages: categoryAnalysis[cat].images.size
        })),
        suspiciousProducts: suspiciousProducts
    };
    
    fs.writeFileSync('visual-analysis-report.json', JSON.stringify(report, null, 2));
    console.log('\n📄 Relatório detalhado salvo em: visual-analysis-report.json');
} else {
    console.log('✅ Nenhum produto suspeito encontrado na análise visual!');
}

console.log('\n🏁 Análise visual concluída!');