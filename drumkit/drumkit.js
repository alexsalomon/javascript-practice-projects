
"use strict";

(() => {
    document.addEventListener('keyup', event => {
        const pressedKeyCode = event.code;
        const keyBox = document.querySelector(`.drumkit__key-box[data-key="${pressedKeyCode}"]`);

        if(keyBox) {
            playAnimation(keyBox);
            playAudio(pressedKeyCode);
        }
    });

    const drumkit = document.querySelector('.drumkit');
    drumkit.addEventListener('transitionend', event => {
        if(event.target.classList.contains('drumkit__key-box') && event.propertyName === 'transform') {
            const keyBox = event.target;
            revertAnimation(keyBox);
        }
    });

    function playAnimation(keyBox) {
        keyBox.classList.add('drumkit__key-box--playing');
    }

    function revertAnimation(keyBox) {
        keyBox.classList.remove('drumkit__key-box--playing');
    }

    function playAudio(keyCode) {
        const audio = document.querySelector(`audio[data-key="${keyCode}"`);
        if(audio) {
            audio.currentTime = 0; // Rewind audio to the start so we can play it again
            audio.play();
        }
    }
})();
