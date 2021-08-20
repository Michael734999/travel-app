let projectData = {};

const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();

const fetch = require('node-fetch');
let path = require('path');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const cors = require('cors');
const { response } = require('express');
app.use(cors());

app.use(express.static('dist'));

const port = 3000;

app.listen(port, () => {
    console.log(`Running on localhost: ${port}`);
});

app.get('/', (req, res) => {
    res.sendFile('dist/index.html');
});

const geonamesAPIKey = process.env.GEONAMES_API_KEY;
const weatherbitAPIKey = process.env.WEATHERBIT_API_KEY;
const pixabayAPIKey = process.env.PIXABAY_API_KEY;

// add post route 
app.post('/data', async(req, res) => {

    const city = req.body.city;

    // construct the api urls 
    const geonamesUrl = `http://api.geonames.org/searchJSON?q=${city}&maxRows=1&username=${geonamesAPIKey}`
    const currentWeatherbitUrl = `https://api.weatherbit.io/v2.0/current?lat=${projectData.lat}&lon=${projectData.lng}&key=${weatherbitAPIKey}`;
    const futureWeatherbitUrl = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${projectData.lat}&lon=${projectData.lng}&key=${weatherbitAPIKey}`;
    const getPixabayCity = `&q=${projectData.city}&orientation=horizontal&image_type=photo`;
    const getPixabayCountry = `&q=${projectData.countryName}&orientation=horizontal&image_type=photo`;
    let pixabayUrl = `https://pixabay.com/api/?key=${pixabayAPIKey}${getPixabayCity}`;
    let imageUrl = '';

    // fetch geonames data 
    await fetch(geonamesUrl)
        .then((response) => response.json())
        .then((response) => {
            let { lat, lng, cityName, countryName } = response.geonames[0];
            projectData = {
                city: cityName,
                countryName,
                lat,
                lng
            }
        })
        .catch((error) => {
            console.log('error', error)
        });

    // fetch current weather data
    await fetch(currentWeatherbitUrl)
        .then((response) => response.json())
        .then((response) => {
            projectData = {
                ...projectData,
                currentWeather: response.projectData[0]
            }
        })
        .catch((error) => {
            console.log('error', error)
        });

    // fetch future weather data
    await fetch(futureWeatherbitUrl)
        .then((response) => response.json())
        .then((response) => {
            projectData = {
                ...projectData,
                futureWeather: response.projectData
            }
        })
        .catch((error) => {
            console.log('error', error)
        });

    // fetch pixabay data
    await fetch(pixabayUrl)
        .then((response) => response.json())
        .then((response) => {
            imageUrl = response.hits[0].webformatURL;
        })
        .catch((error) => {
            console.log('error', error)
        });

    if (imageUrl === '') {
        let pixabayUrl = `https://pixabay.com/api/?key=${pixabayAPIKey}${getPixabayCountry}`
        await fetch(pixabayUrl)
            .then((response) => response.json())
            .then((response) => {
                imageUrl = response.hits[0].webformatURL;
            })
            .catch((error) => {
                console.log('error', error)
            });
    }

    projectData = {
        ...projectData,
        imageUrl
    }

    res.send(projectData)
});