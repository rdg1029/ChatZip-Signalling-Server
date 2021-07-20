const httpServer = require('http').createServer();
const io = require('socket.io')(httpServer, {
    cors: {
        origin: "*",
    }
});

let groups = [];

io.on('connection', socket => {
    //console.log(socket.id + ' connected');
    socket.emit('open');

    socket.on('create group', groupId => {
        groups.push(groupId);
        socket.join(groupId);
        socket.data.group = groupId;
        socket.emit('join group', groupId);
        console.log(groups);
    });

    socket.on('find group', groupId => {
        if (groups.includes(groupId)) {
            socket.emit('group found', groupId);
            // socket.to(groupId).emit('req group', socket.id);
        }
        else {
            socket.emit('group not found');
        }
    });

    socket.on('req info', (groupId, userId) => {
        io.to(groupId).emit('req info', userId);
    })

    socket.on('group info', (targetId, users) => {
        io.to(targetId).emit('group info', users);
    });

    socket.on('req offer', (groupId, userId) => {
        io.to(groupId).emit('req offer', userId);
    });

    socket.on('req answer', (offer, userId, targetId) => {
        io.to(targetId).emit('req answer', offer, userId);
    });
    
    socket.on('recv answer', (answer, userId, targetId) => {
        io.to(targetId).emit('recv answer', answer, userId);
    })

    socket.on('conn ready', targetId => {
        io.to(targetId).emit('conn ready');
    });

    socket.on('req join', groupId => {
        io.to(socket.id).emit('join group', groupId);
        io.to(groupId).emit('user join', socket.id);
        socket.join(groupId);
        socket.data.group = groupId;
    });

    socket.on('is alone', isAlone => {
        socket.data.isAlone = isAlone;
    });

    socket.on('disconnect', () => {
        if(socket.data.isAlone) {
            groups.splice(groups.indexOf(socket.data.group), 1);
            console.log(groups);
        }
        else {
            io.to(socket.data.group).emit('user quit', socket.id);
        }
        console.log(socket.id + ' disconnected');
    });
});

httpServer.listen(process.env.PORT || 3000);
