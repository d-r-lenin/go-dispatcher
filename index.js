const express=require('express')
const app=express();
const server=require('http').createServer(app)
const io=require('socket.io')(server)

app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.set('view engine','ejs')

const roomList = [];
const roomInfo = {};

app.get('/',(req,res)=>{
	const defaultName = 'default';
	res.render('index.ejs',{ room : roomList });
})

app.get('/room' ,(req,res)=>{
	res.render('room.ejs')
})


io.on('connection',socket=>{
	socket.on('join-room',(data) => {
		socket.join(data.roomname)
		socket.room = data.roomname
		socket.name = data.name;
		if(roomList.indexOf(socket.room) === -1){
			roomList.push(socket.room);
			roomInfo[socket.room] = { names : [socket.name] }
		}else{
			roomInfo[socket.room].names.push(socket.name)
		}
		socket.broadcast.to(socket.room).emit('user-connected',socket.name);
	})

	socket.on('disconnect',()=>{
		socket.leave(socket.room)
		roomInfo[socket.room].names.pop(socket.name)
		if(roomInfo[socket.room].names.length === 0){
			roomList.pop(socket.room)
			delete roomInfo[socket.room]
		}
		socket.broadcast.to(socket.room).emit('user-disconnected',socket.name)
	})
	socket.on('message',(message)=>{
		socket.broadcast.to(socket.room).emit('message-r',message,socket.name);
	})

})


server.listen(3000,()=>{
	console.log("listaning localhost:3000")
});
