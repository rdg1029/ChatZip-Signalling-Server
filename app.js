const httpServer = require('http').createServer();
const io = require('socket.io')(httpServer, {
    cors: {
        origin: "*",
    }
});

io.on('connection', socket => {
    //console.log(socket.id + ' connected');
    socket.emit('open');

    socket.on('create room', room => {
        socket.join(room.id)
        socket.emit('join room', room);
    });

    socket.on('req room', (room, offer) => {
        socket.to(room.id).emit('req room', offer)
    });

    socket.on('disconnect', () => {
        console.log(socket.id + ' disconnected');
    });
});

httpServer.listen(process.env.PORT || 3000);
