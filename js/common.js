//REQUEST
function request (url) {
    return new Promise ((resolve, reject) => {
        fetch(url)
        .then(response => response.json())
        .then(json => resolve(json))
        .catch(error => reject(error))
    })
}

const ModalZoom = document.getElementById('modal-zoom');
let btnFavoriteZoom;
if(ModalZoom) {
    btnFavoriteZoom = ModalZoom.querySelector('.btn-gif-favorite');
}

const apiKey = '2SjS01cjlR9l2nSJvF80iM8p1IGCxINn';
const urlTrending = `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}`;
const urlSearch = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}`;
const urlTags = `https://api.giphy.com/v1/gifs/categories?api_key=${apiKey}`;
const urlSuggest = `https://api.giphy.com/v1/tags/related/{term}?api_key=${apiKey}`;
let imgFavoritos = [];
let misGifos =[];
let darkmode = false;


// FAVORITOS
if(localStorage.length > 0) {
    for (var i = 0; i < localStorage.length; i++){
        let key = localStorage.key(i);
        if(key.startsWith('favorito_')) {
            let elementFavorito = localStorageObtener(key);
        
            if(elementFavorito.images) {
                imgFavoritos.push(elementFavorito);
            }
        }
    }
}


//USED IN=> SEARCH, TRENDING (CREATE CARD)
function createCard(src, element, container, index, origin) {
    let frame = document.createElement('div');
    frame.classList.add('card-frame')

    let img = document.createElement("img");
    img.src = src;
    
    let containerGif = document.createElement("div");
    containerGif.classList.add("containerGif");

    let containerBtns =  document.createElement('div');
    containerBtns.classList.add('container-buttons');

    if(origin !== 'misgifos') {
        let buttonHover1 = document.createElement("button");
        buttonHover1.classList.add("btn-gif-favorite");
        
        //some: se verifica que el elemento existe en el array de favoritos para agregar clase active
        if(imgFavoritos.some(e => e.id === element.id)) {
            buttonHover1.classList.add('btn-gif-favorite-added');
        }
        buttonHover1.addEventListener('click', () => {
            let key = 'favorito_' + element.id
            //some: se verifica que el elemento no existe en el array de favoritos para agregarlo al array
            if(imgFavoritos.some(e => e.id === element.id) == false) {
                localStorageGuardar(key, element);
                buttonHover1.classList.add('btn-gif-favorite-added');
                imgFavoritos.push(element);
            }
            else {
                localStorageRemover(key)
                buttonHover1.classList.remove('btn-gif-favorite-added');
                imgFavoritos.splice(imgFavoritos.findIndex(e => e.id === element.id), 1);
            }
            // recarga la pagina si esta en favorito
            if(origin == 'favorito') {
                window.location.reload()
            }
        })
        containerBtns.appendChild(buttonHover1)
    }
    else {
        let buttonHover4 = document.createElement("button");
        buttonHover4.classList.add("btn-gif-trash");

        buttonHover4.addEventListener('click', ()=> {
            localStorageRemover('misgifos_'+element.id)
            misGifos.splice(misGifos.findIndex(e => e.id === element.id), 1);
            
            window.location.reload()
        })
        containerBtns.appendChild(buttonHover4)
    }
    

    let buttonHover2 = document.createElement("button");
    buttonHover2.classList.add("btn-gif-download");
    buttonHover2.addEventListener('click', () => {
        if (origin == 'trending') {
            let element = imgTrending[index];
            let url = element.images.original.url;
            download(url, element.title)
        }
        else if(origin == 'search') {
            let element = imgSearch[index];
            let url = element.images.original.url;
            download(url, element.title)
        }
        else if(origin == 'favorito') {
            let element = imgFavoritos[index];
            let url = element.images.original.url;
            download(url, element.title)
        }
        else if(origin == 'misgifos') {
            let element = misGifos[index];
            let url = element.images.original.url;
            download(url, element.title)
        }
    })
    
    let buttonHover3 = document.createElement("button");
    buttonHover3.classList.add("btn-gif-max");
    buttonHover3.dataset.index = index;
    buttonHover3.dataset.origin = origin;

    if(screen.width > 576) {
        buttonHover3.addEventListener('click', (e) => {
            Maximize(e.target.dataset.origin, e.target.dataset.index);
        })
    }
    else {
        containerGif.addEventListener('touchstart', (e) => {
            Maximize(buttonHover3.dataset.origin, buttonHover3.dataset.index);
        }, false)
    }


    let user = document.createElement("h5");
    user.classList.add("user-gif");
    user.innerText = element.username;

    let name = document.createElement("h4");
    name.classList.add("name-gif");
    name.innerText = element.title;
    frame.appendChild(img)
    containerBtns.appendChild(buttonHover2)
    containerBtns.appendChild(buttonHover3)
    containerGif.appendChild(containerBtns)
    containerGif.appendChild(user)
    containerGif.appendChild(name)
    frame.appendChild(containerGif)
    container.appendChild(frame);
}

function Maximize(origin, index) {
    let currentIndex = parseInt(index);
    ModalZoom.style.display = 'flex';
    if (origin == 'misgifos') {
        btnFavoriteZoom.style.display = 'none';
        let buttonTrash = ModalZoom.querySelector('.btn-gif-trash');
        buttonTrash.addEventListener('click', ()=> {
            localStorageRemover('misgifos_'+misGifos[index].id)
            misGifos.splice(misGifos.findIndex(e => e.id === misGifos[index].id), 1);
            
            window.location.reload()
        })
        buttonTrash.style.display = 'inline-block';
    }
    const imgZoom = ModalZoom.querySelector('img');
    const leftArrowZoom = ModalZoom.querySelector('.btn-slider-left');
    if(leftArrowZoom.getAttribute('listener') !== 'true') {
        leftArrowZoom.addEventListener('click', () => {
            if (currentIndex -1 >= 0) {
                rightArrowZoom.disabled = false;
                currentIndex -= 1;
                dataZoom(origin, currentIndex, imgZoom, usernameZoom, titleZoom)
            } 
            else {
                leftArrowZoom.disabled = true;
            }
        })

    }
    const rightArrowZoom = ModalZoom.querySelector('.btn-slider-right');
    if(rightArrowZoom.getAttribute('listener') !== 'true') {
        rightArrowZoom.addEventListener('click', () => {
            if(origin == 'search') {
                if (currentIndex +1 < imgSearch.length) {
                    leftArrowZoom.disabled = false; //MIENTRAS ME MUEVA A LA DERECHA NO ESTA DESHABILITADO EL BOTON IZQUIERDO
                    currentIndex += 1;
                    dataZoom(origin, currentIndex, imgZoom, usernameZoom, titleZoom)
                }
                else {
                    rightArrowZoom.disabled = true; 
                }
            }
            else if(origin == 'trending') {
                if (currentIndex +1 < imgTrending.length) {
                    leftArrowZoom.disabled = false;
                    currentIndex += 1;
                    dataZoom(origin, currentIndex, imgZoom, usernameZoom, titleZoom)
                }
                else {
                    rightArrowZoom.disabled = true; 
                }
            }
            else if(origin == 'favorito') {
                if (currentIndex +1 < imgFavoritos.length) {
                    leftArrowZoom.disabled = false;
                    currentIndex += 1;
                    dataZoom(origin, currentIndex, imgZoom, usernameZoom, titleZoom)
                }
                else {
                    rightArrowZoom.disabled = true; 
                }
            }
            else if(origin == 'misgifos') {
                if (currentIndex +1 < misGifos.length) {
                    leftArrowZoom.disabled = false;
                    currentIndex += 1;
                    dataZoom(origin, currentIndex, imgZoom, usernameZoom, titleZoom)
                }
                else {
                    rightArrowZoom.disabled = true; 
                }
            }
        })

    }

    const usernameZoom = ModalZoom.querySelector('h4');
    const titleZoom = ModalZoom.querySelector('h5');
    const btnDownloadZoom = ModalZoom.querySelector('.btn-gif-download');
    let element;
    console.log(origin)
    if (origin == 'trending') {
        element = imgTrending[currentIndex];
    }
    else if(origin == 'search') {
        element = imgSearch[currentIndex];
    }
    else if(origin == 'favorito') {
        element = imgFavoritos[currentIndex];
    }
    else if(origin == 'misgifos') {
        element = misGifos[currentIndex];
    }
    
    let idElement = element.id;

    btnDownloadZoom.addEventListener('click', () => {
        let url = element.images.original.url;
        download(url, element.title)
    })

    //some: se verifica que el elemento no existe en el array de favoritos para agregarlo al array
    if(imgFavoritos.some(e => e.id === idElement)) {
        btnFavoriteZoom.classList.add('btn-gif-favorite-added');
    }
    else {
        btnFavoriteZoom.classList.remove('btn-gif-favorite-added');
    }

    btnFavoriteZoom.addEventListener('click', ()=> {
        let key = 'favorito_' + idElement
        //some: se verifica que el elemento no existe en el array de favoritos para agregarlo al array
        if(imgFavoritos.some(e => e.id === idElement) === false) {
            localStorageGuardar(key, element);
            btnFavoriteZoom.classList.add('btn-gif-favorite-added');
            imgFavoritos.push(element);
        }
        else {
            localStorageRemover(key)
            btnFavoriteZoom.classList.remove('btn-gif-favorite-added');
            imgFavoritos.splice(imgFavoritos.findIndex(e => e.id === idElement), 1);
        }
        // recarga la pagina si esta en favorito
        if(origin == 'favorito') {
            window.location.reload()
        }
    })

    const btnCloseZoom = ModalZoom.querySelector('.btn-close');

    if (btnCloseZoom.getAttribute('listener') !== 'true') {
        btnCloseZoom.addEventListener('click', () => {
            ModalZoom.style.display = 'none';
        })
    }

    dataZoom(origin, currentIndex, imgZoom, usernameZoom, titleZoom)

}
//ZOOM SLIDER GIF
function dataZoom(origin, index, img, username, title) {
    if (origin == 'trending') {
        let element = imgTrending[index];
        console.log(element)
        img.src = element.images.fixed_height_downsampled.url;
        username.innerText = element.username;
        title.innerText = element.title;
    }
    else if(origin == 'search') {
        let element = imgSearch[index];
        console.log(element)
        img.src = element.images.fixed_height_downsampled.url;
        username.innerText = element.username;
        title.innerText = element.title;
    }
    else if(origin == 'favorito') {
        console.log(index)
        let element = imgFavoritos[index];
        img.src = element.images.fixed_height_downsampled.url;
        username.innerText = element.username;
        title.innerText = element.title;
    }
    else if(origin == 'misgifos') {
        console.log(index)
        let element = misGifos[index];
        img.src = element.images.fixed_height_downsampled.url;
        username.innerText = element.username;
        title.innerText = element.title;
    }
}

//DOWNLOAD GIF
function download(url, filename) {
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            const urlBlob = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = urlBlob;
            a.download = filename +'.gif';

            a.setAttribute('target', '_blank')

            a.click();

            delete a;
        });
}

//LOCAL STORAGE
function localStorageGuardar (key, element){
    let almacenar = JSON.stringify(element) //convierte en texto el objeto
    window.localStorage.setItem(key, almacenar);
}

function localStorageObtener (key){
    let obtener = JSON.parse(window.localStorage.getItem(key))
    return obtener;
}

function localStorageRemover (key){
    window.localStorage.removeItem(key)
}