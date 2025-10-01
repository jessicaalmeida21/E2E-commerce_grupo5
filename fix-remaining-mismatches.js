const fs = require('fs');

// Ler o database.js
let databaseContent = fs.readFileSync('./js/database.js', 'utf8');

console.log('🔧 CORREÇÃO FINAL DE IMAGENS RESTANTES');
console.log('=====================================');

// Imagens específicas para relógios e smartwatches
const watchImages = [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&auto=format', // Apple Watch
    'https://images.unsplash.com/photo-1461151304267-ef46a710d3e6?w=400&h=400&fit=crop&auto=format', // Galaxy Watch
    'https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=400&h=400&fit=crop&auto=format', // Smartwatch
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&auto=format', // Relógio Digital
    'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop&auto=format', // Relógio Analógico
    'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&h=400&fit=crop&auto=format', // Casio
    'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=400&h=400&fit=crop&auto=format', // Citizen
    'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop&auto=format'  // Seiko
];

// Imagens problemáticas identificadas que precisam ser substituídas
const problematicImages = [
    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop&auto=format'
];

let corrections = 0;
let correctionLog = [];

// Substituir cada imagem problemática
problematicImages.forEach((problematicImage, index) => {
    // Contar quantas vezes a imagem aparece
    const occurrences = (databaseContent.match(new RegExp(problematicImage.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    
    if (occurrences > 0) {
        console.log(`🔍 Encontradas ${occurrences} ocorrências de: ${problematicImage.substring(0, 60)}...`);
        
        // Substituir todas as ocorrências
        for (let i = 0; i < occurrences; i++) {
            const replacementImage = watchImages[i % watchImages.length];
            
            // Substituir apenas a primeira ocorrência de cada vez
            const regex = new RegExp(problematicImage.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
            
            if (databaseContent.match(regex)) {
                databaseContent = databaseContent.replace(regex, replacementImage);
                corrections++;
                
                correctionLog.push({
                    correctionNumber: corrections,
                    oldImage: problematicImage,
                    newImage: replacementImage,
                    occurrence: i + 1
                });
                
                console.log(`✅ ${corrections}. Substituição ${i + 1}/${occurrences}`);
                console.log(`   → ${replacementImage.substring(0, 60)}...`);
            }
        }
        console.log('');
    }
});

// Verificar se ainda existem imagens problemáticas
console.log('🔍 VERIFICAÇÃO FINAL:');
problematicImages.forEach(image => {
    const remaining = (databaseContent.match(new RegExp(image.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    console.log(`📊 ${image.substring(0, 60)}... → ${remaining} restantes`);
});

// Salvar o database atualizado
if (corrections > 0) {
    fs.writeFileSync('./js/database.js', databaseContent);
    
    // Salvar log de correções
    const logReport = {
        timestamp: new Date().toISOString(),
        totalCorrections: corrections,
        problematicImagesFixed: problematicImages.length,
        corrections: correctionLog
    };
    
    fs.writeFileSync('remaining-corrections-log.json', JSON.stringify(logReport, null, 2));
    
    console.log(`\n🎉 CORREÇÕES FINAIS CONCLUÍDAS!`);
    console.log(`📊 Total de correções: ${corrections}`);
    console.log(`📄 Log salvo em: remaining-corrections-log.json`);
    console.log(`✅ Database atualizado: ./js/database.js`);
} else {
    console.log('✅ Nenhuma imagem problemática encontrada!');
}

console.log('\n🏁 Processo finalizado!');