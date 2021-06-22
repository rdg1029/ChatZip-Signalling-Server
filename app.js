const httpServer = require('http').createServer();
const io = require('socket.io')(httpServer, {
    cors: {
        origin: "*",
    }
});

io.on('connection', socket => {
    console.log(socket.id + ' connected');

    socket.on('create room', room => {
        socket.join(room)
    });

    socket.on('req room', (room, offer) => {
        socket.to(room).emit('req room', offer)
    });

    socket.on('disconnect', () => {
        console.log(socket.id + ' disconnected');
    });
});

httpServer.listen(process.env.PORT || 3000);
