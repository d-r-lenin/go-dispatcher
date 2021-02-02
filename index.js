const log=console.log;

const express=require('express')
const app=express();
const server=require('http').createServer(app)
const io=require('socket.io')(server)

app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.set('view engine','ejs')

app.get('/',(req,res)=>{
	res.render('index.ejs');
})


const users={};

io.on('connection',socket=>{

	log('connection opened '+socket.id)

	socket.on('im-connected',(name,i)=>{
		users[socket.id]=name;
		socket.broadcast.emit('user-connected',users[socket.id]);
	})

	socket.on('disconnect',()=>{
		socket.broadcast.emit('user-disconnected',users[socket.id])
		log('connection closed')
	})
	socket.on('message',(message)=>{
		socket.broadcast.emit('message-r',message,users[socket.id]);
	})

})


server.listen(process.env.PORT||3000,()=>{
	log("listaning")
});
