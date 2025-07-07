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
  Welcome: "Welcome to our movie app",
  Explore: "Millions of movies, TV shows and people to discover. Explore now.",
  SearchPlaceholder: "Search and explore...",
  Search: "Search",
  NowPlaying: "Now Playing",
  NoMovies: "There are no movies available"
  },
  ar: {
  Welcome : "مرحبًا بك في تطبيق الأفلام الخاص بنا",
  Explore: "ملايين من الأفلام والبرامج التلفزيونية والأشخاص لتكتشفهم. استكشف الآن.",
  SearchPlaceholder: "ابحث واستكشف...",
  Search: "بحث",
  NowPlaying : "يعرض الآن",
  NoMovies: "لا توجد أفلام متاحة"
},
  fr: {
  Welcome: "Bienvenue sur notre application de films",
  Explore: "Des millions de films, d’émissions TV et de personnes à découvrir. Explorez maintenant.",
  SearchPlaceholder: "Rechercher et explorer...",
  Search: "Rechercher",
  NowPlaying: "Actuellement à l’affiche",
  NoMovies: "Aucun film disponible"
  },
  zh: {
  Welcome: "欢迎使用我们的电影应用程序",
  Explore: "数百万部电影、电视节目和人物等你发现。立即探索。",
  SearchPlaceholder: "搜索并探索...",
  Search: "搜索",
  NowPlaying: "正在热映",
  NoMovies: "暂无可用电影"
  },
};
app.get("/api/translations", (req, res) => {
  const { lang } = req.query;
  if (!lang || !translations[lang]) {
    return res.status(400).json({ error: "Invalid or missing language code" });
  }
  res.json(translations[lang]);
});

const API_KEY = process.env.TMDB_API_KEY;

app.get("/api/tmdb", async (req, res) => {
  const { endpoint, language = "en-US", ...rest } = req.query;

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
        poster_url: item.poster_path ? IMAGE_BASE_URL + item.poster_path : null,
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
