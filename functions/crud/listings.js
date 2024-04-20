const express = require('express');
const cors = require('cors')
const admin = require('../firebase')

const listings = express()
listings.use(cors({origin: true}))

db = admin.firestore()

listings.post('/createListing', async (req, res) => {
  let ref = await db.collection('listings').add(req.body)
  let newListingModel = {
    ...req.body,
    id: ref.id
  }
  console.log(ref.id)
  console.log(newListingModel)
  console.log(typeof newListingModel)
  // Update with newlistingModel

  db.collection('listings').doc(ref.id).update(newListingModel)
  
  //Get poster associated with listing
  posterID = req.body.poster;
  //console.log(hostID)
  posterDoc = await db.collection('users').doc(posterID).get();
  poster = posterDoc.data();
  //console.log(host);
  poster.listings.push(newListingModel);
  //Update poster's listings array
  await db.collection('users').doc(posterID).update(JSON.parse(JSON.stringify(poster)));
  res.status(200).json({"message": "success!"})
})

// Read all documents
listings.get('/getListings', (req, res) => {
  db.collection('listings').get()
    .then(snapshot => {
      const items = [];
      snapshot.forEach(doc => items.push({ id: doc.id, ...doc.data() }));
      res.status(200).json(items);
    })
    .catch(error => res.status(500).json({ error: error.message }));
});

// Read a single document
listings.get('/getListing', (req, res) => {
  const itemId = req.body.id;
  db.collection('listings').doc(itemId).get()
    .then(doc => {
      if (!doc.exists) {
        res.status(404).json({ error: 'Item not found' });
      } else {
        res.status(200).json({ id: doc.id, ...doc.data() });
      }
    })
    .catch(error => res.status(500).json({ error: error.message }));
});

// Update a document
listings.put('/updateListing', (req, res) => {
  const itemId = req.body.id;
  const updatedItem = req.body;
  db.collection('listings').doc(itemId).update(updatedItem)
    .then(() => res.status(200).json({ message: 'Item updated successfully' }))
    .catch(error => res.status(500).json({ error: error.message }));
});

// Delete a document
listings.delete('/deleteListing', (req, res) => {
  const itemId = req.body.id;
  db.collection('listings').doc(itemId).delete()
    .then(() => res.status(200).json({ message: 'Item deleted successfully' }))
    .catch(error => res.status(500).json({ error: error.message }));
});

exports.listings = listings