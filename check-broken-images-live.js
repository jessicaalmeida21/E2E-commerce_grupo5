const fs = require('fs');
const https = require('https');

console.log('🔍 VERIFICANDO IMAGENS QUE NÃO ESTÃO ABRINDO');
console.log('============================================');

// Ler database.js
const databaseContent = fs.readFileSync('./js/database.js', 'utf8');

// Extrair todas as URLs de imagem
const imageUrls = [];
const imageRegex = /"image":\s*"(https:\/\/[^"]+)"/g;
let match;

while ((match = imageRegex.exec(databaseContent)) !== null) {
  imageUrls.push(match[1]);
}

console.log(`📊 Total de imagens encontradas: ${imageUrls.length}`);

// Obter imagens únicas
const uniqueImages = [...new Set(imageUrls)];
console.log(`📊 Imagens únicas: ${uniqueImages.length}`);

// Função para testar se uma imagem carrega
function testImageUrl(url) {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve({ url, status: 'timeout', error: 'Timeout após 15s' });
    }, 15000);

    const req = https.get(url, (res) => {
      clearTimeout(timeout);
      if (res.statusCode === 200) {
        resolve({ url, status: 'success', statusCode: res.statusCode });
      } else {
        resolve({ url, status: 'error', statusCode: res.statusCode, error: `HTTP ${res.statusCode}` });
      }
      res.destroy();
    });

    req.on('error', (error) => {
      clearTimeout(timeout);
      resolve({ url, status: 'error', error: error.message });
    });

    req.setTimeout(15000, () => {
      req.destroy();
    });
  });
}

// Testar todas as imagens únicas
async function checkBrokenImages() {
  console.log('\n🔄 Testando todas as imagens...');
  
  const brokenImages = [];
  const workingImages = [];
  
  for (let i = 0; i < uniqueImages.length; i++) {
    const url = uniqueImages[i];
    const imageId = url.split('/').pop().split('?')[0];
    
    process.stdout.write(`[${i + 1}/${uniqueImages.length}] ${imageId}... `);
    
    const result = await testImageUrl(url);
    
    if (result.status === 'success') {
      workingImages.push(result);
      console.log('✅ OK');
    } else {
      brokenImages.push(result);
      console.log(`❌ ERRO: ${result.error || result.statusCode}`);
    }
  }
  
  console.log('\n📊 RESULTADOS:');
  console.log('===============');
  console.log(`✅ Imagens funcionando: ${workingImages.length}`);
  console.log(`❌ Imagens quebradas: ${brokenImages.length}`);
  console.log(`📈 Taxa de sucesso: ${((workingImages.length / uniqueImages.length) * 100).toFixed(1)}%`);
  
  if (brokenImages.length > 0) {
    console.log('\n❌ IMAGENS QUE NÃO ESTÃO ABRINDO:');
    console.log('=================================');
    brokenImages.forEach((img, index) => {
      console.log(`${index + 1}. ${img.url}`);
      console.log(`   Erro: ${img.error || img.statusCode}`);
      console.log('');
    });
    
    // Encontrar produtos afetados
    console.log('🔍 PRODUTOS AFETADOS POR IMAGENS QUEBRADAS:');
    console.log('==========================================');
    
    const categories = ['smartphones', 'notebooks', 'televisoes', 'audio', 'calcados', 'roupas', 'eletrodomesticos', 'esportes', 'monitores', 'relogios'];
    let affectedProducts = 0;
    
    categories.forEach(category => {
      const categoryRegex = new RegExp(`"${category}":\\s*\\[([\\s\\S]*?)\\](?=\\s*[,}])`, 'i');
      const categoryMatch = databaseContent.match(categoryRegex);
      
      if (categoryMatch) {
        const categoryContent = categoryMatch[1];
        const productRegex = /\\{[^}]*?"title":\\s*"([^"]+)"[^}]*?"image":\\s*"([^"]+)"[^}]*?\\}/g;
        let match;
        
        while ((match = productRegex.exec(categoryContent)) !== null) {
          const title = match[1];
          const image = match[2];
          
          // Verificar se esta imagem está na lista de quebradas
          const isBroken = brokenImages.some(broken => broken.url === image);
          if (isBroken) {
            console.log(`  📱 ${title} (${category})`);
            console.log(`     Imagem: ${image.split('/').pop()}`);
            affectedProducts++;
          }
        }
      }
    });
    
    console.log(`\n📊 Total de produtos afetados: ${affectedProducts}`);
    
    // Salvar relatório
    const report = {
      timestamp: new Date().toISOString(),
      totalImages: uniqueImages.length,
      workingImages: workingImages.length,
      brokenImages: brokenImages.length,
      successRate: ((workingImages.length / uniqueImages.length) * 100).toFixed(1),
      brokenImagesList: brokenImages,
      affectedProductsCount: affectedProducts
    };
    
    fs.writeFileSync('broken-images-report.json', JSON.stringify(report, null, 2));
    console.log('\n📄 Relatório salvo em: broken-images-report.json');
    
  } else {
    console.log('\n🎉 TODAS AS IMAGENS ESTÃO FUNCIONANDO PERFEITAMENTE!');
  }
  
  return brokenImages;
}

// Executar verificação
checkBrokenImages().catch(console.error);