var app = require('express')();  
var http = require('http').createServer(app);  
//var io = require('socket.io')(http, { path: '/play/socket.io'});
var io = require('socket.io')(http);

app.get('/', function(req, res){  
  res.sendFile(__dirname + '/index.html');
});

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

/*http.listen(process.env.PORT_INDEX, function(){  
  console.log('Server running at :'+process.env.PORT_INDEX);
});*/

http.listen('21288', function(){  
  console.log('Server running at :'+'21288');
});

/* ==== MYSQL ==== */

//https://www.npmjs.com/package/mysql

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'mysql.magicraft.life',
  user     : 'magicraft',
  password : 'P0tt3rPlay666',
  database : 'magicraft'
});
 
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
 
  console.log('connected as id ' + connection.threadId);
});

var userEmail = 'gustavomdcl@gmail.com'
var userSelection = "SELECT * FROM PP_USER WHERE email = '"+userEmail+"'";

connection.query(userSelection, function (error, results, fields) {
  if (error) {
    throw error;
  } else {
    if(results!=''){
      console.log(
        'The results * from the table PP_USER where the email is the userEmail are: '+
        'id: '+ results[0].id+
        '; name: '+ results[0].name+
        '; email: '+ results[0].email+
        '; user: '+ results[0].user + ';'
      );
    }
  }
});
 
connection.end();

/*var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello Node\n');
  res.end('I am a wizard\n');
  console.log('gordin');
}).listen(process.env.PORT_INDEX);
console.log('Server running at :'+process.env.PORT_INDEX);*/