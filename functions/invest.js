const express = require('express');
const cors = require('cors')
const admin = require('./firebase');
const { v4: uuidv4 } = require('uuid');

const userReqs = express()
userReqs.use(cors({origin: true}))

db = admin.firestore()

userReqs.post('/createReq', async (req, res) => {
    const userID = req.body.userID;
    console.log(userID)
    let reqID = uuidv4();
    let request = {
        "reqID": investID, 
        "ts": req.body.ts,
        "message": req.body.message,
        "kids": req.body.kids,
        "pets": req.body.pets,
        "stay": [req.body.stay[0], req.body.stay[1]],
        "approved": null,
        "host": req.body.hostID,
        "user": req.body.userID,
        "location": req.body.stayID
    }

    let userDoc = await db.collection('users').doc(userID).get()
    let user = userDoc.data()
    // console.log(user)
    user.requests.push(request)
    // console.log(user)
    // console.log(typeof user)
    db.collection('users').doc(userID).update(JSON.parse(JSON.stringify(user)))

    userID = req.body.userID
    let hostDoc = await db.collection('users').doc(hostID).get()
    let host = hostDoc.data()
    // console.log(user)
    host.requests.push(request)
    // console.log(user)
    // console.log(typeof user)

    db.collection('users').doc(hostID).update(JSON.parse(JSON.stringify(host)))
    //res.status(200).send('Success!')
    res.status(200).send('Success!')
})

userReqs.post('/acceptReq', async (req, res) => {
    const request = req.body;
    
    request['approved'] = true;
    console.log(request)

    const hostID = request['hostID'];
    const userID = request['userID'];

    hostDoc = await db.collection('users').doc(hostID).get();
    host = hostDoc.data()

    
    userDoc = await db.collection('users').doc(userID).get();
    user = userDoc.data()

    
    host['requests'].forEach((req)=>{
        if(req.reqID == request.reqID){
            req = request
        }
    })

    user['requests'].forEach((req)=>{
        if(req.reqID == request.reqID){
            req = request
        }
    })
    console.log(user)

    await db.collection('users').doc(hostID).update(JSON.parse(JSON.stringify(host)));
    await db.collection('users').doc(userID).update(JSON.parse(JSON.stringify(user)));

    res.status(200).send('Success!')
})

userReqs.post('/rejectReq', async (req, res) => {
    const request = req.body.request;
    request['approved'] = false;

    const hostID = request['hostID'];
    const userID = request['userID'];

    host = await db.collection('users').doc(hostID).get();
    user = await db.collection('users').doc(userID).get();
    
    host['requests'].forEach((req)=>{
        if(req.reqID == request.reqID){
            req = request
        }
    })
    user['requests'].forEach((req)=>{
        if(req.reqID == request.reqID){
            req = request
        }
    })

    await db.collection('users').doc(hostID).update(JSON.parse(JSON.stringify(host)));
    await db.collection('users').doc(userID).update(JSON.parse(JSON.stringify(user)));

    res.status(200).send('Success!')
})

exports.userReqs = userReqs