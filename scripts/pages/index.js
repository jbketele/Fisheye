const fetch = require('node-fetch');

async function getPhotographers() {
    try {
        const response = await fetch("data/photographers.json")
        if (!response.ok) {
            throw new Error("Erreur de récupération de données")
        }
        const data = await response.json();
        const photographers = data.photographers;
        console.log(photographers);
        // et bien retourner le tableau photographers seulement une fois récupéré
        return {
            photographers
        };
    } catch (error) {
        console.error("Erreur :", error);
        return {    
            photographers: []
        };
    }

}

async function displayData(photographers) {
    const photographersSection = document.querySelector(".photographer_section");

    photographers.forEach((photographer) => {
        const photographerModel = photographerTemplate(photographer);
        const userCardDOM = photographerModel.getUserCardDOM();
        photographersSection.appendChild(userCardDOM);
    });
}

async function init() {
    // Récupère les datas des photographes
    const { photographers } = await getPhotographers();
    displayData(photographers);
}

init();

