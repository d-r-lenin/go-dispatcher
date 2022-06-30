const crypto = require('crypto');
const express = require('express')
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

app.get('/',(req,res)=>{
	const defaultName = 'default';
	res.render('index.ejs',{ room : roomInfo });
})

app.get('/room' ,(req,res)=>{
	res.render('room.ejs')
})

app.get('/prejoin',(req,res)=>{
	res.render('prejoin.ejs', { roominfo: roomInfo[req.query.roomid], roomid: req.query.roomid });
})

app.get('/create',(req,res)=>{
	res.render('create.ejs');
})

io.on('connection',socket=>{
	socket.on('join-room',(data) => {
		console.log(data);
		socket.roomid = data.roomid;
		if(!socket.roomid){
			socket.roomid = "ID" + crypto.randomBytes(8).toString('hex');
		}
		if (!socket.roomname) socket.roomname = 'unnamed' + crypto.randomBytes(2).toString('hex');
		socket.join(socket.roomid);
		socket.roomname = data.roomname;
		socket.name = data.name;
		if (!roomInfo[socket.roomid]) {
			roomInfo[socket.roomid] = {
				names : [socket.name],
				roomname: socket.roomname
			}
		}else{
			roomInfo[socket.roomid].names.push(socket.name)
		}
		console.log('join:', roomInfo);
		socket.broadcast.to(socket.roomid).emit('user-connected',socket.name);

	})

	socket.on('disconnect',()=>{
		socket.leave(socket.roomid)
		if (roomInfo[socket.roomid].names.includes(socket.name)){
 			roomInfo[socket.roomid].names.splice(roomInfo[socket.roomid].names.indexOf(socket.name),1); //removing the name from array
		}
		if (roomInfo[socket.roomid].names.length === 0) {
			delete roomInfo[socket.roomid];
		}
		console.log('disconnect:', roomInfo[socket.roomid]);
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
