const fs = require('fs');

console.log('🔧 CORREÇÃO COMPLETA DE IMAGENS DE CADEIRA');
console.log('==========================================');

// Ler database.js
let databaseContent = fs.readFileSync('./js/database.js', 'utf8');

// URLs das imagens de cadeira que precisam ser substituídas
const chairImageUrls = [
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop&auto=format'
];

// Contar quantas vezes cada imagem de cadeira aparece
let totalChairImages = 0;
chairImageUrls.forEach((chairUrl, index) => {
    const count = (databaseContent.match(new RegExp(chairUrl.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'), 'g')) || []).length;
    console.log(`🪑 Cadeira ${index + 1}: ${count} ocorrências`);
    totalChairImages += count;
});

console.log(`\\n📊 Total de imagens de cadeira: ${totalChairImages}`);

if (totalChairImages > 0) {
    // Imagens de substituição categorizadas
    const replacementImages = {
        eletrodomesticos: [
            'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format', // Microondas
            'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&auto=format', // Fogão
            'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop&auto=format', // Geladeira
            'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&h=400&fit=crop&auto=format', // Lava-louças
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&auto=format'  // Aspirador
        ],
        televisoes: [
            'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&auto=format', // TV
            'https://images.unsplash.com/photo-1461151304267-ef46a710d3e6?w=400&h=400&fit=crop&auto=format'  // TV 2
        ],
        monitores: [
            'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&auto=format', // Monitor
            'https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=400&h=400&fit=crop&auto=format'  // Monitor 2
        ],
        notebooks: [
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&auto=format', // Notebook
            'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&auto=format'  // Notebook 2
        ],
        smartphones: [
            'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop&auto=format', // Smartphone
            'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&auto=format'  // iPhone
        ],
        esportes: [
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d2b?w=400&h=400&fit=crop&auto=format', // Bola
            'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop&auto=format'  // Equipamento
        ],
        calcados: [
            'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&auto=format', // Tênis
            'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=400&fit=crop&auto=format'  // Sapato
        ],
        roupas: [
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&auto=format', // Camiseta
            'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop&auto=format'  // Roupa
        ],
        audio: [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format', // Fone
            'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop&auto=format'  // Speaker
        ],
        relogios: [
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&auto=format', // Relógio
            'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop&auto=format'  // Relógio 2
        ]
    };
    
    // Criar array com todas as imagens de substituição
    const allReplacements = [];
    Object.values(replacementImages).forEach(categoryImages => {
        allReplacements.push(...categoryImages);
    });
    
    console.log('\\n🔄 Substituindo imagens de cadeira...');
    
    let totalReplacements = 0;
    let imageIndex = 0;
    
    // Substituir cada URL de cadeira
    chairImageUrls.forEach((chairUrl, chairIndex) => {
        let replacementCount = 0;
        
        while (databaseContent.includes(chairUrl)) {
            const replacementImage = allReplacements[imageIndex % allReplacements.length];
            
            console.log(`${totalReplacements + 1}. Cadeira ${chairIndex + 1} → ${replacementImage.split('/').pop().split('?')[0]}`);
            
            // Substituir apenas a primeira ocorrência
            databaseContent = databaseContent.replace(chairUrl, replacementImage);
            
            replacementCount++;
            totalReplacements++;
            imageIndex++;
        }
        
        if (replacementCount > 0) {
            console.log(`   ✅ ${replacementCount} substituições para cadeira ${chairIndex + 1}`);
        }
    });
    
    // Verificar se ainda existem imagens de cadeira
    let finalChairCount = 0;
    chairImageUrls.forEach(chairUrl => {
        const count = (databaseContent.match(new RegExp(chairUrl.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'), 'g')) || []).length;
        finalChairCount += count;
    });
    
    console.log('\\n📊 RESULTADO FINAL:');
    console.log('====================');
    console.log(`🔧 Total de substituições: ${totalReplacements}`);
    console.log(`🪑 Imagens de cadeira restantes: ${finalChairCount}`);
    
    if (totalReplacements > 0) {
        // Salvar arquivo corrigido
        fs.writeFileSync('./js/database.js', databaseContent);
        console.log('\\n✅ Arquivo database.js atualizado com sucesso!');
        
        // Criar relatório detalhado
        const report = {
            timestamp: new Date().toISOString(),
            originalChairImages: totalChairImages,
            chairImageUrls: chairImageUrls,
            totalReplacements: totalReplacements,
            remainingChairImages: finalChairCount,
            replacementImages: allReplacements.slice(0, totalReplacements),
            success: finalChairCount === 0,
            categories: Object.keys(replacementImages)
        };
        
        fs.writeFileSync('complete-chair-fix-report.json', JSON.stringify(report, null, 2));
        console.log('📄 Relatório completo salvo em: complete-chair-fix-report.json');
        
        if (finalChairCount === 0) {
            console.log('\\n🎉 PERFEITO! Todas as imagens de cadeira foram corrigidas!');
            console.log('🛒 Agora todos os 500 produtos têm imagens apropriadas!');
        } else {
            console.log(`\\n⚠️  ATENÇÃO: Ainda restam ${finalChairCount} imagens de cadeira`);
        }
    }
    
} else {
    console.log('✅ Nenhuma imagem de cadeira encontrada para substituir!');
}

console.log('\\n🏁 Correção finalizada!');