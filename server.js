const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3000;

app.get('/reviews/:placeName', async (req, res) => {
    const placeName = req.params.placeName;
    const apiKey = process.env.SECRET_KEY;

    try {
        const searchResponse = await axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${placeName}&key=${apiKey}`);
        const results = searchResponse.data.results;
    
        if (results.length === 0) {
            res.json({ reviews: [], message: 'Place not found' });
            return;
        }
    
        const placeId = results[0].place_id;
        const response = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,reviews,user_ratings_total&key=${apiKey}`);
        const reviews = response.data.result.reviews;

      res.json({ reviews });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve reviews' });
    }
});
  
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});