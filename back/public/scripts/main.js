document.addEventListener('DOMContentLoaded', function () {
    const tiles = document.querySelectorAll('.game-tile');
    let currentTileIndex = -1;

    document.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault(); // Empêcher le défilement de la page avec les touches fléchées

            if (event.key === 'ArrowLeft') {
                currentTileIndex = Math.max(currentTileIndex - 1, 0);
            } else if (event.key === 'ArrowRight') {
                currentTileIndex = Math.min(currentTileIndex + 1, tiles.length - 1);
            }

            tiles.forEach((tile, index) => {
                if (index === currentTileIndex) {
                    tile.classList.add('tiles-active');
                } else {
                    tile.classList.remove('tiles-active');
                }
            });
        }
    });
});