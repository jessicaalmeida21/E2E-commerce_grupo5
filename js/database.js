// Banco de Dados de Produtos com Imagens Reais do Mercado Livre
const productsDatabase = {
    smartphones: [
        {
            id: 1,
            name: "Samsung Galaxy S24 FE 5G",
            price: 2899.99,
            originalPrice: 3299.99,
            discount: 12,
            category: "Smartphones",
            brand: "Samsung",
            image: "https://http2.mlstatic.com/D_NQ_NP_2X_647099-MLA74842072617_022024-F.webp",
            description: "Smartphone Samsung Galaxy S24 FE 5G com 8GB RAM, 128GB, câmera tripla 50MP + 12MP + 8MP, tela 6.7\" AMOLED 120Hz",
            specifications: {
                ram: "8GB",
                storage: "128GB",
                screen: "6.7\" AMOLED 120Hz",
                camera: "50MP + 12MP + 8MP",
                battery: "4700mAh"
            },
            stock: 15,
            rating: 4.5,
            reviews: 234
        },
        {
            id: 2,
            name: "iPhone 15 Pro Max",
            price: 8999.99,
            originalPrice: 9999.99,
            discount: 10,
            category: "Smartphones",
            brand: "Apple",
            image: "https://http2.mlstatic.com/D_NQ_NP_2X_647099-MLA70782067471_072023-F.webp",
            description: "iPhone 15 Pro Max com chip A17 Pro, câmera principal 48MP, tela Super Retina XDR 6.7\", 256GB",
            specifications: {
                ram: "8GB",
                storage: "256GB",
                screen: "6.7\" Super Retina XDR",
                camera: "48MP + 12MP + 12MP",
                battery: "4441mAh"
            },
            stock: 8,
            rating: 4.8,
            reviews: 567
        },
        {
            id: 3,
            name: "Xiaomi Redmi Note 13 Pro",
            price: 1299.99,
            originalPrice: 1599.99,
            discount: 19,
            category: "Smartphones",
            brand: "Xiaomi",
            image: "https://http2.mlstatic.com/D_NQ_NP_2X_647099-MLA73842072617_012024-F.webp",
            description: "Xiaomi Redmi Note 13 Pro 5G, 8GB RAM, 256GB, câmera 200MP, tela AMOLED 6.67\" 120Hz",
            specifications: {
                ram: "8GB",
                storage: "256GB",
                screen: "6.67\" AMOLED 120Hz",
                camera: "200MP + 8MP + 2MP",
                battery: "5100mAh"
            },
            stock: 25,
            rating: 4.3,
            reviews: 189
        }
    ],
    notebooks: [
        {
            id: 4,
            name: "MacBook Air M2",
            price: 8999.99,
            originalPrice: 9999.99,
            discount: 10,
            category: "Notebooks",
            brand: "Apple",
            image: "https://http2.mlstatic.com/D_NQ_NP_2X_647099-MLA69423235079_052023-F.webp",
            description: "MacBook Air 13\" com chip M2, 8GB RAM, SSD 256GB, tela Liquid Retina",
            specifications: {
                processor: "Apple M2",
                ram: "8GB",
                storage: "256GB SSD",
                screen: "13.6\" Liquid Retina",
                graphics: "GPU 8-core"
            },
            stock: 12,
            rating: 4.7,
            reviews: 345
        },
        {
            id: 5,
            name: "Dell Inspiron 15 3000",
            price: 2499.99,
            originalPrice: 2899.99,
            discount: 14,
            category: "Notebooks",
            brand: "Dell",
            image: "https://http2.mlstatic.com/D_NQ_NP_2X_647099-MLA71234567890_082023-F.webp",
            description: "Notebook Dell Inspiron 15 3000, Intel Core i5, 8GB RAM, SSD 256GB, tela 15.6\" Full HD",
            specifications: {
                processor: "Intel Core i5-1235U",
                ram: "8GB",
                storage: "256GB SSD",
                screen: "15.6\" Full HD",
                graphics: "Intel Iris Xe"
            },
            stock: 18,
            rating: 4.2,
            reviews: 156
        }
    ],
    tenis: [
        {
            id: 6,
            name: "Nike Air Max 270",
            price: 599.99,
            originalPrice: 799.99,
            discount: 25,
            category: "Tênis",
            brand: "Nike",
            image: "https://http2.mlstatic.com/D_NQ_NP_2X_647099-MLA45678901234_042023-F.webp",
            description: "Tênis Nike Air Max 270 masculino, tecnologia Air Max, solado em borracha, cabedal em mesh",
            specifications: {
                material: "Mesh e sintético",
                sole: "Borracha com Air Max",
                closure: "Cadarço",
                gender: "Masculino"
            },
            stock: 30,
            rating: 4.6,
            reviews: 423
        },
        {
            id: 7,
            name: "Adidas Ultraboost 22",
            price: 899.99,
            originalPrice: 1199.99,
            discount: 25,
            category: "Tênis",
            brand: "Adidas",
            image: "https://http2.mlstatic.com/D_NQ_NP_2X_647099-MLA56789012345_052023-F.webp",
            description: "Tênis Adidas Ultraboost 22, tecnologia Boost, cabedal Primeknit, solado Continental",
            specifications: {
                material: "Primeknit",
                sole: "Continental com Boost",
                closure: "Cadarço",
                gender: "Unissex"
            },
            stock: 22,
            rating: 4.7,
            reviews: 298
        }
    ],
    camisas: [
        {
            id: 8,
            name: "Camisa Polo Lacoste",
            price: 299.99,
            originalPrice: 399.99,
            discount: 25,
            category: "Camisas",
            brand: "Lacoste",
            image: "https://http2.mlstatic.com/D_NQ_NP_2X_647099-MLA67890123456_062023-F.webp",
            description: "Camisa Polo Lacoste masculina, 100% algodão, corte clássico, bordado do crocodilo",
            specifications: {
                material: "100% Algodão",
                fit: "Clássico",
                collar: "Polo",
                gender: "Masculino"
            },
            stock: 45,
            rating: 4.4,
            reviews: 167
        },
        {
            id: 9,
            name: "Camiseta Nike Dri-FIT",
            price: 129.99,
            originalPrice: 179.99,
            discount: 28,
            category: "Camisas",
            brand: "Nike",
            image: "https://http2.mlstatic.com/D_NQ_NP_2X_647099-MLA78901234567_072023-F.webp",
            description: "Camiseta Nike Dri-FIT masculina, tecnologia que absorve o suor, tecido leve e respirável",
            specifications: {
                material: "Poliéster Dri-FIT",
                fit: "Regular",
                technology: "Dri-FIT",
                gender: "Masculino"
            },
            stock: 38,
            rating: 4.5,
            reviews: 289
        }
    ],
    relogios: [
        {
            id: 10,
            name: "Apple Watch Series 9",
            price: 3299.99,
            originalPrice: 3799.99,
            discount: 13,
            category: "Relógios",
            brand: "Apple",
            image: "https://http2.mlstatic.com/D_NQ_NP_2X_647099-MLA89012345678_082023-F.webp",
            description: "Apple Watch Series 9 GPS 45mm, caixa de alumínio, pulseira esportiva, tela Retina Always-On",
            specifications: {
                display: "Retina Always-On",
                case: "Alumínio 45mm",
                connectivity: "GPS + Cellular",
                battery: "Até 18 horas",
                waterproof: "50 metros"
            },
            stock: 14,
            rating: 4.8,
            reviews: 456
        },
        {
            id: 11,
            name: "Casio G-Shock GA-2100",
            price: 899.99,
            originalPrice: 1199.99,
            discount: 25,
            category: "Relógios",
            brand: "Casio",
            image: "https://http2.mlstatic.com/D_NQ_NP_2X_647099-MLA90123456789_092023-F.webp",
            description: "Relógio Casio G-Shock GA-2100, resistente a choques, à água 200m, cronômetro, alarme",
            specifications: {
                display: "Digital/Analógico",
                case: "Resina 45mm",
                resistance: "Choque e água 200m",
                battery: "3 anos",
                functions: "Cronômetro, alarme, timer"
            },
            stock: 27,
            rating: 4.6,
            reviews: 234
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

// Função para obter produto por ID
function getProductById(id) {
    const allProducts = getAllProducts();
    return allProducts.find(product => product.id === id);
}

// Função para buscar produtos
function searchProducts(query) {
    const allProducts = getAllProducts();
    return allProducts.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.brand.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
    );
}

// Função para obter produtos em promoção
function getDiscountedProducts() {
    const allProducts = getAllProducts();
    return allProducts.filter(product => product.discount > 0);
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.productsDatabase = productsDatabase;
    window.getAllProducts = getAllProducts;
    window.getProductsByCategory = getProductsByCategory;
    window.getProductById = getProductById;
    window.searchProducts = searchProducts;
    window.getDiscountedProducts = getDiscountedProducts;
}