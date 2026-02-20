const admin = require('firebase-admin');

// we need the service account credentials to read from firestore
const serviceAccount = require('./service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function listProducts() {
  const snapshot = await db.collection('products').get();
  snapshot.forEach(doc => {
    console.log(doc.id, '=>', doc.data().slug);
    console.log('inStock:', doc.data().inStock);
  });
}

listProducts().catch(console.error);
