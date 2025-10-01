// Script Simples para Adicionar Imagens aos Produtos
const fs = require('fs');

// Mapeamento de imagens por categoria
const categoryImages = {
    'Smartphones': [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&crop=center&auto=format&q=80'
    ],
    'Notebooks': [
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&crop=center&auto=format&q=80'
    ],
    'Televisões': [
        'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80'
    ],
    'Áudio e Som': [
        'https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80'
    ],
    'Calçados': [
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop&crop=center&auto=format&q=80'
    ],
    'Roupas': [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center&auto=format&q=80'
    ],
    'Eletrodomésticos': [
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&crop=center&auto=format&q=80'
    ],
    'Esportes e Lazer': [
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400&h=400&fit=crop&crop=center&auto=format&q=80'
    ],
    'Monitores': [
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center&auto=format&q=80'
    ],
    'Relógios': [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1594576662059-c4e9b5d0e1b3?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1581578731548-c6a0c3f2b4a4?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80'
    ]
};

function getImageForCategory(category, index = 0) {
    const images = categoryImages[category];
    if (!images || images.length === 0) {
        // Imagem padrão se categoria não encontrada
        return 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center&auto=format&q=80';
    }
    return images[index % images.length];
}

async function addImagesToProducts() {
    try {
        console.log('🖼️  Adicionando imagens aos produtos...');
        
        const databasePath = './js/database.js';
        
        // Backup
        const backupPath = `./js/database-backup-before-images-${Date.now()}.js`;
        fs.copyFileSync(databasePath, backupPath);
        console.log(`💾 Backup criado: ${backupPath}`);
        
        // Carregar database
        const database = require(databasePath);
        const products = database.getAllProducts();
        
        console.log(`📊 Total de produtos: ${products.length}`);
        
        // Contar produtos por categoria
        const categoryCount = {};
        let updatedCount = 0;
        
        products.forEach((product, index) => {
            const category = product.category;
            
            if (!categoryCount[category]) {
                categoryCount[category] = 0;
            }
            
            // Adicionar imagem se não existir
            if (!product.image) {
                const imageIndex = categoryCount[category];
                product.image = getImageForCategory(category, imageIndex);
                updatedCount++;
            }
            
            categoryCount[category]++;
        });
        
        console.log(`✅ Produtos atualizados com imagens: ${updatedCount}`);
        console.log('📋 Distribuição por categoria:');
        Object.entries(categoryCount).forEach(([cat, count]) => {
            console.log(`   ${cat}: ${count} produtos`);
        });
        
        // Ler o conteúdo original do arquivo
        let content = fs.readFileSync(databasePath, 'utf8');
        
        // Adicionar imagens usando regex simples
        products.forEach((product) => {
            if (product.image) {
                // Procurar pelo produto e adicionar imagem se não existir
                const productRegex = new RegExp(`("id": "${product.id}"[\\s\\S]*?"ratingCount": \\d+)(?!.*"image":)`, 'g');
                content = content.replace(productRegex, `$1,\n            "image": "${product.image}"`);
            }
        });
        
        // Salvar arquivo atualizado
        fs.writeFileSync(databasePath, content, 'utf8');
        
        console.log(`📁 Database atualizado: ${databasePath}`);
        
        // Testar se o arquivo está válido
        try {
            delete require.cache[require.resolve(databasePath)];
            const testDb = require(databasePath);
            const testProducts = testDb.getAllProducts();
            const withImages = testProducts.filter(p => p.image).length;
            
            console.log(`🎉 Teste bem-sucedido!`);
            console.log(`📊 Produtos com imagens: ${withImages}/${testProducts.length}`);
            
            return { success: true, totalProducts: testProducts.length, withImages };
            
        } catch (testError) {
            console.error('❌ Erro no teste:', testError.message);
            return { success: false, error: testError.message };
        }
        
    } catch (error) {
        console.error('❌ Erro ao adicionar imagens:', error);
        return { success: false, error: error.message };
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    addImagesToProducts().then(result => {
        if (result.success) {
            console.log('\n🎉 Imagens adicionadas com sucesso!');
        } else {
            console.log('\n💥 Falha ao adicionar imagens:', result.error);
        }
    });
}

module.exports = { addImagesToProducts };