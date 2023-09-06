const express = require('express');
const path =require('path');
const app = express();
const port =4444;
const bodyparser = require('body-parser');
const hbs = require('hbs')
const mongoose = require('mongoose');
const mongoStore = require('connect-mongo')
const Posts = require('./models/posts');
const Users = require('./models/users');
const Comments = require('./models/comments');
const Messages = require('./models/messages');
const passport = require('./authentication/passport');
const session = require('express-session');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const flash = require('connect-flash');
require('dotenv').config()
const { v4: uuidv4 } = require('uuid');
app.use(flash());
app.set('view engine','hbs');
hbs.registerPartials(path.join(__dirname,'./views/partials'))

app.use(express.static(path.join(__dirname,'public')));
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    store: mongoStore.create({ mongoUrl: 'mongodb://localhost/test-app' })

}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/post',require('./routes/script'))
app.use('/main',require('./routes/main'))
app.use('/logins',require('./routes/logins'))
app.use('/likecomment',require('./routes/postsOpsNL'))
app.use('/mypost',require('./routes/mypostOps'))
app.use('/chats',require('./routes/chats'))

app.get('/login',(req,res)=>{
    res.render('loginpage');
})

app.get('/messages',(req,res)=>{
    const { recusername } = req.query;
    let user="";
    if(req.user) {user = req.user.username;}
    Messages.find({ recusername: recusername, senusername: user})
    .then((messages)=>{
        res.render('messagespage',{user,messages});
        res.render('messagespage',{user});
    })
    .catch((err)=>{
        res.send("lag gayi....");
    })
})

io.on('connection',(socket)=>{
    io.emit('login',"I am logined");
    // socket.join("room");
    socket.on('send',(msg)=>{
        io.to("647afd0316fae10ce9ff4766").emit('reply',msg);
        console.log(msg);
    });  
})

// chat page requests///////////////////////////////////////////////////////////////////
app.get('/chat',(req,res)=>{
    let user="Login here";
    if(req.user) {user= req.user.username;}
    if (!req.user) return res.render('nouserchatpage',{user,mess: " Login in for chats"});
    Users.findOne({ _id : req.user._id })
    .then((users)=>{
        let chats = users.chatpersons
        res.render('chatpage',{user,users});
    })
    .catch((err)=>{
        res.send("lag gayi....");
    })
})

app.get('/editposts',(req,res)=>{
    let user="Login here";
    if(req.user) {user= req.user.username;}
    if (!req.user) return res.render('myposts',{user,mess: " Sign in for feed"});
    Posts.find({ user_id : req.user._id }).populate('user_id').sort({_id:-1})
    // .populate('user_id')              yeh toh chal hi ni raha
    .then((posts)=>{
        if(posts.length == 0) res.render('myposts',{posts,user,mess:"No posts posted"});
        res.render('myposts',{user,posts,mess1: `Welcome ${user} to`});
    })
    .catch((err)=>{
        res.send("lag gayi....");
    })
})
    // Posts.find().sort({_id:-1})

app.get('/updatepost',(req,res)=>{
    const{id} = req.query;
    Posts.findById({ _id: id})
    .then((post)=>{
        res.render('updatepage',{ post });
    })
    .catch((err)=>{
        res.send("lagg gayi !!!");
    })
})

app.get('/',(req,res)=>{
    // Posts.find({ user_id : req.user._id }).populate('user_id')
    let user="Login here";
    if(req.user) {user= req.user.username;}
    Posts.find({}).sort({_id:-1})
    .then((posts)=>{
        res.render('postpage',{posts,user});
    })
    .catch((err)=>{
        res.send("lagg gayii...");
    })
})

mongoose.connect('mongodb://127.0.0.1:27017/posts')
    .then(()=>{
        server.listen(port,()=>{
            console.log(`http://localhost:${port}`);
        })
    })
    .catch((err)=>{
        console.log("lag gayi");
    })
