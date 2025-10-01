# 🚀 Sistema de Deploy Automático - E2E Commerce

Este projeto agora possui **deploy automático** configurado! Sempre que você fizer mudanças, elas podem ser enviadas automaticamente para o GitHub e o site será atualizado.

## 📋 Opções Disponíveis

### 1. **Quick Deploy** (Mais Rápido) ⚡
- **Arquivo**: `quick-deploy.bat`
- **Como usar**: Duplo clique no arquivo
- **O que faz**: Commit + Push imediato
- **Ideal para**: Mudanças rápidas

### 2. **Auto Deploy** (Completo) 🔧
- **Arquivo**: `auto-deploy.bat` ou `auto-deploy.ps1`
- **Como usar**: Duplo clique no arquivo
- **O que faz**: Verifica mudanças + Commit + Push com timestamp
- **Ideal para**: Deploy controlado com verificações

### 3. **Watch & Deploy** (Monitoramento) 👁️
- **Arquivo**: `watch-and-deploy.ps1`
- **Como usar**: Clique direito → "Executar com PowerShell"
- **O que faz**: Monitora mudanças automaticamente a cada 30 segundos
- **Ideal para**: Desenvolvimento contínuo

## 🎯 Como Usar

### Opção 1: Deploy Rápido
```bash
# Simplesmente dê duplo clique em:
quick-deploy.bat
```

### Opção 2: Deploy Completo
```bash
# Duplo clique em qualquer um:
auto-deploy.bat
auto-deploy.ps1
```

### Opção 3: Monitoramento Contínuo
```powershell
# Clique direito em watch-and-deploy.ps1 → "Executar com PowerShell"
# Ou execute no terminal:
.\watch-and-deploy.ps1
```

## 🔄 Fluxo Automático

1. **Você faz mudanças** nos arquivos
2. **Script detecta** as mudanças
3. **Git add .** - Adiciona todos os arquivos
4. **Git commit** - Commit com timestamp automático
5. **Git push** - Envia para GitHub
6. **GitHub Actions** - Deploy automático para GitHub Pages
7. **Site atualizado** em 2-5 minutos

## 🌐 Links Importantes

- **Repositório**: https://github.com/jessicaalmeida21/E2E-commerce_grupo5
- **Site Live**: https://jessicaalmeida21.github.io/E2E-commerce_grupo5/
- **Servidor Local**: http://localhost:8000/E2E-commerce/

## ⚠️ Dicas Importantes

1. **Aguarde 2-5 minutos** após o push para ver mudanças online
2. **Use Quick Deploy** para mudanças simples
3. **Use Watch & Deploy** durante desenvolvimento ativo
4. **Pressione Ctrl+C** para parar o monitoramento
5. **Sempre teste localmente** antes do deploy

## 🛠️ Troubleshooting

### Se o deploy falhar:
1. Verifique sua conexão com internet
2. Confirme que está no diretório correto
3. Execute `git status` para ver o estado atual
4. Tente novamente com `auto-deploy.bat`

### Se o site não atualizar:
1. Aguarde mais alguns minutos
2. Limpe o cache do navegador (Ctrl+F5)
3. Verifique o GitHub Actions na aba "Actions" do repositório

## 🎉 Pronto!

Agora você tem **deploy automático** configurado! Suas mudanças serão enviadas automaticamente para o GitHub e o site será atualizado. 

**Escolha a opção que melhor se adapta ao seu fluxo de trabalho!**