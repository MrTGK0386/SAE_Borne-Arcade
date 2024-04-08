const http = require("http");
const express = require("express");
const request = require("request");
const lecteur = require("fs");

const authController = require("./controllers/authController");
const app=express();

app.set("view engine", "ejs");

app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.render("index", {user: req.user});
})

app.listen(3000, () => {
    console.log("Server started on http://localhost:3000");
})