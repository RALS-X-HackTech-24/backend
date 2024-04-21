const express = require('express');
const cors = require('cors')
const moment = require('moment')
require('dotenv').config({path: '../secrets/.env'});

const admin = require('./firebase')
const stripe = require('stripe')(process.env.STRIPE_SK)

const payments = express()
payments.use(cors({origin: true}))

db = admin.firestore()

payments.post('/createCampaign', async(req, res) => {
  const product = await stripe.products.create({
    name: req.body.name,
    description: req.body.description,
    images: req.body.images
  })

  const data = {
    id: product.id,
    name: req.body.name,
    description: req.body.description,
    images: req.body.images,
    goal: req.body.goal,
    raised: 0,
    investors: [],
    ts: moment().toISOString(),
    location: req.body.location,
    expiry: req.body.expiry,
    organizer: req.body.organizer,
    likes: 0,
  }

  db.collection('campaigns').doc(product.id).set(data)

  res.status(200).send("success")
})

payments.post('/checkout', async (req, res) => {
  const price = await stripe.prices.create({
    currency: 'usd',
    unit_amount: req.body.amount,
    product: req.body.campaign
  })

  const session = await stripe.checkout.sessions.create({
    success_url: `http://localhost:5000/chack24-4a090/us-central1/payments/checkoutConfirm/amount/${req.body.amount}/uid/${req.body.uid}/campaign/${req.body.campaign}`,
    line_items: [
      {
        price: price.id,
        quantity: 1,
      },
    ],
    mode: 'payment',
  })

  res.status(200).send({url: session.url})
})

payments.get('/checkoutConfirm/amount/:amount/uid/:uid/campaign/:campaign', async (req, res) => {
  //req.params.amount =( parseInt(req.params.amount)/100).toFixed(2)
  
  const sessions = await stripe.checkout.sessions.list({
    limit: 3,
  });

  let session = sessions.data[0]

  if(session.status == "complete") {
    //create investment model
    let investment = {
      amount: req.params.amount,
      campaign: req.params.campaign,
      uid: req.params.uid,
      ts: moment().toISOString()
    }

    //lets update the user model
    let user = await db.collection('users').doc(req.params.uid).get()
    user = user.data()
    user.investedCampaigns.push(investment)
    await db.collection('users').doc(req.params.uid).update(user)

    //lets update the campaign model
    let campaign = await db.collection('campaigns').doc(req.params.campaign).get()
    campaign = campaign.data()
    campaign.raised += parseInt(req.params.amount)
    campaign.investors.push(investment)
    await db.collection('campaigns').doc(req.params.campaign).update(campaign)

    //ok lol hopefully that all worked!
    res.send("Payment successful! Thanks for your contribution!")
  } else {
    console.log("failedddd!")
    res.send("Payment failed!")
  }
})



exports.payments = payments