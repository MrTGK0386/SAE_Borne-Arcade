BDD :
    table infoBorne
        -Nom de la borne
        -Identifiants admin
        -Mot de passe admin
        -Status de la borne (en cours, en maintenance, arret)
        -Status dépot (disponible, indisponible)
        -runtime

    table jeu
        -id
        -launcher
        -nombre de joueurs
        -"path"
        -date_ajout
        -type
        -status

    table gameStats
        -id_jeu
        -highscore_info  (name,score)
        -total_time_played

Prérequis :
    dossier avec dossier du jeu, preview_image, config.ini