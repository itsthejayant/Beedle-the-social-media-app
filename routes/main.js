const router = require('express').Router();
const handler = require('../controller/posts/script');
const Posts = require('./../models/posts');

router.post('/addpost',(req,res)=>{
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



module.exports= router;