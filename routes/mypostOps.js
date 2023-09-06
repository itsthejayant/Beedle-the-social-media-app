const router = require('express').Router();
const handler = require('../controller/posts/script');
const Posts = require('./../models/posts');

router.post('/deletepost',(req,res)=>{
    const{ id } = req.body;
    Posts.deleteOne({_id: id})
    .then(()=>{
        res.redirect('/editposts');
    })
    .catch((err)=>{
        res.send("lagg gayi !!!");
    })
})

router.post('/updatepost',async (req,res)=>{
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

module.exports= router;