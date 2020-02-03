var mymap = L.map('mapid', {
  center: [48.866667, 2.333333],
  zoom: 4
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  foo: 'bar',
  attribution:
    'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
}).addTo(mymap);

var cityMarker;

for (
  var i = 0;
  i < document.getElementsByClassName('city-lat-lon').length;
  i++
) {
  var city = document.getElementsByClassName('city-lat-lon')[i];
  var cityName = city.dataset.cityName;
  var latitude = city.dataset.latitude;
  var longitude = city.dataset.longitude;
  var img = city.dataset.img;
  var myIcon = L.icon({
    iconUrl: img,
    iconSize: [50, 50],
    iconAnchor: [22, 30],
    popupAnchor: [0, -15]
  });
  cityMarker = L.marker([latitude, longitude], { icon: myIcon });
  cityMarker.addTo(mymap);
  cityMarker.bindPopup(city.textContent).openPopup();
}
