// Script para gerenciar a página de contato
document.addEventListener('DOMContentLoaded', function() {
    setupContactForm();
});

// Configurar formulário de contato
function setupContactForm() {
    const form = document.getElementById('contact-form');
    
    if (form) {
        form.addEventListener('submit', handleContactForm);
    }
}

// Processar formulário de contato
function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };
    
    // Validar dados
    if (!validateContactForm(data)) {
        return;
    }
    
    // Simular envio
    simulateFormSubmission(data);
}

// Validar formulário
function validateContactForm(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Nome deve ter pelo menos 2 caracteres');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('E-mail inválido');
    }
    
    if (!data.subject) {
        errors.push('Selecione um assunto');
    }
    
    if (!data.message || data.message.trim().length < 10) {
        errors.push('Mensagem deve ter pelo menos 10 caracteres');
    }
    
    if (errors.length > 0) {
        showNotification(errors.join('<br>'), 'error');
        return false;
    }
    
    return true;
}

// Validar e-mail
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Simular envio do formulário
function simulateFormSubmission(data) {
    const submitBtn = document.querySelector('#contact-form button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Mostrar loading
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;
    
    // Simular delay
    setTimeout(() => {
        // Simular sucesso
        showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
        
        // Limpar formulário
        document.getElementById('contact-form').reset();
        
        // Restaurar botão
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Log dos dados (em produção seria enviado para servidor)
        console.log('Dados do contato:', data);
        
    }, 2000);
}

// Mostrar notificação
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}
