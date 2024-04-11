const http = require("http");
const express = require("express");
const fs = require("fs");
const path = require("path");

const socket = require("ejs/ejs");
const app=express();

app.use(express.static('public'));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));

const server = http.createServer(app);


app.get("/", (req, res) => {
    borneStatus = "home";
    res.render("index", {borneStatus: borneStatus});
})

app.post("/list", (req, res) => {
    const folderPath = 'public/games'; // Chemin du dossier avec les jeux

    // Lecture des dossiers dans le dossier principal
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            // Filtrer les dossiers
            const folders = files.filter(file => fs.statSync(path.join(folderPath, file)).isDirectory());

            const middleIndex = Math.ceil(folders.length / 2);
            const firstList = folders.slice(0, middleIndex);
            const secondList = folders.slice(middleIndex);

            res.render('index', { borneStatus: 'listing', firstList, secondList });
        }
    });
});


server.listen(3000, () => {
    console.log("Server started on http://localhost:3000");
})

var socketMain = require("socket.io")(server);

 socketMain.on("connection", (socketToClient) => {
    console.log("Socket client connected");
})