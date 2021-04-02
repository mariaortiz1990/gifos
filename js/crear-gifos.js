const buttonComenzar = document.getElementById('crear-gifo-comenzar');
const buttonGrabar = document.getElementById('crear-gifo-grabar');
const buttonFinalizar = document.getElementById('crear-gifo-finalizar');
const buttonSubir = document.getElementById('crear-gifo-subir');
const buttonStep1 = document.getElementById('step-one');
const buttonStep2 = document.getElementById('step-two');
const buttonStep3 = document.getElementById('step-three');
const containerVideoMessage = document.getElementById('video-message');
const containerVideoHover = document.getElementById('video-hover');
const containerVideo = document.querySelector('video');
const counterHours = document.getElementById('hours');
const counterMinutes = document.getElementById('minutes');
const counterSeconds = document.getElementById('seconds');
const videoTime = document.getElementById('video-time');
const buttonRepetir = document.getElementById('btn-repetir');
const checked = document.getElementById('create-gifo-loader');
const buttonDescargar = document.getElementById('create-gifo-download');
const buttonCompartir = document.getElementById('create-gifo-compartir');

const urlUploadEndpoint = 'https://upload.giphy.com/v1/gifs';
const urlGetGifEndpoint = 'https://api.giphy.com/v1/gifs/';
 
var seconds = 0;

const constraints = { audio: false, 
    video: {
        height: { max: 480 },
        width: 480
    }
};
let promesaMedia;



//EVENTO COMENZAR
buttonComenzar.addEventListener('click', () => {
    containerVideoMessage.querySelector('h2').innerText = '¿Nos das acceso \n a tu cámara?';
    containerVideoMessage.querySelector('p').innerText = 'El acceso a tu camara será válido sólo \n por el tiempo en el que estés creando el GIFO.';
    buttonStep1.classList.add('active');
    
    getUserMedia();
})

//EVENTO GRABAR
let timer;
let recorder;
buttonGrabar.addEventListener('click', () => {
    buttonStep1.classList.remove('active');
    buttonStep2.classList.add('active');
    buttonGrabar.style.display = 'none';
    buttonFinalizar.style.display = 'block';
    timer = setInterval(setTime, 1000);

    promesaMedia.then(async function(stream) {
        recorder = RecordRTC(stream, {
            type: 'gif'            
        });
        recorder.startRecording();
    });
})

buttonFinalizar.addEventListener('click', () => {
    buttonFinalizar.style.display = 'none';
    buttonSubir.style.display = 'block';
    clearInterval(timer);
    recorder.stopRecording();
    containerVideo.pause()
    videoTime.style.display = 'none';
    buttonRepetir.style.display = 'block';
})

//EVENTO REPETIR CAPTURA
buttonRepetir.addEventListener('click', () => {
    containerVideo.style.display = 'flex';
    let promesaMedia;
    buttonRepetir.style.display = 'none';
    videoTime.style.display = 'block';
    buttonSubir.style.display = 'none';
    buttonGrabar.style.display = 'block';
    counterSeconds.innerHTML = '00';
    counterMinutes.innerHTML = '00';
    counterHours.innerHTML = '00';
    seconds = 0;
    getUserMedia();
})

//SUBIR GIFOS
let currentUploadedGifo;
buttonSubir.addEventListener('click', ()=> {
    buttonStep2.classList.remove('active');
    buttonStep3.classList.add('active');
    buttonSubir.style.display = 'none';
    buttonRepetir.style.display = 'none';

    containerVideoHover.style.display = 'flex';
    let form = new FormData();
    form.append('file', recorder.getBlob(), 'myGif.gif');
    form.append('username', 'MaruGifo');

    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", (e)=> {
        stopStreamedVideo();
        //containerVideo.srcObject = null;

        checked.classList.add('create-gifo-loader');
        const paragraph = containerVideoHover.querySelector('p').innerText = 'GIFO subido con éxito';
        buttonDescargar.style.display = 'inline-block';
        buttonCompartir.style.display = 'inline-block';  
        let result = JSON.parse(e.target.response)
        request(urlGetGifEndpoint + result.data.id + "?api_key="+apiKey)
        .then((response)=> {        
            currentUploadedGifo = response.data;
            let key = 'misgifos_' + currentUploadedGifo.id
            localStorageGuardar(key, currentUploadedGifo);
            misGifos.push(currentUploadedGifo)
        })


    });
    oReq.addEventListener("progress", (progress)=> {

    });
    oReq.addEventListener("error", (error)=> {
        console.error(error)
    });
    oReq.open("POST", urlUploadEndpoint+"?api_key="+apiKey);
    oReq.send(form)
})

//EVENTO DESCARGAR
buttonDescargar.addEventListener('click', () => {
    invokeSaveAsDialog(recorder.getBlob());
})
//EVENTO COMPARTIR
buttonCompartir.addEventListener('click', () => {
    console.log(currentUploadedGifo.url);
    getlink();
    alert("El enlace se ha añadido al portapapeles");


})

function getlink() {
    var aux = document.createElement("input");
    aux.setAttribute("value", currentUploadedGifo.url);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
    }


function getUserMedia() {
    promesaMedia = navigator.mediaDevices.getUserMedia(constraints);
    promesaMedia.then(function(stream) {
        buttonComenzar.style.display = "none";
        buttonGrabar.style.display = "block";
        containerVideoMessage.style.display = 'none';
        containerVideo.style.display = 'flex';
        containerVideo.srcObject = stream;
        containerVideo.play()
    })
}



//CONTADOR TIEMPO GRABACION
function setTime()
{
    ++seconds;
    counterSeconds.innerHTML = pad(seconds%60);
    counterMinutes.innerHTML = pad(parseInt(seconds/60));
    counterHours.innerHTML = pad(parseInt(seconds/360));
    videoTime.style.display = 'block';

}

function pad(val)
{
    var valString = val + "";
    if(valString.length < 2)
    {
        return "0" + valString;
    }
    else
    {
        return valString;
    }
}

//PARAR CAMARA
function stopStreamedVideo() {
    const stream = containerVideo.srcObject;
    const tracks = stream.getTracks();
  
    tracks.forEach(function(track) {
      track.stop();
    });
}

