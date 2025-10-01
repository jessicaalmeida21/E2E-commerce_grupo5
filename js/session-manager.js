// Gerenciador de Sessão - Sistema de Timeout Automático
// Este arquivo deve ser incluído em todas as páginas que requerem autenticação

class SessionManager {
    constructor() {
        this.timeoutDuration = 30 * 60 * 1000; // 30 minutos em millisegundos
        this.warningTime = 5 * 60 * 1000; // Avisar 5 minutos antes
        this.checkInterval = 60 * 1000; // Verificar a cada minuto
        this.warningShown = false;
        
        this.init();
    }
    
    init() {
        // Verificar se há usuário logado
        if (!this.isUserLoggedIn()) {
            return;
        }
        
        // Iniciar verificação periódica
        this.startPeriodicCheck();
        
        // Adicionar listeners para atividade do usuário
        this.addActivityListeners();
        
        console.log('🔐 SessionManager inicializado - Timeout: 30 minutos');
    }
    
    isUserLoggedIn() {
        return localStorage.getItem('currentUser') !== null;
    }
    
    getCurrentUser() {
        const userStr = localStorage.getItem('currentUser');
        return userStr ? JSON.parse(userStr) : null;
    }
    
    getSessionTimeout() {
        const timeout = localStorage.getItem('sessionTimeout');
        return timeout ? parseInt(timeout, 10) : null;
    }
    
    renewSession() {
        if (!this.isUserLoggedIn()) {
            return;
        }
        
        const newTimeout = Date.now() + this.timeoutDuration;
        localStorage.setItem('sessionTimeout', newTimeout.toString());
        localStorage.setItem('sessionStartTime', Date.now().toString());
        
        // Reset warning flag
        this.warningShown = false;
        
        console.log('🔄 Sessão renovada - Novo timeout:', new Date(newTimeout).toLocaleTimeString());
    }
    
    checkSessionTimeout() {
        if (!this.isUserLoggedIn()) {
            return;
        }
        
        const timeout = this.getSessionTimeout();
        if (!timeout) {
            // Se não há timeout definido, criar um novo
            this.renewSession();
            return;
        }
        
        const now = Date.now();
        const timeRemaining = timeout - now;
        
        // Verificar se a sessão expirou
        if (timeRemaining <= 0) {
            this.expireSession();
            return;
        }
        
        // Mostrar aviso se restam 5 minutos ou menos
        if (timeRemaining <= this.warningTime && !this.warningShown) {
            this.showTimeoutWarning(Math.ceil(timeRemaining / 60000)); // minutos restantes
        }
    }
    
    showTimeoutWarning(minutesRemaining) {
        this.warningShown = true;
        
        const message = `Sua sessão expirará em ${minutesRemaining} minuto(s). Deseja continuar?`;
        
        if (confirm(message)) {
            this.renewSession();
            console.log('✅ Sessão renovada pelo usuário');
        } else {
            console.log('❌ Usuário optou por não renovar a sessão');
        }
    }
    
    expireSession() {
        console.log('⏰ Sessão expirada por inatividade');
        
        const user = this.getCurrentUser();
        const userName = user ? user.name : 'Usuário';
        
        // Limpar dados da sessão
        localStorage.removeItem('currentUser');
        localStorage.removeItem('sessionTimeout');
        localStorage.removeItem('sessionStartTime');
        
        // Mostrar mensagem e redirecionar
        alert(`Olá ${userName}! Sua sessão expirou por inatividade (30 minutos). Por favor, faça login novamente.`);
        
        // Redirecionar para página de login
        this.redirectToLogin();
    }
    
    redirectToLogin() {
        try {
            // Verificar se estamos na pasta pages
            if (window.location.pathname.includes('/pages/')) {
                window.location.href = './login.html';
            } else {
                window.location.href = './pages/login.html';
            }
        } catch (error) {
            console.error('Erro ao redirecionar para login:', error);
            window.location.href = '/pages/login.html';
        }
    }
    
    startPeriodicCheck() {
        // Verificar imediatamente
        this.checkSessionTimeout();
        
        // Configurar verificação periódica
        setInterval(() => {
            this.checkSessionTimeout();
        }, this.checkInterval);
    }
    
    addActivityListeners() {
        const events = ['click', 'keypress', 'scroll', 'mousemove', 'touchstart'];
        
        events.forEach(event => {
            document.addEventListener(event, () => {
                this.onUserActivity();
            }, { passive: true });
        });
    }
    
    onUserActivity() {
        if (!this.isUserLoggedIn()) {
            return;
        }
        
        // Renovar sessão apenas se passou mais de 1 minuto desde a última renovação
        const lastActivity = localStorage.getItem('sessionStartTime');
        if (lastActivity) {
            const timeSinceLastActivity = Date.now() - parseInt(lastActivity, 10);
            if (timeSinceLastActivity > 60000) { // 1 minuto
                this.renewSession();
            }
        }
    }
    
    // Método público para logout manual
    logout() {
        console.log('🚪 Logout manual executado');
        
        // Limpar dados da sessão
        localStorage.removeItem('currentUser');
        localStorage.removeItem('sessionTimeout');
        localStorage.removeItem('sessionStartTime');
        
        // Redirecionar para login
        this.redirectToLogin();
    }
    
    // Método para obter informações da sessão
    getSessionInfo() {
        if (!this.isUserLoggedIn()) {
            return null;
        }
        
        const timeout = this.getSessionTimeout();
        const startTime = localStorage.getItem('sessionStartTime');
        
        return {
            user: this.getCurrentUser(),
            timeoutAt: timeout ? new Date(timeout) : null,
            startedAt: startTime ? new Date(parseInt(startTime, 10)) : null,
            timeRemaining: timeout ? Math.max(0, timeout - Date.now()) : 0
        };
    }
}

// Inicializar o gerenciador de sessão automaticamente
const sessionManager = new SessionManager();

// Exportar para uso global
window.sessionManager = sessionManager;

// Função global para logout (compatibilidade)
function logout() {
    sessionManager.logout();
}

console.log('🔐 Session Manager carregado e ativo');