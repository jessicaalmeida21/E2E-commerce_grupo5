const fs = require('fs');

console.log('🔧 CORREÇÃO ESPECÍFICA DE IMAGENS DE CADEIRA EM PRODUTOS INCORRETOS');
console.log('==================================================================');

// Ler database.js
let databaseContent = fs.readFileSync('./js/database.js', 'utf8');

// Imagem de cadeira problemática identificada
const chairImageUrl = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&auto=format';

// Imagens de substituição por categoria/tipo de produto
const replacementImages = {
    // Eletrodomésticos
    'fogão': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format',
    'microondas': 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&auto=format',
    'geladeira': 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop&auto=format',
    'lava-louças': 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&h=400&fit=crop&auto=format',
    'aspirador': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&auto=format',
    'ar-condicionado': 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=400&fit=crop&auto=format',
    
    // Eletrônicos
    'tv': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&auto=format',
    'monitor': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&auto=format',
    'notebook': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&auto=format',
    'smartphone': 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop&auto=format',
    
    // Esportes
    'bola': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&auto=format',
    'equipamento': 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop&auto=format',
    
    // Roupas e Calçados
    'tênis': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&auto=format',
    'camiseta': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&auto=format',
    'calça': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&auto=format',
    
    // Áudio
    'fone': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format',
    'caixa': 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop&auto=format',
    
    // Relógios
    'relógio': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&auto=format',
    'watch': 'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=400&h=400&fit=crop&auto=format',
    
    // Padrão para produtos não identificados
    'default': 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&auto=format'
};

// Função para determinar a imagem correta baseada no título do produto
function getCorrectImageForProduct(title) {
    const titleLower = title.toLowerCase();
    
    // Eletrodomésticos
    if (titleLower.includes('fogão')) return replacementImages['fogão'];
    if (titleLower.includes('micro-ondas') || titleLower.includes('microondas')) return replacementImages['microondas'];
    if (titleLower.includes('geladeira') || titleLower.includes('refrigerador')) return replacementImages['geladeira'];
    if (titleLower.includes('lava-louças') || titleLower.includes('lava louças')) return replacementImages['lava-louças'];
    if (titleLower.includes('aspirador')) return replacementImages['aspirador'];
    if (titleLower.includes('ar-condicionado') || titleLower.includes('ar condicionado')) return replacementImages['ar-condicionado'];
    
    // Eletrônicos
    if (titleLower.includes('tv') || titleLower.includes('televisão') || titleLower.includes('televisao')) return replacementImages['tv'];
    if (titleLower.includes('monitor')) return replacementImages['monitor'];
    if (titleLower.includes('notebook') || titleLower.includes('laptop')) return replacementImages['notebook'];
    if (titleLower.includes('iphone') || titleLower.includes('galaxy') || titleLower.includes('smartphone')) return replacementImages['smartphone'];
    
    // Esportes
    if (titleLower.includes('bola')) return replacementImages['bola'];
    if (titleLower.includes('equipamento') || titleLower.includes('esporte')) return replacementImages['equipamento'];
    
    // Roupas e Calçados
    if (titleLower.includes('tênis') || titleLower.includes('tenis')) return replacementImages['tênis'];
    if (titleLower.includes('camiseta') || titleLower.includes('camisa')) return replacementImages['camiseta'];
    if (titleLower.includes('calça') || titleLower.includes('jeans')) return replacementImages['calça'];
    
    // Áudio
    if (titleLower.includes('fone') || titleLower.includes('headphone')) return replacementImages['fone'];
    if (titleLower.includes('caixa') || titleLower.includes('speaker')) return replacementImages['caixa'];
    
    // Relógios
    if (titleLower.includes('relógio') || titleLower.includes('relogio') || titleLower.includes('watch')) return replacementImages['relógio'];
    
    // Padrão
    return replacementImages['default'];
}

// Função para corrigir imagens
function fixChairImages() {
    let totalReplacements = 0;
    const corrections = [];
    
    console.log('🔍 Procurando produtos com imagem de cadeira...');
    
    // Dividir em linhas para análise mais precisa
    const lines = databaseContent.split('\\n');
    let currentProduct = null;
    let inProduct = false;
    let productLines = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Detectar início de produto
        if (line.trim().includes('"id":') && line.includes('PROD-')) {
            if (currentProduct && productLines.length > 0) {
                // Processar produto anterior
                processProduct(currentProduct, productLines, i - productLines.length);
            }
            
            inProduct = true;
            currentProduct = { id: '', title: '', category: '', image: '' };
            productLines = [line];
            
            // Extrair ID
            const idMatch = line.match(/"id":\\s*"([^"]+)"/);
            if (idMatch) currentProduct.id = idMatch[1];
        } else if (inProduct) {
            productLines.push(line);
            
            // Extrair informações
            if (line.includes('"title":')) {
                const titleMatch = line.match(/"title":\\s*"([^"]+)"/);
                if (titleMatch) currentProduct.title = titleMatch[1];
            }
            
            if (line.includes('"category":')) {
                const categoryMatch = line.match(/"category":\\s*"([^"]+)"/);
                if (categoryMatch) currentProduct.category = categoryMatch[1];
            }
            
            if (line.includes('"image":')) {
                const imageMatch = line.match(/"image":\\s*"([^"]+)"/);
                if (imageMatch) currentProduct.image = imageMatch[1];
            }
            
            // Detectar fim do produto
            if (line.trim() === '}' || line.trim() === '},') {
                processProduct(currentProduct, productLines, i - productLines.length + 1);
                inProduct = false;
                currentProduct = null;
                productLines = [];
            }
        }
    }
    
    function processProduct(product, lines, startLine) {
        if (product.image === chairImageUrl) {
            const correctImage = getCorrectImageForProduct(product.title);
            
            console.log(`\\n🔧 CORRIGINDO: ${product.title} (${product.category})`);
            console.log(`   ❌ Imagem atual: cadeira`);
            console.log(`   ✅ Nova imagem: ${correctImage.split('/').pop().split('?')[0]}`);
            
            // Substituir a imagem nas linhas do produto
            for (let j = 0; j < lines.length; j++) {
                if (lines[j].includes(chairImageUrl)) {
                    lines[j] = lines[j].replace(chairImageUrl, correctImage);
                }
            }
            
            // Atualizar no conteúdo principal
            const productText = lines.join('\\n');
            const originalProductText = productText.replace(correctImage, chairImageUrl);
            databaseContent = databaseContent.replace(originalProductText, productText);
            
            corrections.push({
                id: product.id,
                title: product.title,
                category: product.category,
                oldImage: 'cadeira',
                newImage: correctImage.split('/').pop().split('?')[0]
            });
            
            totalReplacements++;
        }
    }
    
    return { totalReplacements, corrections };
}

// Executar correções
console.log('🚀 Iniciando correção de imagens...');
const result = fixChairImages();

console.log('\\n📊 RESULTADO FINAL:');
console.log('===================');
console.log(`🔧 Total de correções: ${result.totalReplacements}`);

if (result.totalReplacements > 0) {
    console.log('\\n✅ PRODUTOS CORRIGIDOS:');
    console.log('=======================');
    result.corrections.forEach((correction, index) => {
        console.log(`${index + 1}. ${correction.title} (${correction.category})`);
        console.log(`   Nova imagem: ${correction.newImage}`);
    });
    
    // Salvar arquivo corrigido
    fs.writeFileSync('./js/database.js', databaseContent);
    console.log('\\n💾 Arquivo database.js atualizado com sucesso!');
    
    // Verificar se ainda existem imagens de cadeira
    const remainingChairs = (databaseContent.match(new RegExp(chairImageUrl.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'), 'g')) || []).length;
    console.log(`\\n🔍 Verificação: ${remainingChairs} imagens de cadeira restantes`);
    
    // Salvar relatório
    const report = {
        timestamp: new Date().toISOString(),
        totalCorrections: result.totalReplacements,
        corrections: result.corrections,
        remainingChairImages: remainingChairs
    };
    
    fs.writeFileSync('chair-corrections-report.json', JSON.stringify(report, null, 2));
    console.log('📄 Relatório salvo em: chair-corrections-report.json');
    
} else {
    console.log('ℹ️  Nenhuma correção necessária - não foram encontradas imagens de cadeira em produtos incorretos');
}

console.log('\\n🎉 Correção finalizada!');