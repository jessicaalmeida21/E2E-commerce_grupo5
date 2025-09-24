// Script para gerenciar usuários
document.addEventListener('DOMContentLoaded', function() {
    initializeUsersPage();
});

let users = [];
let filteredUsers = [];
let currentUser = null;
let isEditing = false;

// Inicializar página de usuários
function initializeUsersPage() {
    // Verificar se usuário está logado e é admin
    checkUserPermissions();
    
    // Carregar usuários
    loadUsers();
    
    // Configurar event listeners
    setupEventListeners();
    
    // Configurar header
    setupHeader();
}

// Verificar permissões do usuário
function checkUserPermissions() {
    const currentUserData = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUserData) {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = '../pages/login.html';
        return;
    }
    
    // Apenas vendedores podem gerenciar usuários
    if (currentUserData.profile !== 'seller') {
        alert('Você não tem permissão para acessar esta página.');
        window.location.href = '../index.html';
        return;
    }
    
    currentUser = currentUserData;
}

// Carregar usuários do localStorage
function loadUsers() {
    users = JSON.parse(localStorage.getItem('users')) || [];
    filteredUsers = [...users];
    displayUsers();
}

// Exibir usuários na tabela
function displayUsers() {
    const usersList = document.getElementById('users-list');
    const emptyState = document.getElementById('empty-users');
    
    if (filteredUsers.length === 0) {
        usersList.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    usersList.innerHTML = '';
    
    filteredUsers.forEach(user => {
        const row = createUserRow(user);
        usersList.appendChild(row);
    });
}

// Criar linha da tabela para usuário
function createUserRow(user) {
    const row = document.createElement('tr');
    
    const statusClass = user.status === 'active' ? 'active' : 'inactive';
    const profileClass = user.profile === 'seller' ? 'seller' : 'customer';
    const profileText = user.profile === 'seller' ? 'Vendedor' : 'Cliente';
    
    const createdAt = new Date(user.createdAt).toLocaleDateString('pt-BR');
    
    row.innerHTML = `
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td><span class="profile-badge ${profileClass}">${profileText}</span></td>
        <td><span class="status-badge ${statusClass}">${user.status === 'active' ? 'Ativo' : 'Inativo'}</span></td>
        <td>${createdAt}</td>
        <td>
            <div class="actions">
                <button class="action-btn view" onclick="viewUser('${user.id}')" title="Visualizar">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn edit" onclick="editUser('${user.id}')" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="deleteUser('${user.id}')" title="Excluir">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;
    
    return row;
}

// Configurar event listeners
function setupEventListeners() {
    // Botão adicionar usuário
    document.getElementById('add-user-btn').addEventListener('click', () => {
        openUserModal();
    });
    
    // Fechar modal
    document.getElementById('close-modal').addEventListener('click', closeUserModal);
    document.getElementById('cancel-btn').addEventListener('click', closeUserModal);
    
    // Fechar modal de exclusão
    document.getElementById('close-delete-modal').addEventListener('click', closeDeleteModal);
    document.getElementById('cancel-delete-btn').addEventListener('click', closeDeleteModal);
    
    // Formulário de usuário
    document.getElementById('user-form').addEventListener('submit', handleUserSubmit);
    
    // Busca
    document.getElementById('search-users').addEventListener('input', filterUsers);
    document.getElementById('search-btn').addEventListener('click', filterUsers);
    
    // Filtros
    document.getElementById('profile-filter').addEventListener('change', filterUsers);
    document.getElementById('status-filter').addEventListener('change', filterUsers);
    
    // Fechar modal clicando fora
    document.getElementById('user-modal').addEventListener('click', (e) => {
        if (e.target.id === 'user-modal') {
            closeUserModal();
        }
    });
    
    document.getElementById('delete-modal').addEventListener('click', (e) => {
        if (e.target.id === 'delete-modal') {
            closeDeleteModal();
        }
    });
}

// Configurar header
function setupHeader() {
    const userNameHeader = document.getElementById('user-name-header');
    const logoutBtn = document.getElementById('logout-btn-header');
    
    if (userNameHeader) {
        userNameHeader.textContent = currentUser.name;
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}

// Abrir modal de usuário
function openUserModal(userId = null) {
    const modal = document.getElementById('user-modal');
    const modalTitle = document.getElementById('modal-title');
    const form = document.getElementById('user-form');
    const statusGroup = document.getElementById('status-group');
    
    // Limpar formulário
    form.reset();
    clearErrors();
    
    if (userId) {
        // Editar usuário existente
        const user = users.find(u => u.id === userId);
        if (user) {
            isEditing = true;
            modalTitle.textContent = 'Editar Usuário';
            statusGroup.style.display = 'block';
            
            // Preencher formulário
            document.getElementById('user-name').value = user.name;
            document.getElementById('user-email').value = user.email;
            document.getElementById('user-profile').value = user.profile;
            document.getElementById('user-status').value = user.status || 'active';
            
            // Senha não é obrigatória na edição
            document.getElementById('user-password').required = false;
            document.getElementById('user-confirm-password').required = false;
            
            // Armazenar ID do usuário sendo editado
            form.dataset.userId = userId;
        }
    } else {
        // Novo usuário
        isEditing = false;
        modalTitle.textContent = 'Novo Usuário';
        statusGroup.style.display = 'none';
        
        // Senha é obrigatória para novo usuário
        document.getElementById('user-password').required = true;
        document.getElementById('user-confirm-password').required = true;
        
        delete form.dataset.userId;
    }
    
    modal.classList.add('show');
}

// Fechar modal de usuário
function closeUserModal() {
    const modal = document.getElementById('user-modal');
    modal.classList.remove('show');
    isEditing = false;
}

// Abrir modal de exclusão
function deleteUser(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    const modal = document.getElementById('delete-modal');
    const userName = document.getElementById('delete-user-name');
    
    userName.textContent = user.name;
    modal.dataset.userId = userId;
    modal.classList.add('show');
}

// Fechar modal de exclusão
function closeDeleteModal() {
    const modal = document.getElementById('delete-modal');
    modal.classList.remove('show');
    delete modal.dataset.userId;
}

// Visualizar usuário
function viewUser(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    // Por enquanto, apenas abrir modal de edição em modo somente leitura
    openUserModal(userId);
    
    // Desabilitar campos para visualização
    const form = document.getElementById('user-form');
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.disabled = true;
    });
    
    // Alterar botão para fechar
    const saveBtn = document.getElementById('save-btn');
    saveBtn.textContent = 'Fechar';
    saveBtn.type = 'button';
    saveBtn.onclick = closeUserModal;
}

// Editar usuário
function editUser(userId) {
    openUserModal(userId);
}

// Confirmar exclusão
document.getElementById('confirm-delete-btn').addEventListener('click', function() {
    const modal = document.getElementById('delete-modal');
    const userId = modal.dataset.userId;
    
    if (userId) {
        // Remover usuário
        users = users.filter(u => u.id !== userId);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Recarregar lista
        loadUsers();
        
        // Fechar modal
        closeDeleteModal();
        
        showNotification('Usuário excluído com sucesso!', 'success');
    }
});

// Filtrar usuários
function filterUsers() {
    const searchTerm = document.getElementById('search-users').value.toLowerCase();
    const profileFilter = document.getElementById('profile-filter').value;
    const statusFilter = document.getElementById('status-filter').value;
    
    filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm) || 
                            user.email.toLowerCase().includes(searchTerm);
        const matchesProfile = !profileFilter || user.profile === profileFilter;
        const matchesStatus = !statusFilter || (user.status || 'active') === statusFilter;
        
        return matchesSearch && matchesProfile && matchesStatus;
    });
    
    displayUsers();
}

// Validar senha
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

// Hash da senha
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

// Limpar erros
function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
    });
}

// Mostrar erro
function showError(fieldId, message) {
    const errorElement = document.getElementById(fieldId);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

// Lidar com envio do formulário
async function handleUserSubmit(e) {
    e.preventDefault();
    
    clearErrors();
    
    const formData = {
        name: document.getElementById('user-name').value.trim(),
        email: document.getElementById('user-email').value.trim(),
        password: document.getElementById('user-password').value,
        confirmPassword: document.getElementById('user-confirm-password').value,
        profile: document.getElementById('user-profile').value,
        status: document.getElementById('user-status').value || 'active'
    };
    
    let hasError = false;
    
    // Validar nome
    if (!formData.name) {
        showError('name-error', 'Nome é obrigatório');
        hasError = true;
    }
    
    // Validar email
    if (!formData.email) {
        showError('email-error', 'E-mail é obrigatório');
        hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        showError('email-error', 'E-mail inválido');
        hasError = true;
    } else {
        // Verificar se email já existe (exceto para o usuário sendo editado)
        const existingUser = users.find(u => u.email === formData.email && u.id !== formData.userId);
        if (existingUser) {
            showError('email-error', 'Este e-mail já está em uso');
            hasError = true;
        }
    }
    
    // Validar senha
    if (!isEditing || formData.password) {
        if (!formData.password) {
            showError('password-error', 'Senha é obrigatória');
            hasError = true;
        } else {
            const passwordValidation = validatePassword(formData.password);
            if (!passwordValidation.valid) {
                showError('password-error', passwordValidation.message);
                hasError = true;
            }
        }
        
        if (formData.password !== formData.confirmPassword) {
            showError('confirm-password-error', 'As senhas não coincidem');
            hasError = true;
        }
    }
    
    // Validar perfil
    if (!formData.profile) {
        showError('profile-error', 'Perfil é obrigatório');
        hasError = true;
    }
    
    if (hasError) {
        return;
    }
    
    try {
        if (isEditing) {
            // Editar usuário existente
            const userId = document.getElementById('user-form').dataset.userId;
            const userIndex = users.findIndex(u => u.id === userId);
            
            if (userIndex !== -1) {
                users[userIndex].name = formData.name;
                users[userIndex].email = formData.email;
                users[userIndex].profile = formData.profile;
                users[userIndex].status = formData.status;
                users[userIndex].updatedAt = new Date().toISOString();
                
                // Atualizar senha se fornecida
                if (formData.password) {
                    users[userIndex].password = await hashPassword(formData.password);
                }
                
                localStorage.setItem('users', JSON.stringify(users));
                loadUsers();
                closeUserModal();
                showNotification('Usuário atualizado com sucesso!', 'success');
            }
        } else {
            // Criar novo usuário
            const newUser = {
                id: Date.now().toString(),
                name: formData.name,
                email: formData.email,
                password: await hashPassword(formData.password),
                profile: formData.profile,
                status: 'active',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            loadUsers();
            closeUserModal();
            showNotification('Usuário criado com sucesso!', 'success');
        }
    } catch (error) {
        console.error('Erro ao salvar usuário:', error);
        showNotification('Erro ao salvar usuário. Tente novamente.', 'error');
    }
}

// Logout
function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('sessionTimeout');
    window.location.href = '../pages/login.html';
}

// Mostrar notificação
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 1001;
        opacity: 0;
        transition: opacity 0.3s ease;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 100);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}
