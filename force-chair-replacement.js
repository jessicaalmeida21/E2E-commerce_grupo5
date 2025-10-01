const fs = require('fs');

console.log('🔧 SUBSTITUIÇÃO FORÇADA DE CADEIRAS');
console.log('===================================');

// Ler database.js
let content = fs.readFileSync('./js/database.js', 'utf8');

// URLs exatas encontradas na busca
const chairUrl1 = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&auto=format';
const chairUrl2 = 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop&auto=format';

// Contar ocorrências
const count1 = (content.split(chairUrl1).length - 1);
const count2 = (content.split(chairUrl2).length - 1);

console.log(`🪑 Cadeira 1 (photo-1586023492125): ${count1} ocorrências`);
console.log(`🪑 Cadeira 2 (photo-1506439773649): ${count2} ocorrências`);
console.log(`📊 Total: ${count1 + count2} cadeiras`);

if (count1 + count2 > 0) {
    // Imagens de substituição
    const replacements = [
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format', // Microondas
        'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&auto=format', // Fogão
        'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop&auto=format', // Geladeira
        'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&h=400&fit=crop&auto=format', // Lava-louças
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&auto=format', // Aspirador
        'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=400&h=400&fit=crop&auto=format', // Cafeteira
        'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop&auto=format', // Liquidificador
        'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&auto=format', // TV
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&auto=format', // Monitor
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&auto=format', // Notebook
        'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop&auto=format', // Smartphone
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format', // Fone
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop&auto=format', // Speaker
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d2b?w=400&h=400&fit=crop&auto=format', // Bola
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&auto=format', // Tênis
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&auto=format', // Camiseta
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&auto=format', // Relógio
        'https://images.unsplash.com/photo-1461151304267-ef46a710d3e6?w=400&h=400&fit=crop&auto=format', // TV 2
        'https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=400&h=400&fit=crop&auto=format', // Monitor 2
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&auto=format', // Notebook 2
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&auto=format', // iPhone
        'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=400&fit=crop&auto=format', // Sapato
        'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop&auto=format', // Roupa
        'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop&auto=format', // Relógio 2
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&auto=format', // Tênis 2
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop&auto=format', // Produto genérico
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&auto=format', // Gadget
        'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop&auto=format', // Acessório
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&auto=format', // Produto tech
        'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=400&fit=crop&auto=format', // Eletrônico
        'https://images.unsplash.com/photo-1572635196184-84e35138cf62?w=400&h=400&fit=crop&auto=format', // Item casa
        'https://images.unsplash.com/photo-1586953208359-3e69f7e0e9b5?w=400&h=400&fit=crop&auto=format'  // Produto moderno
    ];
    
    console.log('\\n🔄 Substituindo cadeiras...');
    
    let totalReplacements = 0;
    let replacementIndex = 0;
    
    // Substituir cadeira 1
    while (content.includes(chairUrl1) && replacementIndex < replacements.length) {
        const replacement = replacements[replacementIndex];
        content = content.replace(chairUrl1, replacement);
        totalReplacements++;
        replacementIndex++;
        console.log(`${totalReplacements}. Cadeira 1 → ${replacement.split('/').pop().split('?')[0]}`);
    }
    
    // Substituir cadeira 2
    while (content.includes(chairUrl2) && replacementIndex < replacements.length) {
        const replacement = replacements[replacementIndex];
        content = content.replace(chairUrl2, replacement);
        totalReplacements++;
        replacementIndex++;
        console.log(`${totalReplacements}. Cadeira 2 → ${replacement.split('/').pop().split('?')[0]}`);
    }
    
    // Se ainda há cadeiras, usar as substituições novamente
    while ((content.includes(chairUrl1) || content.includes(chairUrl2)) && totalReplacements < 100) {
        if (content.includes(chairUrl1)) {
            const replacement = replacements[replacementIndex % replacements.length];
            content = content.replace(chairUrl1, replacement);
            totalReplacements++;
            replacementIndex++;
            console.log(`${totalReplacements}. Cadeira 1 → ${replacement.split('/').pop().split('?')[0]}`);
        }
        
        if (content.includes(chairUrl2)) {
            const replacement = replacements[replacementIndex % replacements.length];
            content = content.replace(chairUrl2, replacement);
            totalReplacements++;
            replacementIndex++;
            console.log(`${totalReplacements}. Cadeira 2 → ${replacement.split('/').pop().split('?')[0]}`);
        }
    }
    
    // Verificação final
    const finalCount1 = (content.split(chairUrl1).length - 1);
    const finalCount2 = (content.split(chairUrl2).length - 1);
    const finalTotal = finalCount1 + finalCount2;
    
    console.log('\\n📊 RESULTADO:');
    console.log('==============');
    console.log(`🔧 Substituições realizadas: ${totalReplacements}`);
    console.log(`🪑 Cadeiras restantes: ${finalTotal}`);
    
    if (totalReplacements > 0) {
        // Salvar arquivo
        fs.writeFileSync('./js/database.js', content);
        console.log('\\n✅ Arquivo database.js atualizado!');
        
        // Criar relatório
        const report = {
            timestamp: new Date().toISOString(),
            originalCount: count1 + count2,
            totalReplacements: totalReplacements,
            finalCount: finalTotal,
            success: finalTotal === 0
        };
        
        fs.writeFileSync('force-chair-replacement-report.json', JSON.stringify(report, null, 2));
        console.log('📄 Relatório salvo em: force-chair-replacement-report.json');
        
        if (finalTotal === 0) {
            console.log('\\n🎉 SUCESSO! Todas as cadeiras foram eliminadas!');
        } else {
            console.log(`\\n⚠️  Ainda restam ${finalTotal} cadeiras`);
        }
    }
} else {
    console.log('✅ Nenhuma cadeira encontrada!');
}

console.log('\\n🏁 Processo finalizado!');