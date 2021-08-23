// getWeatherBit function 
const getWeatherBit = async(daysLeft, lat, long) => {
    let format = 'hourly';
    if (daysLeft > 7) format = 'daily';

    const response = await fetch('/getWeatherbit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: `https://api.weatherbit.io/v2.0/forecast/${format}?lat=${lat}&lon=${long}` })
    })

    const weatherbit = await response.json();
    return weatherbit;
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

    const geoname = await response.json();
    return geoname;
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

    const pixabay = await response.json();
    return pixabay;
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
                ${
                    save 
                    ? '<h3>' + city + '</h3>' 
                    : '<h3>' + city + '</h3>'
                }
                <div id='time'>Your trip is in ${daysLeft} days!</div>
                </div>
                <div= id='weather'>
                    <div id='weatherInfo'>
                    <div id='temp'>${weatherbit[0].temp}</div>
                    <div>${weatherbit[0].weather.description}</div>
                    </div>
                </div>
            </div>
            <div class='tripManage'>
                <button type='button' tripID='${id}' onclick="return ${
                    save ? 'Client.save()' : 'Client.remove()'
                }">
                ${
                    save
                        ? '<div>Save</div>'
                        : '<div>Remove</div>'
                }
                ${save ? 'Save' : 'Remove'} Trip
                </button>
            </div>`;
}

// UI to show the saved trips
const showSaved = () => {
    const savedTrips = JSON.parse(
        localStorage.getItem('saved')
    );

    const save = document.getElementById('save');

    if (savedTrips != null) {
        let newFragment = new DocumentFragment();
        for (let savedTrip of savedTrips) {

            const daysLeft = Client.dateHandler(
                savedTrip.departDate
            );

            const tripList = document.createElement('div');
            tripList.classList.add('savedTrips');

            tripList.innerHTML = Client.updateUI(
                savedTrip.pixabay.webformatURL,
                savedTrip.city,
                daysLeft,
                savedTrip.weatherbit,
                savedTrip.id,
                false
            );
            newFragment.appendChild(tripList);
        }
        save.appendChild(newFragment);
    }
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

    let geoname;
    let weatherbit;
    let pixabay;

    try {
        geoname = await Client.getGeoName(city.value);
        if (geoname.geonames.length === 0) return;

        const lat = geoname.geonames[0].lat;
        const long = geoname.geonames[0].lng;

        const daysLeft = Client.dateHandler(departDate.value);

        weatherbit = await Client.getWeatherBit(daysLeft, lat, long);

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

                const tripList = Client.updateUI(
                    search.pixabay.webformatURL,
                    search.city,
                    daysLeft,
                    search.weatherbit,
                    search.id
                );

                info.innerHTML = `
                <div class='trips'>
                ${tripList}
                </div>
                `;
            })
    } catch (error) {
        console.log('error', error);
    }
};

// function to save trips 
const save = async() => {
    const save = document.getElementById('save');
    const getPost = async() => {
        const response = await fetch('/getPost');
        const search = await response.json();
        return search;
    }

    const getSave = async() => {
        const response = await fetch('/getSave');
        const savedTrips = await response.json();
        return savedTrips;
    }

    const isSaved = (saveId, save) => {
        if (save.length !== 0) {
            for (let t of save) {
                if (t.geoname.geonameId === saveId) {
                    return true;
                }
            }
            return false;
        }
    };



    let saved = await getSave();
    let search = await getPost();

    if (isSaved(search.id, saved)) { return; };

    postData('/save', search)
        .then(async(savedData) => {
            saved = await getSave();
            localStorage.setItem('saved', JSON.stringify(saved));

            const daysLeft = Client.dateHandler(savedData.departDate);
            let cityImg = savedData.pixabay.webformatURL;
            if (!cityImg) cityImg = '';

            const tripList = document.createElement('div');
            tripList.classList.add('savedTrips');

            tripList.innerHTML = Client.updateUI(
                cityImg,
                savedData.city,
                daysLeft,
                savedData.weatherbit,
                savedData.id,
                false
            );

            save.prepend(tripList);
        })
}

// function to remove trips 
const remove = async(url = '/remove', data = {}) => {
    const mainElement = event.target.closest('.trips');
    const tripId = event.target.dataset.tripId;
    data = { id: tripId };
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const saved = await response.json();

    localStorage.setItem('saved', JSON.stringify(saved));

    mainElement.remove();
}

// Exporting all functions
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
};