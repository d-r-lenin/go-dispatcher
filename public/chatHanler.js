
const { name , roomid, roomname } = UrlDecode()

if(!name || !roomid || !roomname){
	location.replace('/')
}


const msgForm = document.querySelector('.message-form')
const sendBtn = document.querySelector('.send-button')
const msgInput = document.querySelector('.message-input')
const chatDisplay = document.querySelector('.message-display')
const chatHeader = document.querySelector('.chat-header')
const link = document.querySelector('#link');


// const socket = io('wss://godispatcher.herokuapp.com');
const socket = io('ws://localhost:3000');



socket.on('connect',async ()=>{
	socket.emit('join-room',{ name , roomid, roomname})
	setTimeout(async()=>{
		const data = await axios.get(`/roominfo?roomid=${roomid}`);
		console.log(data);
		chatHeader.innerHTML = `<h1>${data.data.roomname}</h1>`
		link.outerHTML = `<a target="blank" href = "http://${location.host}/prejoin?&roomid=${roomid}&roomname=${data.data.roomname}" >click here</a>`
	},700);
	socket.on('room-not-available',(data)=>{
		location.replace('/');
	})
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
