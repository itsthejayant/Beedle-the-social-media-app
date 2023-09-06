const router = require('express').Router();
const Posts = require('./../models/posts');
const Comments = require('./../models/comments');

router.post('/likeup', async (req,res)=>{
    const { id ,count } = req.body;
    if(!req.user) return res.send("sign in karo yaar");
    try{
        await Posts.updateOne({_id:id},{$set: {likecount : count}});
    }
    catch(err){
        console.log("error");
    }
})

router.post('/getallcomments',(req,res)=>{
    const {id} = req.body;
    Comments.find({post_id: id}).populate('post_id')
    .then((comments)=>{
        res.send(comments);
    })
    .catch((err)=>{
        res.send("lagg gayii...")
    })  
})
router.post('/addcomment',(req,res)=>{
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
router.post('/getcommentid',(req,res)=>{
    const {message} = req.body;
    Comments.findOne({message:message})
    .then((comm)=>{
        res.send(comm._id);
    })
    .catch((err)=>{
        res.send("lagg gayii...")
    })
})
router.post('/getcommentreplies',(req,res)=>{
    const {message} = req.body;
    Comments.findOne({message:message})
    .then((comm)=>{
        res.send(comm.replies);
    })
    .catch((err)=>{
        res.send("lagg gayii...")
    })
})
router.post('/addreply',(req,res)=>{
    const { id ,text} = req.body;
    if(! req.user)  return res.send("pehle login in to karle yaar");
    Comments.findOne({_id:id})
    .then((comm)=>{
        let arr = comm.replies;
        arr.push(text);
        Comments.updateOne({_id:id},{$set:{replies: arr}})
        .then((d)=>{
            res.send('Reply Added')
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