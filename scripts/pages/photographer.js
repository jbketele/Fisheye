//Mettre le code JavaScript lié à la page photographer.html

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
    //rechercher les données
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

function displayPhotographerData({ name, city, country, tagline, portrait }) {
    const header = document.querySelector(".photograph-header");
    const button = document.querySelector(".contact_button");
    const photographInfo = document.createElement('div');
    photographInfo.classList.add('photogarph-info');
    const h1 = document.createElement('h1');
    h1.textContent = name;
    const p1 = document.createElement('p');
    p1.textContent = city + ", " + country;
    const p2 = document.createElement('p');
    p2.textContent = tagline;
    const circle = document.createElement('div');
    const picture = `assets/photographers/${portrait}`;
    const img = document.createElement('img');
    img.setAttribute("src", picture);
    p1.classList.add('place');
    p2.classList.add('tagline');
    header.insertBefore(photographInfo, button);
    photographInfo.appendChild(h1);
    photographInfo.appendChild(p1);
    photographInfo.appendChild(p2);
    header.appendChild(circle);
    circle.appendChild(img);
    circle.classList.add('circle-image');
    img.classList.add(`photographer-image-${id}`);
}