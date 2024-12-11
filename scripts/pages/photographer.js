// photographer.js - Gestion des photographes et des médias

// Classe pour le photographe
class Photographer {
    constructor({ id, name, city, country, tagline, portrait, price }) {
        this.id = id;
        this.name = name;
        this.city = city;
        this.country = country;
        this.tagline = tagline;
        this.portrait = portrait;
        this.price = price;
    }

    displayInfo() {
        const header = document.querySelector(".photograph-header");
        const button = document.querySelector(".contact_button");

        const photographInfo = document.createElement('div');
        photographInfo.classList.add('photographer-info');
        header.insertBefore(photographInfo, button);

        photographInfo.innerHTML = `
            <h1>${this.name}</h1>
            <p class="place">${this.city}, ${this.country}</p>
            <p class="tagline">${this.tagline}</p>
        `;

        const circle = document.createElement('div');
        circle.classList.add('circle-image');
        header.appendChild(circle);

        const img = document.createElement('img');
        img.src = `assets/photographers/${this.portrait}`;
        img.alt = this.name;
        circle.appendChild(img);
        circle.classList.add('circle-image');
        img.classList.add(`photographer-image-${this.id}`);

        // Création du footer avec le prix et le total des likes (initialisé à 0)
        const footer = document.createElement('div');
        footer.classList.add('footer');

        // Ajout du prix du photographe
        const priceElement = document.createElement('p');
        priceElement.classList.add('photographer-price');
        priceElement.textContent = `${this.price}€/jour`;

        const likesContainer = document.createElement('div');
        likesContainer.classList.add('likes-container');

        const totalLikesElement = document.createElement('span');
        totalLikesElement.classList.add('total-likes');
        totalLikesElement.textContent = '0';
        likesContainer.appendChild(totalLikesElement);

        const heartIcon = document.createElement('i');
        heartIcon.classList.add('fas', 'fa-heart');
        likesContainer.appendChild(heartIcon);

        footer.appendChild(likesContainer);

        footer.appendChild(priceElement);

        document.body.appendChild(footer);


    }

    bindContactButton() {
        const button = document.querySelector(".contact_button");
        button.addEventListener('click', () => {
            console.log(`Contactez ${this.name}`);
            Modal.open(this.name);
        });
    }
}

// Classe pour la galerie de médias
class MediaGallery {
    constructor(mediaList) {
        this.mediaList = mediaList;
        this.sortedMediaList = [...mediaList];
    }

    display(main) {
        const gallery = document.createElement('div');
        gallery.classList.add('media-gallery');
        main.appendChild(gallery);

        this.addSortSelector(main, gallery);  // Ajout du tri
        this.renderGallery(gallery);
    }

    renderGallery(gallery) {
        gallery.innerHTML = ''; //Vider l'ancienne galerie

        this.sortedMediaList.forEach((media) => {
            const { path, title } = media;
            const fileType = path.split('.').pop().toLowerCase();

            const mediaContainer = document.createElement('div');
            mediaContainer.classList.add('media-container');

            let mediaElement;

            // Création de l'élément média
            if (['jpg', 'png'].includes(fileType)) {
                mediaElement = document.createElement('img');
                mediaElement.src = path;
                mediaElement.alt = `Photo de ${title}`;
            } else if (fileType === 'mp4') {
                mediaElement = document.createElement('video');
                mediaElement.controls = true;

                const source = document.createElement('source');
                source.src = path;
                source.type = 'video/mp4';
                mediaElement.appendChild(source);
            }

            // Gestion de l'ouverture de la lightbox
            mediaElement.addEventListener('click', () => {
                Lightbox.open(media, this.sortedMediaList);
            });

            mediaContainer.appendChild(mediaElement);
            const mediaDetails = this.createMediaDetails(media);
            mediaContainer.appendChild(mediaDetails);
            gallery.appendChild(mediaContainer);
        });
    }

    createMediaDetails(media) {
        const { title } = media
        // Création de la section des détails (titre et likes)
        const mediaDetails = document.createElement('div');
        mediaDetails.classList.add('title-box');

        // Ajout du titre
        const mediaTitle = document.createElement('p');
        mediaTitle.textContent = title;
        mediaTitle.classList.add('media-title');

        // Section des likes
        const likeSection = document.createElement('div');
        likeSection.classList.add('like-section');

        const likeCount = document.createElement('span');
        likeCount.textContent = media.likes || 0;
        likeCount.classList.add('like-count');

        const likeButton = document.createElement('i');
        likeButton.classList.add('like-button');
        likeButton.setAttribute('aria-label', 'Ajouter un like');
        likeButton.classList.add('fas', 'fa-heart');

        // Gestion du clic sur le bouton like
        likeButton.addEventListener('click', () => {
            media.likes = media.likes === 0 ? 1 : 0;
            likeCount.textContent = media.likes;
            this.updateTotalLikes();
        });

        likeSection.appendChild(likeCount);
        likeSection.appendChild(likeButton);

        // Ajout des détails au conteneur
        mediaDetails.appendChild(mediaTitle);
        mediaDetails.appendChild(likeSection);

        return mediaDetails;
    }

    addSortSelector(main, gallery) {
        const sortContainer = document.createElement('div');
        sortContainer.classList.add('sort-container');

        const sortLabel = document.createElement('label');
        sortLabel.setAttribute('for', 'sort');
        sortLabel.textContent = 'Trier par : ';

        const sortSelect = document.createElement('select');
        sortSelect.setAttribute('id', 'sort');
        sortSelect.innerHTML = `
                <option value="">...</option>
                <option value="popularity">Popularité</option>
                <option value="date">Date</option>
                <option value="title">Titre</option>
            `;

        sortContainer.appendChild(sortLabel);
        sortContainer.appendChild(sortSelect);
        main.insertBefore(sortContainer, gallery);

        sortSelect.addEventListener('change', () => {
            this.sortMedia(sortSelect.value);
            this.renderGallery(gallery);
        });

    }

    sortMedia(criterion) {
        switch (criterion) {
            case 'popularity':
                this.sortedMediaList.sort((a, b) => (b.likes || 0) - (a.likes || 0));
                break;
            case 'title':
                this.sortedMediaList.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'date':
                this.sortedMediaList.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
        }
    }

    // Mise à jour du total des likes dans le footer
    updateTotalLikes() {
        const totalLikes = this.sortedMediaList.reduce((acc, media) => acc + (media.likes || 0), 0);
        this.updateFooter(totalLikes);
    }

    updateFooter(totalLikes) {
        const footer = document.querySelector('.footer');
        const likesElement = footer.querySelector('.total-likes');
        likesElement.textContent = `${totalLikes}`;
    }
}


// Classe pour la gestion de la modale
class Modal {
    static open(name) {
        const modal = document.querySelector('dialog');
        const modalTitle = modal.querySelector('h2');
        modalTitle.innerHTML = `Contactez-moi<br>${name}`;
        modal.showModal();
    }

    static close() {
        const modal = document.querySelector('dialog');
        modal.close();
    }
}

// Classe pour gérer la Lightbox
class Lightbox {
    static create() {
        // Créer les éléments de la lightbox
        const lightbox = document.createElement('dialog');
        lightbox.classList.add('lightbox');

        const lightboxContent = document.createElement('div');
        lightboxContent.classList.add('lightbox-content');

        const mediaContainer = document.createElement('div');
        mediaContainer.classList.add('lightbox-media');

        const titleElement = document.createElement('p');
        titleElement.classList.add('lightbox-title');

        const closeButton = document.createElement('button');
        closeButton.classList.add('lightbox-close', 'button-lightbox');
        closeButton.textContent = 'X';

        const prevButton = document.createElement('button');
        prevButton.classList.add('button-lightbox', 'prev');
        prevButton.textContent = '<';

        const nextButton = document.createElement('button');
        nextButton.classList.add('button-lightbox', 'next');
        nextButton.textContent = '>';

        // Ajouter les événements de navigation
        closeButton.addEventListener('click', () => Lightbox.close(lightbox));
        prevButton.addEventListener('click', () => Lightbox.navigate(-1));
        nextButton.addEventListener('click', () => Lightbox.navigate(1));

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') Lightbox.close(lightbox);
            if (event.key === 'ArrowLeft') Lightbox.navigate(-1);
            if (event.key === 'ArrowRight') Lightbox.navigate(1);
        });

        // Ajouter les éléments à la lightbox
        lightboxContent.append(prevButton, mediaContainer, nextButton, closeButton);
        lightbox.append(lightboxContent, titleElement);
        document.body.appendChild(lightbox);
    }

    static open(media, mediaList) {
        const lightbox = document.querySelector('.lightbox');
        Lightbox.mediaList = mediaList;
        Lightbox.currentIndex = mediaList.findIndex(m => m.path === media.path);
        Lightbox.updateContent(media);
        lightbox.showModal();
    }

    static updateContent(media) {
        const lightbox = document.querySelector('.lightbox');
        const mediaContainer = lightbox.querySelector('.lightbox-media');
        const titleElement = lightbox.querySelector('.lightbox-title');

        mediaContainer.innerHTML = '';
        titleElement.textContent = media.title;

        const fileType = media.path.split('.').pop().toLowerCase();

        if (['jpg', 'png'].includes(fileType)) {
            const img = document.createElement('img');
            img.classList.add('media-lightbox');
            img.src = media.path;
            img.alt = media.title;
            mediaContainer.appendChild(img);
        } else if (fileType === 'mp4') {
            const video = document.createElement('video');
            video.classList.add('media-lightbox');
            video.controls = true;
            const source = document.createElement('source');
            source.src = media.path;
            source.type = 'video/mp4';
            video.appendChild(source);
            mediaContainer.appendChild(video);
        }
    }

    static navigate(direction) {
        const newIndex = (Lightbox.currentIndex + direction + Lightbox.mediaList.length) % Lightbox.mediaList.length;
        Lightbox.currentIndex = newIndex;
        Lightbox.updateContent(Lightbox.mediaList[newIndex]);
    }

    static close(lightbox) {
        lightbox.close();
    }
}

// Initialisation de la Lightbox au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    Lightbox.create();
});


// Fonction principale d'initialisation
async function init() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'), 10);

    try {
        const response = await fetch("data/photographers.json");
        if (!response.ok) throw new Error("Erreur lors du chargement des données.");

        const data = await response.json();
        const photographerData = data.photographers.find(p => p.id === id);

        if (photographerData) {
            const photographer = new Photographer(photographerData);
            photographer.displayInfo();
            photographer.bindContactButton();

            const mediaResponse = await fetch("data/images-photographer.json");
            const mediaData = await mediaResponse.json();

            const firstName = photographer.name.split(' ')[0];
            const mediaList = mediaData[firstName] || [];

            const gallery = new MediaGallery(mediaList);
            gallery.display(document.querySelector('main'));
        } else {
            console.error("Photographe non trouvé.");
        }
    } catch (error) {
        console.error("Erreur :", error);
    }
}

init();
