const functions = require('firebase-functions');
const users = require('./users')

exports.users = functions.https.onRequest(users.users)