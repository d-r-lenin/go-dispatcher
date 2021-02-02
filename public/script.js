const name=prompt('enter your nick name')
const msgForm=document.querySelector('.message-form')
const sendBtn=document.querySelector('.send-button')
const msgInput=document.querySelector('.message-input')
const chatDisplay=document.querySelector('.message-display')




const socket=io('wss://localhost:3000');

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
	sendBtn.addEventListener('click',async(event)=>{
		writeMessage(msgInput.value);
		socket.emit('message',msgInput.value);
		msgInput.value='';
		msgInput.focus();
	})
	msgInput.addEventListener('keyup',async(event)=>{
		if(event.keyCode===13){
			writeMessage(msgInput.value);
			socket.emit('message',msgInput.value);
			msgInput.value='';
			msgInput.focus();
		}
	})


})


function createMessage(message,name){
	const msgEl = document.createElement('div')
	msgEl.classList.add('recived-message')
	msgEl.classList.add('message')
	msgEl.innerHTML=`<span class="box"></span>
						  <span>${name} : ${message}</span>`
	chatDisplay.appendChild(msgEl)
	chatDisplay.scrollTop=chatDisplay.scrollHeight;
}
function writeMessage(message){
	const msgEl = document.createElement('div')
	msgEl.classList.add('sent-message')
	msgEl.classList.add('message')
	msgEl.innerHTML=`<span class="box"></span>
						  <span>${message}</span>`
	chatDisplay.appendChild(msgEl)
	chatDisplay.scrollTop=chatDisplay.scrollHeight;
}
