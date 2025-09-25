// Script para gerenciar login e cadastro de usuários

document.addEventListener('DOMContentLoaded', function() {
    // Elementos da interface
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
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
    
    // Validação de senha
    function validatePassword(password) {
        // Mínimo 10 caracteres
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
        
        // Deve conter caracteres especiais
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            return { valid: false, message: 'A senha deve conter pelo menos um caractere especial.' };
        }
        
        return { valid: true };
    }
    
    // Gerenciamento de usuários
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Adicionar usuários de teste se não existir nenhum
    if (users.length === 0) {
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
        
        users.push(testCustomer, testSeller);
        localStorage.setItem('users', JSON.stringify(users));
        console.log('Usuários de teste criados:', { testCustomer, testSeller });
        console.log('Usuários salvos no localStorage:', JSON.parse(localStorage.getItem('users')).length);
    }
    
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
        
        // Redirecionar com base no perfil
        if (user.profile === 'seller') {
            console.log('Redirecionando para admin.html');
            window.location.href = './admin.html';
        } else {
            console.log('Redirecionando para index.html');
            window.location.href = '../index.html';
        }
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
            users = JSON.parse(localStorage.getItem('users')) || [];
            
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
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;
            const profile = document.getElementById('register-profile').value;
            const messageElement = document.getElementById('register-message');
            
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
            
            if (!name) {
                document.getElementById('register-name-error').textContent = 'Nome é obrigatório';
                hasError = true;
            }
            
            if (!email) {
                document.getElementById('register-email-error').textContent = 'E-mail é obrigatório';
                hasError = true;
            } else if (users.some(u => u.email === email)) {
                document.getElementById('register-email-error').textContent = 'Este e-mail já está em uso';
                hasError = true;
            }
            
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
            
            if (password !== confirmPassword) {
                document.getElementById('register-confirm-password-error').textContent = 'As senhas não coincidem';
                hasError = true;
            }
            
            if (!profile) {
                document.getElementById('register-profile-error').textContent = 'Selecione um perfil';
                hasError = true;
            }
            
            if (hasError) {
                return;
            }
            
            // Normalizar perfil para o backend/uso interno
            const normalizedProfile = profile === 'vendedor' ? 'seller' : 'customer';
            console.log('Perfil normalizado:', normalizedProfile);

            // Criar novo usuário
            const newUser = {
                id: Date.now().toString(),
                name,
                email,
                password: await hashPassword(password),
                profile: normalizedProfile,
                createdAt: new Date().toISOString()
            };
            
            console.log('Novo usuário criado:', newUser);
            console.log('Usuários antes de adicionar:', users.length);
            
            // Adicionar à lista e salvar
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            console.log('Usuários após adicionar:', users.length);
            console.log('Usuários salvos no localStorage:', JSON.parse(localStorage.getItem('users') || '[]').length);
            
            // Cadastro bem-sucedido
            messageElement.textContent = 'Cadastro realizado com sucesso! Você já pode fazer login.';
            messageElement.className = 'form-message success';
            
            // Limpar formulário
            registerForm.reset();
            
            // Mudar para a aba de login após 2 segundos
            setTimeout(() => {
                document.querySelector('.tab[data-tab="login"]').click();
            }, 2000);
        });
    }
});

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
            messageElement.textContent = 'Credenciais preenchidas! Clique em "Entrar" para fazer login.';
            messageElement.className = 'form-message success';
        }
    }
}