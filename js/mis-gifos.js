const containerMisGifos = document.getElementById('mis-gifos-result');
const botonVerMas = document.getElementById('btn-ver-mas');
const misGifosNoResult = document.getElementById('mis-gifos-no-result');

if(localStorage.length > 0) {
    let indexGif = 0;
    for (var i = 0; i < localStorage.length; i++){
        let key = localStorage.key(i);
        if(key.startsWith('misgifos_')) {
            misGifosNoResult.style.display = 'none';
            let elementMiGifo = localStorageObtener(key);

            if(elementMiGifo.images) {
                misGifos.push(elementMiGifo);
                createCard(elementMiGifo.images.fixed_height_downsampled.url, elementMiGifo, containerMisGifos, indexGif, 'misgifos' ); //CREATECARD: COMMON
                botonVerMas.style.display = 'block';
            }
            indexGif++;
        }
    }
}

