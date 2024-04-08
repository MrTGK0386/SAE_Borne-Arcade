const http = require("http");
const request = require("request");
const lecteur = require("fs");

var compteur;

var serveur = http.createServer(function (req, res) {
    // message de retour
    var pageDemande = req.url;
    if (pageDemande == '/' || pageDemande == '/index.html') {
        lecteur.readFile('index.html', 'utf-8', function (err, content) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(content);
            res.end()
            console.log("Reponse envoyé !");
        })
    } else if (pageDemande == '/pouet' || pageDemande == '/funny') {
        lecteur.readFile('pouet.html', 'utf-8', function (err, content) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(content);
            res.end();
            console.log("Reponse envoyé !");
        })
    } else if (pageDemande == '/lol') {
        res.setHeader("Content-Type", "text/html");
        res.write(`<h1>Hello World! Vous avez vu la page lol ${compteur} fois</h1>`);
        res.end();
        console.log("Reponse envoyé !");
    }

    compteur ++;
    console.log("Une requete a ete detecte");
    console.log(req.url);
}).listen(1234);

//on charge socket.io et on le branche au serveur http en cours
var sockPrincipale = require("socket.io")(serveur);
//Quand un client se connecte, on lui crée une socket dédié

sockPrincipale.on("connection", function(sockVersClient) {
    console.log("Un client est connecté !"); // on affiche un message console
    sockVersClient.on("reponseDuClient", async function (mes){
        console.log("Réponse reçu");
        const coupServer = await randInt(shifumi);
        await playShifumi(mes,coupServer,sockVersClient);
        sockVersClient.emit('emojiJoueur',PlayerEmoji);
        sockVersClient.emit('emojiServer',ServerEmoji);
        sockVersClient.emit('scoreJoueur',pointPlayer);
        sockVersClient.emit('scoreServer',pointServer);

    });
});

console.log(`Serveur lancé sur : http://localhost:1234`);