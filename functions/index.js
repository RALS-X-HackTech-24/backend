const functions = require('firebase-functions');
const users = require('./crud/users')
const campaigns = require('./crud/campaigns')
const posts = require('./crud/posts')
const payments = require('./payments')

exports.users = functions.https.onRequest(users.users)
exports.campaigns = functions.https.onRequest(campaigns.campaigns)
exports.posts = functions.https.onRequest(posts.posts)
exports.payments = functions.https.onRequest(payments.payments)