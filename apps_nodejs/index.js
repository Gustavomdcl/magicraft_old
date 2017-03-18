var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello Node\n');
  res.end('I am a wizard\n');
  console.log('gordin');
}).listen(process.env.PORT_INDEX);
console.log('Server running at :'+process.env.PORT_INDEX);
