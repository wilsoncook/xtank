<?php
function getheaders($req){
    $r=$h=$o=null;
    if(preg_match("/GET (.*) HTTP/"   ,$req,$match)){ $r=$match[1]; }
    if(preg_match("/Host: (.*)\r\n/"  ,$req,$match)){ $h=$match[1]; }
    if(preg_match("/Origin: (.*)\r\n/",$req,$match)){ $o=$match[1]; }
    return array($r,$h,$o);
}
$socket = socket_create(AF_INET, SOCK_STREAM, getprotobyname('tcp'));
socket_set_nonblock($socket);
socket_bind($socket, 'localhost', 1337);
socket_listen($socket);

while (TRUE) {
	$conn = socket_accept($socket);
	if ($conn) {
		echo "Socket conntected\r\n";
		echo "Something is in the buffer...sending data...\r\n";
		/*[WebSocket协议握手部分]
		socket_recv($conn,$cache,2048,0);
		//$cache = socket_read($conn, 2048, PHP_NORMAL_READ);

		list($resource, $host, $origin) = getheaders($cache);
		//echo "[DEBUG]====\r\n";
		//echo $resource, $host, $origin;
		//握手
		$upgrade = "HTTP/1.1 101 Web Socket Protocol Handshake\r\n" .
					"Upgrade: WebSocket\r\n" .
					"Connection: Upgrade\r\n" .
					"WebSocket-Origin: " . $origin . "\r\n" .
					"Sec-WebSocket-Accept: " . "d" . "\r\n" .
					"WebSocket-Location: ws://" . $host . $resource . "\r\n";
		socket_write($conn, $upgrade.chr(0), strlen($upgrade.chr(0)));
		*/
		//send test data
		for ($i=0; $i<10; $i++) {
			socket_write($conn, '[TEST DATA]');
			sleep(1);
		}
		/*
		while ($data = socket_read($conn, 1024, PHP_NORMAL_READ)) {
			if ($data == 'bye') break;
			$buffer = $data;
			socket_write($conn, "Information Received\r\n");
			echo "Buffer:".$buffer."\r\n";
		}
		*/
		socket_close($conn);
		echo "Closed the socket\r\n";
	}
	sleep(1);
}