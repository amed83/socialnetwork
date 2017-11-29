const express = require('express');
const app = express();
const compression = require('compression');
const bodyParser = require('body-parser');
const pg = require('pg');
const spicedPg = require('spiced-pg');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const csurf = require('csurf')
const bcrypt = require('bcryptjs')
const toS3 = require('./toS3').toS3;
const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');
const server = require('http').Server(app);
const io = require('socket.io')(server);


const db = spicedPg(process.env.DATABASE_URL || 'postgres:Amedeo:Tafano83@localhost:5432/socialnetwork');

app.use(express.static('public'));

app.use(compression());

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(cookieParser());

app.use(cookieSession({
    secret: 'a really hard to guess secret',
    maxAge: 1000 * 60 * 60 * 24 * 14
}));

app.use(bodyParser.json())

if (process.env.NODE_ENV != 'production') {
    app.use('/bundle.js', require('http-proxy-middleware')({
        target: 'http://localhost:8081/'
    }));
}

var diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname , './uploads'));
    },
    filename: function (req, file, callback) {
      uidSafe(24).then(function(uid) {
          callback(null, uid + path.extname(file.originalname));
      });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        filesize: 2097152
    }
});


app.get('/welcome',(req, res)=> {
    if(req.session.user){
        res.redirect('/')
    }
    else{
        res.sendFile(__dirname + '/index.html');
    }
})



app.get('/user',(req,res)=>{
    const param =[req.session.user.userid]
    const q = `SELECT firstname,lastname,image,id,bio FROM users WHERE id= $1`
    db.query(q,param).then((result)=>{
        const data = result.rows[0]
        if(!data.image){
            data.image='/img/defaultFun.jpg'
        }
        else{
            var url=`https://s3.amazonaws.com/spicedling/${data.image}`
            data.image=url;
        }
        res.json(data)
    })
})

app.get('/user/:id/profile',(req,res)=>{
    const params=[req.params.id]
    const q = `SELECT * FROM users WHERE id= $1`
    db.query(q,params).then((data)=>{
        if(data){
            if(!data.rows[0].image){

                data.rows[0].image='/img/defaultFun.jpg'
            }
            else{
                var url = `https://s3.amazonaws.com/spicedling/${data.rows[0].image}`
                data.rows[0].image=url
            }
            res.json(data.rows[0])
        }
    })
})

app.post('/register',(req,res) =>{
    if (!req.body.password || !req.body.first || !req.body.last || !req.body.email) {
        res.json({success:false})
    }
    else{
        hashPassword(req.body.password).then(function(hash){
            const params = [req.body.first,req.body.last,req.body.email,hash];
            const q = `INSERT INTO users (firstname,lastname,email,password) VALUES ($1,$2,$3,$4) RETURNING ID`
            db.query(q,params).then((result)=>{
                const id = result.rows[0].id
                req.session.user = {
                        first: params[0],
                        last: params[1],
                        mail: params[2],
                        userid:id
                    }
                res.json({success:true})
            })
        })
    }
})

app.post('/login',(req,res)=>{
    if (!req.body.password || !req.body.email) {
        res.json({success:false})
    }
    else{
        const param = [req.body.email]
        const q = 'SELECT * FROM users WHERE email = $1'
        db.query(q, param).then((result) => {
            const data = result.rows[0];
            if (data) {
                checkPassword(req.body.password, data.password).then((doesMatch) => {
                    if (doesMatch) {
                        req.session.user = {
                            first: data.firstname,
                            last: data.lastname,
                            userid: data.id
                        }
                        res.json({
                            success: true
                        })
                    } else {
                        res.json({
                            success: false
                        })
                    }
                })
            }
        })
    }

})

app.post('/upload',uploader.single('file'),(req,res)=>{
    if (req.file) {
        toS3(req.file).then(function(){
            var q = `UPDATE users SET image =$1 WHERE id= $2`
            var param = [req.file.filename,req.session.user.userid]
            db.query(q,param).then(function(result){
                const url = `https://s3.amazonaws.com/spicedling/${req.file.filename}`
                res.json({
                    success: true,
                    url:url
                })
            })
        })
    } else {
        res.json({
            success: false
        });
    }
})

app.post('/saveBio',(req,res)=>{
    if(req.body.bio){
        var param =[req.body.bio,req.session.user.userid]
        var q = `UPDATE users SET bio=$1  WHERE id = $2 RETURNING bio`
        db.query(q,param).then((data)=>{
            const {bio} = data.rows[0]
            console.log(bio)
            res.json({
                success:true,
                userBio:bio
            })
        })
    }
    else{
        res.json({
            success:false
        })
    }

})

app.post('/UpdateFriendStatus/user/:id',(req,res)=>{
    var status= req.body.updateStatus
    const params =[req.params.id,req.session.user.userid,req.body.updateStatus]
    if(status===1){

        var q= `INSERT INTO friend_requests (recipient_id,sender_id,status) VALUES ($1,$2,$3) RETURNING  status,sender_id`
    }else if(status===0){
        params.pop()//remove the latest element on the array since you don't need status anymore for the query
        var q= `DELETE FROM friend_requests WHERE (recipient_id = $1 AND sender_id = $2 AND status=1)`

    }else if (status===4) {
        params.pop()//same as above
        var q= `DELETE FROM friend_requests WHERE (recipient_id = $1 AND sender_id = $2 AND status=3)`
    }
    else{
        var q=`UPDATE friend_requests SET status = $3
        WHERE (sender_id = $2 AND recipient_id = $1)
        OR (sender_id = $1 AND recipient_id = $2)
        RETURNING sender_id,status,recipient_id `
    }
    db.query(q,params).then((data)=>{
        res.json(data.rows[0])
    })

})

app.get('/friendsList',(req,res)=>{
    const params=[req.session.user.userid]
    const q = `SELECT users.id,firstname,lastname,image,status
    FROM friend_requests
    JOIN users
    ON (status=1 AND recipient_id=$1 AND sender_id =users.id)
    OR (status=3 AND recipient_id=$1 AND sender_id =users.id)
    OR (status=3 AND sender_id=$1 AND recipient_id =users.id)`
    db.query(q,params).then((data)=>{
    var data = data.rows
    data.forEach((friend)=>{
        friend.image=`https://s3.amazonaws.com/spicedling/${friend.image}`
    })
        res.json(data)
    })
})



app.get( '/friendStatus/user/:id',(req,res)=>{
    const params=[req.params.id,req.session.user.userid]
    const q = `SELECT status,sender_id AS senderId FROM friend_requests WHERE (sender_id =$2 and recipient_id=$1) OR (sender_id =$1 and recipient_id=$2) `
    db.query(q,params).then((data)=>{
        console.log('inside firnedStatus/user/id get',data.rows)
        res.json(data.rows)
    })
})

app.post('/endFriendship/:id',(req,res)=>{
    const params=[req.params.id,req.session.user.userid]
    const q =`DELETE FROM friend_requests WHERE (recipient_id =$2 AND sender_id=$1)
    OR(recipient_id =$1 AND sender_id=$2)`
    db.query(q,params).then(()=>{
        res.json({
            success:true
        })
    })
})

app.get('/receiveFriendRequest',(req,res) =>{
    const params=[req.session.user.userid]
    const q = `SELECT status`
})




app.post('/acceptFriendshipRequest/:id',(req,res)=>{
    const status=3
    const params=[req.params.id,req.session.user.userid,status]
    const q =`UPDATE friend_requests SET status = $3
    WHERE (sender_id = $2 AND recipient_id = $1)
    OR (sender_id = $1 AND recipient_id = $2)
    RETURNING sender_id,status,recipient_id`
    db.query(q,params).then((data)=>{

        res.json({data})
    })
})


//SOCKET.IO ONLINE USERRS //

app.post('newMessage/:socketId',(req,res) =>{

})
let usersOnline=[];
let chatMessages=[];

app.get('/connected/:socketId',(req, res)=> {

    //getting the socket Id and the id of the logged-in user
    const userSocketId= req.params.socketId
    const userId= req.session.user.userid

    //check if this user is already online(checking the array that maps all the user's id and socket id)
    const usersConnected = usersOnline.find(user => userId === user.userid)

    usersOnline.push({
        userid:userId,
        userSocketId:userSocketId
    })

    if(!usersConnected){
        let {first,last,userid} = req.session.user
        io.sockets.emit('userJoined',{
            firstname:first,
            lastname:last,
            id:userid
        })
    }

    const q =`SELECT firstname,lastname,image,id FROM users WHERE id = ANY($1)`
     const params = [usersOnline.map(user=> user.userid)]
     db.query(q,params).then((data)=>{
         const onlineUsersNow= data.rows
         onlineUsersNow.forEach((user)=>{
             if(!user.image){
                 user.image='/img/defaultFun.jpg'
             }else{
                 user.image=`https://s3.amazonaws.com/spicedling/${user.image}`
                 console.log('inside for each',user.image);
             }
          })
         io.sockets.sockets[userSocketId].emit('onlineUsers',{
             onlineUsersNow:onlineUsersNow
         })
         console.log('questi sono gli utenti connessi ora', onlineUsersNow);
     })
})

    io.on('connection', socket => {
        socket.emit('newMessage',{
            chatMessages:chatMessages
        })
        socket.on('disconnect',() => {
             const disconnectedUser= usersOnline.filter(user =>user.userSocketId == socket.id)[0]
             const indexUser= usersOnline.indexOf(disconnectedUser)
             usersOnline.splice(indexUser,1)
             var otherSockets = usersOnline.find(user=>user.userid == disconnectedUser.userid)

             if(!otherSockets){
                io.sockets.emit('userLeft',{
                    id:disconnectedUser.userid
                })
             }
        })

     socket.on('chatMessage',(messageBody)=>{
            if(messageBody){
                var date =new Date()
                const {userid,message,firstname,lastname,image} = messageBody
                chatMessages.push({
                    userid:userid,
                    message:message,
                    firstname:firstname,
                    lastname:lastname,
                    image:image,
                    date:date.toLocaleTimeString()
                    })
                    if(chatMessages.length>10){
                        console.log('about to shift')
                        a = chatMessages.shift()
                    }
                    console.log('chatMessages',chatMessages);
                    socket.broadcast.emit('newMessage',{
                        chatMessages:chatMessages

                    })
                    socket.emit('newMessage',{
                        chatMessages:chatMessages

                    })
               }

        })


    })




app.get('*',(req,res)=>{
    if(!req.session.user){
        res.redirect('/welcome')
    }else {
        res.sendFile(__dirname + '/index.html');
    }
})




server.listen(8080,function(){
    console.log("I'm listening");
});


function hashPassword(plainTextPassword) {
    return new Promise(function(resolve, reject) {
        bcrypt.genSalt(function(err, salt) {
            if (err) {
                return reject(err);
            }
            bcrypt.hash(plainTextPassword, salt, function(err, hash) {
                if (err) {
                    return reject(err);
                }
                resolve(hash);
            });
        });
    });
}

function checkPassword(textEnteredInLoginForm, hashedPasswordFromDatabase) {
    return new Promise(function(resolve, reject) {
        bcrypt.compare(textEnteredInLoginForm, hashedPasswordFromDatabase, function(err, doesMatch) {
            if (err) {
                reject(err);
            } else {
                resolve(doesMatch);
            }
        });
    });
}
