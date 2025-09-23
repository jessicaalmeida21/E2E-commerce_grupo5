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
    
    // Função para salvar usuários no localStorage
    function saveUsers() {
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    // Função para criptografar senha (simulação)
    function encryptPassword(password) {
        // Em um ambiente real, usaríamos bcrypt ou outra biblioteca segura
        // Esta é apenas uma simulação básica para demonstração
        return btoa(password + 'salt_for_demo');
    }
    
    // Gerenciamento de sessão
    function startSession(user) {
        // Remover senha do objeto de usuário antes de armazenar na sessão
        const sessionUser = {...user};
        delete sessionUser.password;
        
        // Armazenar dados do usuário e timestamp
        localStorage.setItem('currentUser', JSON.stringify(sessionUser));
        const timeout = new Date().getTime() + (30 * 60 * 1000); // 30 minutos
        localStorage.setItem('sessionTimeout', timeout);
        
        // Redirecionar com base no perfil
        if (user.profile === 'seller') {
            window.location.href = '../pages/admin.html';
        } else {
            window.location.href = '../index.html';
        }
    }
    
    // Verificar timeout de sessão (30 minutos)
    function checkSessionTimeout() {
        const sessionStart = sessionStorage.getItem('sessionStart');
        if (sessionStart) {
            const currentTime = Date.now();
            const sessionDuration = currentTime - parseInt(sessionStart);
            
            // 30 minutos = 1800000 ms
            if (sessionDuration > 1800000) {
                // Encerrar sessão
                sessionStorage.removeItem('currentUser');
                sessionStorage.removeItem('sessionStart');
                alert('Sua sessão expirou por inatividade. Por favor, faça login novamente.');
                window.location.href = '../pages/login.html';
            }
        }
    }
    
    // Verificar timeout a cada minuto
    setInterval(checkSessionTimeout, 60000);
    
    // Resetar timer de sessão em cada interação do usuário
    ['click', 'keypress', 'scroll', 'mousemove'].forEach(event => {
        document.addEventListener(event, () => {
            if (sessionStorage.getItem('currentUser')) {
                sessionStorage.setItem('sessionStart', Date.now());
            }
        });
    });
    
    // Formulário de login
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
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
            
            // Verificar credenciais
            const encryptedPassword = encryptPassword(password);
            const user = users.find(u => u.email === email);
            
            if (!user || user.password !== encryptedPassword) {
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
        registerForm.addEventListener('submit', function(e) {
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
            
            // Criar novo usuário
            const newUser = {
                id: Date.now().toString(),
                name,
                email,
                password: encryptPassword(password),
                profile,
                createdAt: new Date().toISOString()
            };
            
            // Adicionar à lista e salvar
            users.push(newUser);
            saveUsers();
            
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