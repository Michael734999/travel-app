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
const { response } = require('express');
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
const geonamesAPIKey = process.env.GEONAMES_API_KEY;
const weatherbitAPIKey = process.env.WEATHERBIT_API_KEY;
const pixabayAPIKey = process.env.PIXABAY_API_KEY;

// get geoname post route 
app.post('/getGeoname', async(req, res) => {
    const get = await axios.get(`${req.body.url}&username=${geonamesAPIKey}`)
    res.send(get.data);
});

// get weatherbit post route 
app.post('/getWeatherbit', async(req, res) => {
    const get = await axios.get(`${req.body.url}&username=${weatherbitAPIKey}`)
    res.send(get.data);
});

// get pixabay post route 
app.post('/getPixabay', async(req, res) => {
    const get = await axios.get(`${req.body.url}&username=${pixabayAPIKey}`)
    res.send(get.data);
});

// add post route 
app.post('/savePost', (req, res) => {
    projectData = req.body;
    res.send(projectData);
})

// add get route 
app.get('/getPost', (req, res) => {
    res.json(savedData);
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
    const trip = req.body.id;

    savedData = savedData.filter((current) => {
        return current.id != trip;
    });
    res.json(savedData)
})