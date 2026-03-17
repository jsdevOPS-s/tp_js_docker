/*
    ********************************
        fonction qui ajoute un avis
    ********************************
*/
export function ajoutListenersAvis() {

    const piecesElements = document.querySelectorAll(".fiches article button");
 
    for (let i = 0; i < piecesElements.length; i++) {
 
        piecesElements[i].addEventListener("click", async function (event) {
 
            const id = event.target.dataset.id;

            const reponse = await fetch("http://localhost:8081/pieces/" + `${id}` + "/avis");
            const avis = await reponse.json();

            window.localStorage.setItem(`avis-piece-${id}`, JSON.stringify(avis));

            const pieceElement = event.target.parentElement;
            afficherAvis(pieceElement, avis);
        });
    }
}
 



/*
    ********************************
    fonction qui permet d'afficher
    les avis
    ********************************
*/ 
export function afficherAvis(pieceElement, avis){
    const avisElement = document.createElement("div");
    
    for (let i = 0; i < avis.length; i++) {
        avisElement.innerHTML += `<p><b>${avis[i].utilisateur}:</b> ${avis[i].commentaire}</p>`;
    }
    pieceElement.appendChild(avisElement);
}






/*
    ********************************
    fonction qui permet d'envoyer 
    un avis
    ********************************
*/
export function ajoutListenerEnvoyerAvis() {
    const formulaireAvis = document.querySelector(".formulaire-avis");

    // lorsque l'id de la piece est choisi, la piece s'affiche en miniature sous le formulaire
    const pieceIdInput = formulaireAvis.querySelector("[name=piece_id]");
    pieceIdInput.addEventListener('input', async function () {
        const pieceId = parseInt(this.value);

        // Supprimer l'aperçu précédent s'il existe
        const ancienApercu = formulaireAvis.querySelector(".apercu-piece");
        if (ancienApercu) ancienApercu.remove();

            if (!pieceId || isNaN(pieceId)) return;

            try {
                const reponse = await fetch(`http://localhost:8081/pieces/${pieceId}`);

                //  si la pièce n'existe pas
                if (!reponse.ok) {
                    const msg = document.createElement("p");
                    msg.classList.add("apercu-piece");
                    msg.textContent = "Aucune pièce trouvée pour cet ID.";
                    formulaireAvis.appendChild(msg);
                    return;
                }

                const piece = await reponse.json();

                // créer l'aperçu de la pièce
                const apercu = document.createElement("div");
                apercu.classList.add("apercu-piece");
                apercu.innerHTML = `
                    <img src="${piece.image}" alt="${piece.nom}" style="width:80px; height:auto;">
                    <p><strong>${piece.nom}</strong> — ${piece.prix} €</p>
                `;
                formulaireAvis.appendChild(apercu);

            } catch (erreur) {
                console.error("Erreur lors de la récupération de la pièce :", erreur);
            }
        
    });


    // animation de la piece lorsqu'on choisi son id
    pieceIdInput.addEventListener("input", function (event) {
        const pieceIdSaisi = event.target.value;

        const lesPieces = document.querySelectorAll(".fiches article");
        for (let i =0; i < lesPieces.length; i++) {
            lesPieces[i].style.backgroundColor =  "white";
        }               
        
        // cibler la piece
        const boutonCible = document.querySelector(`article button[data-id="${pieceIdSaisi}"]`);
            
        if (boutonCible) {
            const ficheArticle = boutonCible.parentElement;
            
            // css dans js          
            ficheArticle.style.backgroundColor = "#8b8383ff";
        }
    });


    formulaireAvis.addEventListener("submit", function (event) {
        event.preventDefault();

        // Création de l’objet du nouvel avis.
        const avis = {
            pieceId: parseInt(event.target.querySelector("[name=piece_id]").value),
            utilisateur: event.target.querySelector("[name=utilisateur]").value,
            commentaire: event.target.querySelector("[name=commentaire]").value,
            nbEtoiles: parseInt(event.target.querySelector("[name=nbEtoiles]").value)
        };
        
        // Création de la charge utile au format JSON
        const chargeUtile = JSON.stringify(avis);

        // Appel de la fonction fetch avec toutes les informations nécessaires
        fetch("http://localhost:8081/avis", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: chargeUtile
        });
    });
}








/*
    ********************************
    fonction qui affiche le graphique
    des avis
    ********************************
*/ 
export async function afficherGraphiqueAvis() {
    // Calcul du nombre total de commentaires par quantité d'étoiles attribuées
    const avis = await fetch("http://localhost:8081/avis").then(avis => avis.json());
    const nb_commentaires = [0, 0, 0, 0, 0];
    for (let commentaire of avis) {
        nb_commentaires[commentaire.nbEtoiles - 1]++;
    }

    // Légende qui s'affichera sur la gauche à côté de la barre horizontale
    const labels = ["5", "4", "3", "2", "1"];
        
    // Données et personnalisation du graphique
    const data = {
        labels: labels,
        datasets: [{
            label: "Étoiles attribuées",
            data: nb_commentaires.reverse(),
            backgroundColor: "rgba(255, 230, 0, 1)", // couleur jaune
        }],
    };

    // Objet de configuration final
    const config = {
        type: "bar",
        data: data,
        options: {
            indexAxis: "y",
        },
    };

    // Rendu du graphique
    const graphiqueAvis = new Chart(
        document.querySelector("#graphique-avis"),
        config,
    );
}



