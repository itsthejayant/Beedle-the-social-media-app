const express = require('express');
const path =require('path');
const app = express();
const port =4444;
const bodyparser = require('body-parser');
const hbs = require('hbs')
const mongoose = require('mongoose');
const Posts = require('./models/posts');
const Users = require('./models/users');
const Comments = require('./models/comments');
const Messages = require('./models/messages');
const passport = require('./authentication/passport');
const session = require('express-session');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
// const { v4: uuidv4 } = require('uuid');

app.set('view engine','hbs');
hbs.registerPartials(path.join(__dirname,'./views/partials'))

app.use(express.static(path.join(__dirname,'public')));

app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());

app.use(session({
    secret: 'asdjbaskdadbaskdv',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// app.use((req,res,next)=>{
//     Users.find({_id: "6478e9239c0f37cfc7d10347"})
//     .then((user)=>{
//         req.user =  user[0];
//         next();
//     })
// })

// app.use('/post',require('./routes/script'));

app.post('/likeup', async (req,res)=>{
    const { id ,count } = req.body;
    // if(!req.user) res.send("sign in karo yaar");
    // if( postuserId )
    // let id1= JSON.parse(id);
    // console.log( id,count );
    try{
        await Posts.updateOne({_id:id},{$set: {likecount : count}});
    }
    catch(err){
        console.log("error");
    }
})

app.get('/login',(req,res)=>{
    res.render('loginpage');
})

app.post('/login',  passport.authenticate('local',{failureRedirect : '/login'} )   ,
    function(req,res){
            res.redirect('/');
        // res.send('login hogaya');
});

app.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
});

app.post('/signup',(req,res)=>{
    const { username, password} = req.body;
    // console.log(username," kya drama h yaar");
    Users.find({username: username})
    .then((users)=>{
        // console.log(" inside find datbase");
        // if(users) console.log("user is present");
        if(users.length != 0 ) return res.render('loginpage',{mess: "invalid username or password"});
        else{
            let newuser = new Users({username, password})
            newuser.save()
            .then(()=>{
                res.render('loginpage',{mess: "You are signed up. Now login"});
            })
            .catch(err=>{
                res.send("lagg gayi");
            })
        }
    })
    .catch(err=>{
        res.send("lagg gayi");
    });
    
})

app.get('/messages',(req,res)=>{
    const { recusername } = req.query;
    let user="";
    if(req.user) {user = req.user.username;}
    // Messages.find({ recusername: recusername, senusername: user})
    // .then((messages)=>{
        // res.render('messagespage',{user,messages});
        res.render('messagespage',{user});
    // })
    // .catch((err)=>{
    //     res.send("lag gayi....");
    // })
})

// sockets code here ///////////////////////////////////////////////////////////////////
// io.on('connection',(socket)=>{
//     io.emit('login',"I am logined");
//     socket.on('send',(msg)=>{
//         socket.emit('reply',msg);
//     });  
// })

io.on('connection',(socket)=>{
    io.emit('login',"I am logined");
    socket.join("room");
    socket.on('send',(msg)=>{
        io.to("room").emit('reply',msg);
    });  
})

// chat page requests///////////////////////////////////////////////////////////////////
app.get('/chat',(req,res)=>{
    let user="Login here";
    if(req.user) {user= req.user.username;}
    if (!req.user) return res.render('nouserchatpage',{user,mess: " Login in for chats"});
    Users.findOne({ _id : req.user._id })
    .then((users)=>{
        // if(posts.length == 0) 
        // {posts,user,mess:"No posts posted"}
        let chats = users.chatpersons
        res.render('chatpage',{user,users});
        // res.render('myposts',{user,posts,mess1: `Welcome ${user} to`});
    })
    .catch((err)=>{
        res.send("lag gayi....");
    })
})

app.post('/newchat',(req,res)=>{
    const {newchat } = req.body;
    Users.findOne({username : newchat})
    .then((u)=>{
        if(!u) return res.send("invalid username");
        let arr = req.user.chatpersons;
        arr.push(newchat);
        Users.updateOne({_id:req.user._id},{$set:{chatpersons: arr}})
        .then((d)=>{
            res.send('new chat added')
        })
        .catch((err)=>{
            res.send("lagg gayii...")
        })
    })
    .catch((err)=>{
        res.send("lagg gayii...")
    })
        
})
// post page requests/////////////////////////////////////////////////////
app.post('/getallcomments',(req,res)=>{
    const {id} = req.body;
    Comments.find({post_id: id}).populate('post_id')
    .then((comments)=>{
        res.send(comments);
    })
    .catch((err)=>{
        res.send("lagg gayii...")
    })  
})

app.post('/addcomment',(req,res)=>{
    if(! req.user)  return res.send("pehle login in to karle yaar");
    const{ id,comment}= req.body;
    let newcomment = new Comments({message:comment,username:req.user.username,post_id: id});
    newcomment.save()
    .then(()=>{
        res.send("Comment Added");
    })
    .catch((err)=>{
        res.send("lagg gayii...")
    })
})

app.post('/getcommentid',(req,res)=>{
    const {message} = req.body;
    Comments.findOne({message:message})
    .then((comm)=>{
        res.send(comm._id);
    })
    .catch((err)=>{
        res.send("lagg gayii...")
    })
})

app.post('/getcommentreplies',(req,res)=>{
    const {message} = req.body;
    Comments.findOne({message:message})
    .then((comm)=>{
        res.send(comm.replies);
    })
    .catch((err)=>{
        res.send("lagg gayii...")
    })
})

app.post('/addreply',(req,res)=>{
    const { id ,text} = req.body;
    Comments.findOne({_id:id})
    .then((comm)=>{
        let arr = comm.replies;
        arr.push(text);
        Comments.updateOne({_id:id},{$set:{replies: arr}})
        .then((d)=>{
            res.send('reply added')
        })
        .catch((err)=>{
            res.send("lagg gayii...")
        })
    })
    .catch((err)=>{
        res.send("lagg gayii...")
    })

})

app.post('/addpost',(req,res)=>{
    if( !req.user) return res.send(' first login to post');
        // console.log(req.body);
        const { title, description, imageurl} = req.body;
        let newpost= new Posts({ title, description, imageurl, user_id: req.user._id, likecount: 0,creator: req.user.username} )
        newpost.save()
        .then(()=>{
            res.redirect('/');
        })
        .catch((err)=>{
            res.send("lagg gayii...")
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


app.post('/deletepost',(req,res)=>{
    const{ id } = req.body;
    Posts.deleteOne({_id: id})
    .then(()=>{
        res.redirect('/editposts');
    })
    .catch((err)=>{
        res.send("lagg gayi !!!");
    })
})

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

app.post('/updatepost',async (req,res)=>{
    const{ title,description,imageurl} = req.body;
    const { id } = req.body;
    // const {title}= req.body;
    try{
        const resw = await Posts.updateOne({_id:id},{$set:{title:title, description:description,imageurl:imageurl}});
        res.redirect('/editposts');
    }
    catch(err){
        console.log("error");
    }
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
        res.send("lagg gayi project ki");
    })
