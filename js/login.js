// Script para gerenciar login e cadastro de usuários - VERSÃO CORRIGIDA DEFINITIVA

document.addEventListener('DOMContentLoaded', function() {
    console.log('=== INICIALIZANDO SISTEMA DE LOGIN CORRIGIDO ===');
    
    // Verificar se o usuário já está logado
    checkExistingLogin();
    
    // Configurar cabeçalho do usuário
    setupHeaderUserActions();
    
    // Elementos da interface
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    console.log('Elementos encontrados:', {
        tabs: tabs.length,
        tabContents: tabContents.length,
        loginForm: !!loginForm,
        registerForm: !!registerForm
    });
    
    // Gerenciamento de abas
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            console.log('Mudando para aba:', tabId);
            
            // Atualizar abas ativas
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Mostrar conteúdo da aba selecionada
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tabId}-tab`) {
                    content.classList.add('active');
                }
            });
        });
    });
    
    // Configurar formulário de login
    if (loginForm) {
        console.log('✅ Configurando formulário de login...');
        loginForm.addEventListener('submit', handleLogin);
    } else {
        console.log('❌ Formulário de login não encontrado');
    }
    
    // Configurar formulário de cadastro
    if (registerForm) {
        console.log('✅ Configurando formulário de cadastro...');
        registerForm.addEventListener('submit', handleRegister);
    } else {
        console.log('❌ Formulário de cadastro não encontrado');
    }
    
    // Configurar validação em tempo real
    setupRealTimeValidation();
    
    console.log('=== SISTEMA DE LOGIN INICIALIZADO ===');
});

// Gerenciamento de usuários
let users = [];

// Função para inicializar usuários
function initializeUsers() {
    // Usuários de teste fixos (sempre existem)
    const fixedTestUsers = [
        {
            id: 'test-001',
            name: 'Cliente Teste',
            email: 'teste@gmail.com',
            password: 'teste123', // Senha com 10 caracteres
            profile: 'customer',
            createdAt: new Date().toISOString(),
            isFixed: true
        },
        {
            id: 'test-002',
            name: 'Vendedor Teste',
            email: 'vendedor@teste.com',
            password: 'vendedor1', // Senha com 10 caracteres
            profile: 'seller',
            createdAt: new Date().toISOString(),
            isFixed: true
        }
    ];
    
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
        try {
            const loadedUsers = JSON.parse(storedUsers);
            console.log('Usuários carregados do localStorage:', loadedUsers.length);
            
            // Garantir que os usuários fixos sempre existam
            users = [...fixedTestUsers];
            
            // Adicionar usuários cadastrados (que não sejam fixos)
            const customUsers = loadedUsers.filter(user => !user.isFixed);
            users = [...users, ...customUsers];
            
            console.log('Usuários finais:', users.length, '(2 fixos +', customUsers.length, 'cadastrados)');
        } catch (error) {
            console.error('Erro ao carregar usuários do localStorage:', error);
            users = [...fixedTestUsers];
        }
    } else {
        console.log('Nenhum usuário encontrado, criando usuários de teste fixos...');
        users = [...fixedTestUsers];
    }
    
    // Sempre salvar a lista atualizada
    try {
        localStorage.setItem('users', JSON.stringify(users));
        console.log('Usuários salvos no localStorage:', users.length);
    } catch (error) {
        console.error('Erro ao salvar usuários no localStorage:', error);
    }
}

// Inicializar usuários imediatamente
initializeUsers();

// Função para salvar usuários no localStorage
function saveUsers() {
    try {
        localStorage.setItem('users', JSON.stringify(users));
        console.log('Usuários salvos no localStorage:', users.length);
    } catch (error) {
        console.error('Erro ao salvar usuários:', error);
    }
}

// Função para criptografar senha
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Validação de senha
function validatePassword(password) {
    // Mínimo 6 caracteres, máximo 10 caracteres
    if (password.length < 6) {
        return { valid: false, message: 'A senha deve ter no mínimo 6 caracteres.' };
    }
    
    if (password.length > 10) {
        return { valid: false, message: 'A senha deve ter no máximo 10 caracteres.' };
    }
    
    // Deve conter números
    if (!/\d/.test(password)) {
        return { valid: false, message: 'A senha deve conter pelo menos um número.' };
    }
    
    // Deve conter letras
    if (!/[a-zA-Z]/.test(password)) {
        return { valid: false, message: 'A senha deve conter pelo menos uma letra.' };
    }
    
    return { valid: true };
}

// Validação de nome
function validateName(name) {
    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(name)) {
        return { valid: false, message: 'O nome deve conter apenas letras e espaços.' };
    }
    if (name.length < 2) {
        return { valid: false, message: 'O nome deve ter no mínimo 2 caracteres.' };
    }
    if (name.length > 50) {
        return { valid: false, message: 'O nome deve ter no máximo 50 caracteres.' };
    }
    return { valid: true };
}

// Validação de email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { valid: false, message: 'Digite um e-mail válido.' };
    }
    if (email.length > 100) {
        return { valid: false, message: 'O e-mail deve ter no máximo 100 caracteres.' };
    }
    return { valid: true };
}

// Função para alternar visualização da senha
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    const icon = button.querySelector('.show-password');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.textContent = '🙈';
        button.setAttribute('aria-label', 'Ocultar senha');
    } else {
        input.type = 'password';
        icon.textContent = '👁️';
        button.setAttribute('aria-label', 'Mostrar senha');
    }
}

// Função para aplicar máscara no campo de nome
function applyNameMask(input) {
    input.addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
    });
}

// Função para configurar validação em tempo real
function setupRealTimeValidation() {
    const nameInput = document.getElementById('register-name');
    const emailInput = document.getElementById('register-email');
    const passwordInput = document.getElementById('register-password');
    const confirmPasswordInput = document.getElementById('register-confirm-password');
    
    if (nameInput) {
        applyNameMask(nameInput);
    }
    
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const validation = validateEmail(this.value);
            const errorElement = document.getElementById('register-email-error');
            if (!validation.valid && this.value) {
                errorElement.textContent = validation.message;
            } else {
                errorElement.textContent = '';
            }
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const validation = validatePassword(this.value);
            const errorElement = document.getElementById('register-password-error');
            if (!validation.valid && this.value) {
                errorElement.textContent = validation.message;
            } else {
                errorElement.textContent = '';
            }
        });
    }
    
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            const password = document.getElementById('register-password').value;
            const errorElement = document.getElementById('register-confirm-password-error');
            if (this.value && this.value !== password) {
                errorElement.textContent = 'As senhas não coincidem';
            } else {
                errorElement.textContent = '';
            }
        });
    }
}

// Função para lidar com login
async function handleLogin(e) {
    e.preventDefault();
    console.log('=== INÍCIO DO LOGIN ===');
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me').checked;
    const messageElement = document.getElementById('login-message');
    
    // Limpar mensagens de erro anteriores
    document.getElementById('login-email-error').textContent = '';
    document.getElementById('login-password-error').textContent = '';
    messageElement.textContent = '';
    messageElement.className = 'form-message';
    
    // Validar campos
    if (!email) {
        document.getElementById('login-email-error').textContent = 'E-mail é obrigatório';
        return;
    }
    
    if (!password) {
        document.getElementById('login-password-error').textContent = 'Senha é obrigatória';
        return;
    }
    
    // Recarregar usuários do localStorage para garantir dados atualizados
    initializeUsers();
    
    // Verificar credenciais
    const user = users.find(u => u.email === email);
    
    console.log('Tentativa de login:', { email, hasUser: !!user });
    console.log('Usuários cadastrados:', users.length);
    
    if (!user) {
        messageElement.textContent = 'E-mail ou senha incorretos';
        messageElement.className = 'form-message error';
        return;
    }
    
    // Verificar senha (comparação direta para usuários de teste, criptografada para outros)
    let passwordMatch = false;
    if (user.isFixed || user.id === 'test-001' || user.id === 'test-002') {
        // Usuários de teste - comparação direta
        passwordMatch = user.password === password;
        console.log('Usuário de teste - comparação direta:', { 
            userId: user.id, 
            senhaDigitada: password, 
            senhaArmazenada: user.password, 
            match: passwordMatch 
        });
    } else {
        // Outros usuários - comparação criptografada
        const encryptedPassword = await hashPassword(password);
        passwordMatch = user.password === encryptedPassword;
        console.log('Usuário cadastrado - comparação criptografada:', { 
            userId: user.id,
            match: passwordMatch 
        });
    }
    
    if (!passwordMatch) {
        messageElement.textContent = 'E-mail ou senha incorretos';
        messageElement.className = 'form-message error';
        return;
    }
    
    console.log('✅ Login bem-sucedido:', user);
    
    // LIMPAR CARRINHOS DE OUTROS USUÁRIOS AO FAZER LOGIN
    clearOtherUserCarts(user.id);
    
    // Salvar usuário atual no localStorage
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Salvar tempo de início da sessão
    localStorage.setItem('sessionStartTime', Date.now().toString());
    
    // Salvar opção "Lembrar-me"
    localStorage.setItem('rememberMe', rememberMe.toString());
    
    // Se "Lembrar-me" estiver marcado, salvar credenciais (apenas email por segurança)
    if (rememberMe) {
        localStorage.setItem('savedEmail', email);
        console.log('✅ Email salvo para login automático');
    } else {
        localStorage.removeItem('savedEmail');
    }
    
    // Mostrar mensagem de sucesso
    messageElement.innerHTML = `
        <div class="success-message">
            <i class="fas fa-check-circle"></i>
            <span>Login realizado com sucesso! Redirecionando...</span>
        </div>
    `;
    messageElement.className = 'form-message success';
    
    // Redirecionar para página de boas-vindas
    console.log('Redirecionando para welcome.html');
    setTimeout(() => {
        // Verificar se estamos na pasta pages
        if (window.location.pathname.includes('/pages/')) {
            window.location.href = './welcome.html';
        } else {
            window.location.href = './pages/welcome.html';
        }
    }, 1500);
}

// Função para limpar carrinhos de outros usuários
function clearOtherUserCarts(currentUserId) {
    console.log('=== LIMPANDO CARRINHOS DE OUTROS USUÁRIOS ===');
    const allKeys = Object.keys(localStorage);
    
    allKeys.forEach(key => {
        if (key.startsWith('cart_') && key !== `cart_${currentUserId}`) {
            localStorage.removeItem(key);
            console.log(`Carrinho de outro usuário removido: ${key}`);
        }
    });
    
    // Limpar carrinho de guest também
    localStorage.removeItem('cart_guest');
    console.log('Carrinho de guest removido');
}

// Função para lidar com cadastro
async function handleRegister(e) {
    e.preventDefault();
    console.log('=== INÍCIO DO CADASTRO ===');
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const profile = document.getElementById('register-profile').value;
    const messageElement = document.getElementById('register-message');
    
    console.log('Dados do formulário:', { name, email, password: '***', confirmPassword: '***', profile });
    
    // Limpar mensagens de erro anteriores
    document.getElementById('register-name-error').textContent = '';
    document.getElementById('register-email-error').textContent = '';
    document.getElementById('register-password-error').textContent = '';
    document.getElementById('register-confirm-password-error').textContent = '';
    document.getElementById('register-profile-error').textContent = '';
    messageElement.textContent = '';
    messageElement.className = 'form-message';
    
    // Validar campos
    let hasError = false;
    
    // Validar nome
    if (!name) {
        document.getElementById('register-name-error').textContent = 'Nome é obrigatório';
        hasError = true;
    } else {
        const nameValidation = validateName(name);
        if (!nameValidation.valid) {
            document.getElementById('register-name-error').textContent = nameValidation.message;
            hasError = true;
        }
    }
    
    // Validar email
    if (!email) {
        document.getElementById('register-email-error').textContent = 'E-mail é obrigatório';
        hasError = true;
    } else {
        const emailValidation = validateEmail(email);
        if (!emailValidation.valid) {
            document.getElementById('register-email-error').textContent = emailValidation.message;
            hasError = true;
        }
    }
    
    // Validar senha
    if (!password) {
        document.getElementById('register-password-error').textContent = 'Senha é obrigatória';
        hasError = true;
    } else {
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            document.getElementById('register-password-error').textContent = passwordValidation.message;
            hasError = true;
        }
    }
    
    // Validar confirmação de senha
    if (!confirmPassword) {
        document.getElementById('register-confirm-password-error').textContent = 'Confirmação de senha é obrigatória';
        hasError = true;
    } else if (password !== confirmPassword) {
        document.getElementById('register-confirm-password-error').textContent = 'As senhas não coincidem';
        hasError = true;
    }
    
    // Validar perfil
    if (!profile) {
        document.getElementById('register-profile-error').textContent = 'Perfil é obrigatório';
        hasError = true;
    }
    
    if (hasError) {
        console.log('❌ Erros de validação encontrados');
        return;
    }
    
    console.log('✅ Validação passou, verificando email duplicado...');
    
    // Verificar se email já existe
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        console.log('❌ Email já cadastrado:', email);
        messageElement.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <span>Este e-mail já está cadastrado.</span>
            </div>
        `;
        messageElement.className = 'form-message error';
        return;
    }
    
    console.log('✅ Email único, criando usuário...');
    
    try {
        // Normalizar perfil
        const normalizedProfile = profile === 'cliente' ? 'customer' : 'seller';
        console.log('Perfil normalizado:', normalizedProfile);
        
        // Criar novo usuário
        const hashedPassword = await hashPassword(password);
        console.log('Senha criptografada com sucesso');
        
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password: hashedPassword,
            profile: normalizedProfile,
            createdAt: new Date().toISOString(),
            isFixed: false // Usuário cadastrado, não fixo
        };
        
        console.log('Novo usuário criado:', { ...newUser, password: '***' });
        console.log('Usuários antes de adicionar:', users.length);
        
        // Adicionar à lista e salvar
        users.push(newUser);
        saveUsers();
        
        console.log('✅ Usuário adicionado com sucesso! Total de usuários:', users.length);
        
        // LIMPAR CARRINHO AO CRIAR NOVO CADASTRO
        clearOtherUserCarts(newUser.id);
        
        // Mostrar mensagem de sucesso
        messageElement.innerHTML = `
            <div class="success-message">
                <i class="fas fa-check-circle"></i>
                <span>Cadastro realizado com sucesso! Redirecionando para login...</span>
            </div>
        `;
        messageElement.className = 'form-message success';
        
        // Redirecionar para aba de login após 2 segundos
        setTimeout(() => {
            const loginTab = document.querySelector('.tab[data-tab="login"]');
            if (loginTab) {
                loginTab.click();
                console.log('Mudando para aba de login...');
            }
        }, 2000);
        
    } catch (error) {
        console.error('❌ Erro ao criar usuário:', error);
        messageElement.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <span>Erro ao criar conta. Tente novamente.</span>
            </div>
        `;
        messageElement.className = 'form-message error';
    }
}

// Função para verificar se o usuário já está logado
function checkExistingLogin() {
    console.log('🔍 Verificando se há usuário logado...');
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const sessionStartTime = localStorage.getItem('sessionStartTime');
    
    if (currentUser) {
        console.log('✅ Usuário encontrado no localStorage:', currentUser.name);
        
        // Verificar se a sessão ainda é válida (opcional - pode definir um tempo limite)
        if (sessionStartTime) {
            const sessionAge = Date.now() - parseInt(sessionStartTime);
            const maxSessionTime = 7 * 24 * 60 * 60 * 1000; // 7 dias em millisegundos
            
            if (sessionAge > maxSessionTime) {
                console.log('⏰ Sessão expirada, fazendo logout...');
                logout();
                return;
            }
        }
        
        // Se estamos na página de login, redirecionar para welcome
        if (window.location.pathname.includes('login.html')) {
            console.log('🔄 Usuário já logado, redirecionando para welcome...');
            setTimeout(() => {
                if (window.location.pathname.includes('/pages/')) {
                    window.location.href = './welcome.html';
                } else {
                    window.location.href = './pages/welcome.html';
                }
            }, 1000);
        }
    } else {
        console.log('❌ Nenhum usuário logado');
        
        // Verificar se há email salvo para preencher automaticamente
        const savedEmail = localStorage.getItem('savedEmail');
        const rememberMe = localStorage.getItem('rememberMe') === 'true';
        
        if (savedEmail && rememberMe) {
            const emailInput = document.getElementById('login-email');
            if (emailInput) {
                emailInput.value = savedEmail;
                console.log('📧 Email preenchido automaticamente:', savedEmail);
            }
        }
    }
}

// Função para configurar as ações do usuário no cabeçalho
function setupHeaderUserActions() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const loggedOutActions = document.getElementById('logged-out-actions');
    const loggedInActions = document.getElementById('logged-in-actions');
    const userNameHeader = document.getElementById('user-name-header');
    const adminLink = document.getElementById('admin-link');
    const logoutBtn = document.getElementById('logout-btn-header');
    
    if (currentUser) {
        // Usuário logado
        if (loggedOutActions) loggedOutActions.style.display = 'none';
        if (loggedInActions) loggedInActions.style.display = 'flex';
        if (userNameHeader) userNameHeader.textContent = currentUser.name;
        
        // Mostrar link de admin apenas para vendedores
        if (adminLink) {
            adminLink.style.display = currentUser.profile === 'seller' ? 'block' : 'none';
        }
        
        // Configurar logout
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                logout();
            });
        }
    } else {
        // Usuário não logado
        if (loggedOutActions) loggedOutActions.style.display = 'flex';
        if (loggedInActions) loggedInActions.style.display = 'none';
    }
}

// Função de logout
function logout() {
    console.log('Fazendo logout...');
    
    // Limpar carrinho ao fazer logout
    const currentUserId = getCurrentUserId();
    clearOtherUserCarts(currentUserId);
    console.log('🧹 Carrinho limpo');
    
    localStorage.removeItem('currentUser');
    localStorage.removeItem('sessionStartTime');
    
    // Verificar se deve manter o "Lembrar-me"
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    if (!rememberMe) {
        localStorage.removeItem('savedEmail');
        localStorage.removeItem('rememberMe');
        console.log('🧹 Dados de login removidos');
    } else {
        console.log('💾 Mantendo dados de "Lembrar-me"');
    }
    
    window.location.href = './login.html';
}

// Função para iniciar sessão
function startSession(user) {
    const sessionData = {
        userId: user.id,
        startTime: Date.now(),
        lastActivity: Date.now()
    };
    localStorage.setItem('sessionStartTime', JSON.stringify(sessionData));
    console.log('Sessão iniciada para:', user.name);
}

// Verificar sessão ativa
function checkSession() {
    const sessionData = localStorage.getItem('sessionStartTime');
    if (sessionData) {
        const session = JSON.parse(sessionData);
        const now = Date.now();
        const sessionDuration = now - session.startTime;
        const maxSessionDuration = 24 * 60 * 60 * 1000; // 24 horas
        
        if (sessionDuration > maxSessionDuration) {
            alert('Sua sessão expirou por inatividade. Por favor, faça login novamente.');
            window.location.href = '../pages/login.html';
        }
    }
}

// Verificar sessão ao carregar a página
checkSession();