
let { name, roomid, roomname, topics } = UrlDecode()

roomid = decodeURI(roomid),
name = decodeURI(name),
topics = decodeURI(topics)

if(!name || !roomid || !roomname){
	location.replace('/')
}
// history.replaceState('hello', 'faced',`/room?name=${name}&roomid=${roomid}&roomname=${roomname}`);

const msgForm = document.querySelector('.message-form')
const sendBtn = document.querySelector('.send-button')
const msgInput = document.querySelector('.message-input')
const chatDisplay = document.querySelector('.message-display')
const disc = document.querySelector('.discription');
const chatHeader = document.querySelector('.chat-header')
const link = document.querySelector('#link');

function copylink(){
	let l = `${location.host}/prejoin?roomid=${roomid}&roomname=${roomname}`;
	navigator.clipboard.writeText(l);
	alert('Link copied...');
}

// const socket = io('wss://godispatcher.herokuapp.com');
const socket = io('ws://localhost:3000');



socket.on('connect',async ()=>{
	socket.emit('join-room',{ name , roomid, roomname, topics})
	setTimeout(async()=>{
		const data = await axios.get(`/roominfo?roomid=${roomid}`);
		console.log(data);
		chatHeader.innerHTML = `<h1>${data.data.roomname}</h1>`;
		disc.innerText = data.data.topics;
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
