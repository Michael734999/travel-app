// getWeatherBit function 
const getWeatherBit = async(countdown, lat, long) => {
    let format = 'hourly';
    if (countdown >= 8) {
        format = 'daily';
    }

    const response = await fetch('/getWeatherbit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: `https://api.weatherbit.io/v2.0/forecast/${format}?lat=${lat}&lon=${long}` })
    })

    try {
        const weatherData = await response.json();
        return weatherData;
    } catch (error) {
        console.log('error', error)
    }
}

// getGeoName function
const getGeoName = async(dest) => {

    const response = await fetch('/getGeoname', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: `http://api.geonames.org/searchJSON?formatted=true&q=${dest}` })
    })

    try {
        const nameData = await response.json();
        return nameData;
    } catch (error) {
        console.log('error', error)
    }
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

    try {
        const imgData = await response.json();
        return imgData;
    } catch (error) {
        console.log('error', error)
    }
}

// date handler function
const dateHandler = (upcoming) => {
    const dif = new Date(upcoming) - new Date();
    let daysLeft = new Date(dif) / (24 * 3600 * 1000);
    daysleft = Number(math.round(daysLeft));
    return daysLeft;
}

// update the UI 
const updateUI = () => {
    return ``
}

// UI to show the saved trips
const showSaved = () => {
    const savedTrips = JSON.parse(
        localStorage.getItem('')
    );
}

// add handle submit function 

const handleSubmit = async(e) => {
    e.preventDefault();

    // const global vars 
    const city = document.getElementById('city');
    const departDate = document.getElementById('departDate');
    const info = document.getElementById('info');
    const temp = document.getElementById('temp');
    const save = document.getElementById('save');
    const form = [city, departDate];

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

        postProjectData('/savePost', projectData)
            .then(async(search) => {
                let cityImg = '';

                if (search.pixabay.webformatURL) {
                    cityImg = search.pixabay.webformatURL;
                }
            })
    } catch (error) {
        console.log('error', error);
    }

}

// Exporting all functions
export {
    getWeatherBit,
    getGeoName,
    getPixaBay,
    dateHandler
};