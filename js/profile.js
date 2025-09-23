// Script para gerenciar perfil do usuário
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o usuário está logado
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = 'login.html';
        return;
    }
    
    // Carregar dados do usuário
    loadUserData();
    setupEventListeners();
});

// Carregar dados do usuário
function loadUserData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.id === currentUser.id);
    
    if (!user) {
        alert('Usuário não encontrado.');
        window.location.href = 'login.html';
        return;
    }
    
    // Preencher formulário
    document.getElementById('name').value = user.name;
    document.getElementById('email').value = user.email;
    document.getElementById('profile-type').value = user.profile;
    
    // Mostrar nome do usuário no header
    const userNameHeader = document.getElementById('user-name');
    if (userNameHeader) {
        userNameHeader.textContent = user.name;
    }
    
    // Mostrar link de admin se for vendedor
    const adminLink = document.querySelector('.admin-link');
    if (adminLink && user.profile === 'seller') {
        adminLink.style.display = 'inline-block';
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Botão salvar perfil
    const saveBtn = document.getElementById('save-profile');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveProfile);
    }
    
    // Botão excluir conta
    const deleteBtn = document.getElementById('delete-account');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', showDeleteModal);
    }
    
    // Botões do modal de exclusão
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    const cancelDeleteBtn = document.getElementById('cancel-delete');
    const closeModalBtn = document.querySelector('.close-modal');
    
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', confirmDelete);
    }
    
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', closeDeleteModal);
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeDeleteModal);
    }
    
    // Botão logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Toggle de senhas
    setupPasswordToggles();
}

// Salvar perfil
function saveProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex === -1) {
        showMessage('Usuário não encontrado.', 'error');
        return;
    }
    
    // Validar campos
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    if (!name || !email) {
        showMessage('Nome e email são obrigatórios.', 'error');
        return;
    }
    
    // Verificar se email já existe (exceto para o usuário atual)
    const emailExists = users.some(u => u.email === email && u.id !== currentUser.id);
    if (emailExists) {
        showMessage('Este email já está em uso por outro usuário.', 'error');
        return;
    }
    
    // Se está alterando senha, validar
    if (newPassword) {
        if (!currentPassword) {
            showMessage('Digite a senha atual para alterar a senha.', 'error');
            return;
        }
        
        // Verificar senha atual
        const currentUserData = users[userIndex];
        const currentPasswordHash = await hashPassword(currentPassword);
        if (currentPasswordHash !== currentUserData.password) {
            showMessage('Senha atual incorreta.', 'error');
            return;
        }
        
        // Validar nova senha
        const passwordValidation = validatePassword(newPassword);
        if (!passwordValidation.valid) {
            showMessage(passwordValidation.message, 'error');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            showMessage('As senhas não coincidem.', 'error');
            return;
        }
    }
    
    // Atualizar dados
    users[userIndex].name = name;
    users[userIndex].email = email;
    
    if (newPassword) {
        users[userIndex].password = await hashPassword(newPassword);
    }
    
    // Salvar
    localStorage.setItem('users', JSON.stringify(users));
    
    // Atualizar usuário atual
    const updatedUser = {...users[userIndex]};
    delete updatedUser.password;
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    showMessage('Perfil atualizado com sucesso!', 'success');
    
    // Limpar campos de senha
    document.getElementById('current-password').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';
}

// Mostrar modal de exclusão
function showDeleteModal() {
    const modal = document.getElementById('delete-modal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// Fechar modal de exclusão
function closeDeleteModal() {
    const modal = document.getElementById('delete-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Confirmar exclusão
function confirmDelete() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Remover usuário da lista
    const updatedUsers = users.filter(u => u.id !== currentUser.id);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // Limpar sessão
    localStorage.removeItem('currentUser');
    localStorage.removeItem('sessionTimeout');
    
    showMessage('Conta excluída com sucesso.', 'success');
    
    // Redirecionar para login
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
}

// Logout
function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('sessionTimeout');
    window.location.href = 'login.html';
}

// Configurar toggles de senha
function setupPasswordToggles() {
    const toggles = document.querySelectorAll('.toggle-password');
    
    toggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('.show-password');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.textContent = '🙈';
            } else {
                input.type = 'password';
                icon.textContent = '👁️';
            }
        });
    });
}

// Validação de senha
function validatePassword(password) {
    if (password.length < 10) {
        return { valid: false, message: 'A senha deve ter no mínimo 10 caracteres.' };
    }
    
    if (!/\d/.test(password)) {
        return { valid: false, message: 'A senha deve conter pelo menos um número.' };
    }
    
    if (!/[a-zA-Z]/.test(password)) {
        return { valid: false, message: 'A senha deve conter pelo menos uma letra.' };
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return { valid: false, message: 'A senha deve conter pelo menos um caractere especial.' };
    }
    
    return { valid: true };
}

// Hash de senha
async function hashPassword(password) {
    try {
        const salt = 'e2e_demo_salt_v1';
        const encoder = new TextEncoder();
        const data = encoder.encode(password + salt);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    } catch (e) {
        return btoa(password + 'salt_for_demo');
    }
}

// Mostrar mensagem
function showMessage(message, type) {
    const messageElement = document.getElementById('form-message');
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.className = `form-message ${type}`;
        messageElement.style.display = 'block';
        
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 5000);
    }
}
