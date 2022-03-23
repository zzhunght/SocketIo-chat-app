require('dotenv').config()
const express = require('express')
const app = express()
const { createServer } = require('http')
const { Server } = require('socket.io')

const httpServer = createServer(app)
const io = new Server(httpServer)

app.use(express.static('./public'))
app.set('view engine', 'ejs')
app.set('views','./views')

let listUsers = []
let listUsersFocus = []
io.on("connection",(socket) => {
    socket.on("client-send-data",(data) =>{
        
        if(listUsers.indexOf(data) >= 0){
            socket.emit("sv-send-failure-register")
        }
        else{
            listUsers.push(data)
            socket.Username = data
            socket.emit("sv-send-success-register",data)
            io.sockets.emit("sv-send-ds-user",listUsers)
        }
    })
    socket.on('client-log-out',()=>{
        listUsers.splice(listUsers.indexOf(socket.Username),1)
        socket.emit("log-out-success")
        socket.broadcast.emit("sv-send-ds-user",listUsers)
    })

    socket.on('client-send-msg',(data)=>{
        socket.broadcast.emit("some-one-send-msg",{us:socket.Username,msg:data})
        socket.emit("your-msg",data)
    })
    socket.on('client-focus-in',()=>{
        listUsersFocus.push(socket.Username)
        socket.broadcast.emit("users-focus-in",listUsersFocus)
        
    })
    socket.on('client-focus-out',()=>{
        listUsersFocus.splice(listUsersFocus.indexOf(socket.Username),1)
        socket.broadcast.emit("users-focus-in",listUsersFocus)

    })
})


app.get('/', (req, res) =>{
    res.render('trangchu')
})



httpServer.listen(process.env.PORT || 8000,()=> console.log('listening on port 8000'))