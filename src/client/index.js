import {
    getWeatherBit,
    getGeoName,
    getPixaBay,
    dateHandler,
    handleSubmit,
    updateUI,
    remove,
    save,
    showSaved
} from './js/app';

import './styles/styles.scss';

document.addEventListener('DOMContentLoaded', () => {
    Client.showSaved();
});

export {
    getWeatherBit,
    getGeoName,
    getPixaBay,
    dateHandler,
    handleSubmit,
    updateUI,
    remove,
    save,
    showSaved
}