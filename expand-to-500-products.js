// Script para expandir database.js para 500 produtos
const fs = require('fs');

console.log('🚀 Expandindo database.js para 500 produtos...');

// Fazer backup
const currentContent = fs.readFileSync('js/database.js', 'utf8');
fs.writeFileSync('js/database-backup-before-500.js', currentContent);
console.log('💾 Backup criado: js/database-backup-before-500.js');

// Carregar imagens do arquivo 500-images-database.json
let images = [];
try {
    const imagesContent = fs.readFileSync('500-images-database.json', 'utf8');
    const imagesData = JSON.parse(imagesContent);
    images = imagesData.images || [];
    console.log(`📸 Carregadas ${images.length} imagens do arquivo 500-images-database.json`);
} catch (error) {
    console.log('⚠️ Arquivo de imagens não encontrado, usando imagens padrão');
    // Imagens padrão por categoria
    images = {
        smartphones: [
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
            "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
            "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=400&fit=crop&crop=center&auto=format&q=80"
        ],
        notebooks: [
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&crop=center&auto=format&q=80"
        ],
        televisoes: [
            "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
            "https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=400&h=400&fit=crop&crop=center&auto=format&q=80"
        ]
    };
}

// Função para obter imagem aleatória
function getRandomImage(category) {
    if (Array.isArray(images)) {
        return images[Math.floor(Math.random() * images.length)];
    } else if (images[category] && images[category].length > 0) {
        return images[category][Math.floor(Math.random() * images[category].length)];
    }
    return "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center&auto=format&q=80";
}

// Dados para gerar produtos
const productData = {
    smartphones: {
        brands: ['Samsung', 'Apple', 'Xiaomi', 'Motorola', 'LG', 'Huawei', 'OnePlus', 'Google', 'Sony', 'Nokia'],
        models: ['Galaxy S24', 'iPhone 15', 'Redmi Note', 'Moto G', 'Xperia', 'Pixel', 'Nord', 'P60', 'G73', 'C55'],
        variants: ['Pro', 'Ultra', 'Plus', 'Max', 'FE', 'Lite', '5G', 'Pro Max'],
        basePrice: [800, 4000],
        category: 'Smartphones'
    },
    notebooks: {
        brands: ['Dell', 'HP', 'Lenovo', 'Acer', 'ASUS', 'Apple', 'MSI', 'Samsung', 'LG', 'Positivo'],
        models: ['Inspiron', 'Pavilion', 'ThinkPad', 'Aspire', 'VivoBook', 'MacBook', 'Gaming', 'Book', 'Gram', 'Motion'],
        variants: ['15', '14', '13', 'Air', 'Pro', 'Gaming', 'Ultra', 'Slim', 'Touch', 'i5'],
        basePrice: [1500, 8000],
        category: 'Notebooks'
    },
    televisoes: {
        brands: ['Samsung', 'LG', 'Sony', 'TCL', 'Philips', 'Panasonic', 'AOC', 'Multilaser', 'Semp', 'Hisense'],
        models: ['Smart TV', 'QLED', 'OLED', 'NanoCell', 'Crystal', 'Neo QLED', '4K', '8K', 'UHD', 'Full HD'],
        variants: ['32"', '43"', '50"', '55"', '65"', '75"', '85"', 'HDR', 'Dolby', 'Android'],
        basePrice: [800, 5000],
        category: 'Televisões'
    },
    audio: {
        brands: ['Sony', 'JBL', 'Bose', 'Sennheiser', 'Audio-Technica', 'Beats', 'Marshall', 'Harman Kardon', 'Philips', 'Edifier'],
        models: ['Headphone', 'Speaker', 'Earbuds', 'Soundbar', 'Fone', 'Caixa', 'Bluetooth', 'Wireless', 'Gaming', 'Studio'],
        variants: ['Pro', 'Max', 'Ultra', 'Mini', 'Portable', 'Premium', 'Bass', 'Noise Cancel', '5.1', 'Surround'],
        basePrice: [100, 2000],
        category: 'Áudio e Som'
    },
    calcados: {
        brands: ['Nike', 'Adidas', 'Puma', 'Vans', 'Converse', 'New Balance', 'Asics', 'Mizuno', 'Olympikus', 'Fila'],
        models: ['Air Max', 'Ultraboost', 'Suede', 'Old Skool', 'Chuck Taylor', 'Fresh Foam', 'Gel', 'Wave', 'Correct', 'Disruptor'],
        variants: ['270', '90', '22', 'Classic', 'Hi', 'V3', 'Kayano', 'Rider', 'Force', 'II'],
        basePrice: [150, 800],
        category: 'Calçados'
    },
    roupas: {
        brands: ['Nike', 'Adidas', 'Puma', 'Lacoste', 'Tommy', 'Calvin Klein', 'Polo', 'Levi\'s', 'Zara', 'H&M'],
        models: ['Camiseta', 'Polo', 'Moletom', 'Jaqueta', 'Calça', 'Bermuda', 'Vestido', 'Blusa', 'Camisa', 'Short'],
        variants: ['Dri-FIT', 'Essentials', 'Classic', 'Slim', 'Regular', 'Oversized', 'Cropped', 'Basic', 'Premium', 'Sport'],
        basePrice: [50, 400],
        category: 'Roupas'
    },
    eletrodomesticos: {
        brands: ['Philips', 'Oster', 'Brastemp', 'Electrolux', 'Consul', 'LG', 'Samsung', 'Midea', 'Britânia', 'Mondial'],
        models: ['Air Fryer', 'Liquidificador', 'Geladeira', 'Fogão', 'Micro-ondas', 'Lava-louças', 'Aspirador', 'Cafeteira', 'Sanduicheira', 'Mixer'],
        variants: ['4L', '6L', 'Frost Free', 'Inox', 'Digital', 'Turbo', 'Premium', 'Compact', 'Pro', 'Max'],
        basePrice: [100, 3000],
        category: 'Eletrodomésticos'
    },
    esportes: {
        brands: ['Caloi', 'Trek', 'Specialized', 'Koga', 'Decathlon', 'Oxer', 'Poker', 'WCT', 'Gonew', 'Acte'],
        models: ['Bicicleta', 'Esteira', 'Halteres', 'Banco', 'Elíptico', 'Spinning', 'Kit', 'Barra', 'Colchonete', 'Corda'],
        variants: ['Elite', 'Carbon', 'Mountain', 'Speed', 'Dobrável', 'Elétrica', 'Ajustável', 'Profissional', 'Home', 'Fitness'],
        basePrice: [80, 4000],
        category: 'Esportes e Lazer'
    },
    monitores: {
        brands: ['ASUS', 'Dell', 'LG', 'Samsung', 'AOC', 'BenQ', 'Acer', 'HP', 'Philips', 'MSI'],
        models: ['Gaming', 'UltraSharp', 'UltraWide', 'Curved', 'Professional', 'TUF', 'ROG', 'Odyssey', 'Hero', 'Optix'],
        variants: ['24"', '27"', '32"', '34"', '144Hz', '165Hz', '240Hz', '4K', 'QHD', 'Full HD'],
        basePrice: [400, 3000],
        category: 'Monitores'
    },
    relogios: {
        brands: ['Apple', 'Samsung', 'Garmin', 'Fitbit', 'Casio', 'Citizen', 'Seiko', 'Fossil', 'Amazfit', 'Huawei'],
        models: ['Watch', 'Galaxy Watch', 'Forerunner', 'Versa', 'G-Shock', 'Eco-Drive', 'Prospex', 'Gen', 'GTR', 'GT'],
        variants: ['Series 9', 'Ultra', '6', '4', 'Pro', 'Classic', 'Active', '5', '3', '2'],
        basePrice: [200, 4000],
        category: 'Relógios'
    }
};

// Função para gerar produto
function generateProduct(category, index) {
    const data = productData[category];
    const brand = data.brands[Math.floor(Math.random() * data.brands.length)];
    const model = data.models[Math.floor(Math.random() * data.models.length)];
    const variant = data.variants[Math.floor(Math.random() * data.variants.length)];
    
    const basePrice = Math.random() * (data.basePrice[1] - data.basePrice[0]) + data.basePrice[0];
    const price = Math.round(basePrice * 100) / 100;
    const originalPrice = Math.round(price * (1 + Math.random() * 0.3) * 100) / 100;
    const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
    
    const stock = Math.floor(Math.random() * 100) + 10;
    const rating = Math.round((Math.random() * 2 + 3) * 10) / 10; // 3.0 a 5.0
    const ratingCount = Math.floor(Math.random() * 500) + 50;
    
    return {
        id: `PROD-${String(index).padStart(3, '0')}`,
        title: `${brand} ${model} ${variant}`,
        price: price,
        originalPrice: originalPrice,
        discount: discount,
        category: data.category,
        brand: brand,
        image: getRandomImage(category),
        description: `${brand} ${model} ${variant} com excelente qualidade e design moderno. Produto com garantia e entrega rápida.`,
        stock: stock,
        rating: rating,
        ratingCount: ratingCount
    };
}

// Distribuição de produtos por categoria (total 500)
const distribution = {
    smartphones: 60,    // 60 produtos
    notebooks: 50,      // 50 produtos
    televisoes: 45,     // 45 produtos
    audio: 55,          // 55 produtos
    calcados: 65,       // 65 produtos
    roupas: 70,         // 70 produtos
    eletrodomesticos: 50, // 50 produtos
    esportes: 40,       // 40 produtos
    monitores: 35,      // 35 produtos
    relogios: 30        // 30 produtos
};

// Gerar produtos
const productsDatabase = {};
let productIndex = 1;

Object.keys(distribution).forEach(category => {
    productsDatabase[category] = [];
    const count = distribution[category];
    
    for (let i = 0; i < count; i++) {
        const product = generateProduct(category, productIndex);
        productsDatabase[category].push(product);
        productIndex++;
    }
    
    console.log(`✅ Gerados ${count} produtos para categoria: ${category}`);
});

// Criar conteúdo do novo database.js
const newDatabaseContent = `// Banco de Dados de Produtos - 500 Produtos Organizados por Categoria
const productsDatabase = ${JSON.stringify(productsDatabase, null, 4)};

// Função para obter todos os produtos
function getAllProducts() {
    const allProducts = [];
    Object.values(productsDatabase).forEach(category => {
        allProducts.push(...category);
    });
    return allProducts;
}

// Função para obter produtos por categoria
function getProductsByCategory(category) {
    return productsDatabase[category] || [];
}

// Função para obter categorias disponíveis
function getCategories() {
    return Object.keys(productsDatabase).map(key => ({
        key: key,
        name: getCategoryDisplayName(key)
    }));
}

// Função para obter nome de exibição da categoria
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

// Exportar para Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        productsDatabase,
        getAllProducts,
        getProductsByCategory,
        getCategories,
        getCategoryDisplayName
    };
}

// Exportar globalmente para Node.js (para compatibilidade)
if (typeof global !== 'undefined') {
    global.productsDatabase = productsDatabase;
    global.getAllProducts = getAllProducts;
    global.getProductsByCategory = getProductsByCategory;
    global.getCategories = getCategories;
    global.getCategoryDisplayName = getCategoryDisplayName;
}`;

// Salvar o novo arquivo
fs.writeFileSync('js/database.js', newDatabaseContent);

console.log('🎉 Database expandido com sucesso!');
console.log('📊 Resumo da expansão:');
Object.keys(distribution).forEach(category => {
    console.log(`  ${category}: ${distribution[category]} produtos`);
});
console.log(`📝 Total: ${Object.values(distribution).reduce((a, b) => a + b, 0)} produtos`);
console.log('✅ Todas as categorias mantidas e organizadas');
console.log('🖼️ Imagens aleatórias atribuídas a cada produto');