import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 3000;

let users = []
let messages = []

app.use(cors())

app.get('/', (req, res) =>
{
    console.log('connected');
})

io.on('connection', (socket) => {
    console.log('Połączenie nawiązane');


    console.log(users);


    socket.on('disconnect', () =>
    {
        io.emit('deletePlayer', {id: socket.id})
        console.log('disconnect');
        users = users.filter(user => user.id != socket.id)
        console.log(users);
    })
    
    socket.emit('getMessages', {messages})

    socket.on('newPlayer', (player) =>
    {
        if(users.find(user => user.id == player.id))
            return

        users.push({
            id: player.id,
            color: player.color,
            position: player.position,
            name: player.name
        })

        io.emit('newPlayer', {users})
        
    })

    socket.on('changePosition', (player) =>
    {
        let user = users.find(user => user.id == player.id)

        console.log(user);

        if(user)
        {
            user.position.x = player.x
            user.position.y = player.y
        }

        socket.broadcast.emit('changePosition', {player})
    })

    socket.on('newMessage', (message) =>
    {
        messages.push({name: message.name, text: message.text})

        socket.broadcast.emit('newMessage', message)
    })
    
});

server.listen(port, () => {
    console.log(`Serwer nasłuchuje na porcie ${port}`);
});
