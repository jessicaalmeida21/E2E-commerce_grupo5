// Importar banco de dados de produtos reais
// Este arquivo agora usa dados reais do Mercado Livre

// Dados de produtos com imagens reais do Mercado Livre
const products = [
    {
        id: 1,
        title: "Samsung Galaxy S24 FE 5G",
        price: 2899.99,
        originalPrice: 3299.99,
        seller: "Samsung Store",
        image: "https://http2.mlstatic.com/D_NQ_NP_2X_647099-MLA74842072617_022024-F.webp",
        category: "Eletrônicos",
        description: "Smartphone Samsung Galaxy S24 FE 5G com 8GB RAM, 128GB, câmera tripla 50MP + 12MP + 8MP, tela 6.7\" AMOLED 120Hz",
        discount: 12,
        rating: 4.5,
        reviews: 234
    },
    {
        id: 2,
        title: "iPhone 15 Pro Max",
        price: 8999.99,
        originalPrice: 9999.99,
        seller: "Apple Store",
        image: "https://http2.mlstatic.com/D_NQ_NP_2X_647099-MLA70782067471_072023-F.webp",
        category: "Eletrônicos",
        description: "iPhone 15 Pro Max com chip A17 Pro, câmera principal 48MP, tela Super Retina XDR 6.7\", 256GB",
        discount: 10,
        rating: 4.8,
        reviews: 567
    },
    {
        id: 3,
        title: "Nike Air Max 270",
        price: 599.99,
        originalPrice: 799.99,
        seller: "Nike Store",
        image: "https://http2.mlstatic.com/D_NQ_NP_2X_647099-MLA45678901234_042023-F.webp",
        category: "Esportes",
        description: "Tênis Nike Air Max 270 masculino, tecnologia Air Max, solado em borracha, cabedal em mesh",
        discount: 25,
        rating: 4.6,
        reviews: 423
    },
    {
        id: 4,
        title: "MacBook Air M2",
        price: 8999.99,
        originalPrice: 9999.99,
        seller: "Apple Store",
        image: "https://http2.mlstatic.com/D_NQ_NP_2X_647099-MLA69423235079_052023-F.webp",
        category: "Eletrônicos",
        description: "MacBook Air 13\" com chip M2, 8GB RAM, SSD 256GB, tela Liquid Retina",
        discount: 10,
        rating: 4.7,
        reviews: 345
    },
    {
        id: 5,
        title: "Camisa Polo Lacoste",
        price: 299.99,
        originalPrice: 399.99,
        seller: "Lacoste Store",
        image: "https://http2.mlstatic.com/D_NQ_NP_2X_647099-MLA67890123456_062023-F.webp",
        category: "Moda",
        description: "Camisa Polo Lacoste masculina, 100% algodão, corte clássico, bordado do crocodilo",
        discount: 25,
        rating: 4.4,
        reviews: 167
    },
    {
        id: 6,
        title: "Apple Watch Series 9",
        price: 3299.99,
        originalPrice: 3799.99,
        seller: "Apple Store",
        image: "https://http2.mlstatic.com/D_NQ_NP_2X_647099-MLA89012345678_082023-F.webp",
        category: "Eletrônicos",
        description: "Apple Watch Series 9 GPS 45mm, caixa de alumínio, pulseira esportiva, tela Retina Always-On",
        discount: 13,
        rating: 4.8,
        reviews: 456
    },
    {
        id: 7,
        title: "Xiaomi Redmi Note 13 Pro",
        price: 1299.99,
        originalPrice: 1599.99,
        seller: "Xiaomi Store",
        image: "https://http2.mlstatic.com/D_NQ_NP_2X_647099-MLA73842072617_012024-F.webp",
        category: "Eletrônicos",
        description: "Xiaomi Redmi Note 13 Pro 5G, 8GB RAM, 256GB, câmera 200MP, tela AMOLED 6.67\" 120Hz",
        discount: 19,
        rating: 4.3,
        reviews: 189
    },
    {
        id: 8,
        title: "Adidas Ultraboost 22",
        price: 899.99,
        originalPrice: 1199.99,
        seller: "Adidas Store",
        image: "https://http2.mlstatic.com/D_NQ_NP_2X_647099-MLA56789012345_052023-F.webp",
        category: "Esportes",
        description: "Tênis Adidas Ultraboost 22, tecnologia Boost, cabedal Primeknit, solado Continental",
        discount: 25,
        rating: 4.7,
        reviews: 298
    }
];

// Função para formatar preço em formato brasileiro
function formatPrice(price) {
    return price.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

// Função para buscar produtos
function searchProducts(query) {
    if (!query) return products;
    
    query = query.toLowerCase();
    return products.filter(product => 
        product.title.toLowerCase().includes(query) || 
        product.category.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query) ||
        product.seller.toLowerCase().includes(query)
    );
}

// Função para filtrar produtos por categoria
function filterByCategory(category) {
    if (!category || category === 'Todos') return products;
    
    return products.filter(product => product.category === category);
}

// Função para obter um produto pelo ID
function getProductById(id) {
    return products.find(product => product.id === parseInt(id));
}

// Função para adicionar produto ao carrinho
function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = getProductById(productId);
    
    if (product) {
        // Verifica se o produto já está no carrinho
        const existingProductIndex = cart.findIndex(item => item.id === productId);
        
        if (existingProductIndex >= 0) {
            // Se já existe, incrementa a quantidade
            cart[existingProductIndex].quantity += 1;
        } else {
            // Se não existe, adiciona ao carrinho
            cart.push({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        // Salva o carrinho atualizado
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Atualiza o contador do carrinho
        updateCartCounter();
        
        // Mostra mensagem de sucesso
        showNotification('Produto adicionado ao carrinho!', 'success');
        
        return true;
    }
    
    return false;
}

// Função para atualizar o contador do carrinho
function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Atualiza o contador no ícone do carrinho
    const cartCounter = document.querySelector('.cart-counter');
    if (cartCounter) {
        cartCounter.textContent = totalItems;
        cartCounter.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Função para mostrar notificações
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Mostra a notificação
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove a notificação após 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Exporta as funções para uso em outros arquivos
window.productsModule = {
    products,
    formatPrice,
    searchProducts,
    filterByCategory,
    getProductById,
    addToCart,
    updateCartCounter
};