// API Key: 11d0b9ecfe6585e3f89cfd5313bb1ded
var weatherData = {};

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const https = require("https");

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.render("index");
});

app.post("/", function (req, res) {
  const weatherDataEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  const query = "?q=" + req.body.cityQuery;
  const appID = "&appid=11d0b9ecfe6585e3f89cfd5313bb1ded";
  const units = "&units=metric";

  var weatherDataURL = weatherDataEndpoint + query + appID + units;

  https.get(weatherDataURL, function (response) {
    response.on("data", function (data) {
      weatherData = JSON.parse(data);
      console.log(weatherData);

      if (weatherData.cod !== 200) {
        res.redirect("/");
      } else {
        const city = weatherData.name;

        let weatherDescription = weatherData.weather[0].description;
        weatherDescription = weatherDescription.slice(0, 1).toUpperCase() + weatherDescription.slice(1, weatherDescription.length);

        const weatherIconURL = "https://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@4x.png";
        const temperature = weatherData.main.temp;
        const pressure = weatherData.main.pressure;
        const humidity = weatherData.main.humidity;
        const windSpeed = weatherData.wind.speed;
        const windDirection = weatherData.wind.deg;
        const cloudiness = weatherData.clouds.all;
        const visibility = weatherData.visibility;

        let rainfall;
        let snowfall;

        if ("rain" in weatherData) {
          rainfall = weatherData.rain["1h"] + " mm";
        } else {
          rainfall = "Data is currently unavailable";
        }

        if ("snow" in weatherData) {
          snowfall = weatherData.snow["1h"] + " mm";
        } else {
          snowfall = "Data is currently unavailable";
        }

        res.render("weather", {
          city: city,
          weatherDescription: weatherDescription,
          weatherIconURL: weatherIconURL,
          temperature: temperature,
          pressure: pressure,
          humidity: humidity,
          windSpeed: windSpeed,
          windDirection: windDirection,
          cloudiness: cloudiness,
          visibility: visibility,
          rainfall: rainfall,
          snowfall: snowfall,
        });
      }
    });
  });
});

app.listen(3000, function () {
  console.log("Server is running.");
});
