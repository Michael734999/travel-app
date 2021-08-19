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

app.get('/data', () => {
    res.send({
        geonamesAPIKey: geonamesAPIKey,
        weatherbitAPIKey: weatherbitAPIKey,
        pixabayAPIKey: pixabayAPIKey,
    })
});

app.get('/get', (req, res) => {
    res.send(projectData)
});

app.post('/post', (req, res) => {
    projectData = req.body;
    res.send({
        message: 'Reseived Post'
    });
    console.log(projectData)
})