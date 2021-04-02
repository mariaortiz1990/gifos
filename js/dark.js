const modoNocturno = document.querySelector('.btn-dark');
const bodyDark = document.querySelector('body')


if(window.localStorage.getItem('darkmode') === 'true') {
    bodyDark.classList.add('dark-mode');
    darkmode = true;
}

modoNocturno.addEventListener('click', () => {
    bodyDark.classList.toggle('dark-mode');
    if(darkmode === true) {
        darkmode = false;
    }
    else {
        darkmode = true;
    }
    window.localStorage.setItem('darkmode', darkmode);
})
