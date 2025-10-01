// Script para gerenciar a página de fornecedores
document.addEventListener('DOMContentLoaded', function() {
    loadSellers();
});

// Carregar fornecedores
async function loadSellers() {
    try {
        console.log('Iniciando carregamento de fornecedores...');
        
        // Aguardar carregamento dos módulos
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        let categories = [];
        
        // Tentar carregar categorias via productsModule
        if (typeof productsModule !== 'undefined' && productsModule.getCategories) {
            try {
                categories = await productsModule.getCategories();
                console.log('Categorias carregadas via productsModule:', categories);
            } catch (error) {
                console.error('Erro no productsModule:', error);
            }
        }
        
        // Se não conseguiu, tentar via database.js diretamente
        if (!categories || categories.length === 0) {
            console.log('Tentando carregar categorias via database.js...');
            if (typeof getCategories === 'function') {
                categories = getCategories();
                console.log('Categorias carregadas via database.js:', categories);
            }
        }
        
        // Se ainda não tem categorias, usar fallback
        if (!categories || categories.length === 0) {
            console.log('Usando categorias de fallback...');
            categories = [
                { key: 'smartphones', name: 'Smartphones' },
                { key: 'notebooks', name: 'Notebooks' },
                { key: 'televisoes', name: 'Televisões' },
                { key: 'audio', name: 'Áudio e Som' },
                { key: 'calcados', name: 'Calçados' },
                { key: 'roupas', name: 'Roupas' },
                { key: 'eletrodomesticos', name: 'Eletrodomésticos' },
                { key: 'esportes', name: 'Esportes e Lazer' },
                { key: 'monitores', name: 'Monitores' },
                { key: 'relogios', name: 'Relógios' }
            ];
        }
        
        console.log('Categorias finais:', categories);
        const sellers = generateSellersFromCategories(categories);
        displaySellers(sellers);
        
    } catch (error) {
        console.error('Erro ao carregar fornecedores:', error);
        // Fallback com categorias básicas
        const fallbackCategories = [
            { key: 'smartphones', name: 'Smartphones' },
            { key: 'notebooks', name: 'Notebooks' },
            { key: 'televisoes', name: 'Televisões' },
            { key: 'audio', name: 'Áudio e Som' }
        ];
        const sellers = generateSellersFromCategories(fallbackCategories);
        displaySellers(sellers);
    }
}

// Gerar fornecedores baseados nas categorias
function generateSellersFromCategories(categories) {
    const sellers = [];
    
    categories.forEach((category, index) => {
        // Usar o nome da categoria ou a chave como fallback
        const categoryName = category.name || category.key || category;
        const categoryKey = category.key || category.toLowerCase();
        
        sellers.push({
            id: `seller-${index + 1}`,
            name: getSellerName(categoryKey),
            category: categoryName,
            categoryKey: categoryKey,
            description: getSellerDescription(categoryKey),
            logo: getSellerLogo(categoryKey),
            rating: (4 + Math.random()).toFixed(1),
            productsCount: getProductsCountForCategory(categoryKey),
            joinedDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), 1)
        });
    });
    
    return sellers;
}

// Obter contagem real de produtos por categoria
function getProductsCountForCategory(categoryKey) {
    try {
        if (typeof getProductsByCategory === 'function') {
            const products = getProductsByCategory(categoryKey);
            return products.length;
        }
        if (typeof productsDatabase !== 'undefined' && productsDatabase[categoryKey]) {
            return productsDatabase[categoryKey].length;
        }
    } catch (error) {
        console.error('Erro ao contar produtos da categoria:', error);
    }
    // Fallback para número aleatório
    return Math.floor(Math.random() * 100) + 10;
}

// Obter nome do fornecedor baseado na categoria
function getSellerName(categoryKey) {
    const names = {
        'smartphones': ['TechMobile', 'SmartPhone Pro', 'Mobile World', 'CellTech'],
        'notebooks': ['NotebookMax', 'LaptopStore', 'Computer Pro', 'TechNotebook'],
        'televisoes': ['TV Center', 'SmartTV Pro', 'Televisão Plus', 'TV World'],
        'audio': ['AudioMax', 'Som & Música', 'Audio Pro', 'Sound Store'],
        'calcados': ['Sapatos & Cia', 'Calçados Premium', 'Shoe Store', 'Pé Direito'],
        'roupas': ['Fashion Store', 'Moda & Estilo', 'Roupas Premium', 'Style Center'],
        'eletrodomesticos': ['Casa & Cozinha', 'EletroCasa', 'Home Appliances', 'Domésticos Pro'],
        'esportes': ['Sports Center', 'Atleta Store', 'Fitness Pro', 'Sport Zone'],
        'monitores': ['Monitor Pro', 'Display Center', 'Screen Store', 'Monitor Plus'],
        'relogios': ['Tempo & Estilo', 'Relógios Premium', 'Watch Store', 'Time Center']
    };
    
    const categoryNames = names[categoryKey] || ['Loja Premium', 'Store Pro', 'Mega Store', 'Super Store'];
    return categoryNames[Math.floor(Math.random() * categoryNames.length)];
}

// Obter descrição do fornecedor
function getSellerDescription(categoryKey) {
    const descriptions = {
        'smartphones': 'Especialista em smartphones e tecnologia móvel de última geração.',
        'notebooks': 'Notebooks e laptops para trabalho, estudo e entretenimento.',
        'televisoes': 'Smart TVs e televisões com a melhor qualidade de imagem.',
        'audio': 'Equipamentos de áudio e som para todos os ambientes.',
        'calcados': 'Calçados confortáveis e estilosos para todas as ocasiões.',
        'roupas': 'Moda e estilo para todos os momentos da sua vida.',
        'eletrodomesticos': 'Sua casa mais moderna e funcional com nossos eletrodomésticos.',
        'esportes': 'Equipamentos esportivos para você alcançar seus objetivos.',
        'monitores': 'Monitores profissionais para trabalho e gaming.',
        'relogios': 'Relógios elegantes e funcionais para marcar seu tempo.'
    };
    
    return descriptions[categoryKey] || 'Produtos de qualidade para todas as suas necessidades.';
}

// Obter logo do fornecedor
function getSellerLogo(categoryKey) {
    const logos = {
        'smartphones': 'https://via.placeholder.com/100x100/007bff/ffffff?text=📱',
        'notebooks': 'https://via.placeholder.com/100x100/28a745/ffffff?text=💻',
        'televisoes': 'https://via.placeholder.com/100x100/ffc107/ffffff?text=📺',
        'audio': 'https://via.placeholder.com/100x100/e83e8c/ffffff?text=🎵',
        'calcados': 'https://via.placeholder.com/100x100/fd7e14/ffffff?text=👟',
        'roupas': 'https://via.placeholder.com/100x100/6f42c1/ffffff?text=👕',
        'eletrodomesticos': 'https://via.placeholder.com/100x100/20c997/ffffff?text=🏠',
        'esportes': 'https://via.placeholder.com/100x100/dc3545/ffffff?text=⚽',
        'monitores': 'https://via.placeholder.com/100x100/17a2b8/ffffff?text=🖥️',
        'relogios': 'https://via.placeholder.com/100x100/6c757d/ffffff?text=⌚'
    };
    
    return logos[categoryKey] || 'https://via.placeholder.com/100x100/6c757d/ffffff?text=🏪';
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
            <p class="seller-category">${seller.category}</p>
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
            <div class="seller-actions">
                <button class="btn-primary" onclick="viewSellerProducts('${seller.categoryKey}', '${seller.category}')">
                    Ver Produtos (${seller.productsCount})
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Função para visualizar produtos do vendedor
function viewSellerProducts(categoryKey, categoryName) {
    // Redirecionar para o catálogo filtrado por categoria
    const catalogUrl = `catalog.html?category=${encodeURIComponent(categoryKey)}`;
    window.location.href = catalogUrl;
}
