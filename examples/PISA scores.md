The [Program for International Student Assesment (PISA)](https://en.wikipedia.org/wiki/Programme_for_International_Student_Assessment) is an international study conducted by the OECD. It measures the evolution of the performance of 15 years old pupils on mathematics, science and reading in different countries.

This document demonstrates how to use the `leaflet.minichart` plugin to represent over a leaflet map the scores of the pupils of the different countries.

## Data

The data to represent has the following format:

```javascript
var data = [
  {"year":2015,"country":"Australia","math":494,"reading":503,"science":510,"lon":133.7751,"lat":-25.2744},
  {"year":2015,"country":"Austria","math":497,"reading":485,"science":495,"lon":14.5501,"lat":47.5162},
  {"year":2015,"country":"Belgium","math":507,"reading":499,"science":502,"lon":4.4699,"lat":50.5039},
  ...
];
```

We also have the average score for each category:

```javascript
var avgScores = {math: 493.4, reading: 492.7, science: 498.2};
```

## Initialisation of the map

In the header of our html file we include `leaflet` and the `leaflet.minichart` plugin:

```xml
<link rel="stylesheet" href="https://unpkg.com/leaflet@0.7.3/dist/leaflet.css" media="screen" title="leaflet">
<script src="https://unpkg.com/leaflet@0.7.3/dist/leaflet.js" charset="utf-8"></script>
<script src="../dist/leaflet.minichart.min.js" charset="utf-8"></script>
<script src="https://unpkg.com/leaflet.minichart@0.1.3/dist/leaflet.minichart.min.js" charset="utf-8"></script>
```

We also add a div that will contain the leaflet map:
```xml
<div id="map" style="width:100%;height:400px;"></div>
```

The following javascript code initializes the map:
```javascript
var center = [48.861415, 4.349326];
var mymap = L.map('map').setView(center, 4);
var tiles = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}');
tiles.addTo(mymap);
```

We now want to add to the map barcharts that represent the deviance to the mean of the three scores for year 2015. To do so, we loop over our data and create a `minicharts` object for each country. We store
store them in an array so we will be able to update them later.

```javascript
var charts = {};
for (var i = 0; i < data.length; i++) {
  var d = data[i];

  if (d.year == 2015) {
    var scoresDiff = [
      d.math - avgScores.math,
      d.reading - avgScores.reading,
      d.science - avgScores.science
    ];
    charts[d.country] = L.minichart([d.lat, d.lon], {data: scoresDiff, maxValues: 90});
    mymap.addLayer(charts[d.country] ) ;
  }
}
```

<div id="map0" style="width:100%;height:400px;margin-bottom:20px;"></div>

We can improve our map by passing some additional options to `L.minichart` to reduce the size of the charts and use prettier colors:
```javascript
charts[d.country] = L.minichart(
  [d.lat, d.lon],
  {
    data: scoresDiff,
    maxValues: 90,
    width:40, height:40,
    colors: ["#7A8B99", "#91ADC2", "#A9DDD6"]
  }
);
```
<div id="map1" style="width:100%;height:400px;margin-bottom:20px;"></div>

## Update charts

We have represented the PISA results for 2015 but we would like to also look at the results of the other years. To do so let us add a select input to our document. Each time the user changes the value of the input a javascript function called "updateMap" is
```xml
<select id = "year" onchange="updateMap()">
  <option value="2015">2015</option>
  <option value="2012">2012</option>
  <option value="2009">2009</option>
  <option value="2006">2006</option>
</select>
```

To update charts we use the `setOption` method.

```javascript
function updateMap() {
  var year = document.getElementById("year").value;
  for (var i = 0; i < data.length; i++) {
    var d = data[i];

    if (d.year == year) {
      var scoresDiff = [
        d.math - avgScores.math,
        d.reading - avgScores.reading,
        d.science - avgScores.science
      ];
      charts[d.country].setOptions({data:scoresDiff});
    }
  }
}
```
Here is the final result:

<select id = "year" onchange="updateMap()">
  <option value="2015">2015</option>
  <option value="2012">2012</option>
  <option value="2009">2009</option>
  <option value="2006">2006</option>
</select>
<div id="map" style="width:100%;height:600px;margin-bottom:10px;"></div>

<link rel="stylesheet" href="https://unpkg.com/leaflet@0.7.3/dist/leaflet.css" media="screen" title="leaflet">
<script src="https://unpkg.com/leaflet@0.7.3/dist/leaflet.js" charset="utf-8"></script>
<script src="leaflet.minichart.min.js" charset="utf-8"></script>
<script type="text/javascript" src = "js/pisa.js"></script>
