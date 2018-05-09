
"use strict";

(() => {
    updateClockHands();

    function updateClockHands() {
        const SECOND_HAND = document.querySelector('.clock__hand--second');
        const MINUTE_HAND = document.querySelector('.clock__hand--minute');
        const HOUR_HAND = document.querySelector('.clock__hand--hour');

        const { SECONDS, MINUTES, HOUR } = getCurrentTime();

        const SECOND_DEGREES = (SECONDS * 360 / 60) + 90;
        const MINUTE_DEGREES = (MINUTES * 360 / 60) + ((SECONDS * 360 / 60) / 60) + 90;
        const HOUR_DEGREES = (HOUR * 360 / 12) + ((MINUTES * 360 / 60) / 12) + 90;

        const transition = SECOND_HAND.style.transition;
        if(SECONDS === 0) {
            SECOND_HAND.style.transition = 'all 0s';
        } else {
            SECOND_HAND.style.transition = 'all 0.05s';
        }

        SECOND_HAND.style.transform = `rotate(${SECOND_DEGREES}deg)`;
        MINUTE_HAND.style.transform = `rotate(${MINUTE_DEGREES}deg)`;
        HOUR_HAND.style.transform = `rotate(${HOUR_DEGREES}deg)`;

        setTimeout(updateClockHands, 1000);
    }

    function getCurrentTime() {
        const now = new Date();

        return {
            SECONDS: now.getSeconds(),
            MINUTES: now.getMinutes(),
            HOUR: now.getHours(),
        }
    }
})();
