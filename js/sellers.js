// Script para gerenciar a página de fornecedores
document.addEventListener('DOMContentLoaded', function() {
    loadSellers();
});

// Carregar fornecedores
async function loadSellers() {
    try {
        const categories = await productsModule.getCategories();
        const sellers = generateSellersFromCategories(categories);
        displaySellers(sellers);
    } catch (error) {
        console.error('Erro ao carregar fornecedores:', error);
    }
}

// Gerar fornecedores baseados nas categorias
function generateSellersFromCategories(categories) {
    const sellers = [];
    
    categories.forEach((category, index) => {
        sellers.push({
            id: `seller-${index + 1}`,
            name: getSellerName(category),
            category: category,
            description: getSellerDescription(category),
            logo: getSellerLogo(category),
            rating: (4 + Math.random()).toFixed(1),
            productsCount: Math.floor(Math.random() * 100) + 10,
            joinedDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), 1)
        });
    });
    
    return sellers;
}

// Obter nome do fornecedor baseado na categoria
function getSellerName(category) {
    const names = {
        'eletrônicos': ['TechStore', 'EletroMax', 'Digital World', 'TechZone'],
        'eletrodomésticos': ['Casa & Cozinha', 'EletroCasa', 'Home Appliances', 'Domésticos Pro'],
        'móveis': ['Mobly Design', 'Casa & Decoração', 'Furniture Plus', 'Móveis Premium'],
        'roupas': ['Fashion Store', 'Style & Co', 'Moda & Estilo', 'Fashion World'],
        'esportes': ['Sports Center', 'Atleta Store', 'Fitness Pro', 'Sport Zone']
    };
    
    const categoryNames = names[category] || ['Loja Premium', 'Store Pro', 'Mega Store', 'Super Store'];
    return categoryNames[Math.floor(Math.random() * categoryNames.length)];
}

// Obter descrição do fornecedor
function getSellerDescription(category) {
    const descriptions = {
        'eletrônicos': 'Especialista em tecnologia e eletrônicos de última geração.',
        'eletrodomésticos': 'Sua casa mais moderna e funcional com nossos eletrodomésticos.',
        'móveis': 'Móveis de qualidade para transformar seu lar em um ambiente único.',
        'roupas': 'Moda e estilo para todos os momentos da sua vida.',
        'esportes': 'Equipamentos esportivos para você alcançar seus objetivos.'
    };
    
    return descriptions[category] || 'Produtos de qualidade para todas as suas necessidades.';
}

// Obter logo do fornecedor
function getSellerLogo(category) {
    const logos = {
        'eletrônicos': 'https://via.placeholder.com/100x100/007bff/ffffff?text=Tech',
        'eletrodomésticos': 'https://via.placeholder.com/100x100/28a745/ffffff?text=Home',
        'móveis': 'https://via.placeholder.com/100x100/ffc107/ffffff?text=Furn',
        'roupas': 'https://via.placeholder.com/100x100/e83e8c/ffffff?text=Fashion',
        'esportes': 'https://via.placeholder.com/100x100/fd7e14/ffffff?text=Sport'
    };
    
    return logos[category] || 'https://via.placeholder.com/100x100/6c757d/ffffff?text=Store';
}

// Exibir fornecedores
function displaySellers(sellers) {
    const grid = document.getElementById('sellers-grid');
    grid.innerHTML = '';
    
    sellers.forEach(seller => {
        const sellerCard = createSellerCard(seller);
        grid.appendChild(sellerCard);
    });
}

// Criar card do fornecedor
function createSellerCard(seller) {
    const card = document.createElement('div');
    card.className = 'seller-card';
    
    const rating = '★'.repeat(Math.floor(seller.rating)) + '☆'.repeat(5 - Math.floor(seller.rating));
    const joinedYear = seller.joinedDate.getFullYear();
    
    card.innerHTML = `
        <div class="seller-logo">
            <img src="${seller.logo}" alt="${seller.name}">
        </div>
        <div class="seller-info">
            <h3 class="seller-name">${seller.name}</h3>
            <p class="seller-category">${seller.category.charAt(0).toUpperCase() + seller.category.slice(1)}</p>
            <p class="seller-description">${seller.description}</p>
            <div class="seller-stats">
                <div class="stat">
                    <span class="stat-value">${seller.rating}</span>
                    <span class="stat-label">Avaliação</span>
                </div>
                <div class="stat">
                    <span class="stat-value">${seller.productsCount}</span>
                    <span class="stat-label">Produtos</span>
                </div>
                <div class="stat">
                    <span class="stat-value">${joinedYear}</span>
                    <span class="stat-label">Desde</span>
                </div>
            </div>
            <div class="seller-rating">
                <span class="stars">${rating}</span>
                <span class="rating-text">(${seller.rating})</span>
            </div>
        </div>
    `;
    
    return card;
}
