/* ==== VARIABLES ==== */

var app = require('express')();  
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'mysql.magicraft.life',
  user     : 'magicraft',
  password : 'P0tt3rPlay666',
  database : 'magicraft'
});
var crypto = require('crypto'); //senhas https://gist.github.com/kitek/1579117

/* ==== MYSQL ==== */
 
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
});
 
//connection.end();

/* ==== SocketIo ==== */

//User Storage
var allConnectedClients = Object.keys(io.sockets.connected);
var currentConnections = {};
io.sockets.on('connection', function (client) {
    for (var i = 0, len = allConnectedClients.length; i < len; i++) {
      client.emit('first user', currentConnections[allConnectedClients[i]].clientData);
    }
    //client.emit('start placement', 'start');
    currentConnections[client.id] = {socket: client};
    client.on('data', function (somedata) {
        currentConnections[client.id].clientData = somedata; 
        allConnectedClients = Object.keys(io.sockets.connected);
    });    
    client.on('disconnect', function() {
        io.sockets.emit('logout user', currentConnections[client.id].clientData);
        allConnectedClients = Object.keys(io.sockets.connected);
        delete currentConnections[client.id];
    });
});

//User's Movement
io.on('connection', function(socket){  
  socket.on('user change', function(user_data){
    io.sockets.emit('user change', user_data);
  });
  socket.on('socket login', function(loginData){
    var userEmail = loginData.split('/')[0];
    var userPassword = crypto.createHash('md5').update(loginData.split('/')[1]).digest("hex"); //senha md5
    var userSelection = "SELECT * FROM `PP_USER` WHERE `email` = '"+userEmail+"' AND `password` = '"+userPassword+"' LIMIT 1";
    connection.query(userSelection, function (error, results, fields) {
     if (error) {
        throw error;
      } else {
         if(results!=''){
          //Login Succeeded
          var loggedUser = false;
          //Verify if user is already logged in by looking for every single user
          for (var i = 0, len = allConnectedClients.length; i < len; i++) {
            if(currentConnections[allConnectedClients[i]].clientData!=undefined){
              if(currentConnections[allConnectedClients[i]].clientData.split('/')[2]==results[0].user) {
                //If user is logged in
                loggedUser = true;
              }
            }
          }
          if(loggedUser == false){
            socket.emit('start placement', results[0].user);
          } else {
            socket.emit('failed login', 'Usuário logado em outra janela');
          }
        } else {
          //Login Failed
          socket.emit('failed login', 'Email ou senha incorretos');
        }
      }
    });
  });
});

//.split('/')[0]

/* ==== Cria Servidor na porta ==== */

app.get('/', function(req, res){  
  res.sendFile(__dirname + '/index.html');
});

http.listen('21288', function(){  
  console.log('Server running at :'+'21288');
});