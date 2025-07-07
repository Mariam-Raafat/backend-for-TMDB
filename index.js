const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("✅ Backend for TMDB is running!");
});
const translations = {
  en: {
    Title: 'Movie App',
    Welcome: 'Welcome to our movie app',
    'NOW Playing': 'Now Playing',
    Watchlist: 'Watchlist',
    Search: 'Search'
  },
  ar: {
    Title: 'تطبيق الأفلام',
    Welcome: 'مرحبًا بك في تطبيق الأفلام الخاص بنا',
    'NOW Playing': 'يعرض الآن',
    Watchlist: 'المفضلة',
    Search: 'بحث'
  },
  fr: {
    Title: 'Application de Films',
    Welcome: 'Bienvenue dans notre application de films',
    'NOW Playing': 'En cours',
    Watchlist: 'Liste de souhaits',
    Search: 'Chercher'
  },
  zh: {
    Title: '电影应用程序',
    Welcome: '欢迎使用我们的电影应用程序',
    'NOW Playing': '正在播放',
    Watchlist: '愿望清单',
    Search: '搜索'
  }
};
app.get('/api/translations', (req, res) => {
  const { lang } = req.query;
  if (!lang || !translations[lang]) {
    return res.status(400).json({ error: 'Invalid or missing language code' });
  }
  res.json(translations[lang]);
});

const API_KEY = process.env.TMDB_API_KEY;

app.get("/api/tmdb", async (req, res) => {
  const { endpoint, language = 'en-US', ...rest } = req.query;

  if (!endpoint) {
    return res.status(400).json({ error: "endpoint parameter is required" });
  }

  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/${endpoint}`,
      {
        params: {
          api_key: API_KEY,
          language,
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
