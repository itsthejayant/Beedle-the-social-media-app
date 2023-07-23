const passport = require('passport');
const LocalStrategy = require('passport-local');
const Users= require('./../models/users');

passport.use( new LocalStrategy({
    usernameField : 'username',
    passwordField : 'password'
    },
    async function (username,password,done){
        try {
            let user = await Users.findOne({username : username});
            if (!user) return done(null,false);
            else return done(null,user);
        }
        catch(err){
           if(err) return done(err,false);
        }
    }
));

passport.serializeUser( function(user,done){
    done( null,user.id);
})

passport.deserializeUser( function( id,done){ 
    Users.findById(id)
    .then((user)=>{
        done(null,user);
    })
    .catch((err)=>{
        done(err,false);
    })
})

module.exports = passport;