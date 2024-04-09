const http = require("http");
const express = require("express");

const authController = require("./controllers/authController");
const socket = require("ejs/ejs");
const app=express();

app.set("view engine", "ejs");

app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.render("index", {user: req.user});
})

app.listen(3000, () => {
    console.log("Server started on http://localhost:3000");
})

var socketMain = require("socket.io")(app);

socketMain.on("connection", (socketToClient) => {
    console.log("Socket client connected");
})