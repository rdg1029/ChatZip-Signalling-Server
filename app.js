const httpServer = require('http').createServer();
const io = require('socket.io')(httpServer, {
    cors: {
        origin: "*",
    }
});

let rooms = [];

io.on('connection', socket => {
    //console.log(socket.id + ' connected');
    socket.emit('open');

    socket.on('create room', room => {
        rooms.push(room.id);
        socket.join(room.id)
        socket.emit('join room', room);
    });

    socket.on('req room', roomId => {
        if (roomId in rooms) {
            socket.to(roomId).emit('req room', offer)
        }
        else {
            socket.emit('room not found');
        }
    });

    socket.on('disconnect', () => {
        console.log(socket.id + ' disconnected');
    });
});

httpServer.listen(process.env.PORT || 3000);
