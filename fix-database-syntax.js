// Script para corrigir erros de sintaxe no database.js
const fs = require('fs');

function fixDatabaseSyntax() {
    try {
        console.log('🔧 Corrigindo erros de sintaxe no database.js...');
        
        const databasePath = './js/database.js';
        let content = fs.readFileSync(databasePath, 'utf8');
        
        // Backup antes da correção
        const backupPath = `./js/database-backup-syntax-fix-${Date.now()}.js`;
        fs.writeFileSync(backupPath, content, 'utf8');
        console.log(`💾 Backup criado: ${backupPath}`);
        
        let fixCount = 0;
        
        // Corrigir aspas duplas extras em titles
        const titleRegex = /"title": "([^"]+)""/g;
        content = content.replace(titleRegex, (match, title) => {
            fixCount++;
            return `"title": "${title}",`;
        });
        
        // Corrigir aspas duplas extras em descriptions
        const descRegex = /"description": "([^"]+)"" com/g;
        content = content.replace(descRegex, (match, desc) => {
            fixCount++;
            return `"description": "${desc} com`;
        });
        
        // Corrigir outras possíveis aspas duplas extras
        const generalRegex = /: "([^"]+)""/g;
        content = content.replace(generalRegex, (match, value) => {
            fixCount++;
            return `: "${value}"`;
        });
        
        // Salvar arquivo corrigido
        fs.writeFileSync(databasePath, content, 'utf8');
        
        console.log(`✅ Correções aplicadas: ${fixCount}`);
        console.log(`📁 Arquivo corrigido: ${databasePath}`);
        
        // Testar se o arquivo está válido
        try {
            delete require.cache[require.resolve(databasePath)];
            const db = require(databasePath);
            const products = db.getAllProducts();
            console.log(`🎉 Database válido! Total de produtos: ${products.length}`);
            return { success: true, fixCount, totalProducts: products.length };
        } catch (testError) {
            console.error('❌ Ainda há erros no database:', testError.message);
            return { success: false, error: testError.message };
        }
        
    } catch (error) {
        console.error('❌ Erro ao corrigir sintaxe:', error);
        return { success: false, error: error.message };
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    fixDatabaseSyntax();
}

module.exports = { fixDatabaseSyntax };