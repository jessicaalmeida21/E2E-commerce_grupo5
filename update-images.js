const fs = require('fs');

// Banco de imagens específicas por categoria
const categoryImages = {
  smartphones: [
    'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop&auto=format', // iPhone 15
    'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop&auto=format', // Samsung Galaxy
    'https://images.unsplash.com/photo-1663781292073-d7198d04c0c3?w=400&h=400&fit=crop&auto=format', // iPhone 14
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop&auto=format', // Google Pixel
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&auto=format', // OnePlus
    'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop&auto=format', // Xiaomi
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop&auto=format', // Smartphone moderno
    'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop&auto=format', // iPhone preto
    'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=400&h=400&fit=crop&auto=format', // Smartphone branco
    'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&h=400&fit=crop&auto=format', // Smartphone azul
  ],
  
  notebooks: [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&auto=format', // MacBook
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&auto=format', // Laptop moderno
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop&auto=format', // Dell/HP
    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop&auto=format', // ASUS
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop&auto=format', // Lenovo
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=400&fit=crop&auto=format', // Gaming laptop
    'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400&h=400&fit=crop&auto=format', // Ultrabook
    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=400&fit=crop&auto=format', // Surface
    'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&h=400&fit=crop&auto=format', // MacBook Air
    'https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=400&h=400&fit=crop&auto=format', // Laptop prateado
  ],
  
  eletronicos: [
    'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&auto=format', // TV moderna
    'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop&auto=format', // Smart TV
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&auto=format', // TV Samsung
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format', // TV LG
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&auto=format', // TV Sony
    'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=400&h=400&fit=crop&auto=format', // TV 4K
    'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&h=400&fit=crop&auto=format', // Smart TV wall
    'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=400&h=400&fit=crop&auto=format', // TV moderna sala
    'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=400&fit=crop&auto=format', // TV grande
    'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop&auto=format', // TV curva
  ],
  
  fones: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format', // Headphones
    'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=400&fit=crop&auto=format', // Fones Bluetooth
    'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=400&fit=crop&auto=format', // Earbuds
    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop&auto=format', // Fones gaming
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop&auto=format', // AirPods
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop&auto=format', // Headphones studio
    'https://images.unsplash.com/photo-1558756520-22cfe5d382ca?w=400&h=400&fit=crop&auto=format', // Fones pretos
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop&auto=format', // Wireless earbuds
    'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=400&h=400&fit=crop&auto=format', // Fones coloridos
    'https://images.unsplash.com/photo-1577174881658-0f30ed549adc?w=400&h=400&fit=crop&auto=format', // Fones premium
  ],
  
  moda: [
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&auto=format', // Tênis Nike
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&auto=format', // Sapatos
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop&auto=format', // Tênis Adidas
    'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop&auto=format', // Sapatos sociais
    'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=400&fit=crop&auto=format', // Tênis casual
    'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=400&h=400&fit=crop&auto=format', // Botas
    'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop&auto=format', // Sandálias
    'https://images.unsplash.com/photo-1520256862855-398228c41684?w=400&h=400&fit=crop&auto=format', // Sapatos femininos
    'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop&auto=format', // Tênis esportivo
    'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=400&h=400&fit=crop&auto=format', // Calçados diversos
  ],
  
  casa: [
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&auto=format', // Sofá moderno
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop&auto=format', // Mesa de jantar
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&auto=format', // Cadeira design
    'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop&auto=format', // Cama box
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop&auto=format', // Guarda-roupa
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&auto=format', // Estante
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop&auto=format', // Mesa centro
    'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop&auto=format', // Poltrona
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&auto=format', // Rack TV
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop&auto=format', // Cômoda
  ],
  
  esportes: [
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&auto=format', // Bicicleta
    'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop&auto=format', // Equipamentos
    'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&auto=format', // Bola futebol
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&auto=format', // Tênis corrida
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format', // Academia
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&auto=format', // Natação
    'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop&auto=format', // Basquete
    'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop&auto=format', // Vôlei
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&auto=format', // Tênis
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format', // Fitness
  ],
  
  relogios: [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&auto=format', // Relógio clássico
    'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop&auto=format', // Smartwatch
    'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=400&h=400&fit=crop&auto=format', // Relógio luxo
    'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=400&h=400&fit=crop&auto=format', // Apple Watch
    'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=400&h=400&fit=crop&auto=format', // Relógio esportivo
    'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=400&h=400&fit=crop&auto=format', // Relógio digital
    'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=400&h=400&fit=crop&auto=format', // Relógio feminino
    'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&h=400&fit=crop&auto=format', // Relógio vintage
    'https://images.unsplash.com/photo-1627989580309-bfaf3e58af6f?w=400&h=400&fit=crop&auto=format', // Relógio moderno
    'https://images.unsplash.com/photo-1639006570490-2d7c4c27cb6d?w=400&h=400&fit=crop&auto=format', // Relógio premium
  ]
};

console.log('🔄 ATUALIZANDO IMAGENS DO E2E-COMMERCE');
console.log('=====================================');

// Ler o arquivo database.js
let databaseContent = fs.readFileSync('./js/database.js', 'utf8');

// Função para obter imagem aleatória de uma categoria
function getRandomImageFromCategory(category, usedImages = new Set()) {
  const images = categoryImages[category] || categoryImages.smartphones;
  const availableImages = images.filter(img => !usedImages.has(img));
  
  if (availableImages.length === 0) {
    // Se todas as imagens da categoria foram usadas, reinicia
    return images[Math.floor(Math.random() * images.length)];
  }
  
  const selectedImage = availableImages[Math.floor(Math.random() * availableImages.length)];
  usedImages.add(selectedImage);
  return selectedImage;
}

// Mapear categorias do database para nossas categorias de imagens
const categoryMapping = {
  'smartphones': 'smartphones',
  'notebooks': 'notebooks',
  'televisoes': 'eletronicos',
  'audio': 'fones',
  'calcados': 'moda',
  'roupas': 'moda',
  'eletrodomesticos': 'casa',
  'esportes': 'esportes',
  'monitores': 'eletronicos',
  'relogios': 'relogios'
};

let updatedCount = 0;
const usedImages = new Set();

// Processar cada categoria
Object.keys(categoryMapping).forEach(dbCategory => {
  const imageCategory = categoryMapping[dbCategory];
  console.log(`\n📱 Processando categoria: ${dbCategory}`);
  
  // Encontrar a seção da categoria no database
  const categoryRegex = new RegExp(`"${dbCategory}":\\s*\\[([\\s\\S]*?)\\](?=\\s*[,}])`, 'i');
  const categoryMatch = databaseContent.match(categoryRegex);
  
  if (categoryMatch) {
    let categoryContent = categoryMatch[1];
    let productCount = 0;
    
    // Substituir cada imagem na categoria
    categoryContent = categoryContent.replace(/"image":\s*"([^"]+)"/g, (match, oldUrl) => {
      const newImage = getRandomImageFromCategory(imageCategory, usedImages);
      productCount++;
      updatedCount++;
      return `"image": "${newImage}"`;
    });
    
    // Substituir a categoria inteira no database
    databaseContent = databaseContent.replace(categoryMatch[0], 
      `"${dbCategory}": [${categoryContent}]`);
    
    console.log(`  ✅ ${productCount} produtos atualizados`);
  } else {
    console.log(`  ⚠️  Categoria não encontrada: ${dbCategory}`);
  }
});

// Salvar o arquivo atualizado
fs.writeFileSync('./js/database.js', databaseContent);

console.log(`\n🎉 ATUALIZAÇÃO CONCLUÍDA!`);
console.log(`📊 Total de produtos atualizados: ${updatedCount}`);
console.log(`🎯 Imagens únicas utilizadas: ${usedImages.size}`);
console.log(`📈 Nova taxa de diversidade estimada: ${((usedImages.size / updatedCount) * 100).toFixed(1)}%`);

console.log('\n✅ Arquivo database.js atualizado com sucesso!');