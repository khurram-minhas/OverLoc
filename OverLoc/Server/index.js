const http = require("http");
const app = require("./app");
var cors = require('cors')
const server = http.createServer(app);

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;
// server listening 

app.listen(3000, "localhost");