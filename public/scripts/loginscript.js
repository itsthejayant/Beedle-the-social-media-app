// const abc=require('./localstorage/class')
const form=document.querySelector('form');
const signup=document.querySelector('.signup');
const login=document.querySelector('.login');
const username=document.querySelector('.username');
const password=document.querySelector('.password');
const Users = require('./../../models/users');

// signup.addEventListener('click',(ev)=>{

//     // ev.preventDefault();
//     // console.log("click hou");
//     ev.preventDefault();
//     let uname=username.value;
//     let pass=password.value;
//     let newuser={
//         username:uname,
//         password:pass
//     }
//     console.log(newuser);
//     quorausers.setuser(newuser)
//     .then(()=>{
//         console.log("user created seuccesfully")
//         alert("user signed in now login")
//     })
//     .catch((err)=>{
//         alert(err);
//     })
//     console.log(newuser);
// });

login.addEventListener('click',(ev)=>{
    ev.preventDefault();
    let uname=username.value;
    let pass=password.value;
    Users.findOne({username:uname})
    .then((user)=>{
        console.log("working");
    })
    .catch((err)=>{
        console.log("error");
    })
    // let usersjson=localStorage.getItem('users');
    // let users=JSON.parse(usersjson);
    // let user = users.filter((u) => u.username === uname);
    // console.log(user,"userinfo"    )
    // if(user.length==0) alert("Not a valid user, try to first sign in");
    // // window.location = 'C:\Users\Jayant\OneDrive\Desktop\web dev 2\lecture-10 async\index.html';
    // console.log("user logined");

});
