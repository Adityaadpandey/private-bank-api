import http from 'http';

http.createServer((req, res) => {
    message: "Hello from Auth Service!";
    res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end(JSON.stringify({
        message: "Hello from Auth Service!",
        url: req.url,
        headers: req.headers,
    }));
}).listen(3001, () => {
    console.log('Auth service running at http://localhost:3001/');
}
);
