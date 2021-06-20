const httpServer = require('http').createServer();
const io = require('socket.io')(httpServer, {
    cors: {
        origin: "*",
    }
});

io.on('connection', socket => {

});

httpServer.listen(3000);