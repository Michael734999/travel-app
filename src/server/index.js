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

const port = 8081;

app.listen(port, () => {
    console.log(`Running on localhost: ${port}`);
});

app.get('/', (req, res) => {
    res.sendFile('dist/index.html');
});