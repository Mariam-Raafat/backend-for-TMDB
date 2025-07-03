const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("✅ Backend for TMDB is running!");
});

const API_KEY = process.env.TMDB_API_KEY;

app.get("/api/tmdb", async (req, res) => {
  const { endpoint, ...rest } = req.query;

  if (!endpoint) {
    return res.status(400).json({ error: "endpoint parameter is required" });
  }

  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/${endpoint}`,
      {
        params: {
          api_key: API_KEY,
          language: "en-US",
          ...rest,
        },
      }
    );

    let data = response.data;

    if (data.results && Array.isArray(data.results)) {
      const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

      data.results = data.results.map((item) => ({
        ...item,
        poster_url: item.poster_path
          ? IMAGE_BASE_URL + item.poster_path
          : null,
      }));

      console.log("✅ poster_url mapping done");
    } else {
      console.log("❌ No results to map");
    }

    res.json(data);
  } catch (error) {
    console.error("❌ Error fetching TMDB data:", error.message);
    res.status(500).json({ error: "Error fetching data from TMDb" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
