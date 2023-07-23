const search=document.querySelector('.search');
const mainarea= document.querySelector('.mainarea');
const askbox = document.querySelector('.askbox');
const createbox= document.querySelector('.createbox')
const hidebtn = document.querySelector('.hidebtn');
const createpost= document.querySelector('.createpost');
const askquestion= document.querySelector('.askquestion');
const questionform= document.querySelector('.questionform');
const postform = document.querySelector('.login-box');
const commentbtns = document.querySelectorAll('.commentbtn');
const newcomments = document.querySelectorAll('.newcomment');
const commentbox = document.querySelector('.commentbox');
const postsarea = document.querySelector('.postsarea');
// const add_question = document.querySelector('.add_question');
const info = document.querySelector('.info');
// const idinput = document.querySelector('.idinput');

newcomments.forEach((newcomment)=>{
    newcomment.addEventListener('submit',(ev)=>{
        ev.preventDefault();
        let id = newcomment.getAttribute('post_id');
        let commentinput= newcomment.children[0];
        // commentinput.value="";
        // console.log(commentinput);
        let comment = commentinput.value;
        console.log(comment,id);
        axios.post('/addcomment',{id,comment})
        .then((mess)=>{
            if(mess.data == "pehle login in to karle yaar"){
                alert("Login/Sign in to comment");
            }
            if(mess.data == "Comment Added"){
                alert("Comment Added suceddfully");
            }
            commentinput.value="";
            // console.log(mess);
        })
        .catch((err)=>{
            console.log("lagg gayi!!!!");
        }) 
    })
})

commentbtns.forEach((commentbtn)=>{
    commentbtn.addEventListener('click',(ev)=>{
        if(commentbtn.classList.contains('b')){
            let com = commentbtn.parentElement.nextElementSibling.nextElementSibling;
            com.innerHTML="";
            commentbtn.classList.remove('b');
        }
        else{
            let id = commentbtn.getAttribute('post_id');
            commentbtn.classList.add('b');
            let com = commentbtn.parentElement.nextElementSibling.nextElementSibling;
            axios.post('/getallcomments',{id})
            .then((comments)=>{
                // console.log(comments.data);
                let m = comments.data;
                if(m.length == 0 ) {
                    let div1 = document.createElement('div');
                    div1.innerHTML = "No comments"; 
                    com.appendChild(div1);
                }
                m.forEach((comment)=>{
                    let username = comment.username;
                    let message = comment.message;
                    let div1 = document.createElement('div');
                    div1.innerHTML = username; 
                    div1.classList.add('commentname');
                    let a = document.createElement('button');
                    a.innerHTML= "reply";
                    a.classList.add('replycomment');
                    a.classList.add('togglereply');
                    let div2 = document.createElement('div');
                    div2.innerHTML = message; 
                    div2.classList.add('commentmessage');
                    com.appendChild(div1);
                    div1.appendChild(a);
                    com.appendChild(div2);
                        axios.post('/getcommentreplies',{message})
                        .then((replies)=>{
                            if(replies.data.length != 0){
                                let div = document.createElement('div');
                                div.innerHTML = "Replies"; 
                                div.classList.add('commentmessagereply')
                                div.style.color='red';
                                div2.appendChild(div);
                            }
                            replies.data.forEach((rep)=>{
                                let div3 = document.createElement('div');
                                div3.innerHTML = rep; 
                                div3.classList.add('commentmessagereply');
                                div2.appendChild(div3);
                            })
                            
                        })
                        .catch(err=>{
                            console.log("lagg gayi!!!");
                        })
                })
            })
            .catch((err)=>{
                console.log("lagg gayi!!!!");
            })  
        }
        
    })
})


postsarea.addEventListener("click", (ev)=>{
    // const classes = ev.target.className.spilt(' ');
    // let likeBtn = classes[0]
    // console.log(likeBtn)
    // console.log("Inside Event")
    // console.log(ev.target.classList)
    // console.log(ev.target.classList.contains('likebtn'))

    if(ev.target.classList.contains('togglereply')){
        if(ev.target.classList.contains('replycomment')){
            let replybtn = ev.target;
            let comMess = replybtn.parentElement.nextElementSibling;
            let message = comMess.innerHTML;
            // console.log(message);
            axios.post('/getcommentid',{message})
            .then((id)=>{
                let inp = document.createElement('input');
                inp.classList.add('inpreply');
                inp.setAttribute('commentid',id.data);
                comMess.appendChild(inp);
                let add = document.createElement('button');
                add.innerHTML= 'Add';
                add.classList.add('replycomment2')
                comMess.appendChild(add);
            })
            .catch(err=>{
                console.log("lagg gayi!!!");
            })
            replybtn.classList.remove('replycomment');  
        }
        else{
            let comMess = ev.target.parentElement.nextElementSibling;
            // console.log(comMess);
            // console.log(comMess.children);
            // console.log(comMess.children[4]);
            // console.log(comMess.children[3]);
            num = comMess.children.length;
            let b= comMess.children[num-1];
            let d= comMess.children[num-2];
            b.remove();d.remove();
            ev.target.classList.add('replycomment');
        }
    }
    
    if(ev.target.classList.contains('replycomment2')){
        let text = ev.target.previousElementSibling.value;
        let id = ev.target.previousElementSibling.getAttribute('commentid');
        // console.log(text);        console.log(id);
        axios.post('addreply',{id,text})
        .then((m)=>{
            // console.log(m.data);
            ev.target.previousElementSibling.value= "";
            alert('reply added');
        })
        .catch(err=>{
            console.log("lagg gayi!!!");
        })  
    }

    if(ev.target.classList.contains('likebtn')) {
        let likebtn = ev.target;
        let countbtn = likebtn.nextElementSibling;
        // console.log(countbtn)
        if(likebtn.classList.contains('liked')){
            // console.log('clicked');
            let id= likebtn.getAttribute('post_id');
            let count = countbtn.textContent;
            count--;
            likebtn.classList.remove('liked');
            axios.post('/likeup',{id,count})
            .then(()=>{
            })
            .catch(err=>{
                console.log("lagg gayi!!!");
            })
            countbtn.innerHTML= count;
        }
        else{
            likebtn.classList.add('liked');
            let id= likebtn.getAttribute('post_id');
            let count = countbtn.textContent;
            count++;
            axios.post('/likeup',{ id,count })
            .then(()=>{
            })
            .catch(err=>{
                console.log("lagg gayi!!!");
            })
            countbtn.innerHTML= count;
            likebtn.classList.add('liked');
            console.log('clicked');

            }
      }

})


askbox.addEventListener("click",(ev)=>{
    createbox.classList.add('as');
    mainarea.classList.add('bc');
})
// add_question.addEventListener("click",(ev)=>{
//     createbox.classList.add('as');
//     mainarea.classList.add('bc');
// })
hidebtn.addEventListener('click',(ev)=>{
    ev.preventDefault;
    createbox.classList.remove('as');
    mainarea.classList.remove('bc');
    postform.style.visibility='hidden';
})

createpost.addEventListener('click',(ev)=>{
    askquestion.classList.remove('askquestion');
    createpost.classList.add('create');
    questionform.classList.add('hide');
    postform.style.visibility='visible';
})
askquestion.addEventListener('click',(ev)=>{
    askquestion.classList.add('askquestion');
    createpost.classList.remove('create');
    questionform.classList.remove('hide');
    postform.style.visibility='hidden';
})