# 🛒 E2E-Commerce

Um sistema completo de e-commerce desenvolvido com HTML, CSS e JavaScript vanilla, seguindo as melhores práticas de desenvolvimento web.

## 🚀 Funcionalidades

### 🔐 Sistema de Autenticação
- **Login e Registro**: Validação de senha forte (mínimo 10 caracteres, incluindo números, letras e caracteres especiais)
- **Perfis de Usuário**: Cliente e Vendedor
- **Armazenamento**: LocalStorage para persistência de dados
- **Criptografia**: Simulação de criptografia de senhas
- **Sessão**: Timeout automático de 30 minutos

### 👤 Perfil do Usuário
- **Edição de Perfil**: Nome, email, senha
- **Validações**: Email único, senha forte
- **Exclusão de Conta**: Modal de confirmação e limpeza completa de dados

### 🛍️ Gestão de Produtos (Administrador)
- **Acesso Restrito**: Apenas usuários com perfil "Vendedor"
- **Funcionalidades**: Visualização, busca, filtros, ordenação e paginação
- **Gestão de Estoque**: Aumento de estoque com validação

### 🎨 Interface e Experiência do Usuário
- **Design Responsivo**: Mobile First com breakpoints: 480px, 768px, 992px, 1200px
- **Navegação Dinâmica**: Header inteligente baseado no status de login
- **Notificações**: Sistema de alertas com auto-dismiss (3 segundos)

### 🛒 Funcionalidades de E-commerce
- **Catálogo de Produtos**: 500+ produtos organizados por categorias
- **Carrinho de Compras**: Contador visual e persistência entre sessões
- **Sistema de Busca**: Busca por nome e filtros por categoria

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Estilos modernos e responsivos
- **JavaScript ES6+**: Funcionalidades interativas
- **LocalStorage**: Persistência de dados
- **Responsive Design**: Mobile-first approach
- **Unsplash API**: Imagens de alta qualidade (500+ imagens)

## 📁 Estrutura do Projeto

```
E2E-commerce/
├── index.html              # Página inicial
├── pages/
│   ├── login.html          # Login e registro
│   ├── admin.html          # Gestão de produtos
│   ├── profile.html        # Perfil do usuário
│   ├── cart.html           # Carrinho de compras
│   ├── catalog.html        # Catálogo de produtos
│   ├── checkout.html       # Finalização de compra
│   └── ...                 # Outras páginas
├── css/
│   ├── styles.css          # Estilos principais
│   ├── responsive.css      # Estilos responsivos
│   ├── login.css          # Estilos do login
│   ├── admin.css          # Estilos da administração
│   └── profile.css        # Estilos do perfil
├── js/
│   ├── main.js            # Funcionalidades principais
│   ├── products.js        # Dados e gestão de produtos
│   ├── database.js        # Base de dados (500+ produtos)
│   ├── login.js           # Autenticação
│   ├── admin.js           # Administração
│   ├── cart.js            # Carrinho de compras
│   └── profile.js         # Gestão de perfil
├── images/                # Recursos visuais
├── 500-images-database.json # Base de imagens Unsplash
├── FUNCIONALIDADES.md     # Documentação completa
└── README.md              # Este arquivo
```

## 🚀 Como Executar

### Pré-requisitos
- Python 3.x instalado
- Navegador web moderno (Chrome, Firefox, Safari, Edge)

### Instalação e Execução

1. **Inicie o servidor local**
   ```bash
   python -m http.server 8000
   ```

2. **Acesse no navegador**
   ```
   http://localhost:8000
   ```

3. **Registrar**: Criar conta como Cliente ou Vendedor
4. **Navegar**: Explorar produtos e funcionalidades
5. **Administrar**: (Vendedores) Acessar gestão de produtos

## 📱 Compatibilidade

- **Navegadores**: Chrome, Firefox, Safari, Edge
- **Dispositivos**: Desktop, Tablet, Mobile
- **Resoluções**: 320px até 1920px+
- **Breakpoints**: 480px, 768px, 992px, 1200px

## 🎯 Padrões de Código

- **Modularização**: Separação de responsabilidades
- **Validações**: Client-side para melhor UX
- **Segurança**: Validação de dados e sanitização
- **Acessibilidade**: Estrutura semântica e navegação por teclado
- **LinkedIn**: [Seu LinkedIn](https://linkedin.com/in/seu-perfil)

## 🙏 Agradecimentos

- Mercado Livre pelas imagens dos produtos
- Comunidade open source pelas inspirações
- Todos os contribuidores do projeto

---

⭐ **Se este projeto foi útil para você, considere dar uma estrela!** ⭐