const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const authRouter = require("./auth/authRouter");

const server = express();

server.use(cors());
server.use(helmet());
server.use(express.json());

server.use("/api/v1/auth", authRouter);

server.get("/", (req, res) => {
  res.send(`<h1>API is alive</h1>`);
});

server.get("*", (req, res) => {
  res.redirect("https://nairaland.com");
});

module.exports = server;
