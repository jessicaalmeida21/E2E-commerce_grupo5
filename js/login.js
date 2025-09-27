// Script para gerenciar login e cadastro de usuários

document.addEventListener('DOMContentLoaded', function() {
    // Configurar cabeçalho do usuário
    setupHeaderUserActions();
    
    // Elementos da interface
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    console.log('=== VERIFICANDO ELEMENTOS DO FORMULÁRIO ===');
    console.log('loginForm encontrado:', !!loginForm);
    console.log('registerForm encontrado:', !!registerForm);
    console.log('Tabs encontradas:', tabs.length);
    console.log('Tab contents encontrados:', tabContents.length);
    
    // Gerenciamento de abas
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            
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
            
            // Mostrar link de gestão se for vendedor
            if (adminLink && currentUser.profile === 'seller') {
                adminLink.style.display = 'inline-block';
            }
            
            // Configurar logout
            if (logoutBtn) {
                logoutBtn.addEventListener('click', function() {
                    localStorage.removeItem('currentUser');
                    localStorage.removeItem('sessionTimeout');
                    alert('Logout realizado com sucesso!');
                    window.location.reload();
                });
            }
        } else {
            // Usuário não logado
            if (loggedOutActions) loggedOutActions.style.display = 'block';
            if (loggedInActions) loggedInActions.style.display = 'none';
        }
    }
    
    // Validação de senha
    function validatePassword(password) {
        // Mínimo 6 caracteres, máximo 20 caracteres
        if (password.length < 6) {
            return { valid: false, message: 'A senha deve ter no mínimo 6 caracteres.' };
        }
        
        if (password.length > 20) {
            return { valid: false, message: 'A senha deve ter no máximo 20 caracteres.' };
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
        // Apenas letras, espaços e acentos
        if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(name)) {
            return { valid: false, message: 'O nome deve conter apenas letras e espaços.' };
        }
        
        // Mínimo 2 caracteres, máximo 50 caracteres
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
    
    // Gerenciamento de usuários
    let users = [];
    
    // Função para inicializar usuários
    function initializeUsers() {
        const storedUsers = localStorage.getItem('users');
        if (storedUsers) {
            users = JSON.parse(storedUsers);
            console.log('Usuários carregados do localStorage:', users.length);
        } else {
            console.log('Nenhum usuário encontrado, criando usuários de teste...');
            
            // Usuário Cliente
            const testCustomer = {
                id: 'test-001',
                name: 'Cliente Teste',
                email: 'teste@gmail.com',
                password: 'teste123456', // Senha sem criptografia para teste
                profile: 'customer',
                createdAt: new Date().toISOString()
            };
            
            // Usuário Vendedor
            const testSeller = {
                id: 'test-002',
                name: 'Vendedor Teste',
                email: 'vendedor@teste.com',
                password: 'vendedor123456', // Senha sem criptografia para teste
                profile: 'seller',
                createdAt: new Date().toISOString()
            };
            
            users = [testCustomer, testSeller];
            localStorage.setItem('users', JSON.stringify(users));
            console.log('Usuários de teste criados:', { testCustomer, testSeller });
        }
    }
    
    // Inicializar usuários imediatamente
    initializeUsers();
    
    // Função para salvar usuários no localStorage
    function saveUsers() {
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    // Hash seguro de senha (SHA-256) com salt simples para demonstração
    async function hashPassword(password) {
        try {
            const salt = 'e2e_demo_salt_v1';
            const encoder = new TextEncoder();
            const data = encoder.encode(password + salt);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            console.log('Hash da senha (SHA-256):', hashHex);
            return hashHex;
        } catch (e) {
            // Fallback simples caso SubtleCrypto não esteja disponível
            const fallbackHash = btoa(password + 'salt_for_demo');
            console.log('Hash da senha (fallback):', fallbackHash);
            return fallbackHash;
        }
    }
    
    // Gerenciamento de sessão
    function startSession(user) {
        console.log('Iniciando sessão para usuário:', user);
        
        // Remover senha do objeto de usuário antes de armazenar na sessão
        const sessionUser = {...user};
        delete sessionUser.password;
        
        console.log('Usuário da sessão (sem senha):', sessionUser);
        
        // Armazenar dados do usuário e timestamp
        localStorage.setItem('currentUser', JSON.stringify(sessionUser));
        const timeout = new Date().getTime() + (30 * 60 * 1000); // 30 minutos
        localStorage.setItem('sessionTimeout', timeout);
        
        console.log('Sessão salva no localStorage');
        console.log('Perfil do usuário:', user.profile);
        
        // Redirecionar para página de boas-vindas
        console.log('Redirecionando para welcome.html');
        window.location.href = './welcome.html';
    }
    
    // Verificar timeout de sessão (30 minutos) via localStorage
    function checkSessionTimeout() {
        const timeout = localStorage.getItem('sessionTimeout');
        if (!timeout) return;
        const timeoutDate = new Date(parseInt(timeout, 10));
        if (Date.now() > timeoutDate.getTime()) {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('sessionTimeout');
            alert('Sua sessão expirou por inatividade. Por favor, faça login novamente.');
            window.location.href = '../pages/login.html';
        }
    }
    
    // Verificar timeout a cada minuto
    setInterval(checkSessionTimeout, 60000);
    
    // Renovar timeout da sessão em cada interação do usuário
    function renewSessionTimeout() {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            const newTimeout = Date.now() + 30 * 60 * 1000;
            localStorage.setItem('sessionTimeout', newTimeout);
        }
    }
    ['click', 'keypress', 'scroll', 'mousemove'].forEach(event => {
        document.addEventListener(event, renewSessionTimeout);
    });
    
    // Formulário de login
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
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
            console.log('Lista de usuários:', users.map(u => ({ email: u.email, profile: u.profile })));
            
            if (!user) {
                messageElement.textContent = 'E-mail ou senha incorretos';
                messageElement.className = 'form-message error';
                return;
            }
            
            // Verificar senha (comparação direta para usuários de teste, criptografada para outros)
            let passwordMatch = false;
            if (user.id === 'test-001' || user.id === 'test-002') {
                // Usuários de teste - comparação direta
                passwordMatch = user.password === password;
                console.log('Usuário de teste - comparação direta:', { senhaDigitada: password, senhaArmazenada: user.password, match: passwordMatch });
            } else {
                // Outros usuários - comparação criptografada
                const encryptedPassword = await hashPassword(password);
                passwordMatch = user.password === encryptedPassword;
                console.log('Usuário normal - comparação criptografada:', { senhaCriptografada: encryptedPassword, senhaArmazenada: user.password, match: passwordMatch });
            }
            
            if (!passwordMatch) {
                messageElement.textContent = 'E-mail ou senha incorretos';
                messageElement.className = 'form-message error';
                return;
            }
            
            // Login bem-sucedido
            messageElement.textContent = 'Login realizado com sucesso!';
            messageElement.className = 'form-message success';
            
            // Iniciar sessão
            startSession(user);
        });
    }
    
    // Formulário de cadastro
    if (registerForm) {
        console.log('✅ Formulário de cadastro encontrado, adicionando event listener...');
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('=== INÍCIO DO CADASTRO ===');
            console.log('Evento de submit capturado!');
            
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
                } else if (users.some(u => u.email === email)) {
                    document.getElementById('register-email-error').textContent = 'Este e-mail já está em uso';
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
                document.getElementById('register-profile-error').textContent = 'Selecione um perfil';
                hasError = true;
            }
            
            if (hasError) {
                console.log('❌ Erros de validação encontrados, cancelando cadastro');
                return;
            }
            
            console.log('✅ Validação passou, prosseguindo com cadastro');
            
            // Normalizar perfil para o backend/uso interno
            const normalizedProfile = profile === 'vendedor' ? 'seller' : 'customer';
            console.log('Perfil normalizado:', normalizedProfile);

            try {
                // Criar novo usuário
                const hashedPassword = await hashPassword(password);
                console.log('Senha criptografada com sucesso');
                
                const newUser = {
                    id: Date.now().toString(),
                    name,
                    email,
                    password: hashedPassword,
                    profile: normalizedProfile,
                    createdAt: new Date().toISOString()
                };
                
                console.log('Novo usuário criado:', { ...newUser, password: '***' });
                console.log('Usuários antes de adicionar:', users.length);
                
                // Adicionar à lista e salvar
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));
                
                console.log('Usuários após adicionar:', users.length);
                console.log('Usuários salvos no localStorage:', JSON.parse(localStorage.getItem('users') || '[]').length);
                
                // Verificar se foi salvo corretamente
                const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
                const savedUser = savedUsers.find(u => u.email === email);
                if (savedUser) {
                    console.log('✅ Usuário salvo com sucesso no localStorage');
                } else {
                    console.error('❌ Erro: Usuário não foi salvo no localStorage');
                }
                
            } catch (error) {
                console.error('❌ Erro ao criar usuário:', error);
                messageElement.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-circle"></i>
                        <span>Erro ao criar conta. Tente novamente.</span>
                    </div>
                `;
                messageElement.className = 'form-message error';
                return;
            }
            
            // Cadastro bem-sucedido
            messageElement.innerHTML = `
                <div class="success-message">
                    <i class="fas fa-check-circle"></i>
                    <span>Cadastro realizado com sucesso! Você já pode fazer login.</span>
                </div>
            `;
            messageElement.className = 'form-message success';
            
            // Limpar formulário
            registerForm.reset();
            
            // Mostrar notificação de sucesso
            showSuccessNotification('Cadastro realizado com sucesso! Redirecionando para login...');
            
            // Mudar para a aba de login após 2 segundos
            setTimeout(() => {
                const loginTab = document.querySelector('.tab[data-tab="login"]');
                if (loginTab) {
                    loginTab.click();
                }
                // Limpar mensagem de sucesso
                messageElement.textContent = '';
                messageElement.className = 'form-message';
            }, 2000);
        });
    } else {
        console.error('❌ Formulário de cadastro não encontrado!');
        console.log('Elementos disponíveis:', document.querySelectorAll('form'));
    }
    
    // Event listener alternativo no botão de cadastro
    const registerButton = document.querySelector('button[type="submit"]');
    if (registerButton) {
        console.log('✅ Botão de cadastro encontrado, adicionando event listener alternativo...');
        registerButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('=== BOTÃO DE CADASTRO CLICADO ===');
            
            // Simular o submit do formulário
            if (registerForm) {
                const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                registerForm.dispatchEvent(submitEvent);
            }
        });
    } else {
        console.error('❌ Botão de cadastro não encontrado!');
    }
});

// Função para mostrar notificação de sucesso
function showSuccessNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Adicionar estilos
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    // Adicionar ao DOM
    document.body.appendChild(notification);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Função para preencher credenciais de teste
function fillTestCredentials(email, password) {
    // Preencher campos de login
    const loginEmail = document.getElementById('login-email');
    const loginPassword = document.getElementById('login-password');
    
    if (loginEmail && loginPassword) {
        loginEmail.value = email;
        loginPassword.value = password;
        
        // Mudar para aba de login se estiver na aba de cadastro
        const loginTab = document.querySelector('.tab[data-tab="login"]');
        if (loginTab) {
            loginTab.click();
        }
        
        // Mostrar mensagem de sucesso
        const messageElement = document.getElementById('login-message');
        if (messageElement) {
            messageElement.innerHTML = `
                <div class="success-message">
                    <i class="fas fa-check-circle"></i>
                    <span>Credenciais preenchidas! Clique em "Entrar" para fazer login.</span>
                </div>
            `;
            messageElement.className = 'form-message success';
        }
    }
}

// Função para testar cadastro
function testRegistration() {
    console.log('=== TESTE DE CADASTRO ===');
    
    // Mudar para aba de cadastro primeiro
    const registerTab = document.querySelector('.tab[data-tab="register"]');
    if (registerTab) {
        registerTab.click();
        console.log('Mudando para aba de cadastro...');
    }
    
    // Aguardar um pouco e preencher campos
    setTimeout(() => {
        const nameField = document.getElementById('register-name');
        const emailField = document.getElementById('register-email');
        const passwordField = document.getElementById('register-password');
        const confirmPasswordField = document.getElementById('register-confirm-password');
        const profileField = document.getElementById('register-profile');
        
        if (nameField && emailField && passwordField && confirmPasswordField && profileField) {
            nameField.value = 'Teste Cadastro';
            emailField.value = 'teste@cadastro.com';
            passwordField.value = 'teste123';
            confirmPasswordField.value = 'teste123';
            profileField.value = 'cliente';
            
            console.log('✅ Campos preenchidos com sucesso');
            console.log('Valores:', {
                name: nameField.value,
                email: emailField.value,
                password: '***',
                confirmPassword: '***',
                profile: profileField.value
            });
            
            // Simular clique no botão
            const registerButton = document.querySelector('button[type="submit"]');
            if (registerButton) {
                console.log('Clicando no botão de cadastro...');
                registerButton.click();
            } else {
                console.error('❌ Botão de cadastro não encontrado');
            }
        } else {
            console.error('❌ Campos de cadastro não encontrados');
            console.log('Campos encontrados:', {
                name: !!nameField,
                email: !!emailField,
                password: !!passwordField,
                confirmPassword: !!confirmPasswordField,
                profile: !!profileField
            });
        }
    }, 500);
}

// Adicionar botão de teste ao DOM
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar botão de teste de cadastro
    const testSection = document.querySelector('.test-credentials');
    if (testSection) {
        const testButton = document.createElement('button');
        testButton.textContent = 'Testar Cadastro';
        testButton.className = 'btn secondary';
        testButton.style.marginTop = '10px';
        testButton.onclick = testRegistration;
        testSection.appendChild(testButton);
    }
    
    // Configurar validação em tempo real
    setupRealTimeValidation();
});

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
        // Remove caracteres que não são letras, espaços ou acentos
        e.target.value = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
    });
}

// Função para validar em tempo real
function setupRealTimeValidation() {
    const nameInput = document.getElementById('register-name');
    const emailInput = document.getElementById('register-email');
    const passwordInput = document.getElementById('register-password');
    const confirmPasswordInput = document.getElementById('register-confirm-password');
    
    // Aplicar máscara no nome
    if (nameInput) {
        applyNameMask(nameInput);
    }
    
    // Validação em tempo real do email
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
    
    // Validação em tempo real da senha
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
    
    // Validação em tempo real da confirmação de senha
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

// Função para limpar cache e recarregar
function clearCacheAndReload() {
    // Limpar localStorage
    localStorage.clear();
    
    // Mostrar mensagem
    alert('Cache limpo! A página será recarregada.');
    
    // Recarregar a página
    window.location.reload(true);
}