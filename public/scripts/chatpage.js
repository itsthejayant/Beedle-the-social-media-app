const form = document.querySelector('.newchat');
const btn = document.querySelector('.btnnewchat');
const inp = document.querySelector('.inpnewchat');
const invalid = document.querySelector('.invalid');


form.addEventListener('submit',(ev)=>{
    ev.preventDefault();
    let newchat = inp.value;
    axios.post('/newchat',{newchat})
    .then((d)=>{
        // console.log(d.data);
        if(d.data == "invalid username"){
            console.log("invalid username2222")
            invalid.innerHTML="Invalid Username";
            invalid.style.color="red";
        }
        else{
            invalid.innerHTML="Newchat created";
            invalid.style.color="blue";
        }
        inp.value="";
    })
    .catch((err)=>{
        console.log("lagg gayi !!!");
    })
})