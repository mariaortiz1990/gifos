const containerFavoritos = document.getElementById('favoritos-result');
const botonVerMas = document.getElementById('btn-ver-mas');
const favoritosNoResult = document.getElementById('favoritos-no-result');

imgFavoritos = [];
let pageVerMas = 0;

if(localStorage.length > 0) {
    for (var i = 0; i < localStorage.length; i++){
        let key = localStorage.key(i);
        if(key.startsWith('favorito_')) {
            favoritosNoResult.style.display = 'none';
            let elementFavorito = localStorageObtener(key);
        
            if(elementFavorito.images) {
                imgFavoritos.push(elementFavorito);
            }
        }
    }
    
    for (let i = 0; i < imgFavoritos.length; i++) {
        if (i < 12) { 
            botonVerMas.style.display = 'none';
            const element = imgFavoritos[i];
            createCard(element.images.fixed_height_downsampled.url, element, containerFavoritos, i, 'favorito');
            pageVerMas = i;
        }
        else {
            botonVerMas.style.display = 'block';
        }
    }

    botonVerMas.addEventListener('click', () => { 
        for ( let i = 0; pageVerMas < imgFavoritos.length;) { 
            if (i < 12) {
                botonVerMas.style.display = 'none';
                const element = imgFavoritos[pageVerMas];
                createCard(element.images.fixed_height_downsampled.url, element, containerFavoritos, pageVerMas, 'favorito');
                i++;
                pageVerMas++
            }
            else {
                botonVerMas.style.display = 'block';
            }
        }
    })
}

