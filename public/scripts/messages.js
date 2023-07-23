const inp =document.querySelector('#msg');
const btn =document.querySelector('#btn');
const list =document.querySelector('.list');

const socket = io();

btn.addEventListener('click',()=>{
    let msg = inp.value;

    socket.emit('send',{
        msg,id:socket.id
    });

})

socket.on('login',(msg)=>{
    console.log(msg);
})
socket.on('reply',(msg)=>{
    let div = document.createElement('div');
    div.innerText = `message received : ${msg.msg}`;
    list.appendChild(div);
})
