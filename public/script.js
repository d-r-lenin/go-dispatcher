const name=prompt('enter your nick name')
const msgForm=document.querySelector('.message-form')
const sendBtn=document.querySelector('.form-button')
const msgInput=document.querySelector('.message-input')
const chatDisplay=document.querySelector('.message-display')




const socket=io('ws://godispatcher.herokuapp.com');

socket.on('connect',()=>{
	socket.on('message-r',(data,name)=>{
		createMessage(data,name);
	})
	
	createMessage('connected','you');
	
	socket.emit('im-connected',name);
	
	socket.on('user-connected',name=>{
		createMessage('connected',name);
	})
	
	socket.on('user-disconnected',name=>{
		createMessage('disconnected',name);
	})
	
	sendBtn.addEventListener('click',async()=>{
		event.preventDefault();
		writeMessage(msgInput.value);
		socket.emit('message',msgInput.value);
	})
	
	
})


function createMessage(message,name){
	const msgEl = document.createElement('a')
	msgEl.innerHTML=`<h1 class="recived-message" >${name}:${message}<\h1>`
	chatDisplay.appendChild(msgEl)
}
function writeMessage(message){
	const msgEl = document.createElement('a')
	msgEl.innerHTML=`<h1 class="sent-message">you:${message}<\h1>`
	chatDisplay.appendChild(msgEl)
}