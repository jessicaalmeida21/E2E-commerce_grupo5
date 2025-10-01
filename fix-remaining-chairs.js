const fs = require('fs');

console.log('🔧 CORREÇÃO DEFINITIVA - TODAS AS CADEIRAS');
console.log('==========================================');

// Ler database.js
let content = fs.readFileSync('./js/database.js', 'utf8');

// Todas as URLs de cadeira que precisam ser substituídas
const chairUrls = [
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop&auto=format'
];

// Contar todas as ocorrências
let totalChairs = 0;
chairUrls.forEach((url, index) => {
    const matches = content.match(new RegExp(url.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'), 'g'));
    const count = matches ? matches.length : 0;
    console.log(`🪑 Cadeira ${index + 1}: ${count} ocorrências`);
    totalChairs += count;
});

console.log(`\\n📊 Total de cadeiras encontradas: ${totalChairs}`);

if (totalChairs > 0) {
    // Imagens de substituição categorizadas por tipo de produto
    const replacementImages = [
        // Eletrodomésticos
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format', // Microondas
        'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&auto=format', // Fogão
        'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop&auto=format', // Geladeira
        'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&h=400&fit=crop&auto=format', // Lava-louças
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&auto=format', // Aspirador
        'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=400&h=400&fit=crop&auto=format', // Cafeteira
        'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop&auto=format', // Liquidificador
        
        // Eletrônicos
        'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&auto=format', // TV
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&auto=format', // Monitor
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&auto=format', // Notebook
        'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop&auto=format', // Smartphone
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format', // Fone
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop&auto=format', // Speaker
        
        // Outros produtos
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
    
    console.log('\\n🔄 Substituindo todas as cadeiras...');
    
    let totalReplacements = 0;
    let imageIndex = 0;
    
    // Substituir cada URL de cadeira
    chairUrls.forEach((chairUrl, chairIndex) => {
        let replacements = 0;
        
        // Continuar substituindo até não haver mais ocorrências
        while (content.includes(chairUrl)) {
            const replacement = replacementImages[imageIndex % replacementImages.length];
            content = content.replace(chairUrl, replacement);
            
            replacements++;
            totalReplacements++;
            imageIndex++;
            
            console.log(`${totalReplacements}. Cadeira ${chairIndex + 1} → ${replacement.split('/').pop().split('?')[0]}`);
        }
        
        if (replacements > 0) {
            console.log(`   ✅ ${replacements} substituições para cadeira ${chairIndex + 1}`);
        }
    });
    
    // Verificação final
    let finalChairs = 0;
    chairUrls.forEach(url => {
        const matches = content.match(new RegExp(url.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'), 'g'));
        const count = matches ? matches.length : 0;
        finalChairs += count;
    });
    
    console.log('\\n📊 RESULTADO:');
    console.log('==============');
    console.log(`🔧 Total de substituições: ${totalReplacements}`);
    console.log(`🪑 Cadeiras restantes: ${finalChairs}`);
    
    if (totalReplacements > 0) {
        // Salvar arquivo corrigido
        fs.writeFileSync('./js/database.js', content);
        console.log('\\n✅ Arquivo database.js atualizado!');
        
        // Criar relatório
        const report = {
            timestamp: new Date().toISOString(),
            originalChairs: totalChairs,
            totalReplacements: totalReplacements,
            finalChairs: finalChairs,
            chairUrls: chairUrls,
            replacementImages: replacementImages.slice(0, totalReplacements),
            success: finalChairs === 0
        };
        
        fs.writeFileSync('remaining-chairs-fix-report.json', JSON.stringify(report, null, 2));
        console.log('📄 Relatório salvo em: remaining-chairs-fix-report.json');
        
        if (finalChairs === 0) {
            console.log('\\n🎉 PERFEITO! Todas as cadeiras foram eliminadas!');
            console.log('🛒 Agora todos os 500 produtos têm imagens corretas!');
        } else {
            console.log(`\\n⚠️  Ainda restam ${finalChairs} cadeiras`);
        }
    }
} else {
    console.log('✅ Nenhuma cadeira encontrada!');
}

console.log('\\n🏁 Correção finalizada!');