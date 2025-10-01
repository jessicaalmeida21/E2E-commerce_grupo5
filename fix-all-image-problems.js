const fs = require('fs');

// Carregar o banco de dados
const databaseContent = fs.readFileSync('js/database.js', 'utf8');
const productsDatabase = eval(databaseContent.replace('// Banco de Dados de Produtos - 500 Produtos Organizados por Categoria\n', '') + '; productsDatabase');

console.log('🔧 Corrigindo todos os problemas de imagem...\n');

// Imagens específicas por categoria e marca
const categoryImages = {
    smartphones: {
        Apple: [
            'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=400&h=400&fit=crop'
        ],
        Samsung: [
            'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=400&h=400&fit=crop'
        ],
        Xiaomi: [
            'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1607936854279-55e8f4bc0b9a?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=400&h=400&fit=crop'
        ],
        Google: [
            'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=400&h=400&fit=crop'
        ],
        OnePlus: [
            'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400&h=400&fit=crop'
        ],
        Sony: [
            'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1607936854279-55e8f4bc0b9a?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&h=400&fit=crop'
        ],
        LG: [
            'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop'
        ],
        Motorola: [
            'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400&h=400&fit=crop'
        ]
    },
    notebooks: {
        Apple: [
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400&h=400&fit=crop'
        ],
        Dell: [
            'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=400&fit=crop'
        ],
        HP: [
            'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop'
        ],
        Lenovo: [
            'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=400&fit=crop'
        ],
        Asus: [
            'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop'
        ],
        MSI: [
            'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=400&fit=crop'
        ]
    },
    tablets: {
        Apple: [
            'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=400&h=400&fit=crop'
        ],
        Samsung: [
            'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop'
        ]
    },
    smartwatches: {
        Apple: [
            'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop'
        ],
        Samsung: [
            'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop'
        ]
    },
    headphones: {
        Sony: [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop'
        ],
        Bose: [
            'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'
        ],
        JBL: [
            'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop'
        ]
    }
};

// Função para obter imagem específica para produto
function getSpecificImageForProduct(product, usedImages = new Set()) {
    const categoryKey = product.category.toLowerCase().replace(/s$/, ''); // Remove 's' do final
    const brandKey = product.brand;
    
    // Tentar encontrar imagens específicas para a categoria e marca
    if (categoryImages[categoryKey] && categoryImages[categoryKey][brandKey]) {
        const availableImages = categoryImages[categoryKey][brandKey].filter(img => !usedImages.has(img));
        if (availableImages.length > 0) {
            const selectedImage = availableImages[Math.floor(Math.random() * availableImages.length)];
            usedImages.add(selectedImage);
            return selectedImage;
        }
    }
    
    // Fallback: usar qualquer imagem da categoria
    if (categoryImages[categoryKey]) {
        const allCategoryImages = Object.values(categoryImages[categoryKey]).flat();
        const availableImages = allCategoryImages.filter(img => !usedImages.has(img));
        if (availableImages.length > 0) {
            const selectedImage = availableImages[Math.floor(Math.random() * availableImages.length)];
            usedImages.add(selectedImage);
            return selectedImage;
        }
    }
    
    // Último fallback: usar imagens de smartphones
    const smartphoneImages = Object.values(categoryImages.smartphones).flat();
    const availableImages = smartphoneImages.filter(img => !usedImages.has(img));
    if (availableImages.length > 0) {
        const selectedImage = availableImages[Math.floor(Math.random() * availableImages.length)];
        usedImages.add(selectedImage);
        return selectedImage;
    }
    
    return product.image; // Manter a imagem original se não encontrar alternativa
}

let corrections = 0;
let usedImages = new Set();
const correctionLog = [];

// Processar cada categoria
Object.keys(productsDatabase).forEach(category => {
    if (Array.isArray(productsDatabase[category])) {
        productsDatabase[category].forEach((product, index) => {
            const originalImage = product.image;
            const newImage = getSpecificImageForProduct(product, usedImages);
            
            if (newImage !== originalImage) {
                product.image = newImage;
                corrections++;
                
                correctionLog.push({
                    category: category,
                    index: index,
                    id: product.id,
                    title: product.title,
                    brand: product.brand,
                    originalImage: originalImage,
                    newImage: newImage,
                    reason: 'Imagem específica para produto'
                });
                
                console.log(`✅ [${corrections}] ${product.title} (${product.brand}) - Nova imagem específica`);
            }
        });
    }
});

// Salvar o banco de dados atualizado
const updatedDatabaseContent = `// Banco de Dados de Produtos - 500 Produtos Organizados por Categoria
const productsDatabase = ${JSON.stringify(productsDatabase, null, 4)};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = productsDatabase;
}`;

fs.writeFileSync('js/database.js', updatedDatabaseContent);

// Salvar log de correções
fs.writeFileSync('all-image-corrections-log.json', JSON.stringify(correctionLog, null, 2));

console.log(`\n📊 RESUMO DAS CORREÇÕES:`);
console.log(`✅ Total de imagens corrigidas: ${corrections}`);
console.log(`📁 Log salvo em: all-image-corrections-log.json`);
console.log(`💾 Banco de dados atualizado: js/database.js`);
console.log('\n🎉 Todas as correções de imagem foram aplicadas!');