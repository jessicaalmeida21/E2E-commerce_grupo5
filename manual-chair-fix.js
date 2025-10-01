const fs = require('fs');

console.log('🔧 CORREÇÃO MANUAL DE IMAGENS DE CADEIRA');
console.log('========================================');

// Ler database.js
let content = fs.readFileSync('./js/database.js', 'utf8');

// URL da imagem de cadeira problemática
const chairImage = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop&auto=format';

// Contar ocorrências
const matches = content.match(/https:\/\/images\.unsplash\.com\/photo-1555041469-a586c61ea9bc\?w=400&h=400&fit=crop&auto=format/g);
const count = matches ? matches.length : 0;

console.log(`🪑 Encontradas ${count} imagens de cadeira`);

if (count > 0) {
    // Imagens de substituição para eletrodomésticos
    const replacements = [
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format', // Microondas
        'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&auto=format', // Fogão
        'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop&auto=format', // Geladeira
        'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&h=400&fit=crop&auto=format', // Lava-louças
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&auto=format', // Aspirador
        'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&auto=format', // TV
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&auto=format', // Monitor
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&auto=format', // Notebook
        'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop&auto=format', // Smartphone
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d2b?w=400&h=400&fit=crop&auto=format', // Bola
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&auto=format', // Tênis
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&auto=format', // Camiseta
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format', // Fone
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&auto=format', // Relógio
        'https://images.unsplash.com/photo-1461151304267-ef46a710d3e6?w=400&h=400&fit=crop&auto=format', // TV 2
        'https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=400&h=400&fit=crop&auto=format', // Monitor 2
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&auto=format'  // Notebook 2
    ];
    
    console.log('\\n🔄 Substituindo imagens...');
    
    let replacementIndex = 0;
    let replacedCount = 0;
    
    // Substituir uma por uma
    while (content.includes(chairImage) && replacementIndex < replacements.length) {
        const newImage = replacements[replacementIndex % replacements.length];
        content = content.replace(chairImage, newImage);
        replacedCount++;
        replacementIndex++;
        
        console.log(`${replacedCount}. Substituído por: ${newImage.split('/').pop().split('?')[0]}`);
    }
    
    // Se ainda há mais cadeiras que substituições, usar as substituições novamente
    while (content.includes(chairImage)) {
        const newImage = replacements[replacementIndex % replacements.length];
        content = content.replace(chairImage, newImage);
        replacedCount++;
        replacementIndex++;
        
        console.log(`${replacedCount}. Substituído por: ${newImage.split('/').pop().split('?')[0]}`);
    }
    
    // Verificar se ainda existem
    const finalMatches = content.match(/https:\/\/images\.unsplash\.com\/photo-1555041469-a586c61ea9bc\?w=400&h=400&fit=crop&auto=format/g);
    const finalCount = finalMatches ? finalMatches.length : 0;
    
    console.log('\\n📊 RESULTADO:');
    console.log('==============');
    console.log(`🔧 Substituições realizadas: ${replacedCount}`);
    console.log(`🪑 Imagens de cadeira restantes: ${finalCount}`);
    
    if (replacedCount > 0) {
        // Salvar arquivo
        fs.writeFileSync('./js/database.js', content);
        console.log('\\n✅ Arquivo database.js atualizado!');
        
        // Criar relatório
        const report = {
            timestamp: new Date().toISOString(),
            originalCount: count,
            replacedCount: replacedCount,
            finalCount: finalCount,
            success: finalCount === 0
        };
        
        fs.writeFileSync('manual-chair-fix-report.json', JSON.stringify(report, null, 2));
        console.log('📄 Relatório salvo em: manual-chair-fix-report.json');
        
        if (finalCount === 0) {
            console.log('\\n🎉 SUCESSO! Todas as imagens de cadeira foram corrigidas!');
        }
    }
} else {
    console.log('✅ Nenhuma imagem de cadeira encontrada!');
}

console.log('\\n🏁 Processo finalizado!');