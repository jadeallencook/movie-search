const express = require('express');
const app = express();
const port = 4200;
const fetch = require('node-fetch');
require('dotenv-safe').config();

app.all('/', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.get('/', (req, res) => {
    const { query } = req.query;
    const { SECRET } = process.env;
    let url = 'https://api.themoviedb.org/3/';
    url += (query) ?
        `search/movie?api_key=${SECRET}&query=${query}` :
        `movie/popular?api_key=${SECRET}&language=en-US&page=1`;
    fetch(url)
        .then(res => res.json())
        .then(json => res.json(json));
});

app.listen(port, () => console.log(`Listening on port ${port}`));