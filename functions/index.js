const functions = require('firebase-functions');
const users = require('./users')
const payments = require('./payments')

exports.users = functions.https.onRequest(users.users)
exports.payments = functions.https.onRequest(payments.payments)