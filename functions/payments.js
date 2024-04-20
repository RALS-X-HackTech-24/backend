const express = require('express');
const cors = require('cors')
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

  res.status(200).send({id: product.id})
})

payments.post('/checkout', async (req, res) => {
  const price = await stripe.prices.create({
    currency: 'usd',
    unit_amount: req.body.amount,
    product: req.body.productID
  })

  const session = await stripe.checkout.sessions.create({
    success_url: 'https://example.com/success',
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

payments.post('/test', async (req, res) => {
  console.log(process.env.STRIPE_SK)
  console.log(process.env.STRIPE_PK)
  res.status(200).send("success")
})

exports.payments = payments