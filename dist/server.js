"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const app = express();
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();
const port = 3000;
const apiKey = process.env.BRAWLSTARS_API_TOKEN_KEY;
app.use(cors());
app.get('/:playerTag', (req, res) => {
    const playerTag = req.params.playerTag;
    axios({
        method: 'get',
        url: `https://api.brawlstars.com/v1/players/%23${playerTag}`,
        headers: {
            'Authorization': `Bearer ${apiKey}`
        }
    })
        .then(response => {
        // Handle successful response
        res.send(response.data);
    })
        .catch(error => {
        // Handle error
        console.log(error);
        res.send('Player Not Found');
    });
});
app.get('/', (req, res) => {
    res.send('Send Player Tag in Url');
});
app.listen(port, () => {
    console.log(`API listening at localhost:${port}`);
});
//# sourceMappingURL=server.js.map