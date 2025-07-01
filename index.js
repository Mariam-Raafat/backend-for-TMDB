const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

const API_KEY = process.env.TMDB_API_KEY;

app.get('/api/tmdb', async (req, res) => {
  const { endpoint, ...rest } = req.query;

  if (!endpoint) {
    return res.status(400).json({ error: 'endpoint parameter is required' });
  }

  try {
    const response = await axios.get(`https://api.themoviedb.org/3/${endpoint}`, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
        ...rest
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Error fetching data from TMDb' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
