const http = require("http");
const app = require("./app");
var cors = require('cors')
var express = require('express')
const server = http.createServer(app);

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;
// server listening 
app.listen(4051, "192.168.10.11")