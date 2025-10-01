// Sistema Avançado de Correção de Produtos
const fs = require('fs');

// Mapeamento de imagens específicas por tipo de produto
const specificImages = {
    // Smartphones
    'iphone': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'samsung galaxy': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'xiaomi': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'motorola': 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'sony xperia': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    
    // Notebooks
    'macbook': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'dell': 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'lenovo': 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'gaming': 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    
    // TVs
    'smart tv': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'oled': 'https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'qled': 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    
    // Monitores
    'monitor': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'gaming monitor': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    
    // Áudio
    'headphone': 'https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'speaker': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'beats': 'https://images.unsplash.com/photo-1603561596112-df9d7f5e0c0e?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    
    // Calçados
    'nike': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'adidas': 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'tênis': 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    
    // Roupas
    'camisa': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'camiseta': 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'polo': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    
    // Relógios
    'apple watch': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'smartwatch': 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    'relógio': 'https://images.unsplash.com/photo-1594576662059-c4e9b5d0e1b3?w=400&h=400&fit=crop&crop=center&auto=format&q=80'
};

// Correções de nomes de produtos
const nameCorrections = {
    // Smartphones problemáticos
    'Sony Xperia FE': 'Sony Xperia 5 III',
    'LG C55 Lite': 'LG K62 Plus',
    'Sony G73 Pro': 'Sony Xperia 1 IV',
    'Sony G73 Plus': 'Sony Xperia 10 IV',
    'OnePlus C55 Ultra': 'OnePlus Nord 2T',
    'Apple Redmi Note FE': 'iPhone 14 Pro',
    'Apple Nord Lite': 'iPhone 13 Mini',
    'Apple G73 Ultra': 'iPhone 14 Plus',
    'Samsung C55 Lite': 'Samsung Galaxy A54',
    'LG Moto G Lite': 'LG K52',
    
    // Notebooks problemáticos
    'Dell Gaming Slim': 'Dell Inspiron Gaming',
    'Lenovo Motion 15': 'Lenovo IdeaPad Gaming',
    'MSI ThinkPad Slim': 'MSI GF63 Thin',
    'HP Motion Pro': 'HP Pavilion Gaming',
    
    // TVs problemáticas
    'Hisense 8K HDR': 'Hisense 65U8G QLED',
    'Hisense 8K 65"': 'Hisense 55U7G ULED',
    
    // Monitores problemáticos
    'LG TUF 32"': 'LG UltraGear 32GP850',
    'Samsung Odyssey 27"': 'Samsung Odyssey G7 27"',
    
    // Áudio problemáticos
    'Beats Gaming Pro': 'Beats Studio3 Wireless',
    'JBL Charge Essential': 'JBL Charge 5',
    
    // Calçados problemáticos
    'Asics Disruptor II': 'Asics Gel-Kayano 29',
    'Fila Disruptor Classic': 'Fila Disruptor II',
    
    // Roupas problemáticas
    'Zara Polo Cropped': 'Zara Polo Básico',
    'H&M Cropped Fit': 'H&M Camiseta Básica',
    
    // Relógios problemáticos
    'Fitbit Galaxy Watch 5': 'Fitbit Versa 4',
    'Apple G-Shock Ultra': 'Apple Watch Series 8'
};

function getCorrectImage(productTitle, category) {
    const title = productTitle.toLowerCase();
    
    // Buscar imagem específica baseada no título
    for (const [keyword, imageUrl] of Object.entries(specificImages)) {
        if (title.includes(keyword.toLowerCase())) {
            return imageUrl;
        }
    }
    
    // Fallback para imagens por categoria
    const categoryImages = {
        'Smartphones': [
            'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
            'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80'
        ],
        'Notebooks': [
            'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
            'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop&crop=center&auto=format&q=80'
        ],
        'Televisões': [
            'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
            'https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80'
        ],
        'Monitores': [
            'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
            'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80'
        ],
        'Áudio e Som': [
            'https://images.unsplash.com/photo-1583496661160-fb5886a13d5e?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
            'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop&crop=center&auto=format&q=80'
        ],
        'Calçados': [
            'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
            'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=400&fit=crop&crop=center&auto=format&q=80'
        ],
        'Roupas': [
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
            'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80'
        ],
        'Relógios': [
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
            'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&crop=center&auto=format&q=80'
        ]
    };
    
    const images = categoryImages[category] || categoryImages['Smartphones'];
    return images[Math.floor(Math.random() * images.length)];
}

async function fixProductNamesAndImages() {
    try {
        console.log('🔧 Iniciando correção avançada de produtos...\n');
        
        const databasePath = './js/database.js';
        const problematicPath = './problematic-products.json';
        
        // Backup
        const backupPath = `./js/database-backup-advanced-fix-${Date.now()}.js`;
        fs.copyFileSync(databasePath, backupPath);
        console.log(`💾 Backup criado: ${backupPath}`);
        
        // Carregar dados
        const database = require(databasePath);
        const products = database.getAllProducts();
        const problematicProducts = JSON.parse(fs.readFileSync(problematicPath, 'utf8'));
        
        console.log(`📊 Produtos a corrigir: ${problematicProducts.length}`);
        
        let correctedNames = 0;
        let correctedImages = 0;
        
        // Aplicar correções
        problematicProducts.forEach(problematic => {
            const product = products.find(p => p.id === problematic.id);
            if (product) {
                // Corrigir nome se necessário
                if (nameCorrections[product.title]) {
                    console.log(`📝 Corrigindo nome: "${product.title}" → "${nameCorrections[product.title]}"`);
                    product.title = nameCorrections[product.title];
                    correctedNames++;
                }
                
                // Corrigir imagem
                const newImage = getCorrectImage(product.title, product.category);
                if (newImage !== product.image) {
                    console.log(`🖼️  Corrigindo imagem: ${product.title}`);
                    product.image = newImage;
                    correctedImages++;
                }
            }
        });
        
        console.log(`\n✅ Correções aplicadas:`);
        console.log(`   Nomes corrigidos: ${correctedNames}`);
        console.log(`   Imagens corrigidas: ${correctedImages}`);
        
        // Regenerar arquivo database.js
        let content = fs.readFileSync(databasePath, 'utf8');
        
        // Atualizar produtos no conteúdo
        products.forEach(product => {
            // Regex para encontrar e substituir o produto
            const productRegex = new RegExp(
                `("id": "${product.id}"[\\s\\S]*?)"title": "[^"]*"([\\s\\S]*?)"image": "[^"]*"`,
                'g'
            );
            
            content = content.replace(productRegex, 
                `$1"title": "${product.title}"$2"image": "${product.image}"`
            );
        });
        
        // Salvar arquivo atualizado
        fs.writeFileSync(databasePath, content, 'utf8');
        console.log(`📁 Database atualizado: ${databasePath}`);
        
        // Testar arquivo
        try {
            delete require.cache[require.resolve(databasePath)];
            const testDb = require(databasePath);
            const testProducts = testDb.getAllProducts();
            
            console.log(`\n🎉 Teste bem-sucedido!`);
            console.log(`📊 Total de produtos: ${testProducts.length}`);
            
            return { success: true, correctedNames, correctedImages };
            
        } catch (testError) {
            console.error('❌ Erro no teste:', testError.message);
            return { success: false, error: testError.message };
        }
        
    } catch (error) {
        console.error('❌ Erro na correção:', error);
        return { success: false, error: error.message };
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    fixProductNamesAndImages().then(result => {
        if (result.success) {
            console.log('\n🎉 Correção avançada concluída com sucesso!');
        } else {
            console.log('\n💥 Falha na correção:', result.error);
        }
    });
}

module.exports = { fixProductNamesAndImages };