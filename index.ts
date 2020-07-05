import * as net from 'net';

const server = net.createServer((conn) => {
  console.log('browser connected');
  conn.on('end', () => {
    console.log('browser disconnected');
  });
  conn.on('data', (data) => {
    console.log("REQ:", data.toString('utf8'));

    var is_kernel_buffer_full = conn.write(response+body)
    if(is_kernel_buffer_full){
      console.log('Data was flushed successfully from kernel buffer i.e written successfully!');
    }else{
      conn.pause();
    }
  })
  conn.on('drain', () => {
    console.log("drain finished");
    conn.resume();
  })
})
server.listen(2000);

let body = `<html>
  <head>
    <title>An Example Page</title>
  </head>
  <body>
    <p>Hello World, this is a very simple HTML document.</p>
  </body>
</html>
`;

let response = `HTTP/1.1 200 OK
Content-Type: text/html; charset=UTF-8
Content-Length: ${body.length}
Last-Modified: Wed, 08 Jan 2003 23:11:55 GMT
Server: Node.js
Connection: close

`;