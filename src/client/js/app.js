// getWeatherBit function 
const getWeatherBit = async(daysLeft, lat, long) => {
    let format = 'hourly';
    if (daysLeft > 7) {
        format = 'daily';
    }

    const response = await fetch('/getWeatherbit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: `https://api.weatherbit.io/v2.0/forecast/${format}?lat=${lat}&lon=${long}` })
    })

    const weatherData = await response.json();
    return weatherData;
}

// getGeoName function
const getGeoName = async(city) => {

    const response = await fetch('/getGeoname', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: `http://api.geonames.org/searchJSON?formatted=true&q=${city}` })
    })

    const nameData = await response.json();
    return nameData;
}

// getPixaBay function 
const getPixaBay = async(pt, cat, safe, order, format, dest) => {

    const destination = dest.split(' ').join('+');

    const response = await fetch('/getPixabay', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: `https://pixabay.com/api/?q=${destination}&image_type=${pt}&category=${cat}&safesearch=${safe}&order=${order}&orientation=${format}` })
    })

    const imgData = await response.json();
    return imgData;
}

// date handler function
const dateHandler = (upcoming) => {
    const dif = new Date(upcoming) - new Date();
    let daysLeft = new Date(dif) / (24 * 3600 * 1000);
    daysleft = Number(math.round(daysLeft));
    return daysLeft;
}

// update the UI 
const updateUI = (pixabayImg, city, daysLeft, weatherbit, id, save = true) => {
    return `<div id='tripImg'>
                <img src ='${pixabayImg}' alt='Desination Image'>
            </div>
            <div id='tripMain'>
                <div id='tripData'>
                ${save ? '<h3>' + city + '</h3>' : '<h3>' + city + '</h3>'}
                <div id='time'>Your trip is in ${daysLeft} days!</div>
                </div>
                <div= id='weather'>
                    <div id='weatherInfo'>
                    <div id='temp'>${weatherbit[0].temp}</div>
                    <div>${weatherbit[0].weather.description}</div>
                    </div>
                </div>
            </div>`;
}

// UI to show the saved trips
const showSaved = () => {
    const savedTrips = JSON.parse(
        localStorage.getItem('')
    );
}

// add handle submit function 

const handleSubmit = async(event) => {
    event.preventDefault();

    const postData = async(url = '', data = {}) => {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return response.json();
    };

    // const global vars 
    const city = document.getElementById('city');
    const departDate = document.getElementById('departDate');
    const info = document.getElementById('info');
    const save = document.getElementById('save');

    try {
        let geoname;
        geoname = await Client.getGeoName(city.value);
        if (geoname.geonames.length === 0) return;

        const lat = geoname.geonames[0].lat;
        const long = geoname.geonames[0].lng;

        const daysLeft = Client.dateHandler(departDate.value);

        let weatherbit;
        weatherbit = await Client.getWeatherBit(daysLeft, lat, long);

        let pixabay;
        pixabay = await Client.getPixaBay(
            'photo',
            'travel',
            true,
            'popular',
            'horizontal',
            city.value
        );

        const projectData = {
            id: geoname.geonames[0].geonameId,
            departDate: departDate.value,
            city: city.value,
            geoname: {...geoname.geonames[0] },
            weatherbit: [...weatherbit.data],
            pixabay: {...pixabay.hts[0] }
        };

        postData('/savePost', projectData)
            .then(async(search) => {
                let cityImg = '';

                if (search.pixabay.webformatURL) {
                    cityImg = search.pixabay.webformatURL;
                };

                const passSearch = Client.updateUI(
                    search.pixabay.webformatURL,
                    search.city,
                    daysLeft,
                    search.weatherbit,
                    search.id
                );

                info.innerHTML = `
                <div class='tripInfo'>
                ${passSearch}
                </div>
                `;
            })
    } catch (error) {
        console.log('error', error);
    }
};

// Exporting all functions
export {
    getWeatherBit,
    getGeoName,
    getPixaBay,
    dateHandler,
    handleSubmit,
    updateUI
};