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

    socket.on('create room', roomId => {
        rooms.push(roomId);
        socket.join(roomId)
        socket.emit('join room', roomId);
        socket.data.room = roomId;
        console.log(socket.data.room);
    });

    socket.on('find room', roomId => {
        if (rooms.includes(roomId)) {
            socket.emit('room found', roomId);
            // socket.to(roomId).emit('req room', socket.id);
        }
        else {
            socket.emit('room not found');
        }
    });

    socket.on('req info', (roomId, userId) => {
        io.to(roomId).emit('req info', userId);
    })

    socket.on('req answer', (offer, userId, targetId) => {
        io.to(targetId).emit('req answer', offer, userId);
    });
    
    socket.on('recv answer', (answer, userId, targetId) => {
        io.to(targetId).emit('recv answer', answer, userId);
    })

    socket.on('disconnect', () => {
        console.log(socket.id + ' disconnected');
    });
});

httpServer.listen(process.env.PORT || 3000);
