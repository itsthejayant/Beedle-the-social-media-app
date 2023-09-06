const router = require('express').Router();
const Users = require('./../models/users');

router.post('/newchat',(req,res)=>{
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

module.exports= router;