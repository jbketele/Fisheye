//Mettre le code JavaScript lié à la page photographer.html

//Récupérer l'ID dans l'URL
const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get('id'), 10);
console.log("id récupéré :", id);

//Charger les données du JSON
fetch("data/photographers.json")
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors du chargement des données.');
        }
        return response.json();
    })

    .then(data => {
        console.log("Données chargées : ", data.photographers);
        const photographer = data.photographers.find(p => p.id === id);
        console.log("ID recherché", id);
        console.log("Photographe correspondant : ", photographer);
        if (photographer) {
            displayPhotographerData(photographer);
        } else {
            console.error("Non trouvé");
        }
    })
    .catch(error => {
        console.error('Erreur :', error);
    });

//Afficher les informations du photographe
function displayPhotographerData({ name, city, country, tagline, portrait }) {
    const header = document.querySelector(".photograph-header");
    const button = document.querySelector(".contact_button");

    //Infos
    const photographInfo = document.createElement('div');
    photographInfo.classList.add('photogarph-info');
    header.insertBefore(photographInfo, button);

    //Nom
    const h1 = document.createElement('h1');
    h1.textContent = name;
    photographInfo.appendChild(h1);

    //Ville et Pays
    const p1 = document.createElement('p');
    p1.textContent = city + ", " + country;
    p1.classList.add('place');
    photographInfo.appendChild(p1);

    //Slogan
    const p2 = document.createElement('p');
    p2.textContent = tagline;
    photographInfo.appendChild(p2);
    p2.classList.add('tagline');

    //Photo de profil
    const circle = document.createElement('div');
    header.appendChild(circle);
    const picture = `assets/photographers/${portrait}`;
    const img = document.createElement('img');
    img.setAttribute("src", picture);
    circle.appendChild(img);
    circle.classList.add('circle-image');
    img.classList.add(`photographer-image-${id}`);

    getImagesPhotographer(name);
}

function getImagesPhotographer(photographerName) {
    const firstName = photographerName.split(' ')[0]; // Extraire le prénom
    console.log("Nom complet :", photographerName);
    console.log("Prénom utilisé pour les médias :", firstName);

    fetch("data/images-photographer.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Erreur lors du chargement des médias.");
            }
            return response.json();
        })
        .then(mediaData => {
            const mediaPaths = mediaData[firstName]; // Obtenir les médias du prénom
            if (mediaPaths && mediaPaths.length > 0) {
                console.log(`Médias trouvés pour ${firstName}:`, mediaPaths);
                displayMediaGallery(mediaPaths, photographerName);
            } else {
                console.warn(`Aucun média trouvé pour ${firstName}.`);
            }
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des médias :", error);
        });
}

function displayMediaGallery(mediaPaths, photographerName) {
    const gallery = document.createElement('div');
    gallery.classList.add('media-gallery');

    mediaPaths.forEach(mediaPath => {
        const fileType = mediaPath.split('.').pop().toLowerCase(); // Type du fichier
        let mediaElement;
        let fileName = mediaPath.split('/').pop().split('.')[0];

        title = titleFileName(fileName);

        if (fileType === 'jpg' || fileType === 'png') {
            mediaElement = document.createElement('img');
            mediaElement.setAttribute('src', mediaPath);
            mediaElement.setAttribute('alt', `Photo de ${photographerName}`);
        } else if (fileType === 'mp4') {
            mediaElement = document.createElement('video');
            mediaElement.setAttribute('controls', 'true');
            const source = document.createElement('source');
            source.setAttribute('src', mediaPath);
            source.setAttribute('type', 'video/mp4');
            mediaElement.appendChild(source);
        }

        if (mediaElement) {
            const mediaContainer = document.createElement('div');
            mediaContainer.classList.add('media-container');
            mediaContainer.appendChild(mediaElement);

            const titleBox = document.createElement('div');
            titleBox.classList.add('title-box');
            mediaContainer.appendChild(titleBox);
            const titleElement = document.createElement('p');
            titleElement.textContent = title;
            titleBox.appendChild(titleElement);

            const heartIcon = document.createElement('i');
            heartIcon.classList.add('fas', 'fa-heart');
            titleBox.appendChild(heartIcon);

            gallery.appendChild(mediaContainer);
        }
    });

    // Ajouter la galerie sous les informations du photographe
    const main = document.querySelector('main');
    main.appendChild(gallery);

    console.log("Galerie affichée avec succès.");
}

function titleFileName(fileName) {
    const titles = {
        "Animals_Rainbow": "Arc-en-ciel",
        "Animals_Wild_Horses_in_the_mountains": "Chevaux sauvages",
        "Event_BenevidesWedding": "Mariage Benevides",
        "Event_PintoWedding": "Mariage Pinto",
        "Event_SeasideWedding": "Mariage à la mer",
        "Portrait_Background": "Portrait noir et blanc",
        "Portrait_Nora": "Portrait de Nora",
        "Portrait_Wednesday": "Portrait de mercredi",
        "Travel_HillsideColor": "Couleurs",
        "Travel_Lonesome": "Solitude"
    };

    return titles[fileName] || fileName;
}
