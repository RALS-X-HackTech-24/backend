const functions = require('firebase-functions');
const users = require('./crud/users')
const listings  = require('./crud/listings')
const posts = require('./crud/posts')
const payments = require('./payments')

exports.users = functions.https.onRequest(users.users)
exports.listings = functions.https.onRequest(listings.listings)
exports.posts = functions.https.onRequest(posts.posts)
exports.payments = functions.https.onRequest(payments.payments)