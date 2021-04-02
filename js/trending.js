let imgTrending = [];

//SUGGEST TRENDING
function createLink(suggest, container) {
    let a = document.createElement("span");
    a.innerHTML = suggest;
    container.appendChild(a);
}

const containerSuggestTrending = document.getElementById('p-giphy-suggest-trending');

if(containerSuggestTrending != null) {
    request(urlTags).then((response ) => {
        //console.log(response)
        createLink(response.data[21].name + ', ', containerSuggestTrending);
        createLink(response.data[15].name + ', ', containerSuggestTrending);
        createLink(response.data[23].name + ', ', containerSuggestTrending);
        createLink(response.data[24].name + ', ', containerSuggestTrending);
        createLink(response.data[4].name, containerSuggestTrending);    
    })    
}

//CAROUSEL
request(urlTrending).then((response ) => {
    let container = document.getElementById('gif-trending-embed');
    response.data.forEach((element, index) => {
        if (index < 6) {
            createCard(element.images.fixed_height.url, element, container, imgTrending.length, 'trending'); //CREATECARD: COMMON
            imgTrending.push(element)
        }
    })
})

const leftBotton = document.getElementById('btn-slider-left');
const rightBotton = document.getElementById('btn-slider-right');
const containerGif = document.getElementById('container-gif'); //PAPA
const containerCarrousel = document.getElementById('container-carousel'); //HIJO
const containerTrack = document.getElementById('gif-trending-embed'); //NIETO

let width = containerCarrousel.offsetWidth; //DEVUELVE EL ANCHO DEL LAYOUT DEL ELEMENTO (GIF)
let index = 0;

window.addEventListener('resize', function () { //VENTANA QUE CONTIENE EL DOCUMENTO
    width = containerCarrousel.offsetWidth;
})
rightBotton.addEventListener('click', function(e) {
    leftBotton.disabled = false; //MIENTRAS ME MUEVA A LA DERECHA NO ESTA DESHABILITADO EL BOTON IZQUIERDO
    console.log(containerTrack.offsetWidth - (index * width))
    if (containerTrack.offsetWidth - (index * width) > width)  {
        index = index + 1;
        containerTrack.style.transform = "translateX(" + index * -width + "px)";
    }
    console.log(containerTrack.offsetWidth - (index * width))
    console.log(width)
    if (containerTrack.offsetWidth - (index * width) <= width) { //LLEGA HASTA EL 6TO ELEMENTO Y NO PERMITE HACER MAS CLICK
        rightBotton.disabled = true;
    } 
});
leftBotton.addEventListener("click", function () {
    index = index - 1;
    rightBotton.disabled = false;
    if (index === 0) {
      leftBotton.disabled = true;
    }
    containerTrack.style.transform = "translateX(" + index * -width + "px)";
  });
  
