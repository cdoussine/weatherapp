/*
 * ----------------------THIS IS THE PART 3 WEATHER APP BACKEND  ---------------------------------------------
 */

/*
 * This first section will be regarding our GLOBAL SCOPE ELEMENTS ---------------------------------------------
 */

var express = require('express');
var router = express.Router();
let request = require('async-request');
var mongoose = require('mongoose');
var cityModel = require('../models/city');

// You need to put here your own api Key in order to be able to access the api data
var myWeatherAppKey = 'd86d99d569337f736f991444ff0bf39a';

/*
 * ROUTES SECTION ---------------------------------------------------------------------------------------------
 */

/* GET home page. */
router.get('/', function(req, res, next) {
  // We need to empty the session when the user is on the login page
  req.session.user = null;
  res.render('login');
});
/* GET cities page. */
router.get('/cities', async function(req, res, next) {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    // We aske our database to give us back ALL of our cities
    var citiesFind = await cityModel.find();

    res.render('index', {
      cityList: citiesFind,
      user: req.session.user,
      errMessage: null
    });
  }
});

/* Add-city. */
router.post('/add-city', async function(req, res, next) {
  // we save the form input value in the cityName element
  var cityNameFromFront = req.body.newcity;
  var cityName = cityNameFromFront.charAt(0).toUpperCase();
  cityName = cityName + cityNameFromFront.slice(1);

  var city = await cityModel.findOne({ name: cityName });

  // We initialize the language for french (cf the documentation)
  var lang = 'fr';

  // We initialize the temperature to Celcius (cf the documentation)
  var celcius = 'metric';

  // Here is our async request to access the weather data
  var data = await request(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityNameFromFront}&lang=${lang}&units=${celcius}&appid=${myWeatherAppKey}`
  );

  // We need to parse the body to be able to access the data with the format json

  body = JSON.parse(data.body);

  console.log(cityName, city);

  if (body.cod !== 200 || !cityNameFromFront) {
    console.log(body.message);
    var citiesFindAll = await cityModel.find();
    res.render('index', {
      cityList: citiesFindAll,
      user: req.session.user,
      errMessage: body.message
    });
    return;
  }

  if (city) {
    var citiesFindAll = await cityModel.find();
    res.render('index', {
      cityList: citiesFindAll,
      user: req.session.user,
      errMessage: 'city already exist'
    });
    return;
  }

  /*console.log(body);*/

  // We save the information from the api
  var descApi = body.weather[0].description;
  var tempMinApi = body.main.temp_min;
  var tempMaxApi = body.main.temp_max;
  var cityNameApi = body.name;
  var icon = 'http://openweathermap.org/img/w/' + body.weather[0].icon + '.png';
  var latitude = body.coord.lat;
  var longitude = body.coord.lon;

  //We need to optimize our temperature result for the display

  console.log('avant', tempMinApi);
  tempMinApi = tempMinApi.toFixed(0);
  tempMaxApi = tempMaxApi.toFixed(0);
  console.log('après', tempMinApi);

  // We create our new city
  var newCity = new cityModel({
    name: cityNameApi,
    desc: descApi,
    img: icon,
    temp_min: tempMinApi,
    temp_max: tempMaxApi,
    latitude: latitude,
    longitude: longitude
  });

  // We save our new city in our MongoDB
  var citySaveToDb = await newCity.save();

  // We ask our database to give us back ALL of our cities
  var citiesFindAll = await cityModel.find();

  // this will log to your console your cities collection
  console.log(`Here is our complete city database -- > ${citiesFindAll}`);

  res.render('index', {
    cityList: citiesFindAll,
    user: req.session.user,
    errMessage: null
  });
});

/* Delete-city. */
router.get('/delete-city', async function(req, res, next) {
  // 1) We Save the ID from the front
  /* As you can see, we need to use this time --> req.QUERY and not req.BODY. With GET we use query, and POST we use body.*/
  var cityId = req.query._id;

  // We need to delete this city in our database
  var cityDelete = await cityModel.deleteOne({ _id: cityId });

  // We aske our database to give us back ALL of our cities
  var citiesFindAll = await cityModel.find();

  res.render('index', {
    cityList: citiesFindAll,
    user: req.session.user,
    errMessage: null
  });
});

// export section
module.exports = router;
