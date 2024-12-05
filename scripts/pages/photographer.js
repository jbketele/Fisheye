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

const main = document.querySelector('main');

//Afficher les informations du photographe
function displayPhotographerData({ name, city, country, tagline, portrait, price }) {
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

    button.addEventListener('click', () => {
        console.log("Clic sur le bouton contact pour " + name); // Vérification avant d'appeler displayModal
        openModal(name);
    });

    getImagesPhotographer(name, price);
    displayFooter(price);
}

function getImagesPhotographer(name, price) {
    const firstName = name.split(' ')[0]; // Extraire le prénom
    console.log("Nom complet :", name);
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
                displayMediaGallery(mediaPaths, name, price);
            } else {
                console.warn(`Aucun média trouvé pour ${firstName}.`);
            }
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des médias :", error);
        });
}



function displayMediaGallery(mediaPaths, name, price) {
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
            mediaElement.setAttribute('alt', `Photo de ${name}`);
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

            const likeSection = document.createElement('span');
            titleBox.appendChild(likeSection);

            const heartIcon = document.createElement('i');
            heartIcon.classList.add('fas', 'fa-heart');
            likeSection.appendChild(heartIcon);

            const likeCount = document.createElement('span');
            likeCount.classList.add('like-count');
            likeCount.textContent = 0;

            let likes = 0;
            heartIcon.addEventListener('click', () => {
                likes = likes === 0 ? 1 : 0;
                likeCount.textContent = likes;
                heartIcon.classList.toggle('liked');

                updateTotalLikes();
            })

            likeSection.prepend(likeCount);
            gallery.appendChild(mediaContainer);
        }
    });

    // Ajouter la galerie sous les informations du photographe

    main.appendChild(gallery);

    if (!totalLikesElement) {
        totalLikesElement = displayFooter(price)
    }

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

let totalLikesElement = null;
let totalLikes = 0;

function displayFooter(price) {
    const footer = document.createElement('div');
    footer.classList.add('footer');

    const likesContainer = document.createElement('div');
    likesContainer.classList.add('likes-container');

    const totalLikesElement = document.createElement('span');
    totalLikesElement.classList.add('total-likes');
    totalLikesElement.textContent = '0';
    likesContainer.appendChild(totalLikesElement);

    const heartIcon = document.createElement('i');
    heartIcon.classList.add('fas', 'fa-heart');
    likesContainer.appendChild(heartIcon);

    footer.appendChild(likesContainer)

    const priceElement = document.createElement('span');
    priceElement.classList.add('photographer-price');
    priceElement.textContent = `${price}€/jour`;
    footer.appendChild(priceElement);

    main.appendChild(footer);
    return totalLikesElement;
}

function updateTotalLikes() {
    const likeCounts = document.querySelectorAll('.like-count');
    let total = 0;
    likeCounts.forEach(likeElement => {
        total += parseInt(likeElement.textContent, 10);
    })

    if (totalLikesElement) {
        totalLikesElement.textContent = total;
    } else {
        console.error("Élément non trouvé");
    }
    totalLikes = total;
}

function handleLikeClick(heartIcon, likeCountElement) {
    let likes = parseInt(likeCountElement.textContent, 10);
    likes = likes === 0 ? 1 : 0;
    likeCountElement.textContent = likes;

    heartIcon.classList.toggle('liked');

    updateTotalLikes();
}

function openModal(name) {
    const modal = document.querySelector('dialog');
    const modalTitle = modal.querySelector('h2');
    modalTitle.innerHTML = `Contactez-moi<br>${name}`;
    modal.showModal();
}

function closeModal() {
    dialog.close();
}