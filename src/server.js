const http = require("http");
const fs = require('fs').promises;

const host = 'localhost';
const port = 8000;

const requestListener = function (req, res) {
    const fileName = __dirname + "/../.deploy/index.html";
    console.log('Getting file: ', fileName);
    fs.readFile(fileName)
        .then(contents => {
            res.setHeader("Content-Type", "text/html");
            res.writeHead(200);
            res.end(contents);
        }).catch(err => {
            res.writeHead(500);
            res.end(err);
            return;
        });
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});