// Script para gerenciar login e cadastro de usuários - VERSÃO CORRIGIDA DEFINITIVA

document.addEventListener('DOMContentLoaded', function() {
    console.log('=== INICIALIZANDO SISTEMA DE LOGIN CORRIGIDO DEFINITIVO ===');
    
    // Garantir que os usuários estejam inicializados primeiro
    initializeUsers();
    
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
    if (tabs.length > 0) {
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
    }
    
    // Configurar formulário de login
    if (loginForm) {
        console.log('✅ Configurando formulário de login...');
        loginForm.addEventListener('submit', handleLogin);
        
        // Configurar também com click no botão como fallback
        const loginButton = loginForm.querySelector('button[type="submit"]');
        if (loginButton) {
            loginButton.addEventListener('click', function(e) {
                e.preventDefault();
                handleLogin(e);
            });
        }
    } else {
        console.log('❌ Formulário de login não encontrado');
        console.log('Tentando configurar login alternativo...');
        
        // Fallback: procurar botão de login diretamente
        const loginButton = document.querySelector('button[type="submit"]');
        if (loginButton) {
            console.log('✅ Botão de login encontrado, configurando...');
            loginButton.addEventListener('click', function(e) {
                e.preventDefault();
                handleLogin(e);
            });
        }
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
    
    // Verificar se tudo foi configurado corretamente
    console.log('=== VERIFICAÇÃO FINAL ===');
    console.log('Usuários disponíveis:', users.length);
    console.log('Login form configurado:', !!loginForm);
    console.log('handleLogin disponível:', typeof handleLogin === 'function');
    
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
            password: 'teste123!@', // Senha atualizada com 10 caracteres e símbolos
            profile: 'customer',
            createdAt: new Date().toISOString(),
            isFixed: true
        },
        {
            id: 'test-002',
            name: 'Vendedor Teste',
            email: 'vendedor@teste.com',
            password: 'vendedor1!@', // Senha atualizada com 10 caracteres e símbolos
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
            
            // Migrar senhas não criptografadas para formato criptografado
            const migratedUsers = customUsers.map(user => {
                if (!user.passwordHash && user.password) {
                    console.log('Migrando senha para usuário:', user.email);
                    const { hash, salt } = hashPassword(user.password);
                    return {
                        ...user,
                        passwordHash: hash,
                        passwordSalt: salt,
                        password: undefined // Remover senha em texto plano
                    };
                }
                return user;
            });
            
            users = [...users, ...migratedUsers];
            
            console.log('Usuários finais:', users.length, '(2 fixos +', migratedUsers.length, 'cadastrados)');
            
            // Salvar usuários migrados
            localStorage.setItem('users', JSON.stringify(users));
            console.log('Migração de senhas concluída e usuários salvos');
            
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

// Função para criptografar senha com salt e múltiplas iterações
async function hashPassword(password) {
    // Gerar salt aleatório
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const encoder = new TextEncoder();
    const passwordData = encoder.encode(password);
    
    // Combinar senha com salt
    const combined = new Uint8Array(passwordData.length + salt.length);
    combined.set(passwordData);
    combined.set(salt, passwordData.length);
    
    // Aplicar hash SHA-256 múltiplas vezes para maior segurança
    let hashBuffer = combined;
    for (let i = 0; i < 10000; i++) {
        hashBuffer = await crypto.subtle.digest('SHA-256', hashBuffer);
    }
    
    // Converter para string hexadecimal
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const saltArray = Array.from(salt);
    
    // Retornar hash + salt para verificação posterior
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    const saltHex = saltArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return `${hashHex}:${saltHex}`;
}

// Função para verificar senha criptografada
async function verifyPassword(password, hashedPassword) {
    try {
        // Separar hash e salt
        const [hashHex, saltHex] = hashedPassword.split(':');
        if (!hashHex || !saltHex) {
            // Formato antigo - comparação direta para compatibilidade
            return password === hashedPassword;
        }
        
        // Converter salt de hex para bytes
        const salt = new Uint8Array(saltHex.match(/.{2}/g).map(byte => parseInt(byte, 16)));
        
        // Recriar hash com a senha fornecida
        const encoder = new TextEncoder();
        const passwordData = encoder.encode(password);
        
        // Combinar senha com salt
        const combined = new Uint8Array(passwordData.length + salt.length);
        combined.set(passwordData);
        combined.set(salt, passwordData.length);
        
        // Aplicar hash SHA-256 múltiplas vezes
        let hashBuffer = combined;
        for (let i = 0; i < 10000; i++) {
            hashBuffer = await crypto.subtle.digest('SHA-256', hashBuffer);
        }
        
        // Converter para string hexadecimal
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const newHashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        // Comparar hashes
        return newHashHex === hashHex;
    } catch (error) {
        console.error('Erro na verificação de senha:', error);
        return false;
    }
}

// Validação de senha
function validatePassword(password) {
    // Mínimo 10 caracteres conforme documentação
    if (password.length < 10) {
        return { valid: false, message: 'A senha deve ter no mínimo 10 caracteres.' };
    }
    
    // Deve conter números
    if (!/\d/.test(password)) {
        return { valid: false, message: 'A senha deve conter pelo menos um número.' };
    }
    
    // Deve conter letras
    if (!/[a-zA-Z]/.test(password)) {
        return { valid: false, message: 'A senha deve conter pelo menos uma letra.' };
    }
    
    // Deve conter caracteres especiais conforme documentação
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        return { valid: false, message: 'A senha deve conter pelo menos um caractere especial (!@#$%^&*...).' };
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
    console.log('🔧 Configurando validação em tempo real...');
    
    // Validação do nome - não permitir números
    const nameInput = document.getElementById('register-name');
    if (nameInput) {
        nameInput.addEventListener('input', function(e) {
            // Remove números do campo nome
            let value = e.target.value;
            let cleanValue = value.replace(/[0-9]/g, '');
            
            if (value !== cleanValue) {
                e.target.value = cleanValue;
                // Mostrar feedback visual temporário
                const errorElement = document.getElementById('register-name-error');
                if (errorElement) {
                    errorElement.textContent = 'Números não são permitidos no nome';
                    errorElement.style.color = '#ff6b6b';
                    setTimeout(() => {
                        errorElement.textContent = '';
                    }, 2000);
                }
            }
        });
        
        nameInput.addEventListener('keypress', function(e) {
            // Prevenir digitação de números
            if (/[0-9]/.test(e.key)) {
                e.preventDefault();
                const errorElement = document.getElementById('register-name-error');
                if (errorElement) {
                    errorElement.textContent = 'Apenas letras e espaços são permitidos';
                    errorElement.style.color = '#ff6b6b';
                    setTimeout(() => {
                        errorElement.textContent = '';
                    }, 2000);
                }
            }
        });
    }
    
    // Validação de senha em tempo real
    const passwordInput = document.getElementById('register-password');
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const errorElement = document.getElementById('register-password-error');
            
            if (password.length > 0) {
                const validation = validatePassword(password);
                if (!validation.valid) {
                    errorElement.textContent = validation.message;
                    errorElement.style.color = '#ff6b6b';
                } else {
                    errorElement.textContent = '✓ Senha válida';
                    errorElement.style.color = '#4CAF50';
                }
            } else {
                errorElement.textContent = '';
            }
        });
    }
    
    // Validação de confirmação de senha
    const confirmPasswordInput = document.getElementById('register-confirm-password');
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            const password = document.getElementById('register-password').value;
            const confirmPassword = this.value;
            const errorElement = document.getElementById('register-confirm-password-error');
            
            if (confirmPassword.length > 0) {
                if (password !== confirmPassword) {
                    errorElement.textContent = 'As senhas não coincidem';
                    errorElement.style.color = '#ff6b6b';
                } else {
                    errorElement.textContent = '✓ Senhas coincidem';
                    errorElement.style.color = '#4CAF50';
                }
            } else {
                errorElement.textContent = '';
            }
        });
    }
}

// Função para lidar com login
async function handleLogin(e) {
    e.preventDefault();
    console.log('=== INÍCIO DO LOGIN DEFINITIVO ===');
    
    // Verificar se os elementos existem
    const emailElement = document.getElementById('login-email');
    const passwordElement = document.getElementById('login-password');
    const rememberMeElement = document.getElementById('remember-me');
    const messageElement = document.getElementById('login-message');
    
    if (!emailElement || !passwordElement) {
        console.error('❌ Elementos do formulário não encontrados!');
        console.error('Email element:', !!emailElement);
        console.error('Password element:', !!passwordElement);
        alert('Erro: Formulário não encontrado. Recarregue a página.');
        return;
    }
    
    const email = emailElement.value.trim();
    const password = passwordElement.value;
    const rememberMe = rememberMeElement ? rememberMeElement.checked : false;
    
    console.log('Dados do login:', { email, password: '***', rememberMe });
    
    // Limpar mensagens de erro anteriores
    const emailErrorElement = document.getElementById('login-email-error');
    const passwordErrorElement = document.getElementById('login-password-error');
    
    if (emailErrorElement) emailErrorElement.textContent = '';
    if (passwordErrorElement) passwordErrorElement.textContent = '';
    if (messageElement) {
    messageElement.textContent = '';
    messageElement.className = 'form-message';
    }
    
    // Validar campos
    if (!email) {
        if (emailErrorElement) emailErrorElement.textContent = 'E-mail é obrigatório';
        console.log('❌ Email vazio');
        return;
    }
    
    if (!password) {
        if (passwordErrorElement) passwordErrorElement.textContent = 'Senha é obrigatória';
        console.log('❌ Senha vazia');
        return;
    }
    
    console.log('✅ Campos validados');
    
    // Recarregar usuários do localStorage para garantir dados atualizados
    console.log('🔄 Recarregando usuários...');
    initializeUsers();
    
    console.log('📋 Usuários disponíveis:', users.length);
    users.forEach((u, index) => {
        console.log(`  ${index + 1}. ${u.email} (${u.name}) - ID: ${u.id}`);
    });
    
    // Verificar credenciais
    const user = users.find(u => u.email === email);
    
    console.log('🔍 Tentativa de login:', { email, hasUser: !!user });
    
    if (!user) {
        console.log('❌ Usuário não encontrado');
        if (messageElement) {
        messageElement.textContent = 'E-mail ou senha incorretos';
        messageElement.className = 'form-message error';
        }
        return;
    }
    
    console.log('✅ Usuário encontrado:', { id: user.id, name: user.name, email: user.email });
    
    // Verificar senha (comparação direta para usuários de teste, criptografada para outros)
    console.log('🔐 Verificando senha...');
    let passwordMatch = false;
    
    // Verificar senha baseado no tipo de usuário
    if (user.isFixed || user.id === 'test-001' || user.id === 'test-002') {
        // Usuários de teste fixos - comparação direta
        passwordMatch = user.password === password;
        console.log('🔍 Usuário de teste - comparação direta:', { 
            userId: user.id, 
            senhaDigitada: password, 
            senhaArmazenada: user.password, 
            match: passwordMatch 
        });
    } else {
        // Usuários cadastrados - verificação com senha criptografada
        passwordMatch = await verifyPassword(password, user.password);
        console.log('🔍 Usuário cadastrado - verificação criptografada:', { 
            userId: user.id,
            senhaDigitada: password,
            senhaArmazenada: user.password.substring(0, 10) + '...',
            match: passwordMatch 
        });
    }
    
    if (!passwordMatch) {
        console.log('❌ Senha incorreta');
        if (messageElement) {
        messageElement.textContent = 'E-mail ou senha incorretos';
        messageElement.className = 'form-message error';
        }
        return;
    }
    
    console.log('✅ Senha correta!');
    
    console.log('✅ Login bem-sucedido:', user);
    
    // LIMPAR CARRINHOS DE OUTROS USUÁRIOS AO FAZER LOGIN
    clearOtherUserCarts(user.id);
    
    // Salvar usuário atual no localStorage
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Configurar timeout de sessão (30 minutos)
    const sessionTimeout = Date.now() + (30 * 60 * 1000); // 30 minutos em millisegundos
    localStorage.setItem('sessionTimeout', sessionTimeout.toString());
    localStorage.setItem('sessionStartTime', Date.now().toString());
    
    console.log('⏰ Sessão configurada com timeout de 30 minutos');
    
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
    if (messageElement) {
    messageElement.innerHTML = `
        <div class="success-message">
            <i class="fas fa-check-circle"></i>
            <span>Login realizado com sucesso! Redirecionando...</span>
        </div>
    `;
    messageElement.className = 'form-message success';
    }
    
    // Redirecionar para página de boas-vindas
    console.log('🚀 Redirecionando para welcome.html');
    setTimeout(() => {
        try {
        // Verificar se estamos na pasta pages
        if (window.location.pathname.includes('/pages/')) {
            window.location.href = './welcome.html';
        } else {
            window.location.href = './pages/welcome.html';
            }
        } catch (error) {
            console.error('Erro ao redirecionar:', error);
            alert('Login realizado com sucesso! Clique em OK para continuar.');
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
    
    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
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
    
    // Validar campos obrigatórios - VALIDAÇÃO RIGOROSA
    let hasError = false;
    let errorMessages = [];
    
    // 1. VALIDAR NOME COMPLETO (OBRIGATÓRIO)
    if (!name || name.length === 0) {
        document.getElementById('register-name-error').textContent = 'Nome completo é obrigatório';
        errorMessages.push('Nome completo não informado');
        hasError = true;
    } else if (name.length < 2) {
        document.getElementById('register-name-error').textContent = 'Nome deve ter pelo menos 2 caracteres';
        errorMessages.push('Nome muito curto');
        hasError = true;
    } else {
        const nameValidation = validateName(name);
        if (!nameValidation.valid) {
            document.getElementById('register-name-error').textContent = nameValidation.message;
            errorMessages.push('Nome inválido: ' + nameValidation.message);
            hasError = true;
        }
    }
    
    // 2. VALIDAR E-MAIL (OBRIGATÓRIO E ÚNICO)
    if (!email || email.length === 0) {
        document.getElementById('register-email-error').textContent = 'E-mail é obrigatório';
        errorMessages.push('E-mail não informado');
        hasError = true;
    } else {
        const emailValidation = validateEmail(email);
        if (!emailValidation.valid) {
            document.getElementById('register-email-error').textContent = emailValidation.message;
            errorMessages.push('E-mail inválido: ' + emailValidation.message);
            hasError = true;
        } else {
            // Verificar se email já existe (validação de unicidade)
            const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
            if (existingUser) {
                document.getElementById('register-email-error').textContent = 'Este e-mail já está cadastrado no sistema';
                errorMessages.push('E-mail já cadastrado');
                hasError = true;
            }
        }
    }
    
    // 3. VALIDAR SENHA (OBRIGATÓRIA - MÍNIMO 10 CARACTERES, NÚMEROS, LETRAS E SÍMBOLOS)
    if (!password || password.length === 0) {
        document.getElementById('register-password-error').textContent = 'Senha é obrigatória';
        errorMessages.push('Senha não informada');
        hasError = true;
    } else {
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            document.getElementById('register-password-error').textContent = passwordValidation.message;
            errorMessages.push('Senha inválida: ' + passwordValidation.message);
            hasError = true;
        }
    }
    
    // 4. VALIDAR CONFIRMAÇÃO DE SENHA (OBRIGATÓRIA)
    if (!confirmPassword || confirmPassword.length === 0) {
        document.getElementById('register-confirm-password-error').textContent = 'Confirmação de senha é obrigatória';
        errorMessages.push('Confirmação de senha não informada');
        hasError = true;
    } else if (password !== confirmPassword) {
        document.getElementById('register-confirm-password-error').textContent = 'As senhas não coincidem';
        errorMessages.push('Senhas não coincidem');
        hasError = true;
    }
    
    // 5. VALIDAR PERFIL (OBRIGATÓRIO - VENDEDOR OU CLIENTE)
    if (!profile || profile.length === 0) {
        document.getElementById('register-profile-error').textContent = 'Perfil é obrigatório - selecione Cliente ou Vendedor';
        errorMessages.push('Perfil não selecionado');
        hasError = true;
    } else if (profile !== 'cliente' && profile !== 'vendedor') {
        document.getElementById('register-profile-error').textContent = 'Perfil inválido - deve ser Cliente ou Vendedor';
        errorMessages.push('Perfil inválido');
        hasError = true;
    }
    
    // SE HOUVER QUALQUER ERRO, IMPEDIR O CADASTRO
    if (hasError) {
        console.log('❌ Erros de validação encontrados:', errorMessages);
        messageElement.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <span>Por favor, corrija todos os campos obrigatórios antes de continuar.</span>
            </div>
        `;
        messageElement.className = 'form-message error';
        
        // Focar no primeiro campo com erro
        const firstErrorField = document.querySelector('.error-message:not(:empty)').previousElementSibling;
        if (firstErrorField && firstErrorField.focus) {
            firstErrorField.focus();
        }
        
        return;
    }
    
    console.log('✅ Todas as validações passaram, verificando email único...');
    
    // Verificar se email já existe
    const existingUser = users.find(user => user.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
        document.getElementById('register-email-error').textContent = 'Este e-mail já está cadastrado no sistema';
        messageElement.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <span>E-mail já cadastrado. Use outro e-mail ou faça login.</span>
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
        
        // FAZER LOGIN AUTOMÁTICO APÓS CADASTRO BEM-SUCEDIDO
        console.log('🔐 Fazendo login automático após cadastro...');
        
        // Salvar usuário atual no localStorage (login automático)
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        // Configurar timeout de sessão (30 minutos)
        const sessionTimeout = Date.now() + (30 * 60 * 1000); // 30 minutos em millisegundos
        localStorage.setItem('sessionTimeout', sessionTimeout.toString());
        localStorage.setItem('sessionStartTime', Date.now().toString());
        
        console.log('⏰ Sessão configurada com timeout de 30 minutos');
        console.log('✅ Login automático realizado com sucesso!');
        
        // Mostrar mensagem de sucesso com login automático
        messageElement.innerHTML = `
            <div class="success-message">
                <i class="fas fa-check-circle"></i>
                <span>Cadastro realizado com sucesso! Entrando automaticamente...</span>
            </div>
        `;
        messageElement.className = 'form-message success';
        
        // Redirecionar diretamente para página de boas-vindas após 2 segundos
        console.log('🚀 Redirecionando para welcome.html após login automático');
        setTimeout(() => {
            try {
                // Verificar se estamos na pasta pages
                if (window.location.pathname.includes('/pages/')) {
                    window.location.href = './welcome.html';
                } else {
                    window.location.href = './pages/welcome.html';
                }
            } catch (error) {
                console.error('Erro ao redirecionar:', error);
                alert('Cadastro e login realizados com sucesso! Clique em OK para continuar.');
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

// Função para preencher perfil de teste
function fillTestProfile(profileType) {
    console.log('🧪 Preenchendo perfil de teste:', profileType);
    
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    
    if (!emailInput || !passwordInput) {
        console.error('❌ Campos de login não encontrados');
        return;
    }
    
    if (profileType === 'cliente') {
        emailInput.value = 'teste@gmail.com';
        passwordInput.value = 'teste123!@';
        console.log('✅ Perfil de cliente preenchido');
    } else if (profileType === 'vendedor') {
        emailInput.value = 'vendedor@teste.com';
        passwordInput.value = 'vendedor1!@';
        console.log('✅ Perfil de vendedor preenchido');
    }
    
    // Adicionar feedback visual
    emailInput.style.backgroundColor = '#e8f5e8';
    passwordInput.style.backgroundColor = '#e8f5e8';
    
    setTimeout(() => {
        emailInput.style.backgroundColor = '';
        passwordInput.style.backgroundColor = '';
    }, 1000);
    
    // Focar no botão de login
    const loginButton = document.querySelector('#login-form button[type="submit"]');
    if (loginButton) {
        loginButton.focus();
    }
}