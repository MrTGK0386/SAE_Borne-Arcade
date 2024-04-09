const http = require("http");
const express = require("express");

const authController = require("./controllers/authController");
const socket = require("ejs/ejs");
const app=express();

app.use(express.static('public'));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));

const server = http.createServer(app);

app.get("/", (req, res) => {
    res.render("index", {user: req.user});
})

app.post("/login", authController.login);

server.listen(3000, () => {
    console.log("Server started on http://localhost:3000");
})

var socketMain = require("socket.io")(server);

 socketMain.on("connection", (socketToClient) => {
    console.log("Socket client connected");
})