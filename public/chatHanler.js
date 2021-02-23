const { name , roomname} = UrlDecode()

if(!name || !roomname){
	location.replace('/')
}

const msgForm = document.querySelector('.message-form')
const sendBtn = document.querySelector('.send-button')
const msgInput = document.querySelector('.message-input')
const chatDisplay = document.querySelector('.message-display')
const chatHeader = document.querySelector('.chat-header')

chatHeader.innerHTML = `<h1>${roomname}</h1>`;

const socket=io('ws://localhost:3000');

socket.on('connect',()=>{
	socket.emit('join-room',{ name , roomname })

	socket.on('message-r',(data,name)=>{
		recivedMessage(data,name);
	})

	recivedMessage('connected','you');

	socket.on('user-connected',name=>{
		recivedMessage('connected',name);
	})

	socket.on('user-disconnected',name=>{
		recivedMessage('disconnected',name);
	})
	sendBtn.addEventListener('click',async(event)=>{
		sentMessage(msgInput.value);
		socket.emit('message', msgInput.value);
		msgInput.value='';
		msgInput.focus();
	})
	msgInput.addEventListener('keyup',async(event)=>{
		if(event.keyCode===13){
			sentMessage(msgInput.value);
			socket.emit('message',msgInput.value );
			msgInput.value='';
			msgInput.focus();
		}
	})


})
