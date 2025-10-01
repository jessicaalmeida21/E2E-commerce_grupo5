// Script para reorganizar database.js removendo categorias duplicadas
const fs = require('fs');

console.log('🔄 Reorganizando database.js...');

// Ler o arquivo atual
const databaseContent = fs.readFileSync('js/database.js', 'utf8');

// Fazer backup
fs.writeFileSync('js/database-backup-before-reorganize.js', databaseContent);
console.log('💾 Backup criado: js/database-backup-before-reorganize.js');

// Novo conteúdo organizado
const newDatabaseContent = `// Banco de Dados de Produtos Organizados por Categoria
const productsDatabase = {
    smartphones: [
        {
            id: "PROD-001",
            title: "Samsung Galaxy S24 FE 5G",
            price: 2899.99,
            originalPrice: 3299.99,
            discount: 12,
            category: "Smartphones",
            brand: "Samsung",
            image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
            description: "Smartphone Samsung Galaxy S24 FE 5G com 8GB RAM, 128GB, câmera tripla 50MP + 12MP + 8MP, tela 6.7\\" AMOLED 120Hz",
            stock: 15,
            rating: 4.5,
            ratingCount: 234
        },
        {
            id: "PROD-002",
            title: "iPhone 15 Pro Max",
            price: 8999.99,
            originalPrice: 9999.99,
            discount: 10,
            category: "Smartphones",
            brand: "Apple",
            image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
            description: "iPhone 15 Pro Max com chip A17 Pro, câmera principal 48MP, tela Super Retina XDR 6.7\\", 256GB",
            stock: 8,
            rating: 4.8,
            ratingCount: 567
        },
        {
            id: "PROD-003",
            title: "Xiaomi Redmi Note 13 Pro",
            price: 1299.99,
            originalPrice: 1599.99,
            discount: 19,
            category: "Smartphones",
            brand: "Xiaomi",
            image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
            description: "Smartphone Xiaomi Redmi Note 13 Pro com 8GB RAM, 256GB, câmera tripla 200MP, tela 6.67\\" AMOLED 120Hz",
            stock: 22,
            rating: 4.3,
            ratingCount: 189
        }
    ],
    
    notebooks: [
        {
            id: "PROD-004",
            title: "Notebook Dell Inspiron 15 3000",
            price: 2499.99,
            originalPrice: 2899.99,
            discount: 14,
            category: "Notebooks",
            brand: "Dell",
            image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
            description: "Notebook Dell Inspiron 15 com Intel Core i5, 8GB RAM, 256GB SSD, tela 15.6\\" Full HD",
            stock: 12,
            rating: 4.2,
            ratingCount: 156
        },
        {
            id: "PROD-005",
            title: "MacBook Air M2",
            price: 7999.99,
            originalPrice: 8999.99,
            discount: 11,
            category: "Notebooks",
            brand: "Apple",
            image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
            description: "MacBook Air com chip M2, 8GB RAM, 256GB SSD, tela Liquid Retina 13.6\\"",
            stock: 6,
            rating: 4.9,
            ratingCount: 423
        }
    ],
    
    televisoes: [
        {
            id: "PROD-006",
            title: "Smart TV Samsung 55\\" 4K QLED",
            price: 3299.99,
            originalPrice: 3799.99,
            discount: 13,
            category: "Televisões",
            brand: "Samsung",
            image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
            description: "Smart TV Samsung 55\\" 4K QLED com Tizen, HDR10+, Alexa Built-in",
            stock: 18,
            rating: 4.6,
            ratingCount: 287
        },
        {
            id: "PROD-007",
            title: "Smart TV LG 50\\" 4K NanoCell",
            price: 2799.99,
            originalPrice: 3199.99,
            discount: 13,
            category: "Televisões",
            brand: "LG",
            image: "https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
            description: "Smart TV LG 50\\" 4K NanoCell com webOS, AI ThinQ, Dolby Vision",
            stock: 14,
            rating: 4.4,
            ratingCount: 198
        }
    ],
    
    audio: [
        {
            id: "PROD-008",
            title: "Fone Bluetooth Sony WH-1000XM5",
            price: 1899.99,
            originalPrice: 2199.99,
            discount: 14,
            category: "Áudio e Som",
            brand: "Sony",
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
            description: "Fone de ouvido Sony com cancelamento de ruído, 30h de bateria, Hi-Res Audio",
            stock: 25,
            rating: 4.7,
            ratingCount: 342
        },
        {
            id: "PROD-009",
            title: "JBL Charge 5 Bluetooth Speaker",
            price: 699.99,
            originalPrice: 799.99,
            discount: 13,
            category: "Áudio e Som",
            brand: "JBL",
            image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
            description: "Caixa de som JBL Charge 5 à prova d'água, 20h de bateria, PartyBoost",
            stock: 31,
            rating: 4.5,
            ratingCount: 267
        }
    ],
    
    calcados: [
        {
            id: "PROD-010",
            title: "Tênis Nike Air Max 270",
            price: 599.99,
            originalPrice: 699.99,
            discount: 14,
            category: "Calçados",
            brand: "Nike",
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
            description: "Tênis Nike Air Max 270 com amortecimento Air, design moderno e confortável",
            stock: 45,
            rating: 4.6,
            ratingCount: 523
        },
        {
            id: "PROD-011",
            title: "Tênis Adidas Ultraboost 22",
            price: 799.99,
            originalPrice: 899.99,
            discount: 11,
            category: "Calçados",
            brand: "Adidas",
            image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
            description: "Tênis Adidas Ultraboost 22 com tecnologia Boost, ideal para corrida",
            stock: 38,
            rating: 4.7,
            ratingCount: 412
        }
    ],
    
    roupas: [
        {
            id: "PROD-012",
            title: "Camiseta Nike Dri-FIT",
            price: 129.99,
            originalPrice: 149.99,
            discount: 13,
            category: "Roupas",
            brand: "Nike",
            image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
            description: "Camiseta Nike Dri-FIT com tecnologia que absorve o suor, ideal para esportes",
            stock: 67,
            rating: 4.3,
            ratingCount: 189
        },
        {
            id: "PROD-013",
            title: "Jaqueta Adidas Essentials",
            price: 299.99,
            originalPrice: 349.99,
            discount: 14,
            category: "Roupas",
            brand: "Adidas",
            image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
            description: "Jaqueta Adidas Essentials com capuz, perfeita para o dia a dia",
            stock: 42,
            rating: 4.4,
            ratingCount: 234
        }
    ],
    
    eletrodomesticos: [
        {
            id: "PROD-014",
            title: "Air Fryer Philips Walita 4L",
            price: 449.99,
            originalPrice: 529.99,
            discount: 15,
            category: "Eletrodomésticos",
            brand: "Philips",
            image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
            description: "Air Fryer Philips Walita 4L com tecnologia Rapid Air, cozinha sem óleo",
            stock: 28,
            rating: 4.5,
            ratingCount: 356
        },
        {
            id: "PROD-015",
            title: "Liquidificador Oster Clássico",
            price: 199.99,
            originalPrice: 239.99,
            discount: 17,
            category: "Eletrodomésticos",
            brand: "Oster",
            image: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
            description: "Liquidificador Oster com 12 velocidades, jarra de vidro 1.25L",
            stock: 35,
            rating: 4.2,
            ratingCount: 278
        }
    ],
    
    esportes: [
        {
            id: "PROD-016",
            title: "Bicicleta Caloi Elite Carbon",
            price: 3999.99,
            originalPrice: 4599.99,
            discount: 13,
            category: "Esportes e Lazer",
            brand: "Caloi",
            image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
            description: "Bicicleta Caloi Elite Carbon com quadro de carbono, 21 marchas Shimano",
            stock: 8,
            rating: 4.8,
            ratingCount: 145
        },
        {
            id: "PROD-017",
            title: "Kit Halteres Ajustáveis 20kg",
            price: 299.99,
            originalPrice: 349.99,
            discount: 14,
            category: "Esportes e Lazer",
            brand: "Genérico",
            image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
            description: "Kit de halteres ajustáveis até 20kg, ideal para treino em casa",
            stock: 22,
            rating: 4.3,
            ratingCount: 167
        }
    ],
    
    monitores: [
        {
            id: "PROD-018",
            title: "Monitor Gamer ASUS 24\\" 144Hz",
            price: 1299.99,
            originalPrice: 1499.99,
            discount: 13,
            category: "Monitores",
            brand: "ASUS",
            image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
            description: "Monitor Gamer ASUS 24\\" Full HD 144Hz, 1ms, FreeSync Premium",
            stock: 16,
            rating: 4.6,
            ratingCount: 289
        },
        {
            id: "PROD-019",
            title: "Monitor Dell UltraSharp 27\\" 4K",
            price: 2199.99,
            originalPrice: 2599.99,
            discount: 15,
            category: "Monitores",
            brand: "Dell",
            image: "https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
            description: "Monitor Dell UltraSharp 27\\" 4K IPS, 99% sRGB, USB-C",
            stock: 11,
            rating: 4.7,
            ratingCount: 198
        }
    ],
    
    relogios: [
        {
            id: "PROD-020",
            title: "Apple Watch Series 9 45mm",
            price: 3499.99,
            originalPrice: 3999.99,
            discount: 13,
            category: "Relógios",
            brand: "Apple",
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
            description: "Apple Watch Series 9 45mm com GPS, monitoramento de saúde avançado",
            stock: 19,
            rating: 4.8,
            ratingCount: 456
        },
        {
            id: "PROD-021",
            title: "Relógio Casio G-Shock Digital",
            price: 599.99,
            originalPrice: 699.99,
            discount: 14,
            category: "Relógios",
            brand: "Casio",
            image: "https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
            description: "Relógio Casio G-Shock resistente a choques e água, cronômetro",
            stock: 33,
            rating: 4.5,
            ratingCount: 298
        }
    ]
};

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
}`;

// Salvar o novo arquivo
fs.writeFileSync('js/database.js', newDatabaseContent);

console.log('✅ Database reorganizado com sucesso!');
console.log('📊 Categorias organizadas:');
console.log('  - smartphones → Smartphones');
console.log('  - notebooks → Notebooks');
console.log('  - televisoes → Televisões');
console.log('  - audio → Áudio e Som');
console.log('  - calcados → Calçados');
console.log('  - roupas → Roupas');
console.log('  - eletrodomesticos → Eletrodomésticos');
console.log('  - esportes → Esportes e Lazer');
console.log('  - monitores → Monitores');
console.log('  - relogios → Relógios');
console.log('🗑️ Categorias duplicadas removidas');
console.log('📝 Total de produtos: 21 produtos base (mais produtos podem ser adicionados)');