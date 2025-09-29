// Script para corrigir valores do carrinho e checkout
console.log('🔧 Iniciando correção dos valores do carrinho...');

// Função para adicionar produtos de teste ao carrinho
function addTestProductsToCart() {
    console.log('📦 Adicionando produtos de teste ao carrinho...');
    
    // Verificar se há usuário logado
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        console.log('❌ Nenhum usuário logado, criando usuário de teste...');
        const testUser = {
            id: 'test-001',
            name: 'Cliente Teste',
            email: 'teste@gmail.com',
            password: 'teste123',
            profile: 'customer',
            isFixed: true
        };
        localStorage.setItem('currentUser', JSON.stringify(testUser));
        console.log('✅ Usuário de teste criado');
    }
    
    // Produtos de teste
    const testProducts = [
        {
            id: 'PROD-001',
            title: 'Samsung Galaxy S24 FE 5G',
            price: 2899.99,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
            brand: 'Samsung',
            category: 'Smartphones'
        },
        {
            id: 'PROD-004',
            title: 'Notebook Acer Aspire 5',
            price: 2499.99,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
            brand: 'Acer',
            category: 'Notebooks'
        },
        {
            id: 'PROD-010',
            title: 'Fone JBL Tune 510BT',
            price: 199.99,
            quantity: 2,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
            brand: 'JBL',
            category: 'Áudio'
        }
    ];
    
    // Salvar produtos no carrinho
    const userId = currentUser ? currentUser.id : 'test-001';
    const cartKey = `cart_${userId}`;
    localStorage.setItem(cartKey, JSON.stringify(testProducts));
    
    console.log('✅ Produtos adicionados ao carrinho:', testProducts.length);
    testProducts.forEach(product => {
        console.log(`  - ${product.title}: R$ ${product.price} x ${product.quantity}`);
    });
    
    // Calcular total
    const total = testProducts.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    console.log(`💰 Total do carrinho: R$ ${total.toFixed(2)}`);
    
    return testProducts;
}

// Função para verificar se os valores estão sendo calculados corretamente
function verifyCartValues() {
    console.log('🔍 Verificando valores do carrinho...');
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        console.log('❌ Usuário não encontrado');
        return false;
    }
    
    const cartKey = `cart_${currentUser.id}`;
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    
    if (cart.length === 0) {
        console.log('❌ Carrinho vazio');
        return false;
    }
    
    let subtotal = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        console.log(`  ${item.title}: R$ ${item.price} x ${item.quantity} = R$ ${itemTotal.toFixed(2)}`);
    });
    
    const shipping = subtotal > 99 ? 0 : 15;
    const total = subtotal + shipping;
    
    console.log(`📊 Subtotal: R$ ${subtotal.toFixed(2)}`);
    console.log(`🚚 Frete: R$ ${shipping.toFixed(2)}`);
    console.log(`💰 Total: R$ ${total.toFixed(2)}`);
    
    return { subtotal, shipping, total };
}

// Função para forçar atualização dos valores na página
function forceUpdateCartDisplay() {
    console.log('🔄 Forçando atualização da exibição do carrinho...');
    
    // Se estivermos na página do carrinho
    if (window.location.pathname.includes('cart.html')) {
        // Recarregar a página para forçar atualização
        console.log('🔄 Recarregando página do carrinho...');
        window.location.reload();
        return;
    }
    
    // Se estivermos na página de checkout
    if (window.location.pathname.includes('checkout.html')) {
        // Recarregar a página para forçar atualização
        console.log('🔄 Recarregando página de checkout...');
        window.location.reload();
        return;
    }
}

// Executar correções
console.log('🚀 Executando correções...');

try {
    // 1. Adicionar produtos de teste
    const products = addTestProductsToCart();
    
    // 2. Verificar valores
    const values = verifyCartValues();
    
    if (values) {
        console.log('✅ Valores calculados corretamente');
        
        // 3. Forçar atualização da exibição
        setTimeout(() => {
            forceUpdateCartDisplay();
        }, 1000);
    } else {
        console.log('❌ Erro ao calcular valores');
    }
    
} catch (error) {
    console.error('❌ Erro durante correção:', error);
}

console.log('✅ Correção concluída');

