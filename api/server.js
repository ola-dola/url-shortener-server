const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const server = express();

server.use(cors());
server.use(helmet());
server.use(express.json());

server.get("/", (req, res) => {
  res.send(`<h1>API is alive</h1>`);
});

module.exports = server;
