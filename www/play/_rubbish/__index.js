//https://www.npmjs.com/package/php-express
var express = require('express');
var app = express();  
// must specify options hash even if no options provided!
var phpExpress = require('php-express')({
 
  // assumes php is in your PATH
  binPath: 'php'
});
// set view engine to php-express
app.set('views', './views');
app.engine('php', phpExpress.engine);
app.set('view engine', 'php');
 
// routing all .php file to php-express
app.all(/.+\.php$/, phpExpress.router);
var http = require('http').Server(app);  
var io = require('socket.io')(http);

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

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('PHPExpress app listening at http://%s:%s', host, port);
});