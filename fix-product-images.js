const fs = require('fs');
const path = require('path');

// Carregar o database atual
const { productsDatabase } = require('./js/database.js');

// Mapeamento de categorias para termos de busca de imagem mais específicos
const categoryImageMappings = {
    'smartphones': [
        'smartphone', 'mobile-phone', 'cellphone', 'android-phone', 'iphone'
    ],
    'laptops': [
        'laptop', 'notebook', 'computer', 'macbook', 'gaming-laptop'
    ],
    'tablets': [
        'tablet', 'ipad', 'android-tablet', 'digital-tablet'
    ],
    'smartwatches': [
        'smartwatch', 'apple-watch', 'fitness-tracker', 'wearable'
    ],
    'headphones': [
        'headphones', 'earbuds', 'wireless-headphones', 'audio-headset'
    ],
    'cameras': [
        'camera', 'digital-camera', 'photography', 'dslr-camera'
    ],
    'gaming': [
        'gaming-console', 'video-game', 'playstation', 'xbox', 'nintendo'
    ],
    'accessories': [
        'tech-accessory', 'electronic-device', 'gadget', 'technology'
    ]
};

// Função para gerar URL de imagem mais apropriada
function generateBetterImageUrl(product) {
    const category = product.category ? product.category.toLowerCase() : 'technology';
    const productName = product.title ? product.title.toLowerCase() : '';
    
    // Tentar encontrar termos específicos do produto
    let searchTerm = 'technology'; // termo padrão
    
    // Verificar se a categoria tem mapeamentos específicos
    if (categoryImageMappings[category]) {
        const mappings = categoryImageMappings[category];
        
        // Tentar encontrar um termo que combine com o nome do produto
        for (const term of mappings) {
            if (productName.includes(term.replace('-', ' ')) || 
                productName.includes(term.replace('-', ''))) {
                searchTerm = term;
                break;
            }
        }
        
        // Se não encontrou correspondência específica, usar o primeiro termo da categoria
        if (searchTerm === 'technology') {
            searchTerm = mappings[0];
        }
    }
    
    // Verificar marcas específicas no nome do produto
    const brands = ['apple', 'samsung', 'sony', 'lg', 'xiaomi', 'huawei', 'oneplus', 'google', 'microsoft', 'dell', 'hp', 'lenovo', 'asus', 'acer', 'canon', 'nikon', 'bose', 'jbl', 'beats'];
    
    for (const brand of brands) {
        if (productName.includes(brand)) {
            searchTerm = `${brand}-${searchTerm}`;
            break;
        }
    }
    
    // Gerar URL com termo mais específico
    const imageId = Math.floor(Math.random() * 1000) + 1000; // ID aleatório para variedade
    return `https://images.unsplash.com/photo-${imageId}?w=400&h=400&fit=crop&crop=center&auto=format&q=80&search=${searchTerm}`;
}

// Função para corrigir as imagens
function fixProductImages() {
    console.log('Iniciando correção das imagens dos produtos...');
    
    let correctedCount = 0;
    const correctedProducts = [];
    
    // Iterar sobre todas as categorias
    for (const categoryName in productsDatabase) {
        const categoryProducts = productsDatabase[categoryName];
        
        // Iterar sobre todos os produtos da categoria
        for (let i = 0; i < categoryProducts.length; i++) {
            const product = categoryProducts[i];
            
            // Gerar nova URL de imagem
            const newImageUrl = generateBetterImageUrl(product);
            
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
        }
    }
    
    console.log(`Corrigidas ${correctedCount} imagens de produtos.`);
    
    // Salvar log das correções
    fs.writeFileSync(
        path.join(__dirname, 'image-corrections-log.json'),
        JSON.stringify(correctedProducts, null, 2),
        'utf8'
    );
    
    console.log('Log das correções salvo em image-corrections-log.json');
    
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
    
    console.log('\\n=== RESUMO DA CORREÇÃO ===');
    console.log(`Total de produtos corrigidos: ${corrections.length}`);
    console.log('Todas as imagens foram atualizadas com URLs mais apropriadas.');
    console.log('\\nVerifique o arquivo image-corrections-log.json para detalhes das alterações.');
    
} catch (error) {
    console.error('Erro durante a correção das imagens:', error);
    process.exit(1);
}