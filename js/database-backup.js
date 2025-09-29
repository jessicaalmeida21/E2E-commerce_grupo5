// Banco de Dados de Produtos Organizados por Categoria
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
            description: "Smartphone Samsung Galaxy S24 FE 5G com 8GB RAM, 128GB, câmera tripla 50MP + 12MP + 8MP, tela 6.7\" AMOLED 120Hz",
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
            description: "iPhone 15 Pro Max com chip A17 Pro, câmera principal 48MP, tela Super Retina XDR 6.7\", 256GB",
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
            description: "Smartphone Xiaomi Redmi Note 13 Pro com 8GB RAM, 256GB, câmera tripla 200MP, tela 6.67\" AMOLED 120Hz",
            stock: 22,
            rating: 4.3,
            ratingCount: 189
        }
    ],
    
    notebooks: [
        {
            id: "PROD-004",
            title: "Notebook Acer Aspire 5",
            price: 2499.99,
            originalPrice: 2999.99,
            discount: 17,
            category: "Notebooks",
            brand: "Acer",
            image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
            description: "Notebook Acer Aspire 5 com Intel Core i5, 8GB RAM, 512GB SSD, tela 15.6\" Full HD",
            stock: 12,
            rating: 4.2,
            ratingCount: 156
        },
        {
            id: "PROD-005",
            title: "Notebook Lenovo IdeaPad 3",
            price: 1899.99,
            originalPrice: 2299.99,
            discount: 17,
            category: "Notebooks",
            brand: "Lenovo",
            image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
            description: "Notebook Lenovo IdeaPad 3 com AMD Ryzen 5, 8GB RAM, 256GB SSD, tela 14\" Full HD",
            stock: 18,
            rating: 4.1,
            ratingCount: 98
        },
        {
            id: "PROD-006",
            title: "Notebook Dell Inspiron 15",
            price: 3299.99,
            originalPrice: 3799.99,
            discount: 13,
            category: "Notebooks",
            brand: "Dell",
            image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
            description: "Notebook Dell Inspiron 15 com Intel Core i7, 16GB RAM, 1TB SSD, tela 15.6\" Full HD",
            stock: 7,
            rating: 4.6,
            ratingCount: 203
        }
    ],
    
    televisoes: [
        {
            id: "PROD-007",
            title: "Smart TV Samsung 55\" 4K",
            price: 1899.99,
            originalPrice: 2299.99,
            discount: 17,
            category: "Televisões",
            brand: "Samsung",
            image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
            description: "Smart TV Samsung 55\" 4K UHD com Tizen OS, HDR, Wi-Fi, Bluetooth",
            stock: 25,
            rating: 4.4,
            ratingCount: 312
        },
        {
            id: "PROD-008",
            title: "Smart TV LG 50\" 4K",
            price: 1599.99,
            originalPrice: 1999.99,
            discount: 20,
            category: "Televisões",
            brand: "LG",
            image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
            description: "Smart TV LG 50\" 4K UHD com webOS, HDR, Wi-Fi, Bluetooth",
            stock: 19,
            rating: 4.3,
            ratingCount: 187
        },
        {
            id: "PROD-009",
            title: "Smart TV Sony 43\" 4K",
            price: 1299.99,
            originalPrice: 1599.99,
            discount: 19,
            category: "Televisões",
            brand: "Sony",
            image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
            description: "Smart TV Sony 43\" 4K UHD com Android TV, HDR, Wi-Fi, Bluetooth",
            stock: 14,
            rating: 4.5,
            ratingCount: 245
        }
    ],
    
    audio: [
        {
            id: "PROD-010",
            title: "Fone JBL Tune 510BT",
            price: 199.99,
            originalPrice: 249.99,
            discount: 20,
            category: "Áudio",
            brand: "JBL",
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
            description: "Fone de ouvido JBL Tune 510BT com Bluetooth, microfone integrado, bateria de 40h",
            stock: 35,
            rating: 4.2,
            ratingCount: 178
        },
        {
            id: "PROD-011",
            title: "Fone Sony WH-CH720N",
            price: 399.99,
            originalPrice: 499.99,
            discount: 20,
            category: "Áudio",
            brand: "Sony",
            image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
            description: "Fone de ouvido Sony WH-CH720N com cancelamento de ruído, Bluetooth, bateria de 35h",
            stock: 28,
            rating: 4.6,
            ratingCount: 267
        }
    ],
    
    calcados: [
        {
            id: "PROD-012",
            title: "Tênis Nike Air Max 270",
            price: 599.99,
            originalPrice: 699.99,
            discount: 14,
            category: "Calçados",
            brand: "Nike",
            image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
            description: "Tênis Nike Air Max 270 com tecnologia Air Max, solado em borracha, cabedal em mesh",
            stock: 42,
            rating: 4.4,
            ratingCount: 189
        },
        {
            id: "PROD-013",
            title: "Tênis Adidas Ultraboost 22",
            price: 799.99,
            originalPrice: 899.99,
            discount: 11,
            category: "Calçados",
            brand: "Adidas",
            image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
            description: "Tênis Adidas Ultraboost 22 com tecnologia Boost, cabedal Primeknit, solado Continental",
            stock: 31,
            rating: 4.7,
            ratingCount: 234
        },
        {
            id: "PROD-014",
            title: "Tênis Puma RS-X",
            price: 449.99,
            originalPrice: 549.99,
            discount: 18,
            category: "Calçados",
            brand: "Puma",
            image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
            description: "Tênis Puma RS-X com design retrô, cabedal em mesh, solado em borracha",
            stock: 38,
            rating: 4.3,
            ratingCount: 156
        }
    ],
    
    roupas: [
        {
            id: "PROD-015",
            title: "Camiseta Nike Dri-FIT",
            price: 89.99,
            originalPrice: 119.99,
            discount: 25,
            category: "Roupas",
            brand: "Nike",
            image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
            description: "Camiseta Nike Dri-FIT com tecnologia de secagem rápida, 100% poliéster",
            stock: 67,
            rating: 4.1,
            ratingCount: 98
        },
        {
            id: "PROD-016",
            title: "Calça Jeans Levis 501",
            price: 199.99,
            originalPrice: 249.99,
            discount: 20,
            category: "Roupas",
            brand: "Levis",
            image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
            description: "Calça Jeans Levis 501 com corte clássico, 100% algodão, lavagem média",
            stock: 54,
            rating: 4.5,
            ratingCount: 187
        },
        {
            id: "PROD-017",
            title: "Jaqueta Adidas Originals",
            price: 299.99,
            originalPrice: 349.99,
            discount: 14,
            category: "Roupas",
            brand: "Adidas",
            image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
            description: "Jaqueta Adidas Originals com capuz, zíper frontal, bolsos laterais",
            stock: 29,
            rating: 4.3,
            ratingCount: 134
        }
    ],
    
    eletrodomesticos: [
        {
            id: "PROD-018",
            title: "Liquidificador Philips Walita",
            price: 149.99,
            originalPrice: 199.99,
            discount: 25,
            category: "Eletrodomésticos",
            brand: "Philips",
            image: "https://images.unsplash.com/photo-15569091431326005620-6d0e44b482f8?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
            description: "Liquidificador Philips Walita com 600W, jarra de vidro 1.5L, 4 lâminas em aço inox",
            stock: 41,
            rating: 4.2,
            ratingCount: 167
        },
        {
            id: "PROD-019",
            title: "Air Fryer Mondial",
            price: 299.99,
            originalPrice: 399.99,
            discount: 25,
            category: "Eletrodomésticos",
            brand: "Mondial",
            image: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
            description: "Air Fryer Mondial com 4L de capacidade, 1500W, timer digital, cesto antiaderente",
            stock: 33,
            rating: 4.4,
            ratingCount: 198
        },
        {
            id: "PROD-020",
            title: "Aspirador Robô Britânia",
            price: 599.99,
            originalPrice: 799.99,
            discount: 25,
            category: "Eletrodomésticos",
            brand: "Britânia",
            image: "https://images.unsplash.com/photo-1581578731548-c6a0c3f2b4a4?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
            description: "Aspirador Robô Britânia com navegação inteligente, controle por app, bateria de 120min",
            stock: 22,
            rating: 4.1,
            ratingCount: 89
        }
    ],
    
    esportes: [
        {
            id: "PROD-021",
            title: "Bicicleta Caloi 10",
            price: 899.99,
            originalPrice: 1199.99,
            discount: 25,
            category: "Esportes",
            brand: "Caloi",
            image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
            description: "Bicicleta Caloi 10 com 21 marchas, freios a disco, pneus 26\", quadro em aço",
            stock: 18,
            rating: 4.3,
            ratingCount: 145
        },
        {
            id: "PROD-022",
            title: "Skate Element",
            price: 199.99,
            originalPrice: 249.99,
            discount: 20,
            category: "Esportes",
            brand: "Element",
            image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
            description: "Skate Element completo com shape 7.75\", trucks de alumínio, rodas 52mm",
            stock: 27,
            rating: 4.0,
            ratingCount: 78
        },
        {
            id: "PROD-023",
            title: "Halteres Revestidos 20kg",
            price: 149.99,
            originalPrice: 199.99,
            discount: 25,
            category: "Esportes",
            brand: "ProForm",
            image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
            description: "Halteres revestidos 20kg com barra de 1.20m, anilhas de 2.5kg, revestimento em neoprene",
            stock: 35,
            rating: 4.2,
            ratingCount: 112
        },
        {
            id: "PROD-024",
            title: "Bola de Futebol Nike",
            price: 89.99,
            originalPrice: 119.99,
            discount: 25,
            category: "Esportes",
            brand: "Nike",
            image: "https://images.unsplash.com/photo-1431326005620-6d0e44b482f8?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
            description: "Bola de futebol Nike com tecnologia AerowSculpt, couro sintético, tamanho oficial",
            stock: 48,
            rating: 4.4,
            ratingCount: 203
        }
    ],
    
    monitores: [
        {
            id: "PROD-025",
            title: "Monitor Dell 24\" Full HD",
            price: 699.99,
            originalPrice: 899.99,
            discount: 22,
            category: "Monitores",
            brand: "Dell",
            image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
            description: "Monitor Dell 24\" Full HD com IPS, 75Hz, HDMI, VGA, ajuste de altura",
            stock: 16,
            rating: 4.3,
            ratingCount: 134
        },
        {
            id: "PROD-026",
            title: "Monitor Samsung 27\" 4K",
            price: 1299.99,
            originalPrice: 1599.99,
            discount: 19,
            category: "Monitores",
            brand: "Samsung",
            image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
            description: "Monitor Samsung 27\" 4K UHD com HDR, 60Hz, USB-C, HDMI, DisplayPort",
            stock: 12,
            rating: 4.6,
            ratingCount: 189
        }
    ],
    
    relogios: [
        {
            id: "PROD-027",
            title: "Relógio Casio G-Shock",
            price: 399.99,
            originalPrice: 499.99,
            discount: 20,
            category: "Relógios",
            brand: "Casio",
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
            description: "Relógio Casio G-Shock resistente a choques, à água 200m, cronômetro, alarme",
            stock: 24,
            rating: 4.5,
            ratingCount: 167
        },
        {
            id: "PROD-028",
            title: "Smartwatch Apple Watch",
            price: 1999.99,
            originalPrice: 2499.99,
            discount: 20,
            category: "Relógios",
            brand: "Apple",
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
            description: "Smartwatch Apple Watch Series 9 com GPS, monitoramento de saúde, resistente à água",
            stock: 8,
            rating: 4.8,
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
        name: key.charAt(0).toUpperCase() + key.slice(1)
    }));
}

// Exportar para uso em outros módulos
    window.productsDatabase = productsDatabase;
    window.getAllProducts = getAllProducts;
    window.getProductsByCategory = getProductsByCategory;
window.getCategories = getCategories;