// Script para forçar atualização do cache
console.log('🔄 Forçando atualização do cache...');

// Limpar cache do localStorage
if (typeof localStorage !== 'undefined') {
    localStorage.clear();
    console.log('✅ LocalStorage limpo');
}

// Limpar cache do sessionStorage
if (typeof sessionStorage !== 'undefined') {
    sessionStorage.clear();
    console.log('✅ SessionStorage limpo');
}

// Forçar reload da página sem cache
if (typeof window !== 'undefined') {
    console.log('🔄 Recarregando página sem cache...');
    window.location.reload(true);
}

// Timestamp para forçar nova versão
const timestamp = new Date().getTime();
console.log(`⏰ Timestamp de atualização: ${timestamp}`);

// Adicionar timestamp aos scripts
document.addEventListener('DOMContentLoaded', function() {
    const scripts = document.querySelectorAll('script[src]');
    scripts.forEach(script => {
        if (script.src.includes('database.js') || script.src.includes('catalog.js')) {
            const newSrc = script.src.split('?')[0] + '?v=' + timestamp;
            script.src = newSrc;
            console.log(`🔄 Script atualizado: ${newSrc}`);
        }
    });
});