const socket = io('http://localhost:8000');
//GET DOM ELEMENTS IN RESPECTIVE JS VARIABLES 
const form = document.getElementById('send-container');
const messageInput =document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');

//AUDIO THAT WILL B PLAY A RECEVING A MESSAGES//
var audio = new Audio('tone.mp3');

//FUNCTION WHICH WILL APPEND EVENT INFO TO THE CONTAINER
const append = (message , position) =>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position== 'left') {
        audio.play();
    }
}

// ASK A NEW USER FOR HIS NAME AND LET THE SERVER KNOW//
const name = prompt('enter your name');
socket.emit('new-user-joined', name);

//IF A NEW USERS JOINS, RECEIVE HER NAME TO SERVER//
socket.on('user-joined', name=>{
    append(`${name} joined the chat`, 'right');
})

// IF SERVER SEND A MESSAGE ,RECEIVE IT//
socket.on('receive', data=>{
    append(`${data.name}: ${data.message}`, 'left');
})

//IF USERS LEAVES THE CHAT, APPENT THE INFO TO CONTAINER//
socket.on('left', name=>{
    append(`${name} left the chat`, 'left');
})

//IF THE FORM SUBMITTED, SEND SERVER TO TH MESSAGE//
form.addEventListener('submit', (e) =>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
})