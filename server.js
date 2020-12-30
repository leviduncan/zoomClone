const express = require('express')
const app = express()
const server = require('http').Server(app) // allows us to create a server to be used with socket.io
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
       socket.join(roomId)
       socket.to(roomId).broadcast.emit('user-connected', userId)

       // whever a user disconnects from the room
       socket.on('disconnect', () => {
           socket.to(roomId).broadcast.emit('user-disconnected', userId)
       })
    })
})

server.listen(8080)