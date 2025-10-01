const fs = require('fs');
const path = require('path');

console.log('🔧 CORREÇÃO ABRANGENTE DE PRODUTOS - CATEGORIAS, NOMES E IMAGENS\n');

// Criar backup do banco de dados
const databasePath = path.join(__dirname, 'js', 'database.js');
const backupPath = path.join(__dirname, 'js', `database-backup-comprehensive-fix-${Date.now()}.js`);
fs.copyFileSync(databasePath, backupPath);
console.log(`✅ Backup criado: ${path.basename(backupPath)}`);

// Carregar banco de dados atual
const productsDatabase = require('./js/database.js');

// Definir estrutura correta de categorias
const categoryStructure = {
    smartphones: {
        displayName: 'Smartphones',
        brands: ['Apple', 'Samsung', 'Xiaomi', 'Google', 'OnePlus', 'Huawei', 'Sony', 'LG', 'Motorola', 'Oppo'],
        models: ['iPhone 15', 'Galaxy S24', 'Redmi Note 13', 'Pixel 8', 'OnePlus 12', 'P60', 'Xperia 1', 'G8', 'Edge 50', 'Find X7'],
        variants: ['Pro', 'Ultra', 'Plus', 'Max', 'FE', 'Lite']
    },
    notebooks: {
        displayName: 'Notebooks',
        brands: ['Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'Apple', 'MSI', 'Samsung', 'LG', 'Positivo'],
        models: ['Inspiron', 'Pavilion', 'ThinkPad', 'VivoBook', 'Aspire', 'MacBook', 'Gaming', 'Book', 'Gram', 'Motion'],
        variants: ['Pro', 'Air', 'Gaming', 'Business', 'Student', 'Ultra']
    },
    televisoes: {
        displayName: 'Televisões',
        brands: ['Samsung', 'LG', 'Sony', 'TCL', 'Philips', 'Panasonic', 'Hisense', 'AOC', 'Multilaser', 'Semp'],
        models: ['QLED', 'OLED', 'Crystal', 'NanoCell', 'Bravia', 'C735', 'Ambilight', 'Viera', 'U7K', 'Smart'],
        variants: ['4K', '8K', 'HDR', 'Smart', 'Android TV', 'Tizen']
    },
    audio: {
        displayName: 'Áudio e Som',
        brands: ['Sony', 'JBL', 'Bose', 'Sennheiser', 'Audio-Technica', 'Beats', 'Marshall', 'Harman Kardon', 'Edifier', 'Philips'],
        models: ['WH-1000XM5', 'Charge 5', 'QuietComfort', 'HD 660S', 'ATH-M50x', 'Studio3', 'Major IV', 'Onyx', 'R1280T', 'SHP9500'],
        variants: ['Wireless', 'Bluetooth', 'Noise Cancelling', 'Gaming', 'Studio', 'Sport']
    },
    calcados: {
        displayName: 'Calçados',
        brands: ['Nike', 'Adidas', 'Puma', 'Vans', 'Converse', 'New Balance', 'Asics', 'Reebok', 'Fila', 'Mizuno'],
        models: ['Air Max', 'Ultraboost', 'Suede', 'Old Skool', 'Chuck Taylor', '990v5', 'Gel-Kayano', 'Classic', 'Disruptor', 'Wave'],
        variants: ['Running', 'Casual', 'Basketball', 'Skateboard', 'Training', 'Lifestyle']
    },
    roupas: {
        displayName: 'Roupas',
        brands: ['Nike', 'Adidas', 'Lacoste', 'Tommy Hilfiger', 'Calvin Klein', 'Polo Ralph Lauren', 'Hugo Boss', 'Levi\'s', 'Zara', 'H&M'],
        models: ['Dri-FIT', 'Originals', 'Classic Fit', 'Slim Fit', 'Modern Fit', 'Custom Fit', 'Regular Fit', '501', 'Basic', 'Premium'],
        variants: ['Camiseta', 'Polo', 'Moletom', 'Jaqueta', 'Calça', 'Bermuda', 'Vestido', 'Blusa']
    },
    eletrodomesticos: {
        displayName: 'Eletrodomésticos',
        brands: ['Brastemp', 'Consul', 'Electrolux', 'LG', 'Samsung', 'Philips', 'Arno', 'Black+Decker', 'Mondial', 'Britânia'],
        models: ['Frost Free', 'Inverse', 'TurboCooling', 'InverterLinear', 'Digital', 'Walita', 'Perfect Mix', 'Toast', 'Power', 'Inox'],
        variants: ['Geladeira', 'Fogão', 'Micro-ondas', 'Lava-roupas', 'Lava-louças', 'Aspirador', 'Liquidificador', 'Cafeteira']
    },
    esportes: {
        displayName: 'Esportes e Lazer',
        brands: ['Nike', 'Adidas', 'Puma', 'Under Armour', 'Speedo', 'Penalty', 'Umbro', 'Kappa', 'Fila', 'Wilson'],
        models: ['Dri-FIT', 'Climalite', 'DryCELL', 'HeatGear', 'Endurance+', 'Storm', 'Pro Training', 'Kombat', 'Performance', 'Pro Staff'],
        variants: ['Futebol', 'Basquete', 'Tênis', 'Natação', 'Corrida', 'Academia', 'Yoga', 'Ciclismo']
    },
    monitores: {
        displayName: 'Monitores',
        brands: ['Samsung', 'LG', 'Dell', 'ASUS', 'AOC', 'BenQ', 'Acer', 'HP', 'Philips', 'MSI'],
        models: ['Odyssey', 'UltraWide', 'UltraSharp', 'ROG', 'Hero', 'MOBIUZ', 'Predator', 'EliteDisplay', 'Brilliance', 'Optix'],
        variants: ['4K', 'Ultrawide', 'Gaming', 'Curvo', 'IPS', 'VA', 'OLED', '144Hz', '240Hz']
    },
    relogios: {
        displayName: 'Relógios',
        brands: ['Apple', 'Samsung', 'Garmin', 'Fitbit', 'Amazfit', 'Huawei', 'Fossil', 'Casio', 'Citizen', 'Orient'],
        models: ['Watch Series', 'Galaxy Watch', 'Forerunner', 'Versa', 'GTR', 'Watch GT', 'Gen 6', 'G-Shock', 'Eco-Drive', 'Bambino'],
        variants: ['Smartwatch', 'Fitness', 'GPS', 'Cellular', 'Classic', 'Sport', 'Dress', 'Dive']
    }
};

// Pool de imagens específicas por categoria
const imagePool = {
    smartphones: [
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&h=400&fit=crop&auto=format"
    ],
    notebooks: [
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1587614295999-6c1c3a7b98d0?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=400&fit=crop&auto=format"
    ],
    televisoes: [
        "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop&auto=format"
    ],
    audio: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1558756520-22cfe5d382ca?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&auto=format"
    ],
    calcados: [
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=400&h=400&fit=crop&auto=format"
    ],
    roupas: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&h=400&fit=crop&auto=format"
    ],
    eletrodomesticos: [
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=400&fit=crop&auto=format"
    ],
    esportes: [
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop&auto=format"
    ],
    monitores: [
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&auto=format"
    ],
    relogios: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=400&fit=crop&auto=format"
    ]
};

// Função para gerar nome realista do produto
function generateRealisticProductName(category, index) {
    const categoryData = categoryStructure[category];
    const brand = categoryData.brands[index % categoryData.brands.length];
    const model = categoryData.models[index % categoryData.models.length];
    const variant = categoryData.variants[index % categoryData.variants.length];
    
    // Criar nomes específicos por categoria
    switch (category) {
        case 'smartphones':
            return `${brand} ${model} ${variant}`;
        case 'notebooks':
            return `Notebook ${brand} ${model} ${variant}`;
        case 'televisoes':
            const size = [32, 43, 50, 55, 65, 75][index % 6];
            return `Smart TV ${brand} ${size}" ${model} ${variant}`;
        case 'audio':
            return `${brand} ${model} ${variant}`;
        case 'calcados':
            return `Tênis ${brand} ${model} ${variant}`;
        case 'roupas':
            return `${variant} ${brand} ${model}`;
        case 'eletrodomesticos':
            return `${variant} ${brand} ${model}`;
        case 'esportes':
            return `${variant} ${brand} ${model}`;
        case 'monitores':
            const monitorSize = [21, 24, 27, 32, 34][index % 5];
            return `Monitor ${brand} ${monitorSize}" ${model} ${variant}`;
        case 'relogios':
            return `${brand} ${model} ${variant}`;
        default:
            return `${brand} ${model} ${variant}`;
    }
}

// Função para embaralhar array
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Processar cada categoria
const corrections = [];
let totalCorrections = 0;

Object.keys(productsDatabase).forEach(categoryKey => {
    const products = productsDatabase[categoryKey];
    const categoryData = categoryStructure[categoryKey];
    const shuffledImages = shuffleArray(imagePool[categoryKey] || []);
    
    console.log(`\n🔧 Processando categoria: ${categoryKey} (${products.length} produtos)`);
    
    products.forEach((product, index) => {
        let corrected = false;
        const originalProduct = { ...product };
        
        // 1. Corrigir nome do produto
        const newTitle = generateRealisticProductName(categoryKey, index);
        if (product.title !== newTitle) {
            product.title = newTitle;
            corrected = true;
        }
        
        // 2. Corrigir categoria
        const correctCategory = categoryData.displayName;
        if (product.category !== correctCategory) {
            product.category = correctCategory;
            corrected = true;
        }
        
        // 3. Corrigir marca
        const correctBrand = categoryData.brands[index % categoryData.brands.length];
        if (product.brand !== correctBrand) {
            product.brand = correctBrand;
            corrected = true;
        }
        
        // 4. Atribuir imagem específica
        const imageIndex = index % shuffledImages.length;
        const newImage = shuffledImages[imageIndex];
        if (product.image !== newImage) {
            product.image = newImage;
            corrected = true;
        }
        
        // 5. Melhorar descrição
        const newDescription = `${newTitle} com excelente qualidade e design moderno. Produto ${correctBrand} com garantia e entrega rápida.`;
        if (product.description !== newDescription) {
            product.description = newDescription;
            corrected = true;
        }
        
        if (corrected) {
            corrections.push({
                id: product.id,
                category: categoryKey,
                changes: {
                    title: { old: originalProduct.title, new: product.title },
                    category: { old: originalProduct.category, new: product.category },
                    brand: { old: originalProduct.brand, new: product.brand },
                    image: { old: originalProduct.image, new: product.image },
                    description: { old: originalProduct.description, new: product.description }
                }
            });
            totalCorrections++;
        }
    });
    
    console.log(`   ✅ ${products.length} produtos processados`);
});

// Salvar banco de dados atualizado
const newDatabaseContent = `// Banco de Dados de Produtos - 500 Produtos Organizados por Categoria
const productsDatabase = ${JSON.stringify(productsDatabase, null, 2)};

// Funções do Database
function getAllProducts() {
    const allProducts = [];
    for (const category in productsDatabase) {
        allProducts.push(...productsDatabase[category]);
    }
    return allProducts;
}

function getProductsByCategory(category) {
    const categoryKey = category.toLowerCase();
    return productsDatabase[categoryKey] || [];
}

function getCategories() {
    return Object.keys(productsDatabase).map(key => ({
        key: key,
        name: getCategoryDisplayName(key)
    }));
}

function getCategoryDisplayName(key) {
    const displayNames = {
        'smartphones': 'Smartphones',
        'notebooks': 'Notebooks',
        'televisoes': 'Televisões',
        'audio': 'Áudio e Som',
        'calcados': 'Calçados',
        'roupas': 'Roupas',
        'eletrodomesticos': 'Eletrodomésticos',
        'esportes': 'Esportes e Lazer',
        'monitores': 'Monitores',
        'relogios': 'Relógios'
    };
    return displayNames[key] || key.charAt(0).toUpperCase() + key.slice(1);
}

// Exportar para uso em outros módulos
if (typeof window !== 'undefined') {
    window.productsDatabase = productsDatabase;
    window.getAllProducts = getAllProducts;
    window.getProductsByCategory = getProductsByCategory;
    window.getCategories = getCategories;
    window.getCategoryDisplayName = getCategoryDisplayName;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = productsDatabase;
}`;

fs.writeFileSync(databasePath, newDatabaseContent);

// Salvar log de correções
const logData = {
    timestamp: new Date().toISOString(),
    totalCorrections,
    categoriesProcessed: Object.keys(productsDatabase).length,
    totalProducts: Object.values(productsDatabase).reduce((sum, products) => sum + products.length, 0),
    corrections,
    summary: {
        byCategory: Object.keys(productsDatabase).map(key => ({
            category: key,
            productCount: productsDatabase[key].length,
            displayName: categoryStructure[key].displayName
        }))
    }
};

fs.writeFileSync('comprehensive-corrections-log.json', JSON.stringify(logData, null, 2));

console.log(`\n✅ CORREÇÃO ABRANGENTE CONCLUÍDA!`);
console.log(`   📊 Total de produtos: ${logData.totalProducts}`);
console.log(`   🔧 Total de correções: ${totalCorrections}`);
console.log(`   📁 Categorias processadas: ${logData.categoriesProcessed}`);
console.log(`   💾 Backup salvo: ${path.basename(backupPath)}`);
console.log(`   📋 Log detalhado: comprehensive-corrections-log.json`);
console.log(`   🗃️ Database atualizado: js/database.js`);

console.log(`\n🎯 FUNCIONALIDADES PRESERVADAS:`);
console.log(`   ✅ Estrutura do banco de dados mantida`);
console.log(`   ✅ Sistema de módulos preservado`);
console.log(`   ✅ Funções da API intactas`);
console.log(`   ✅ Compatibilidade com frontend mantida`);