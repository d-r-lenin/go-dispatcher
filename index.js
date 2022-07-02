const crypto = require('crypto');
const axios = require('axios');
const express = require('express');
const app = express();
const server = require('http').createServer(app)
const io = require('socket.io')(server)

app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.set('view engine','ejs')
//hi
const roomInfo = {};

// roomInfo ={
// 	id['string']:{
// 		room: 'string',
// 		names:['string'],
// 		topics:['string']
// 	}
// }

app.get('/',async(req,res)=>{
	res.render('index-new.ejs',{ room : roomInfo });
})

app.get('/room' ,(req,res)=>{
	res.render('room-new.ejs')
})

app.get('/prejoin',(req,res)=>{
	res.render('prejoin-new.ejs', { roominfo: roomInfo[req.query.roomid], roomid: req.query.roomid });
})

app.get('/create',(req,res)=>{
	res.render('create-new.ejs',{ crypto });
})

app.get('/roominfo',(req,res)=>{
	// console.log(req.query);
	let roomid = req.query.roomid
	if(!roomid){
		res.send('no-record');
	}
	// console.log(roomInfo[roomid]);
	// console.log(JSON.stringify(roomInfo[roomid]));
	res.send(JSON.stringify(roomInfo[roomid]));
})

app.post('/create', (req, res) => {
	// console.log(req.body);
	if(!req.body.roomid){
		req.body.roomid = "ID" + crypto.randomBytes(8).toString('hex');
	}
	// roomInfo[req.body.roomid] = {
	// 	names: [],
	// 	roomname: req.body.roomname,
	// 	topics: req.body.topics
	// }

	res.redirect(`/room?name=${req.body.name}&roomid=${req.body.roomid}&roomname=${req.body.roomname}&topics=${req.body.topics}`);
})

io.on('connection',socket=>{
	socket.on('join-room',(data) => {
		socket.roomid = data.roomid;
		socket.roomname = data.roomname;
		if (!roomInfo[socket.roomid]) {
			// socket.emit('room-not-available', true);
			roomInfo[socket.roomid] = {
				names: [],
				roomname: socket.roomname,
				topics: data.topics || "default:random"
			}
			let copy = roomInfo[socket.roomid];
			copy.roomid = socket.roomid;
			socket.broadcast.emit('room-created', copy);
			console.log(copy);
		}
		// if (!socket.roomname) socket.roomname = 'unnamed' + crypto.randomBytes(2).toString('hex');
		socket.name = data.name;
		socket.join(socket.roomid);
		
		roomInfo[socket.roomid].names.push(socket.name);
		
		// console.log('join:', roomInfo);
		socket.broadcast.to(socket.roomid).emit('user-connected',socket.name);
		
	})
	
	socket.on('disconnect',()=>{
		socket.leave(socket.roomid)
		if (!roomInfo[socket.roomid])return;
		if (roomInfo[socket.roomid].names.includes(socket.name)){
			roomInfo[socket.roomid].names.splice(roomInfo[socket.roomid].names.indexOf(socket.name),1); //removing the name from array
		}
		if (roomInfo[socket.roomid].names.length === 0) {
			let copy = roomInfo[socket.roomid];
			copy.roomid = socket.roomid;
			socket.broadcast.emit('room-deleted', copy);
			console.log(copy,'deleted');
			delete roomInfo[socket.roomid];
		}
		// console.log('disconnect:', roomInfo[socket.roomid]);
		socket.broadcast.to(socket.roomid).emit('user-disconnected',socket.name)

	})

	socket.on('message',(message)=>{
		socket.broadcast.to(socket.roomid).emit('message-r',message,socket.name);
	})

})

const PORT = process.env.PORT || 3000;
server.listen(PORT,()=>{
	console.log(`listaning port ${PORT}`);
});
