const router = require('express').Router();
const Posts = require('./../models/posts');
const passport = require('./../authentication/passport');
const Users =  require('./../models/users')

router.post('/login',passport.authenticate('local',{failureRedirect :'/login',failureFlash:true ,failureFlash:'Invalid username or password'}),
    function(req,res){
            res.redirect('/');
        // res.send('login hogaya');
});

router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
});
router.post('/signup',(req,res)=>{
    const { username, password} = req.body;
    // console.log(username," kya drama h yaar");
    Users.find({username: username})
    .then((users)=>{
        if(users.length != 0 ) return res.render('loginpage',{mess: "User already exist"});
        else{
            let newuser = new Users({username, password})
            newuser.save()
            .then(()=>{
                // res.redirect('/login')
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

module.exports= router;