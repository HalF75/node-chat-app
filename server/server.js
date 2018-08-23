const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { isRealString } = require('./utils/validation');
const { generateMessage, generateLocationMessage } = require('./utils/message');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');


const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

let users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and room name are required.');
        }

        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        //Message from Admin to new logged user
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
        //Message from admin to all other users that new user logged in the room
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));

        callback();
    });

    socket.on('createMessage', (message, callback) => {
        console.log('createMessage', message);
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback();
    });

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
    });

    socket.on('disconnect', () => {
        console.log('User was disconnected');
        var user = users.removeUser(socket.id)
        debugger;
        if (user) {
            io.to(user.room).emit('udateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the room.`));
        }
    });
});


server.listen(port, () => {
    console.log(`Application running on port: ${port}`);
});