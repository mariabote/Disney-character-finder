'use strict';

// QUERY-SELECTOR
const allCharacterList = document.querySelector("#all-character");
const favCharacterList = document.querySelector("#favorite-character");
const searchButton = document.querySelector(".js-search-button");
const searchInput = document.querySelector(".js-search-input"); 
const urlApi = "//api.disneyapi.dev/character?pageSize=50";
const clearFavButton = document.querySelector(".js_clear_fav");


// VARIABLES DE DATOS GLOBALES
let fav = [];

   
// FUNCIONES
function renderOne (data, ulElement) {
    let newElement = document.createElement('li');
    newElement.className = "char_item";
    newElement.innerHTML+=`
        <img src="${data.imageUrl || 'https://via.placeholder.com/210x295/ffffff/555555/?text=Disney'}" />
        <h3>${data.name}</h3>
    `;
    newElement.addEventListener("click", (event)=>{
        addFav(data);
    });
    ulElement.appendChild(newElement);
}

function renderAll(dataArray, ulElement) {
    ulElement.innerHTML = "";
    dataArray.forEach(element => {
        renderOne (element, ulElement);  
    });
}

function addFav(data) {
    let elementExist = false;
    let elementIndex = -1;
    for (let i = 0; i < fav.length; i++) {
        const element = fav[i];
        if (element._id == data._id) {
            elementExist = true;
            elementIndex = i;
        }  
    }

    if (elementExist) {
        fav.splice(elementIndex, 1);
    } else {
        fav.push(data);
    }

    renderAll(fav, favCharacterList);
    //save fav in local Storage
    localStorage.setItem('fav', JSON.stringify(fav));
}

// EVENTOS
searchButton.addEventListener("click", (event) => {
    event.preventDefault();
    fetch(`${urlApi}&name=${searchInput.value}`)
        .then(response => response.json())
        .then(data => {
        renderAll(data.data, allCharacterList);
    });
});
clearFavButton.addEventListener("click",(event)=>{
    localStorage.removeItem('fav');
    fav=[];
    renderAll(fav, favCharacterList);
});


// CÓDIGO CUANDO CARGA LA PÁGINA.
fetch(urlApi)
    .then(response => response.json())
    .then(data => {
    renderAll(data.data, allCharacterList);
});
fav = JSON.parse(localStorage.getItem('fav') || "[]");
renderAll(fav, favCharacterList);
