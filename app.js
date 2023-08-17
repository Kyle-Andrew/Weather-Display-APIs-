require("dotenv").config();

const express = require("express");
const app = express();

const bodyParser = require("body-parser");

const axios = require("axios");

const _ = require("lodash");

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.render("index");
});

app.post("/", async (req, res) => {
  const config = {
    params: {
      q: req.body.cityQuery,
      appID: process.env.APP_ID,
      units: "metric",
    },
  };

  try {
    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      config
    );

    const data = response.data;

    const { rain = "No Data Available.", snow = "No Data Available." } = data;

    let weatherData = {
      city: data.name,
      weatherDescription: _.capitalize(data.weather[0].description),
      icon: data.weather[0].icon,
      temperature: data.main.temp,
      pressure: data.main.pressure,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      windDirection: data.wind.deg,
      cloudiness: data.clouds.all,
      visibility: data.visibility,
      rainfall: rain,
      snowfall: snow,
    };

    res.render("weather", { weatherData: weatherData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, function () {
  console.log("Server is running.");
});
