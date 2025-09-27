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
            image: "https://samsung.com/us/smartphones/galaxy-s24-fe/media-assets/001-galaxy-s24-fe-blue-front.jpg",
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
            image: "https://www.apple.com/v/iphone-15-pro/d/images/overview/hero/hero_static__eiaz28v4zm2i_largetall.jpg",
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
            image: "https://i01.appmifile.com/webfile/globalimg/products/pc/redmi-note-13-pro/gallery01.jpg",
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
            image: "https://static.acer.com/up/Resource/Acer/Laptops/Aspire_5/Images/20210324/Aspire_5_AG515-58_gallery_01.png",
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
            image: "https://www.lenovo.com/medias/lenovo-laptop-ideapad-3-15AMN-gallery.png",
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
            image: "https://i.dell.com/is/image/DellContent//content/dam/global-site-design/product_images/dell_laptop/inspiron_15_5000/5000_ispk_3.png",
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
            image: "https://images.samsung.com/is/image/samsung/br-uhd-tu8000-tizen/gallery/ks_uhd_tu8000_2020_qled_lh55tu8000_gallery_black.jpg",
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
            image: "https://www.lg.com/us/images/tvs/md07559245/gallery/50UQ8000-P-01.jpg",
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
            image: "https://www.sony.com/image/9e7aaf50a1e030638d63d28f7670bf76?fmt=pjpeg&wid=330&bgcolor=FFFFFF&bgc=FFFFFF",
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
            image: "https://www.jbl.com/on/demandware.static/-/Sites-masterCatalog_Harman/default/dw0c2adeb2/JBL_TUNE_510BT_Product%20Image_01.png",
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
            image: "https://www.sony.com/image/eca96096c0093eacb32513216926deca?fmt=pjpeg&wid=330&bgcolor=FFFFFF&bgc=FFFFFF",
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
            image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/fb050410-9f2a-40c0-9ae2-d6388399782f/air-max-270-mens-shoes-KkLcGR.png",
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
            image: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/1d6d81ef22d541409e25ae2c00aca369_9366/Ultraboost_22_Shoes_Black_HX9366_01_standard.jpg",
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
            image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa/global/375771/01/sv01/fnd/PNA/fmt/png",
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
            image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/edc52e25-65a4-4234-8048-6d5e4c8d99cd/dri-fit-t-shirt.png",
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
            image: "https://www.levi.com/pt_BR/dw/image/v2/BBTN_PRD/on/demandware.static/-/Sites-LeviMaster/default/dw6c651a3b/images/large/00501-0000-front-pdp.png",
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
            image: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/3f766c5f05e1403cabebac4a00cce441_9366/TT_Trefoil_Jacket_Black_I44401_21_model.jpg",
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
            image: "https://www.philips.com/c-dam/b2c/category-pages/food-prep/stand-blenders/500w-liqstory/ri2148_01.jpg",
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
            image: "https://bazar.shoplineimg.com/media/catalog/product/cache/1/image/600x600/9df78eab33525d08d6e5fb8d27136e95/a/m/ame311_air_fryer_mondial.jpg",
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
            image: "https://www.britania.com.br/images/produtos/aspirador-robo-britania-ar510_1_2.jpg",
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
            image: "https://caloi.vtexassets.com/arquivos/ids/157350-800-auto?v=637847657427970000&width=800&height=auto&aspect=true",
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
            image: "https://www.elementbrand.com/on/demandware.static/-/Sites-element-master/default/dw1e0a98e9/skateboard-woodland-28-view1.jpg",
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
            image: "https://cdn.shopify.com/s/files/1/1235/2345/products/20kg-dumbbell-set-01.jpg",
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
            image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/90348133-4f37-4478-bc35-79226b64f052/mercurial-voltage-futsal-ball.png",
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
            image: "https://i.dell.com/sites/csimages/Video_Imagery/all/optiplex-24-monitor-white.png",
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
            image: "https://image-us.samsung.com/SamsungUS/home/computing/monitors/032021/LS27B600U/001_LS27B600U_001_Front_Black.jpg",
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
            image: "https://gshock.casio.com/media-assets/2100-series/gma-b2100-1a1/gallery/gma-b2100-1a1-2.png",
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
            image: "https://www.apple.com/v/watch/home/b/images/overview/hero/hero_static__d1ie77o1s7e6_large.jpg",
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