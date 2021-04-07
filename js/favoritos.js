const containerFavoritos = document.getElementById('favoritos-result');
const botonVerMas = document.getElementById('btn-ver-mas');
const favoritosNoResult = document.getElementById('favoritos-no-result');

imgFavoritos = [];

if(localStorage.length > 0) {
    let indexFav = 0
    for (var i = 0; i < localStorage.length; i++){
        let key = localStorage.key(i);
        if(key.startsWith('favorito_')) {
            favoritosNoResult.style.display = 'none';
            let elementFavorito = localStorageObtener(key);
        
            if(elementFavorito.images) {
                imgFavoritos.push(elementFavorito);
                createCard(elementFavorito.images.fixed_height_downsampled.url, elementFavorito, containerFavoritos, indexFav, 'favorito' ); //CREATECARD: COMMON
                botonVerMas.style.display = 'block';
            }
            indexFav++;
        }
    }
}

