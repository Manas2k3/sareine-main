const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json');
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

db.collection('products').get().then(snapshot => {
  if (snapshot.empty) {
    console.log('No products found in Firestore.');
  } else {
    snapshot.forEach(doc => console.log('Found product:', doc.id, 'Slug:', doc.data().slug));
  }
}).catch(console.error);
