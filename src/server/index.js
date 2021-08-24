let projectData = {};

let savedData = [];

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
app.use(cors());

const axios = require('axios');

app.use(express.static('dist'));

const port = 3000;

app.listen(port, () => {
    console.log(`Running on localhost: ${port}`);
});

app.get('/', (req, res) => {
    res.sendFile('dist/index.html');
});

// create api keys 
// const geonamesAPIKey = process.env.GEONAMES_API_KEY;
// const weatherbitAPIKey = process.env.WEATHERBIT_API_KEY;
// const pixabayAPIKey = process.env.PIXABAY_API_KEY;

const geonamesAPIKey = 'm_moore007';
const weatherbitAPIKey = '06464716ef0747e5b027e387a33a94f2';
const pixabayAPIKey = '22995017-915874811d25d243f662f78c0';

// get geoname post route 
app.post('/getGeoname', async(req, res) => {
    const response = await axios.get(`${req.body.url}&username=${geonamesAPIKey}`)
    res.send(response.data);
});

// get weatherbit post route 
app.post('/getWeatherbit', async(req, res) => {
    const response = await axios.get(`${req.body.url}&key=${weatherbitAPIKey}`)
    res.send(response.data);
});

// get pixabay post route 
app.post('/getPixabay', async(req, res) => {
    const response = await axios.get(`${req.body.url}&key=${pixabayAPIKey}`)
    res.send(response.data);
});

// add post route 
app.post('/savePost', (req, res) => {
    projectData = req.body;
    res.send(projectData);
})

// add get route 
app.get('/getPost', (req, res) => {
    res.json(projectData);
})

// add post route to save trips data 
app.post('/save', (req, res) => {
    let save = {...req.body };
    savedData.push(save);
    res.send(save);
})

// add a get route to access saved data 
app.get('/getSave', (req, res) => {
    res.json(savedData);
})

// add a post route to remove trips 
app.post('/remove', (req, res) => {
    const tripID = req.body.id;

    savedData = savedData.filter((search) => {
        return search.id != tripID;
    });
    res.json(savedData);
})

module.exports = app;