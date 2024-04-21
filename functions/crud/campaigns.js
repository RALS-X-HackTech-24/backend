const express = require('express');
const cors = require('cors')
const admin = require('../firebase')

const campaigns = express()
campaigns.use(cors({origin: true}))

db = admin.firestore()

// Read all documents
campaigns.get('/getCampaigns', (req, res) => {
  db.collection('campaigns').get()
    .then(snapshot => {
      const items = [];
      snapshot.forEach(doc => items.push({ id: doc.id, ...doc.data() }));
      res.status(200).json(items);
    })
    .catch(error => res.status(500).json({ error: error.message }));
});

// Read a single document
campaigns.post('/getCampaign', (req, res) => {
  const itemId = req.body.id;
  db.collection('campaigns').doc(itemId).get()
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
campaigns.put('/updateCampaign', (req, res) => {
  const itemId = req.body.id;
  const updatedItem = req.body;
  db.collection('campaigns').doc(itemId).update(updatedItem)
    .then(() => res.status(200).json({ message: 'Item updated successfully' }))
    .catch(error => res.status(500).json({ error: error.message }));
});

// Delete a document
campaigns.delete('/deleteCampaign', (req, res) => {
  const itemId = req.body.id;
  db.collection('campaigns').doc(itemId).delete()
    .then(() => res.status(200).json({ message: 'Item deleted successfully' }))
    .catch(error => res.status(500).json({ error: error.message }));
});

exports.campaigns = campaigns