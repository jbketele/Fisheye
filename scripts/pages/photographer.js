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
                addSortSelector(mediaPaths);
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

    mediaPaths.forEach(({ path, title }) => {
        const fileType = path.split('.').pop().toLowerCase(); // Type du fichier

        if (fileType === 'jpg' || fileType === 'png') {
            mediaElement = document.createElement('img');
            mediaElement.setAttribute('src', path);
            mediaElement.setAttribute('alt', `Photo de ${name}`);
        } else if (fileType === 'mp4') {
            mediaElement = document.createElement('video');
            mediaElement.setAttribute('controls', 'true');
            const source = document.createElement('source');
            source.setAttribute('src', path);
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

            mediaElement.addEventListener('click', () => {
                openLightbox(path, title, mediaPaths);
            })
        }
    });

    // Ajouter la galerie sous les informations du photographe

    main.appendChild(gallery);

    if (!totalLikesElement) {
        totalLikesElement = displayFooter(price)
    }

    console.log("Galerie affichée avec succès.");
}

function addSortSelector(mediaPaths) {
    // Créer le conteneur pour le tri
    const sortContainer = document.createElement('div');
    sortContainer.classList.add('sort-container');

    // Label pour le sélecteur
    const sortLabel = document.createElement('label');
    sortLabel.setAttribute('for', 'sort');
    sortLabel.textContent = 'Trier par : ';

    // Menu déroulant pour le tri
    const sortSelect = document.createElement('select');
    sortSelect.setAttribute('id', 'sort');
    sortSelect.innerHTML = `
        <option value="popularity">Popularité</option>
        <option value="date">Date</option>
        <option value="title">Titre</option>
    `;

    // Ajouter les éléments au conteneur
    sortContainer.appendChild(sortLabel);
    sortContainer.appendChild(sortSelect);

    // Insérer le conteneur avant la galerie
    const gallerySection = document.querySelector('.media-gallery');
    if (gallerySection) {
        gallerySection.parentElement.insertBefore(sortContainer, gallerySection);
    }

    // Ajouter l'écouteur d'événement pour le tri
    sortSelect.addEventListener('change', () => {
        const criterion = sortSelect.value; // Récupérer le critère sélectionné
        const sortedMedia = sortMedia(mediaPaths, criterion); // Appliquer le tri
        refreshMediaGallery(sortedMedia); // Réafficher la galerie avec les médias triés
    });
}



function sortMedia(media, criterion) {
    switch (criterion) {
        case 'popularity':
            return media.sort((a, b) => b.likes - a.likes);
        case 'title':
            return media.sort((a, b) => a.title.localeCompare(b.title));
        case 'date':
            return media;
    }
}

function refreshMediaGallery(sortedMedia) {
    const gallery = document.querySelector('.media-gallery');
    gallery.innerHTML = ''; // Vider l'ancienne galerie
    displayMediaGallery(sortedMedia); // Réafficher avec les médias triés
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

let currentIndex = 0;
let mediaList = [];

function openLightbox(mediaPath, title, mediaPaths) {
    mediaList = mediaPaths;
    currentIndex = mediaPaths.findIndex(media => media.path === mediaPath);

    lightbox = document.createElement('dialog');
    lightbox.classList.add('lightbox');

    const lightboxContent = document.createElement('div');
    lightboxContent.classList.add('lightbox-content');

    const closeButton = document.createElement('button');
    closeButton.classList.add('button-lightbox', 'lightbox-close');
    closeButton.textContent = 'X';
    closeButton.addEventListener('click', () => closeLightbox(lightbox));

    const prev = document.createElement('button');
    prev.textContent = "<";
    prev.classList.add('button-lightbox', 'prev');
    prev.addEventListener('click', () => navigateLightbox(-1, lightbox));

    const next = document.createElement('button');
    next.textContent = ">";
    next.classList.add('button-lightbox', 'next');
    next.addEventListener('click', () => navigateLightbox(1, lightbox));

    const mediaContainer = document.createElement('div');
    mediaContainer.classList.add('lightbox-media');

    const lightboxTitle = document.createElement('p');
    lightboxTitle.classList.add('lightbox-title');

    lightboxContent.appendChild(prev);
    lightboxContent.appendChild(mediaContainer);
    lightboxContent.appendChild(closeButton);
    lightboxContent.appendChild(next);
    lightbox.appendChild(lightboxContent);
    lightbox.appendChild(lightboxTitle);


    document.body.appendChild(lightbox);

    const lightboxMedia = lightbox.querySelector('.lightbox-media');

    const fileType = mediaPath.split('.').pop().toLowerCase();

    if (fileType === 'jpg' || fileType === 'png') {
        const img = document.createElement('img');
        img.setAttribute('src', mediaPath);
        img.setAttribute('alt', title);
        img.classList.add('media-lightbox');
        lightboxMedia.appendChild(img);
    } else if (fileType === 'mp4') {
        const video = document.createElement('video');
        video.setAttribute('controls', 'true');
        const source = document.createElement('source');
        source.setAttribute('src', mediaPath);
        source.setAttribute('type', 'video/mp4');
        video.classList.add('media-lightbox');
        video.appendChild(source);
        lightboxMedia.appendChild(video);
    }

    lightboxTitle.textContent = title;

    lightbox.showModal();
}
function closeLightbox(lightbox) {
    if (lightbox && lightbox.close) {
        lightbox.close();
        lightbox.remove(); // Supprime l'élément du DOM après fermeture
    } else {
        console.error("Impossible de fermer la lightbox : élément invalide ou non trouvé.");
    }
}

function navigateLightbox(direction, lightbox, mediaPaths) {
    currentIndex = (currentIndex + direction + mediaList.length) % mediaList.length;
    const newMedia = mediaList[currentIndex];

    if (newMedia) {
        updateLightboxContent(lightbox, newMedia.path);
    } else {
        console.error("Média non trouvé");
    }
}

function updateLightboxContent(lightbox, mediaPath) {
    const lightboxMedia = lightbox.querySelector('.lightbox-media');
    const lightboxTitle = lightbox.querySelector('.lightbox-title');

    // Effacer le contenu précédent
    lightboxMedia.innerHTML = '';

    // Trouver le média dans la liste pour récupérer le titre
    const media = mediaList.find(item => item.path === mediaPath);

    if (media) {
        lightboxTitle.textContent = media.title;
    } else {
        lightboxTitle.textContent = '';
        console.warn("Média introuvable dans la liste.");
    }

    // Déterminer le type de fichier
    const fileType = mediaPath.split('.').pop().toLowerCase();

    if (fileType === 'jpg' || fileType === 'png') {
        const img = document.createElement('img');
        img.setAttribute('src', mediaPath);
        img.setAttribute('alt', media.title);
        img.classList.add('media-lightbox');
        lightboxMedia.appendChild(img);
    } else if (fileType === 'mp4') {
        const video = document.createElement('video');
        video.setAttribute('controls', 'true');
        const source = document.createElement('source');
        source.setAttribute('src', mediaPath);
        source.setAttribute('type', 'video/mp4');
        video.classList.add('media-lightbox');
        video.appendChild(source);
        lightboxMedia.appendChild(video);
    }
}