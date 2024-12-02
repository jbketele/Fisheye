function photographerTemplate(data) {
    const { name, portrait, city, country, tagline, price, id } = data;

    const picture = `assets/photographers/${portrait}`;

    function getUserCardDOM() {
        const article = document.createElement('article');
        const link = document.createElement('a');
        const circle = document.createElement('div');
        const img = document.createElement('img');
        img.setAttribute("src", picture);
        link.setAttribute("href", `photographer.html?id=${id}`);
        const h2 = document.createElement('h2');
        h2.textContent = name;
        const p1 = document.createElement('p');
        p1.textContent = city + ", " + country;
        const p2 = document.createElement('p');
        p2.textContent = tagline;
        const p3 = document.createElement('p');
        p3.textContent = price + "€/jour";
        article.appendChild(link);
        link.appendChild(circle)
        circle.appendChild(img);
        link.appendChild(h2);
        article.appendChild(p1);
        article.appendChild(p2);
        article.appendChild(p3);
        circle.classList.add('circle-image');
        img.classList.add(`photographer-image-${id}`);
        p1.classList.add('place');
        p2.classList.add('tagline');
        p3.classList.add('price');
        return (article);
    }
    return { name, picture, getUserCardDOM }
}