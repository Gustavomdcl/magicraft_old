var app = require('express')();  
var http = require('http').Server(app);  
var index = fs.readFileSync(__dirname + '/index.html');
var server = http.createServer(function(req, res) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(index);
});
var io = require('socket.io').listen(server);



/*app.get('/', function(req, res){  
  res.sendFile(__dirname + '/index.html');
});*/

//Storage
var allConnectedClients = Object.keys(io.sockets.connected);
var currentConnections = {};
io.sockets.on('connection', function (client) {
    for (var i = 0, len = allConnectedClients.length; i < len; i++) {
      //SOCKET ID = console.log('coconut '+i+' = '+allConnectedClients[i]);
      //SOCKET ID DATA = console.log('coconut '+i+' data = '+currentConnections[allConnectedClients[i]].data);
      //Vai emitir somente para esse novo client/socket
      client.emit('first user', currentConnections[allConnectedClients[i]].clientData);
    }
    client.emit('start placement', 'start');
    currentConnections[client.id] = {socket: client};
    client.on('data', function (somedata) {
        currentConnections[client.id].clientData = somedata; 
        allConnectedClients = Object.keys(io.sockets.connected);
        //SOCKET ID = console.log('socket: '+currentConnections[client.id].socket.id);
        //SOCKET ID DATA = console.log('data: '+currentConnections[client.id].clientData);
    });    
    client.on('disconnect', function() {
        io.sockets.emit('logout user', currentConnections[client.id].clientData);
        allConnectedClients = Object.keys(io.sockets.connected);
        delete currentConnections[client.id];
    });
});

io.on('connection', function(socket){  
  console.log('um usuario conectou');
  socket.on('disconnect', function(){
    console.log('usuario desconectou');
  });
  socket.on('user change', function(user_data){  
    console.log('message: ' + user_data);
    io.sockets.emit('user change', user_data);
  });
});

server.listen(process.env.PORT_INDEX);

/*http.listen(process.env.PORT_INDEX, function(){  
  console.log('Server running at :'+process.env.PORT_INDEX);
});*/

/*var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello Node\n');
  res.end('I am a wizard\n');
  console.log('gordin');
}).listen(process.env.PORT_INDEX);
console.log('Server running at :'+process.env.PORT_INDEX);*/