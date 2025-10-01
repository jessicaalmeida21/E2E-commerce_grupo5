const fs = require('fs');
const path = require('path');

// Carregar o database atual
const { productsDatabase } = require('./js/database.js');

// URLs de imagem válidas do Unsplash organizadas por categoria
const validImageUrls = {
    'smartphones': [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop&crop=center&auto=format&q=80'
    ],
    'laptops': [
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80'
    ],
    'tablets': [
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop&crop=center&auto=format&q=80'
    ],
    'smartwatches': [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1594576662059-c4e9b5d0e1b3?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80'
    ],
    'headphones': [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=400&fit=crop&crop=center&auto=format&q=80'
    ],
    'cameras': [
        'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop&crop=center&auto=format&q=80'
    ],
    'gaming': [
        'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=400&fit=crop&crop=center&auto=format&q=80'
    ],
    'monitores': [
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1571513728751-8c9d6e7c7c3b?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center&auto=format&q=80'
    ],
    'relogios': [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1581578731548-c6a0c3f2b4a4?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1594576662059-c4e9b5d0e1b3?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
        'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center&auto=format&q=80'
    ]
};

// Função para obter uma imagem apropriada baseada na categoria
function getAppropriateImageUrl(product, index) {
    const category = product.category ? product.category.toLowerCase() : 'smartphones';
    
    // Mapear categorias para as chaves do validImageUrls
    const categoryMap = {
        'smartphones': 'smartphones',
        'laptops': 'laptops', 
        'tablets': 'tablets',
        'smartwatches': 'relogios',
        'headphones': 'headphones',
        'cameras': 'cameras',
        'gaming': 'gaming',
        'monitores': 'monitores',
        'relogios': 'relogios'
    };
    
    const mappedCategory = categoryMap[category] || 'smartphones';
    const categoryImages = validImageUrls[mappedCategory];
    
    // Usar o índice para distribuir as imagens de forma consistente
    const imageIndex = index % categoryImages.length;
    return categoryImages[imageIndex];
}

// Função para corrigir as imagens
function fixProductImages() {
    console.log('Iniciando correção das imagens dos produtos com URLs válidas...');
    
    let correctedCount = 0;
    const correctedProducts = [];
    let globalIndex = 0;
    
    // Iterar sobre todas as categorias
    for (const categoryName in productsDatabase) {
        const categoryProducts = productsDatabase[categoryName];
        
        // Iterar sobre todos os produtos da categoria
        for (let i = 0; i < categoryProducts.length; i++) {
            const product = categoryProducts[i];
            
            // Gerar nova URL de imagem válida
            const newImageUrl = getAppropriateImageUrl(product, globalIndex);
            
            // Atualizar o produto
            const correctedProduct = {
                ...product,
                image: newImageUrl
            };
            
            correctedProducts.push({
                id: product.id,
                name: product.title,
                category: product.category,
                oldImage: product.image,
                newImage: newImageUrl
            });
            
            // Atualizar no database
            productsDatabase[categoryName][i] = correctedProduct;
            correctedCount++;
            globalIndex++;
        }
    }
    
    console.log(`Corrigidas ${correctedCount} imagens de produtos com URLs válidas.`);
    
    // Salvar log das correções
    fs.writeFileSync(
        path.join(__dirname, 'image-corrections-v2-log.json'),
        JSON.stringify(correctedProducts, null, 2),
        'utf8'
    );
    
    console.log('Log das correções salvo em image-corrections-v2-log.json');
    
    return correctedProducts;
}

// Função para gerar o novo arquivo database.js
function generateNewDatabaseFile(correctedProducts) {
    console.log('Gerando novo arquivo database.js...');
    
    // Ler o arquivo database.js atual
    const currentDatabasePath = path.join(__dirname, 'js', 'database.js');
    let databaseContent = fs.readFileSync(currentDatabasePath, 'utf8');
    
    // Para cada produto corrigido, substituir a URL da imagem
    correctedProducts.forEach(correction => {
        // Escapar caracteres especiais na URL antiga para regex
        const escapedOldImage = correction.oldImage.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        // Criar padrão regex para encontrar e substituir a imagem
        const imagePattern = new RegExp(
            `("image":\\s*")${escapedOldImage}(")`,
            'g'
        );
        
        databaseContent = databaseContent.replace(
            imagePattern,
            `$1${correction.newImage}$2`
        );
    });
    
    // Salvar o arquivo atualizado
    fs.writeFileSync(currentDatabasePath, databaseContent, 'utf8');
    
    console.log('Arquivo database.js atualizado com sucesso!');
}

// Executar a correção
try {
    const corrections = fixProductImages();
    generateNewDatabaseFile(corrections);
    
    console.log('\\n=== RESUMO DA CORREÇÃO V2 ===');
    console.log(`Total de produtos corrigidos: ${corrections.length}`);
    console.log('Todas as imagens foram atualizadas com URLs válidas do Unsplash.');
    console.log('\\nVerifique o arquivo image-corrections-v2-log.json para detalhes das alterações.');
    
} catch (error) {
    console.error('Erro durante a correção das imagens:', error);
    process.exit(1);
}