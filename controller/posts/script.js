const Posts = require('./../../models/posts');

module.exports.postaddpost=(req,res)=>{
    console.log(req.body);
    // const { title, description, imageurl} = req.body;
    // let newpost= new Posts({ title, description, imageurl} )
    // newpost.save()
    // .then(()=>{
        res.render('postpage');
    // })
    // .catch((err)=>{
    //     res.send("lagg gayii...")
    // })
}