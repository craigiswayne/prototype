var toggle = function(t){
    const parent = t.parentNode;
    if(parent.dataset.callback && window[parent.dataset.callback]){
        window[parent.dataset.callback]();
    } else {
        console.log('callback cant be called');
    }
}
var toggle_fullscreen = function() {
    if (document.fullscreenElement === null) {
        const element = document.documentElement;
        if (element.requestFullscreen) {
            element.requestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document
        .querySelectorAll('.toggle input[type=checkbox]')
        .forEach(i => {
            i.addEventListener('change', (event) =>  toggle(i));
        })
})