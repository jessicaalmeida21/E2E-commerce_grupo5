const fs = require('fs');

console.log('🔧 SUBSTITUIÇÃO DIRETA DE IMAGENS DE CADEIRA');
console.log('============================================');

// Ler database.js
let databaseContent = fs.readFileSync('./js/database.js', 'utf8');

// URL da imagem de cadeira que precisa ser substituída
const chairImageUrl = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&auto=format';

// Contar quantas vezes a imagem de cadeira aparece
const initialCount = (databaseContent.match(new RegExp(chairImageUrl.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'), 'g')) || []).length;
console.log(`🪑 Imagem de cadeira encontrada ${initialCount} vezes`);

if (initialCount > 0) {
    // Imagens de substituição variadas
    const replacementImages = [
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format', // Microondas
        'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&auto=format', // Fogão
        'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop&auto=format', // Geladeira
        'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&h=400&fit=crop&auto=format', // Lava-louças
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&auto=format', // Aspirador
        'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&auto=format', // TV
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&auto=format', // Monitor
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&auto=format', // Notebook
        'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop&auto=format', // Smartphone
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&auto=format', // Bola
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&auto=format', // Tênis
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&auto=format', // Camiseta
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format', // Fone
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&auto=format'  // Relógio
    ];
    
    console.log('\\n🔄 Substituindo imagens de cadeira...');
    
    let replacementCount = 0;
    let imageIndex = 0;
    
    // Substituir cada ocorrência por uma imagem diferente
    while (databaseContent.includes(chairImageUrl) && replacementCount < initialCount) {
        const replacementImage = replacementImages[imageIndex % replacementImages.length];
        
        console.log(`${replacementCount + 1}. Substituindo por: ${replacementImage.split('/').pop().split('?')[0]}`);
        
        // Substituir apenas a primeira ocorrência
        databaseContent = databaseContent.replace(chairImageUrl, replacementImage);
        
        replacementCount++;
        imageIndex++;
    }
    
    // Verificar se ainda existem imagens de cadeira
    const finalCount = (databaseContent.match(new RegExp(chairImageUrl.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'), 'g')) || []).length;
    
    console.log('\\n📊 RESULTADO:');
    console.log('==============');
    console.log(`🔧 Substituições realizadas: ${replacementCount}`);
    console.log(`🪑 Imagens de cadeira restantes: ${finalCount}`);
    
    if (replacementCount > 0) {
        // Salvar arquivo corrigido
        fs.writeFileSync('./js/database.js', databaseContent);
        console.log('\\n✅ Arquivo database.js atualizado com sucesso!');
        
        // Criar backup do relatório
        const report = {
            timestamp: new Date().toISOString(),
            originalChairImages: initialCount,
            replacementsMade: replacementCount,
            remainingChairImages: finalCount,
            replacementImages: replacementImages.slice(0, replacementCount).map(img => img.split('/').pop().split('?')[0]),
            success: finalCount === 0
        };
        
        fs.writeFileSync('direct-chair-replacement-report.json', JSON.stringify(report, null, 2));
        console.log('📄 Relatório salvo em: direct-chair-replacement-report.json');
        
        if (finalCount === 0) {
            console.log('\\n🎉 SUCESSO! Todas as imagens de cadeira foram substituídas!');
        } else {
            console.log(`\\n⚠️  ATENÇÃO: Ainda restam ${finalCount} imagens de cadeira`);
        }
    }
    
} else {
    console.log('✅ Nenhuma imagem de cadeira encontrada para substituir!');
}

console.log('\\n🏁 Processo finalizado!');