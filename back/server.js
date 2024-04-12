const http = require("http");
const express = require("express");
const fs = require("fs");
const path = require("path");
const { exec } = require('child_process');

const app=express();

app.use(express.static('public'));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));

const server = http.createServer(app);


app.get("/", (req, res) => {

    const paramValue = req.query.path;

    if (paramValue != null) {
        const gamePath = paramValue;

        //console.log(gamePath);

        res.render('index', {borneStatus: 'playing', gamePath});
    } else {
        borneStatus = "home";
        res.render("index", {borneStatus: borneStatus});
    }

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


            // Récupération des chemins des images preview
            const previewPaths = folders.map(folder => {
                const previewPath = path.join(folderPath, folder, 'preview.png');
                const sanitizedPath = fs.existsSync(previewPath) ? previewPath.substring(previewPath.indexOf('public/') + 'public/'.length) : null;
                //console.log(sanitizedPath);
                return sanitizedPath;
            });



            res.render('index', { borneStatus: 'listing', firstList, secondList, previewPaths });
        }
    });
});


server.listen(3000, () => {
    console.log("Server started on http://localhost:3000");
})