//
const inputSearch = document.getElementById('ipt-search');
const btnRight = document.getElementById('btn-search-right');
const container = document.getElementById('container-result-suggest');
const containerSearch = document.getElementById('container-btn-search');
const btnLeft = document.getElementById('btn-search-left');
const containerResult = document.getElementById('container-result');
const searchResult = document.getElementById('search-result');
const termSearchTitle = document.getElementById('h2-search-result');
const lineGray = document.getElementById('line');
const lupa = document.getElementById('btn-search-left');
const btnVerMas = document.getElementById('btn-ver-mas');
let pageVerMas = 0;
let imgSearch = [];


//SUGGEST ELEMENTS SEARCH BAR GIF
function createSuggestElement(element, container) {
    let div = document.createElement('div')
    div.classList.add('suggest-item-container')

    let item = document.createElement('a');
    item.classList.add('suggest-item');
    item.setAttribute('href', "#");
    item.addEventListener('click', addAutocompleteValue)

    let btn = document.createElement('button')
    btn.classList.add('btn-search')
    btn.classList.add('search-background-gray')

    div.appendChild(btn);
    div.appendChild(item);

    item.innerText = element.name;
    container.appendChild(div)

}

// LISTENER KEYUP SEARCH
inputSearch.addEventListener('keyup', (e)=>{
    if(e.code != 'Enter') {
        let txt = inputSearch.value;
        container.style.display = 'flex';
        btnRight.classList.add('btn-close');
        if (btnRight.getAttribute('listener') !== 'true') {
            btnRight.addEventListener('click', ()=> {
                inputSearch.value = '';
                inputSearchReset();
            })
        //EL EVALUADOR PIDIO SE ELIMINARA
        // if(txt.length > 3) { //A PARTIR DE 4 CARACTERES MUESTRA SUG
        //     container.style.display = 'flex';
        //     btnRight.classList.add('btn-close');
            //RESET ERASE TXT INPUT
         //   }

            let url = urlSuggest.replace('{term}', txt);

            containerSearch.classList.add('no-bottom-border');

            btnLeft.classList.remove('btn-background-none')

            let result = request(url).then((response)=>{
                let slicedArr = response.data.slice(0, 4); //LIMIT RESPONSE
                container.innerHTML = '';
                slicedArr.forEach(element => {
                    createSuggestElement(element, container);
                });
            })
        }
        else {
            inputSearchReset();
        }
    }
    else{
        pageVerMas = 0;
        search(null, true);
    }
});

function inputSearchReset() {
    container.innerHTML = '';
    container.style.display = 'none';
    containerSearch.classList.remove('no-bottom-border')
    btnRight.classList.remove('btn-close');
    btnLeft.classList.add('btn-background-none')
}

//AUTOCOMPLETE 
function addAutocompleteValue(e) {
    let value = e.srcElement.innerText;
    let ipt = document.getElementById('ipt-search');
    ipt.value = value;
    pageVerMas = 0;
    search(null, true);
}

//SEARCH 
function search(offset, noResult) {
    let term = inputSearch.value;
    if (offset == null) {
        searchResult.innerHTML = '';
        imgSearch = [];
    }

    let url = urlSearch +'&q='+ term + '&limit=12&offset='+offset;
    request(url).then((response) => {
        
        termSearchTitle.innerText = term;
        let containerNoResult = document.getElementById('search-no-result');

        if (response.data.length > 0 ) {
            lineGray.style.display = 'block'; 
            containerNoResult.style.display = 'none';
            btnVerMas.style.display = 'block';
            response.data.forEach((element, index) => {
                createCard(element.images.fixed_height_downsampled.url, element, searchResult, imgSearch.length, 'search' ); //CREATECARD: COMMON
                imgSearch.push(element);
            })
        }
        else {
            if (noResult === true) {
                containerNoResult.style.display = 'block';           
            }
            btnVerMas.style.display = 'none';
        }
    })
};

lupa.addEventListener('click', () => {
    pageVerMas = 0;
    search(null, true);
});

btnVerMas.addEventListener('click', () => {
    pageVerMas += 12;
    search(pageVerMas)
});