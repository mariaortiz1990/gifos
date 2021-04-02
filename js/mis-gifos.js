const containerMisGifos = document.getElementById('mis-gifos-result');
const botonVerMas = document.getElementById('btn-ver-mas');
const misGifosNoResult = document.getElementById('mis-gifos-no-result');

let pageVerMas = 0;

if(localStorage.length > 0) {
    for (var i = 0; i < localStorage.length; i++){
        let key = localStorage.key(i);
        if(key.startsWith('misgifos_')) {
            misGifosNoResult.style.display = 'none';
            let elementMiGifo = localStorageObtener(key);

            if(elementMiGifo.images) {
                misGifos.push(elementMiGifo);
            }
        }
    }
    for (let i = 0; i < misGifos.length; i++) {
        if (i < 12) { 
            botonVerMas.style.display = 'none';
            const element = misGifos[i];
            createCard(element.images.fixed_height_downsampled.url, element, containerMisGifos, i, 'misgifos');
            pageVerMas = i;
        }
        else {
            botonVerMas.style.display = 'block';
        }
    }

    botonVerMas.addEventListener('click', () => { 
        for ( let i = 0; pageVerMas < misGifos.length;) { 
            if (i < 12) {
                botonVerMas.style.display = 'none';
                const element = misGifos[pageVerMas];
                createCard(element.images.fixed_height_downsampled.url, element, containerMisGifos, pageVerMas, 'misgifos');
                i++;
                pageVerMas++
            }
            else {
                botonVerMas.style.display = 'block';
            }
        }
    })

}

