document.addEventListener('DOMContentLoaded', function () {
    let currentTileIndex = -1;
    const listeHaut = document.querySelectorAll('.li1');
    const listeBas = document.querySelectorAll('.li2');
    let currentListe = listeHaut;
    let lastListe = listeBas;

    document.addEventListener('keydown', function (event) {
        function replaySound() {
            audio.currentTime = 0; // Réinitialise la position de lecture à 0 (le début du son)
            audio.play(); // Joue le son
          }
        var audio = document.getElementById("selected");
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault(); // Empêcher le défilement de la page avec les touches fléchées
            replaySound()
            if (event.key === 'ArrowLeft') {
                currentTileIndex = Math.max(currentTileIndex - 1, 0);
            } else if (event.key === 'ArrowRight') {
                currentTileIndex = Math.min(currentTileIndex + 1, currentListe.length - 1);
            }

            currentListe.forEach((tile, index) => {
                if (index === currentTileIndex) {
                    tile.classList.add('tiles-active');
                } else {
                    tile.classList.remove('tiles-active');
                }
            });

        }
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            event.preventDefault();
            replaySound()
            if (event.key === 'ArrowDown') {
                currentListe = listeBas;
                lastListe = listeHaut;
            } else if (event.key === 'ArrowUp') {
                currentListe = listeHaut;
                lastListe = listeBas;
            }

            currentListe.forEach((tile, index) => {
                if (index === currentTileIndex) {
                    tile.classList.add('tiles-active');
                } else {
                    tile.classList.remove('tiles-active');
                }
            });

            lastListe.forEach((tile, index) => {
                tile.classList.remove('tiles-active');
            })

        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    if (borneStatus === 'home') {
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                document.querySelector('#boutonMenu').click();

            }
        })
    }
})

document.addEventListener('DOMContentLoaded', function () {
    if (borneStatus === 'listing') {
        var audio = document.getElementById("start");
        audio.play();
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
               const folderName = document.querySelector('.tiles-active').getAttribute('id');
               //console.log(folderName);
               play(folderName);
            }
        })
    }
})

function play(folder){
    const gamePath = "/?path=games/"+folder;
    //console.log(gamePath);
    window.location.href=gamePath;
}

document.addEventListener('DOMContentLoaded', function () {
    if (borneStatus === 'playing') {


        const popup = document.querySelector('#popup');
        const iframe = document.querySelector('iframe');
        console.log("entered event");

        document.addEventListener('keydown', function (event) {

            if (event.key === 'Enter') {
                event.preventDefault();
                event.stopPropagation();
                console.log("popup class changed")
                if (popup.classList.contains('on')) {
                    popup.classList.remove('on');
                } else {
                    popup.classList.add('on');
                }
            }
        })
    }
})

