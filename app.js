const httpServer = require('http').createServer();
const io = require('socket.io')(httpServer, {
    cors: {
        origin: "*",
    }
});

io.on('connection', socket => {
    console.log(socket.id + ' connected');

    socket.on('join room', room => {
        socket.join(room);
    });

    socket.on('disconnect', () => {
        console.log(socket.id + ' disconnected');
    });
});

httpServer.listen(3000);
