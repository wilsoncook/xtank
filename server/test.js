var host = "localhost", port = 1337;
//使用socket.io的尝试
/*
var io = require("socket.io").listen(port);
io.sockets.on('connection', function(socket) {
	console.log('1 Client Connected');
	socket.on('set nickname', function(name) {
		socket.set('nickname', name, function() {
			socket.emit('ready');
		});
	});
	socket.on('msg', function() {
		socket.get('nickname', function(err, name) {
			console.log('Chat message by', name);
		});
	});
	var i = 0;
	setInterval(function() {
		socket.emit('data', {a: 1, b: 2, i: i});
	}, 1000);
});
*/
var app = require('http').createServer(handler)
, io = require('socket.io').listen(app)
, fs = require('fs')

app.listen(80);

function handler (req, res) {
fs.readFile(__dirname + '/../client/test.html',
function (err, data) {
  if (err) {
    res.writeHead(500);
    return res.end(err + '<br />Error loading index.html');
  }

  res.writeHead(200);
  res.end(data);
});
}

io.sockets.on('connection', function (socket) {
socket.emit('news', { hello: 'world' });
socket.on('my other event', function (data) {
  console.log(data);
});
});

/*使用websocket库的尝试
var ws = require(__dirname + "/lib/ws/server");
var server = ws.createServer();
server.addListener("connection", function(connection){
	console.log("1 Client Conntected.\r\n");
	connection.addListener("message", function(msg){
		console.log("[SEND]" + msg + "\r\n");
		server.send(connection.id, msg);
	});
});
server.listen(port, host);
*/

/*NET方式的websocket尝试
var crypto = require("crypto");
var net = require('net');
var util = require("util");
var server = net.createServer(function(s) {
	console.log("Server Connected");
	s.on("end", function(){
		console.log("Server disconnected");
	});
	s.on("data", function(data){
		//console.log(util.inspect(data));
		console.log("[Received]", typeof(data));
		if (isHeader(data)) {
			var request = getRequest(data);
			s.write(buildWebSocketResponse(request));
		} else {
			//此处还需要草案10的Encoder和Decoder做数据传输,所以这里在chrome那端是会报错的
			s.write("Server saved your message\r\n");
		}
	});
	//s.write("You connected!\r\n");
	//s.pipe(s);
});
server.listen(port, host);
console.log("Server is listening on " + host + ":" + port);
//console.log("Max Connections: " + server.maxConnections);

function buildWebSocketResponse(request) {
	var key = request["sec-websocket-key"] + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
	var sha1 = crypto.createHash("sha1");
	key = sha1.update(key).digest("base64");
	//Build websocket header
	var crlf = "\r\n";
	var response = ["HTTP/1.1 101 Switching Protocols", 
	                "Upgrade: websocket", 
	                "Connection: Upgrade",
	                "Sec-WebSocket-Accept: " + key];
	return response.join(crlf) + crlf + crlf;
}

function getRequest(header) {
	if (typeof(header) == "object") header = header.toString();
	var tmp = header.split("\r\n");
	var hash = {};
	var delimeter = ": ";
	for (var i = 0; i < tmp.length; i++) {
		var ele = tmp[i];
		if (ele != "" && ele.indexOf(delimeter) != -1) {
			var param = ele.split(delimeter);
			hash[trim(param[0]).toLowerCase()] = trim(param[1]);
		}
	}
	return hash;
}
function isHeader(data) {
	if (typeof(data) == "object") data = data.toString();
	return /^GET \S+? HTTP\/\S+?/.test(data);
}
function trim(str) {
	return str.replace(/^\s+?|\s+?$/, "")
}
*/