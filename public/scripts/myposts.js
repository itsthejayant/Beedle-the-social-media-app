// const axios = require('axios');
const delbtns = document.querySelectorAll('.delbtn');
const confirmbox = document.querySelector('.confirmbox');
const canceldelbtn = document.querySelector('#canceldelbtn');
const postsarea = document.querySelector('.postsarea');

// code for ajax on delete command with a consfirm window in between
delbtns.forEach((delbtn)=>{
    delbtn.addEventListener('click',(ev)=>{
        let id = delbtn.getAttribute('post_id');
        if(confirm("You are trying to permanently delete the post. Are you sure.....") == true )     {
            let x= delbtn.parentElement.parentElement.parentElement;
            postsarea.removeChild(x);
            axios.post('/deletepost',{id})
            .then(()=>{
            })
            .catch((err)=>{
                console.log("lagg gayi!!!!");
            })  
        }
        else{console.log("delbutton clicked failed")}
    })
})

canceldelbtn.addEventListener('click',(ev)=>{
    confirmbox.style.visibility='hidden';
})

