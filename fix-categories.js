// Script para corrigir e organizar categorias do database.js
const fs = require('fs');

// Ler o arquivo database.js atual
let databaseContent = fs.readFileSync('js/database.js', 'utf8');

// Mapeamento de categorias para padronizar nomes
const categoryMapping = {
    // Categorias originais (manter)
    'smartphones': 'Smartphones',
    'notebooks': 'Notebooks',
    'televisoes': 'Televisões',
    'audio': 'Áudio e Som',
    'calcados': 'Calçados',
    'roupas': 'Roupas',
    'eletrodomesticos': 'Eletrodomésticos',
    'esportes': 'Esportes e Lazer',
    'monitores': 'Monitores',
    'relogios': 'Relógios',
    
    // Categorias geradas (remover duplicatas)
    'tvs': 'televisoes', // Redirecionar para televisoes
    'roupas_masculinas': 'roupas', // Redirecionar para roupas
    'roupas_femininas': 'roupas', // Redirecionar para roupas
    'tenis': 'calcados', // Redirecionar para calcados
    'joias': 'relogios' // Redirecionar para relogios (acessórios)
};

// Função para extrair produtos de uma categoria
function extractProductsFromCategory(content, categoryName) {
    const regex = new RegExp(`${categoryName}:\\s*\\[([\\s\\S]*?)\\](?=,\\s*\\n\\s*(?:[a-zA-Z_]+:|\\}))`, 'g');
    const matches = [];
    let match;
    
    while ((match = regex.exec(content)) !== null) {
        const productsText = match[1];
        // Extrair produtos individuais
        const productRegex = /\{[\s\S]*?\}/g;
        let productMatch;
        while ((productMatch = productRegex.exec(productsText)) !== null) {
            try {
                // Tentar parsear o produto
                const productText = productMatch[0];
                matches.push(productText);
            } catch (error) {
                console.log('Erro ao processar produto:', error);
            }
        }
    }
    
    return matches;
}

// Função para consolidar produtos por categoria
function consolidateProducts() {
    const consolidatedCategories = {};
    
    // Inicializar categorias principais
    Object.keys(categoryMapping).forEach(key => {
        const targetCategory = categoryMapping[key];
        if (typeof targetCategory === 'string' && !targetCategory.includes('_')) {
            // É uma categoria principal
            if (!consolidatedCategories[key]) {
                consolidatedCategories[key] = [];
            }
        }
    });
    
    // Extrair produtos de cada categoria
    Object.keys(categoryMapping).forEach(categoryKey => {
        const products = extractProductsFromCategory(databaseContent, categoryKey);
        const targetCategory = categoryMapping[categoryKey];
        
        if (typeof targetCategory === 'string' && targetCategory !== categoryKey) {
            // É um redirecionamento - mover produtos para categoria principal
            if (!consolidatedCategories[targetCategory]) {
                consolidatedCategories[targetCategory] = [];
            }
            products.forEach(product => {
                // Atualizar categoria do produto
                const updatedProduct = product.replace(
                    /category:\s*"[^"]*"/g, 
                    `category: "${categoryMapping[targetCategory]}"`
                );
                consolidatedCategories[targetCategory].push(updatedProduct);
            });
        } else {
            // É uma categoria principal
            if (!consolidatedCategories[categoryKey]) {
                consolidatedCategories[categoryKey] = [];
            }
            products.forEach(product => {
                // Atualizar categoria do produto
                const updatedProduct = product.replace(
                    /category:\s*"[^"]*"/g, 
                    `category: "${targetCategory}"`
                );
                consolidatedCategories[categoryKey].push(updatedProduct);
            });
        }
    });
    
    return consolidatedCategories;
}

// Função para gerar novo conteúdo do database.js
function generateNewDatabaseContent(consolidatedCategories) {
    let newContent = `// Banco de Dados de Produtos Organizados por Categoria
const productsDatabase = {
`;

    // Adicionar cada categoria
    Object.keys(consolidatedCategories).forEach((categoryKey, index) => {
        const products = consolidatedCategories[categoryKey];
        const categoryDisplayName = categoryMapping[categoryKey];
        
        if (products.length > 0) {
            newContent += `    ${categoryKey}: [\n`;
            
            products.forEach((product, productIndex) => {
                // Indentar produto
                const indentedProduct = product.split('\n').map(line => 
                    line.trim() ? '        ' + line.trim() : ''
                ).join('\n');
                
                newContent += indentedProduct;
                if (productIndex < products.length - 1) {
                    newContent += ',';
                }
                newContent += '\n';
            });
            
            newContent += '    ]';
            if (index < Object.keys(consolidatedCategories).length - 1) {
                newContent += ',';
            }
            newContent += '\n';
        }
    });

    newContent += `};

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
        name: categoryMapping[key] || key.charAt(0).toUpperCase() + key.slice(1)
    }));
}

// Mapeamento de categorias para exibição
const categoryMapping = ${JSON.stringify(categoryMapping, null, 4)};

// Exportar para uso em outros módulos
if (typeof window !== 'undefined') {
    window.productsDatabase = productsDatabase;
    window.getAllProducts = getAllProducts;
    window.getProductsByCategory = getProductsByCategory;
    window.getCategories = getCategories;
    window.categoryMapping = categoryMapping;
}`;

    return newContent;
}

console.log('🔄 Analisando categorias no database.js...');

// Consolidar produtos
const consolidatedCategories = consolidateProducts();

console.log('📊 Categorias encontradas:');
Object.keys(consolidatedCategories).forEach(category => {
    console.log(`  - ${category}: ${consolidatedCategories[category].length} produtos`);
});

// Gerar novo conteúdo
const newContent = generateNewDatabaseContent(consolidatedCategories);

// Fazer backup do arquivo original
fs.writeFileSync('js/database-backup-original.js', databaseContent);
console.log('💾 Backup criado: js/database-backup-original.js');

// Salvar novo arquivo
fs.writeFileSync('js/database.js', newContent);

console.log('✅ Categorias organizadas com sucesso!');
console.log('🏷️ Categorias finais:');
Object.keys(categoryMapping).forEach(key => {
    if (typeof categoryMapping[key] === 'string' && !categoryMapping[key].includes('_')) {
        console.log(`  - ${key} → ${categoryMapping[key]}`);
    }
});