// Correção Segura de Imagens dos Produtos
const fs = require('fs');

// Mapeamento inteligente de imagens baseado em palavras-chave do título
const smartImageMapping = {
    // Smartphones
    'iphone': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'samsung': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'xiaomi': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'motorola': 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'sony': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'oneplus': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'lg': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    
    // Notebooks
    'macbook': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'dell': 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'lenovo': 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'hp': 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'asus': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'msi': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'gaming': 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    
    // TVs
    'tv': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'smart': 'https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'oled': 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'qled': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'hisense': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'tcl': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    
    // Monitores
    'monitor': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'ultrawide': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'odyssey': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'benq': 'https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    
    // Áudio
    'beats': 'https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'jbl': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'bose': 'https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'headphone': 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'speaker': 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    
    // Calçados
    'nike': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'adidas': 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'puma': 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'vans': 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'converse': 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'asics': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'fila': 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    
    // Roupas
    'zara': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'h&m': 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'polo': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'camisa': 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'camiseta': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    
    // Relógios
    'apple watch': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'galaxy watch': 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'fitbit': 'https://images.unsplash.com/photo-1594576662059-c4e9b5d0e1b3?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'smartwatch': 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2b4a4?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'casio': 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80'
};

function getBestImageForProduct(title, category) {
    const titleLower = title.toLowerCase();
    
    // Procurar por correspondência exata de palavras-chave
    for (const [keyword, imageUrl] of Object.entries(smartImageMapping)) {
        if (titleLower.includes(keyword)) {
            return imageUrl;
        }
    }
    
    // Fallback por categoria
    const categoryDefaults = {
        'Smartphones': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'Notebooks': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'Televisões': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'Monitores': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'Áudio e Som': 'https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'Calçados': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'Roupas': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'Relógios': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'Eletrodomésticos': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=center&auto=format&q=80'
    };
    
    return categoryDefaults[category] || categoryDefaults['Smartphones'];
}

async function fixImagesOnly() {
    try {
        console.log('🖼️  Iniciando correção inteligente de imagens...\n');
        
        const databasePath = './js/database.js';
        const problematicPath = './problematic-products.json';
        
        // Backup
        const backupPath = `./js/database-backup-images-fix-${Date.now()}.js`;
        fs.copyFileSync(databasePath, backupPath);
        console.log(`💾 Backup criado: ${backupPath}`);
        
        // Carregar dados
        const database = require(databasePath);
        const products = database.getAllProducts();
        const problematicProducts = JSON.parse(fs.readFileSync(problematicPath, 'utf8'));
        
        console.log(`📊 Produtos problemáticos: ${problematicProducts.length}`);
        
        let correctedImages = 0;
        const corrections = [];
        
        // Aplicar correções de imagem
        problematicProducts.forEach(problematic => {
            const product = products.find(p => p.id === problematic.id);
            if (product) {
                const newImage = getBestImageForProduct(product.title, product.category);
                if (newImage !== product.image) {
                    corrections.push({
                        id: product.id,
                        title: product.title,
                        oldImage: product.image,
                        newImage: newImage
                    });
                    correctedImages++;
                }
            }
        });
        
        console.log(`🔧 Aplicando ${correctedImages} correções de imagem...\n`);
        
        // Ler conteúdo do arquivo
        let content = fs.readFileSync(databasePath, 'utf8');
        
        // Aplicar correções uma por uma
        corrections.forEach((correction, index) => {
            console.log(`${index + 1}/${corrections.length} - ${correction.title}`);
            
            // Regex mais específica para encontrar e substituir apenas a imagem
            const imageRegex = new RegExp(
                `("id": "${correction.id}"[\\s\\S]*?"image": ")[^"]*(")`
            );
            
            content = content.replace(imageRegex, `$1${correction.newImage}$2`);
        });
        
        // Salvar arquivo
        fs.writeFileSync(databasePath, content, 'utf8');
        console.log(`\n📁 Database atualizado: ${databasePath}`);
        
        // Testar arquivo
        try {
            delete require.cache[require.resolve(databasePath)];
            const testDb = require(databasePath);
            const testProducts = testDb.getAllProducts();
            
            console.log(`\n🎉 Teste bem-sucedido!`);
            console.log(`📊 Total de produtos: ${testProducts.length}`);
            console.log(`🖼️  Imagens corrigidas: ${correctedImages}`);
            
            return { success: true, correctedImages };
            
        } catch (testError) {
            console.error('❌ Erro no teste:', testError.message);
            
            // Restaurar backup em caso de erro
            fs.copyFileSync(backupPath, databasePath);
            console.log('🔄 Backup restaurado devido ao erro');
            
            return { success: false, error: testError.message };
        }
        
    } catch (error) {
        console.error('❌ Erro na correção:', error);
        return { success: false, error: error.message };
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    fixImagesOnly().then(result => {
        if (result.success) {
            console.log('\n🎉 Correção de imagens concluída com sucesso!');
        } else {
            console.log('\n💥 Falha na correção:', result.error);
        }
    });
}

module.exports = { fixImagesOnly };