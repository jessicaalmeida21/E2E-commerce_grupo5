const fs = require('fs');

console.log('🔄 Iniciando correção de produtos com nomes reais...');

// Backup da database atual
const timestamp = Date.now();
const backupPath = `js/database-backup-real-names-${timestamp}.js`;

try {
    const currentDatabase = fs.readFileSync('js/database.js', 'utf8');
    fs.writeFileSync(backupPath, currentDatabase);
    console.log(`✅ Backup criado: ${backupPath}`);
} catch (error) {
    console.log('⚠️ Erro ao criar backup:', error.message);
}

// Produtos reais com nomes específicos e imagens correspondentes
const realProductsData = `// Database de produtos E2E-commerce - Produtos Reais com Nomes Específicos
// Gerado automaticamente em ${new Date().toLocaleString()}

const productsDatabase = {
  "smartphones": [
    {
      "id": 1,
      "title": "iPhone 15 Pro Max 256GB Titânio Natural",
      "price": 8999.99,
      "originalPrice": 9999.99,
      "discount": 10,
      "category": "smartphones",
      "brand": "Apple",
      "description": "iPhone 15 Pro Max com chip A17 Pro, câmera de 48MP, tela Super Retina XDR de 6.7 polegadas e construção em titânio",
      "stock": 25,
      "rating": 4.9,
      "ratingCount": 1250,
      "image": "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400"
    },
    {
      "id": 2,
      "title": "Samsung Galaxy S24 Ultra 512GB Preto",
      "price": 7499.99,
      "originalPrice": 8299.99,
      "discount": 10,
      "category": "smartphones",
      "brand": "Samsung",
      "description": "Galaxy S24 Ultra com S Pen integrada, câmera de 200MP, tela Dynamic AMOLED 2X de 6.8 polegadas",
      "stock": 30,
      "rating": 4.8,
      "ratingCount": 980,
      "image": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400"
    },
    {
      "id": 3,
      "title": "Xiaomi 14 Pro 256GB Branco",
      "price": 3999.99,
      "originalPrice": 4499.99,
      "discount": 11,
      "category": "smartphones",
      "brand": "Xiaomi",
      "description": "Xiaomi 14 Pro com Snapdragon 8 Gen 3, câmera Leica de 50MP e carregamento rápido de 120W",
      "stock": 40,
      "rating": 4.7,
      "ratingCount": 650,
      "image": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400"
    },
    {
      "id": 4,
      "title": "Google Pixel 8 Pro 128GB Azul",
      "price": 4999.99,
      "originalPrice": 5499.99,
      "discount": 9,
      "category": "smartphones",
      "brand": "Google",
      "description": "Pixel 8 Pro com chip Tensor G3, câmera computacional avançada e Android 14 puro",
      "stock": 20,
      "rating": 4.6,
      "ratingCount": 420,
      "image": "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400"
    },
    {
      "id": 5,
      "title": "OnePlus 12 256GB Verde",
      "price": 3799.99,
      "originalPrice": 4199.99,
      "discount": 10,
      "category": "smartphones",
      "brand": "OnePlus",
      "description": "OnePlus 12 com Snapdragon 8 Gen 3, carregamento SuperVOOC de 100W e tela AMOLED 120Hz",
      "stock": 35,
      "rating": 4.5,
      "ratingCount": 380,
      "image": "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=400"
    }
  ],
  
  "notebooks": [
    {
      "id": 51,
      "title": "MacBook Pro 16 M3 Max 1TB Cinza Espacial",
      "price": 18999.99,
      "originalPrice": 20999.99,
      "discount": 10,
      "category": "notebooks",
      "brand": "Apple",
      "description": "MacBook Pro 16 com chip M3 Max, 36GB RAM unificada, tela Liquid Retina XDR de 16.2 polegadas",
      "stock": 15,
      "rating": 4.9,
      "ratingCount": 890,
      "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400"
    },
    {
      "id": 52,
      "title": "Dell XPS 15 Intel i9 32GB RTX 4070",
      "price": 12999.99,
      "originalPrice": 14499.99,
      "discount": 10,
      "category": "notebooks",
      "brand": "Dell",
      "description": "Dell XPS 15 com Intel Core i9-13900H, 32GB RAM, RTX 4070, tela 4K OLED de 15.6 polegadas",
      "stock": 20,
      "rating": 4.7,
      "ratingCount": 560,
      "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400"
    },
    {
      "id": 53,
      "title": "Lenovo ThinkPad X1 Carbon Gen 11 i7",
      "price": 8999.99,
      "originalPrice": 9999.99,
      "discount": 10,
      "category": "notebooks",
      "brand": "Lenovo",
      "description": "ThinkPad X1 Carbon com Intel Core i7-1365U, 16GB RAM, SSD 1TB, ultra-leve com 1.12kg",
      "stock": 25,
      "rating": 4.6,
      "ratingCount": 420,
      "image": "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400"
    },
    {
      "id": 54,
      "title": "ASUS ROG Zephyrus G16 RTX 4080 i9",
      "price": 15999.99,
      "originalPrice": 17999.99,
      "discount": 11,
      "category": "notebooks",
      "brand": "ASUS",
      "description": "ROG Zephyrus G16 gamer com RTX 4080, Intel i9-13900H, 32GB RAM, tela 240Hz QHD",
      "stock": 12,
      "rating": 4.8,
      "ratingCount": 320,
      "image": "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400"
    },
    {
      "id": 55,
      "title": "HP Spectre x360 16 OLED i7 Touch",
      "price": 10999.99,
      "originalPrice": 12499.99,
      "discount": 12,
      "category": "notebooks",
      "brand": "HP",
      "description": "HP Spectre x360 conversível com tela OLED 4K touchscreen, Intel i7-1355U, 16GB RAM",
      "stock": 18,
      "rating": 4.5,
      "ratingCount": 280,
      "image": "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400"
    }
  ],
  
  "tablets": [
    {
      "id": 101,
      "title": "iPad Pro 12.9 M2 1TB WiFi Cinza Espacial",
      "price": 7999.99,
      "originalPrice": 8999.99,
      "discount": 11,
      "category": "tablets",
      "brand": "Apple",
      "description": "iPad Pro 12.9 com chip M2, tela Liquid Retina XDR, compatível com Apple Pencil de 2ª geração",
      "stock": 22,
      "rating": 4.8,
      "ratingCount": 750,
      "image": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400"
    },
    {
      "id": 102,
      "title": "Samsung Galaxy Tab S9 Ultra 512GB Grafite",
      "price": 5999.99,
      "originalPrice": 6799.99,
      "discount": 12,
      "category": "tablets",
      "brand": "Samsung",
      "description": "Galaxy Tab S9 Ultra com S Pen incluída, tela Dynamic AMOLED 2X de 14.6 polegadas",
      "stock": 28,
      "rating": 4.7,
      "ratingCount": 480,
      "image": "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400"
    },
    {
      "id": 103,
      "title": "Microsoft Surface Pro 9 Intel i7 16GB",
      "price": 4999.99,
      "originalPrice": 5699.99,
      "discount": 12,
      "category": "tablets",
      "brand": "Microsoft",
      "description": "Surface Pro 9 com Intel Core i7-1255U, 16GB RAM, Type Cover incluído, Windows 11",
      "stock": 20,
      "rating": 4.6,
      "ratingCount": 350,
      "image": "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=400"
    },
    {
      "id": 104,
      "title": "Lenovo Tab P12 Pro OLED 8GB Storm Grey",
      "price": 2999.99,
      "originalPrice": 3499.99,
      "discount": 14,
      "category": "tablets",
      "brand": "Lenovo",
      "description": "Tab P12 Pro com tela OLED 2K de 12.6 polegadas, MediaTek Dimensity 7050, caneta incluída",
      "stock": 25,
      "rating": 4.4,
      "ratingCount": 220,
      "image": "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=400"
    },
    {
      "id": 105,
      "title": "Huawei MatePad Pro 12.6 5G 256GB",
      "price": 3799.99,
      "originalPrice": 4299.99,
      "discount": 12,
      "category": "tablets",
      "brand": "Huawei",
      "description": "MatePad Pro com tela OLED de 12.6 polegadas, Kirin 9000E, M-Pencil de 2ª geração",
      "stock": 15,
      "rating": 4.3,
      "ratingCount": 180,
      "image": "https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?w=400"
    }
  ],
  
  "smartwatches": [
    {
      "id": 151,
      "title": "Apple Watch Series 9 GPS 45mm Meia-Noite",
      "price": 2999.99,
      "originalPrice": 3299.99,
      "discount": 9,
      "category": "smartwatches",
      "brand": "Apple",
      "description": "Apple Watch Series 9 com chip S9, tela Always-On Retina, GPS integrado, resistente à água",
      "stock": 40,
      "rating": 4.8,
      "ratingCount": 920,
      "image": "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400"
    },
    {
      "id": 152,
      "title": "Samsung Galaxy Watch 6 Classic 47mm Preto",
      "price": 1999.99,
      "originalPrice": 2299.99,
      "discount": 13,
      "category": "smartwatches",
      "brand": "Samsung",
      "description": "Galaxy Watch 6 Classic com bezel rotativo, Wear OS powered by Samsung, monitoramento avançado",
      "stock": 35,
      "rating": 4.6,
      "ratingCount": 650,
      "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"
    },
    {
      "id": 153,
      "title": "Garmin Fenix 7X Sapphire Solar Preto",
      "price": 4999.99,
      "originalPrice": 5699.99,
      "discount": 12,
      "category": "smartwatches",
      "brand": "Garmin",
      "description": "Fenix 7X com carregamento solar, GPS multi-banda, resistência militar MIL-STD-810",
      "stock": 18,
      "rating": 4.7,
      "ratingCount": 380,
      "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400"
    },
    {
      "id": 154,
      "title": "Amazfit GTR 4 Limited Edition 46mm",
      "price": 899.99,
      "originalPrice": 1099.99,
      "discount": 18,
      "category": "smartwatches",
      "brand": "Amazfit",
      "description": "GTR 4 com GPS dual-band, bateria de 14 dias, 150+ modos esportivos, Zepp OS 2.0",
      "stock": 50,
      "rating": 4.4,
      "ratingCount": 420,
      "image": "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400"
    },
    {
      "id": 155,
      "title": "Fossil Gen 6 Wellness Edition 44mm",
      "price": 1299.99,
      "originalPrice": 1499.99,
      "discount": 13,
      "category": "smartwatches",
      "brand": "Fossil",
      "description": "Gen 6 com Wear OS 3, Snapdragon Wear 4100+, carregamento rápido, SpO2 e ECG",
      "stock": 30,
      "rating": 4.2,
      "ratingCount": 280,
      "image": "https://images.unsplash.com/photo-1579586337278-3f436f25d4d6?w=400"
    }
  ],
  
  "headphones": [
    {
      "id": 201,
      "title": "Sony WH-1000XM5 Noise Cancelling Preto",
      "price": 1899.99,
      "originalPrice": 2199.99,
      "discount": 14,
      "category": "headphones",
      "brand": "Sony",
      "description": "WH-1000XM5 com cancelamento de ruído líder da indústria, 30h de bateria, Hi-Res Audio",
      "stock": 45,
      "rating": 4.8,
      "ratingCount": 1200,
      "image": "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400"
    },
    {
      "id": 202,
      "title": "Apple AirPods Pro 2ª Geração USB-C",
      "price": 1699.99,
      "originalPrice": 1899.99,
      "discount": 11,
      "category": "headphones",
      "brand": "Apple",
      "description": "AirPods Pro com chip H2, cancelamento ativo de ruído, áudio espacial personalizado",
      "stock": 60,
      "rating": 4.7,
      "ratingCount": 980,
      "image": "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400"
    },
    {
      "id": 203,
      "title": "Bose QuietComfort 45 Wireless Branco",
      "price": 1599.99,
      "originalPrice": 1799.99,
      "discount": 11,
      "category": "headphones",
      "brand": "Bose",
      "description": "QuietComfort 45 com cancelamento de ruído premium, 24h de bateria, conforto excepcional",
      "stock": 35,
      "rating": 4.6,
      "ratingCount": 750,
      "image": "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400"
    },
    {
      "id": 204,
      "title": "Sennheiser Momentum 4 Wireless Preto",
      "price": 1999.99,
      "originalPrice": 2299.99,
      "discount": 13,
      "category": "headphones",
      "brand": "Sennheiser",
      "description": "Momentum 4 com som audiófilo, 60h de bateria, cancelamento adaptativo de ruído",
      "stock": 25,
      "rating": 4.5,
      "ratingCount": 420,
      "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"
    },
    {
      "id": 205,
      "title": "JBL Tour One M2 Over-Ear Azul",
      "price": 899.99,
      "originalPrice": 1099.99,
      "discount": 18,
      "category": "headphones",
      "brand": "JBL",
      "description": "Tour One M2 com True Adaptive Noise Cancelling, som JBL Pro, 50h de bateria",
      "stock": 40,
      "rating": 4.3,
      "ratingCount": 320,
      "image": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400"
    }
  ],
  
  "cameras": [
    {
      "id": 251,
      "title": "Canon EOS R5 Mirrorless Body 45MP",
      "price": 18999.99,
      "originalPrice": 21999.99,
      "discount": 14,
      "category": "cameras",
      "brand": "Canon",
      "description": "EOS R5 com sensor full-frame 45MP, vídeo 8K RAW, estabilização IBIS de 5 eixos",
      "stock": 12,
      "rating": 4.9,
      "ratingCount": 450,
      "image": "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400"
    },
    {
      "id": 252,
      "title": "Sony Alpha A7 IV Mirrorless 33MP",
      "price": 16999.99,
      "originalPrice": 18999.99,
      "discount": 11,
      "category": "cameras",
      "brand": "Sony",
      "description": "Alpha A7 IV com sensor 33MP, vídeo 4K 60p, autofoco híbrido de 759 pontos",
      "stock": 15,
      "rating": 4.8,
      "ratingCount": 380,
      "image": "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400"
    },
    {
      "id": 253,
      "title": "Nikon Z9 Professional Body 45.7MP",
      "price": 24999.99,
      "originalPrice": 27999.99,
      "discount": 11,
      "category": "cameras",
      "brand": "Nikon",
      "description": "Z9 profissional com sensor 45.7MP, vídeo 8K, disparo contínuo 20fps sem blackout",
      "stock": 8,
      "rating": 4.7,
      "ratingCount": 220,
      "image": "https://images.unsplash.com/photo-1495121553079-4c61bcce1894?w=400"
    },
    {
      "id": 254,
      "title": "Fujifilm X-T5 Retro Style 40MP APS-C",
      "price": 8999.99,
      "originalPrice": 9999.99,
      "discount": 10,
      "category": "cameras",
      "brand": "Fujifilm",
      "description": "X-T5 com sensor APS-C 40MP, estabilização IBIS, design clássico com dials analógicos",
      "stock": 20,
      "rating": 4.6,
      "ratingCount": 320,
      "image": "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400"
    },
    {
      "id": 255,
      "title": "Panasonic Lumix GH6 Hybrid 25.2MP",
      "price": 12999.99,
      "originalPrice": 14499.99,
      "discount": 10,
      "category": "cameras",
      "brand": "Panasonic",
      "description": "GH6 híbrida com vídeo 5.7K, Live Streaming, resistente a intempéries, Micro Four Thirds",
      "stock": 18,
      "rating": 4.5,
      "ratingCount": 180,
      "image": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400"
    }
  ],
  
  "gaming": [
    {
      "id": 301,
      "title": "PlayStation 5 Slim 1TB Digital Edition",
      "price": 3999.99,
      "originalPrice": 4499.99,
      "discount": 11,
      "category": "gaming",
      "brand": "Sony",
      "description": "PS5 Slim Digital com SSD 1TB, ray tracing, 4K gaming até 120fps, controle DualSense",
      "stock": 25,
      "rating": 4.9,
      "ratingCount": 1500,
      "image": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400"
    },
    {
      "id": 302,
      "title": "Xbox Series X 1TB Console Preto",
      "price": 3799.99,
      "originalPrice": 4299.99,
      "discount": 12,
      "category": "gaming",
      "brand": "Microsoft",
      "description": "Xbox Series X com 12 teraflops, Quick Resume, Smart Delivery, Game Pass Ultimate",
      "stock": 30,
      "rating": 4.8,
      "ratingCount": 1200,
      "image": "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400"
    },
    {
      "id": 303,
      "title": "Nintendo Switch OLED 64GB Branco",
      "price": 2299.99,
      "originalPrice": 2599.99,
      "discount": 12,
      "category": "gaming",
      "brand": "Nintendo",
      "description": "Switch OLED com tela de 7 polegadas, dock aprimorado, 64GB interno, Joy-Con inclusos",
      "stock": 40,
      "rating": 4.7,
      "ratingCount": 890,
      "image": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400"
    },
    {
      "id": 304,
      "title": "Steam Deck 512GB OLED Limited Edition",
      "price": 4999.99,
      "originalPrice": 5699.99,
      "discount": 12,
      "category": "gaming",
      "brand": "Valve",
      "description": "Steam Deck OLED com tela HDR de 7.4 polegadas, SSD 512GB, controles precisos",
      "stock": 15,
      "rating": 4.6,
      "ratingCount": 420,
      "image": "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400"
    },
    {
      "id": 305,
      "title": "ASUS ROG Ally Z1 Extreme 512GB",
      "price": 3999.99,
      "originalPrice": 4599.99,
      "discount": 13,
      "category": "gaming",
      "brand": "ASUS",
      "description": "ROG Ally com AMD Z1 Extreme, Windows 11, tela 120Hz Full HD de 7 polegadas",
      "stock": 20,
      "rating": 4.4,
      "ratingCount": 280,
      "image": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400"
    }
  ],
  
  "home": [
    {
      "id": 351,
      "title": "Amazon Echo Dot 5ª Geração Azul",
      "price": 299.99,
      "originalPrice": 399.99,
      "discount": 25,
      "category": "home",
      "brand": "Amazon",
      "description": "Echo Dot com Alexa, som melhorado, controle de casa inteligente, design compacto",
      "stock": 80,
      "rating": 4.5,
      "ratingCount": 2500,
      "image": "https://images.unsplash.com/photo-1543512214-318c7553f230?w=400"
    },
    {
      "id": 352,
      "title": "Google Nest Hub Max 10 Smart Display",
      "price": 1299.99,
      "originalPrice": 1599.99,
      "discount": 19,
      "category": "home",
      "brand": "Google",
      "description": "Nest Hub Max com tela 10 polegadas, câmera Nest Cam, Google Assistant, controle doméstico",
      "stock": 35,
      "rating": 4.4,
      "ratingCount": 680,
      "image": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"
    },
    {
      "id": 353,
      "title": "Philips Hue White Ambiance Starter Kit",
      "price": 899.99,
      "originalPrice": 1199.99,
      "discount": 25,
      "category": "home",
      "brand": "Philips",
      "description": "Kit Hue com 4 lâmpadas inteligentes E27, bridge Hue, controle por app e voz",
      "stock": 50,
      "rating": 4.6,
      "ratingCount": 920,
      "image": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"
    },
    {
      "id": 354,
      "title": "Ring Video Doorbell Pro 2 HDR",
      "price": 1599.99,
      "originalPrice": 1899.99,
      "discount": 16,
      "category": "home",
      "brand": "Ring",
      "description": "Video Doorbell Pro 2 com vídeo 1536p HDR, detecção 3D, visão noturna colorida",
      "stock": 25,
      "rating": 4.3,
      "ratingCount": 450,
      "image": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"
    },
    {
      "id": 355,
      "title": "Google Nest Thermostat Inteligente",
      "price": 1199.99,
      "originalPrice": 1499.99,
      "discount": 20,
      "category": "home",
      "brand": "Google",
      "description": "Termostato inteligente com aprendizado automático, economia de energia, controle remoto",
      "stock": 30,
      "rating": 4.2,
      "ratingCount": 320,
      "image": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"
    }
  ]
};

// Função para obter todos os produtos
function getAllProducts() {
    const allProducts = [];
    Object.keys(productsDatabase).forEach(category => {
        allProducts.push(...productsDatabase[category]);
    });
    return allProducts;
}

// Função para obter produto por ID
function getProductById(id) {
    const allProducts = getAllProducts();
    return allProducts.find(product => product.id === parseInt(id));
}

// Função para obter produtos por categoria
function getProductsByCategory(category) {
    return productsDatabase[category] || [];
}

// Função para buscar produtos
function searchProducts(query) {
    const allProducts = getAllProducts();
    const searchTerm = query.toLowerCase();
    
    return allProducts.filter(product => 
        product.title.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.productsDatabase = productsDatabase;
    window.getAllProducts = getAllProducts;
    window.getProductById = getProductById;
    window.getProductsByCategory = getProductsByCategory;
    window.searchProducts = searchProducts;
}

// Exportar para Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        productsDatabase,
        getAllProducts,
        getProductById,
        getProductsByCategory,
        searchProducts
    };
}`;

// Salvar o novo database
fs.writeFileSync('js/database.js', realProductsData);

console.log('✅ Database atualizada com produtos reais!');
console.log('📊 Produtos criados:');
console.log('  📱 Smartphones: 5 produtos');
console.log('  💻 Notebooks: 5 produtos');
console.log('  📱 Tablets: 5 produtos');
console.log('  ⌚ Smartwatches: 5 produtos');
console.log('  🎧 Headphones: 5 produtos');
console.log('  📷 Cameras: 5 produtos');
console.log('  🎮 Gaming: 5 produtos');
console.log('  🏠 Home: 5 produtos');
console.log('📈 Total: 40 produtos com nomes reais e imagens correspondentes');

// Criar relatório
const report = {
    timestamp: new Date().toISOString(),
    totalProducts: 40,
    categories: 8,
    changes: 'Substituição completa por produtos reais com nomes específicos',
    backup: backupPath,
    status: 'Concluído com sucesso'
};

fs.writeFileSync('real-products-report.json', JSON.stringify(report, null, 2));
console.log('📋 Relatório salvo: real-products-report.json');
console.log('🎉 Correção concluída com sucesso!');