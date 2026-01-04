const { cloudinary } = require('../config/cloudinary');

// Test de la configuration Cloudinary
const testCloudinaryConfig = async () => {
  try {
    console.log('🔍 Test de la configuration Cloudinary...');
    console.log('Cloud Name:', cloudinary.config().cloud_name);
    console.log('API Key:', cloudinary.config().api_key ? '✅ Configuré' : '❌ Manquant');
    console.log('API Secret:', cloudinary.config().api_secret ? '✅ Configuré' : '❌ Manquant');

    // Test d'upload d'un fichier test
    console.log('\n📤 Test d\'upload...');
    
    const testResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'bibliotheque/test',
          public_id: `test_${Date.now()}`,
          resource_type: 'auto'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(Buffer.from('Test file content'));
    });

    console.log('✅ Upload réussi:', testResult.secure_url);
    
    // Test de suppression
    console.log('\n🗑️ Test de suppression...');
    const deleteResult = await cloudinary.uploader.destroy(testResult.public_id);
    console.log('✅ Suppression réussie:', deleteResult.result);

    console.log('\n🎉 Cloudinary est parfaitement configuré !');
    
  } catch (error) {
    console.error('❌ Erreur lors du test Cloudinary:', error.message);
    
    if (error.message.includes('credentials')) {
      console.log('\n💡 Solution : Vérifiez vos variables d\'environnement Cloudinary');
      console.log('- CLOUDINARY_CLOUD_NAME');
      console.log('- CLOUDINARY_API_KEY');
      console.log('- CLOUDINARY_API_SECRET');
    }
  }
};

// Test des dossiers
const testFolders = async () => {
  try {
    console.log('\n📁 Vérification des dossiers...');
    
    const folders = ['bibliotheque/images-couvertures', 'bibliotheque/pdf-livres'];
    
    for (const folder of folders) {
      try {
        const result = await cloudinary.api.sub_folders(folder);
        console.log(`✅ Dossier ${folder} : ${result.folders.length} sous-dossiers`);
      } catch (error) {
        if (error.message.includes('Not Found')) {
          console.log(`ℹ️ Dossier ${folder} : sera créé lors du premier upload`);
        } else {
          console.log(`⚠️ Dossier ${folder} : ${error.message}`);
        }
      }
    }
  } catch (error) {
    console.error('❌ Erreur lors de la vérification des dossiers:', error.message);
  }
};

// Test des quotas
const testQuotas = async () => {
  try {
    console.log('\n📊 Vérification des quotas...');
    
    const usage = await cloudinary.api.usage();
    console.log(`📈 Images : ${usage.images.count} / ${usage.images.limit || 'Illimité'}`);
    console.log(`📄 Raw files : ${usage.raw.count} / ${usage.raw.limit || 'Illimité'}`);
    console.log(`💾 Stockage utilisé : ${Math.round(usage.used_pixels / 1000000)}MB`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification des quotas:', error.message);
  }
};

// Exécuter tous les tests
const runAllTests = async () => {
  console.log('🚀 Début des tests Cloudinary...\n');
  
  await testCloudinaryConfig();
  await testFolders();
  await testQuotas();
  
  console.log('\n✨ Tests terminés !');
};

// Exécuter si appelé directement
if (require.main === module) {
  runAllTests();
}

module.exports = {
  testCloudinaryConfig,
  testFolders,
  testQuotas,
  runAllTests
};
