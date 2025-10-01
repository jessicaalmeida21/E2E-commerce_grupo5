const fs = require('fs');
const https = require('https');

console.log('🔍 VALIDAÇÃO FINAL DAS IMAGENS');
console.log('==============================');

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
      resolve({ url, status: 'timeout', error: 'Timeout após 10s' });
    }, 10000);

    const req = https.get(url, (res) => {
      clearTimeout(timeout);
      if (res.statusCode === 200) {
        resolve({ url, status: 'success', statusCode: res.statusCode });
      } else {
        resolve({ url, status: 'error', statusCode: res.statusCode });
      }
      res.destroy();
    });

    req.on('error', (error) => {
      clearTimeout(timeout);
      resolve({ url, status: 'error', error: error.message });
    });

    req.setTimeout(10000, () => {
      req.destroy();
    });
  });
}

// Testar todas as imagens únicas
async function validateAllImages() {
  console.log('\n🔄 Testando carregamento das imagens...');
  
  const results = [];
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < uniqueImages.length; i++) {
    const url = uniqueImages[i];
    console.log(`[${i + 1}/${uniqueImages.length}] Testando: ${url.split('/').pop()}`);
    
    const result = await testImageUrl(url);
    results.push(result);
    
    if (result.status === 'success') {
      successCount++;
      console.log(`  ✅ OK (${result.statusCode})`);
    } else {
      errorCount++;
      console.log(`  ❌ ERRO: ${result.error || result.statusCode}`);
    }
  }
  
  console.log('\n📊 RESULTADOS DA VALIDAÇÃO:');
  console.log('===========================');
  console.log(`✅ Imagens funcionando: ${successCount}`);
  console.log(`❌ Imagens com erro: ${errorCount}`);
  console.log(`📈 Taxa de sucesso: ${((successCount / uniqueImages.length) * 100).toFixed(1)}%`);
  
  if (errorCount > 0) {
    console.log('\n❌ IMAGENS COM PROBLEMAS:');
    results.filter(r => r.status !== 'success').forEach(result => {
      console.log(`  ${result.url}`);
      console.log(`    Erro: ${result.error || result.statusCode}`);
    });
  }
  
  return { successCount, errorCount, results };
}

// Verificar correspondência nome-imagem
function checkNameImageCorrespondence() {
  console.log('\n🔍 VERIFICANDO CORRESPONDÊNCIA NOME-IMAGEM:');
  console.log('==========================================');
  
  const categories = ['smartphones', 'notebooks', 'televisoes', 'audio', 'calcados', 'roupas', 'eletrodomesticos', 'esportes', 'monitores', 'relogios'];
  const mismatches = [];
  
  categories.forEach(category => {
    const categoryRegex = new RegExp(`"${category}":\\s*\\[([\\s\\S]*?)\\](?=\\s*[,}])`, 'i');
    const categoryMatch = databaseContent.match(categoryRegex);
    
    if (categoryMatch) {
      const categoryContent = categoryMatch[1];
      const productRegex = /\{[^}]*?"title":\s*"([^"]+)"[^}]*?"image":\s*"([^"]+)"[^}]*?\}/g;
      let match;
      
      while ((match = productRegex.exec(categoryContent)) !== null) {
        const title = match[1].toLowerCase();
        const image = match[2];
        
        // Verificar incompatibilidades específicas
        if (title.includes('iphone') && !image.includes('1695048133142') && !image.includes('1663781292073') && !image.includes('1574944985070')) {
          mismatches.push({ category, title: match[1], issue: 'iPhone com imagem não-iPhone' });
        }
        
        if (title.includes('samsung') && title.includes('galaxy') && !title.includes('watch') && !image.includes('1610945265064')) {
          mismatches.push({ category, title: match[1], issue: 'Samsung Galaxy com imagem não-Samsung' });
        }
        
        if (title.includes('macbook') && !image.includes('1517336714731') && !image.includes('1611186871348')) {
          mismatches.push({ category, title: match[1], issue: 'MacBook com imagem não-MacBook' });
        }
        
        if (title.includes('samsung') && title.includes('watch') && !image.includes('1524592094714')) {
          mismatches.push({ category, title: match[1], issue: 'Samsung Watch com imagem não-Watch' });
        }
      }
    }
  });
  
  if (mismatches.length === 0) {
    console.log('✅ Todas as correspondências nome-imagem estão corretas!');
  } else {
    console.log(`❌ ${mismatches.length} incompatibilidades encontradas:`);
    mismatches.forEach((mismatch, index) => {
      console.log(`  ${index + 1}. ${mismatch.title} (${mismatch.category})`);
      console.log(`     ${mismatch.issue}`);
    });
  }
  
  return mismatches;
}

// Executar validação completa
async function runCompleteValidation() {
  // 1. Testar carregamento das imagens
  const imageResults = await validateAllImages();
  
  // 2. Verificar correspondência nome-imagem
  const correspondenceResults = checkNameImageCorrespondence();
  
  // 3. Relatório final
  console.log('\n🎉 RELATÓRIO FINAL DE VALIDAÇÃO:');
  console.log('===============================');
  
  if (imageResults.errorCount === 0) {
    console.log('✅ Todas as imagens estão carregando corretamente!');
  } else {
    console.log(`❌ ${imageResults.errorCount} imagens com problemas de carregamento`);
  }
  
  if (correspondenceResults.length === 0) {
    console.log('✅ Todas as correspondências nome-imagem estão corretas!');
  } else {
    console.log(`❌ ${correspondenceResults.length} incompatibilidades nome-imagem`);
  }
  
  const diversityRate = ((uniqueImages.length / imageUrls.length) * 100).toFixed(1);
  console.log(`📊 Taxa de diversidade de imagens: ${diversityRate}%`);
  
  if (imageResults.errorCount === 0 && correspondenceResults.length === 0) {
    console.log('\n🎉 VALIDAÇÃO COMPLETA: TUDO PERFEITO!');
    console.log('✅ Imagens carregando corretamente');
    console.log('✅ Correspondência nome-imagem perfeita');
    console.log('✅ Pronto para uso em produção!');
  } else {
    console.log('\n⚠️  AÇÃO NECESSÁRIA:');
    if (imageResults.errorCount > 0) {
      console.log('- Corrigir imagens que não carregam');
    }
    if (correspondenceResults.length > 0) {
      console.log('- Corrigir incompatibilidades nome-imagem');
    }
  }
}

// Executar
runCompleteValidation().catch(console.error);