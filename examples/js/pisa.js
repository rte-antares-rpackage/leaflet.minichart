var data = [
  {"year":2015,"country":"Australia","math":494,"reading":503,"science":510,"lon":133.7751,"lat":-25.2744},
  {"year":2015,"country":"Austria","math":497,"reading":485,"science":495,"lon":14.5501,"lat":47.5162},
  {"year":2015,"country":"Belgium","math":507,"reading":499,"science":502,"lon":4.4699,"lat":50.5039},
  {"year":2015,"country":"Canada","math":516,"reading":527,"science":528,"lon":-106.3468,"lat":56.1304},
  {"year":2015,"country":"Chile","math":423,"reading":459,"science":447,"lon":-71.543,"lat":-35.6751},
  {"year":2015,"country":"Czech Republic","math":492,"reading":487,"science":493,"lon":15.473,"lat":49.8175},
  {"year":2015,"country":"Denmark","math":511,"reading":500,"science":502,"lon":9.5018,"lat":56.2639},
  {"year":2015,"country":"Estonia","math":520,"reading":519,"science":534,"lon":25.0136,"lat":58.5953},
  {"year":2015,"country":"Finland","math":511,"reading":526,"science":531,"lon":25.7482,"lat":61.9241},
  {"year":2015,"country":"France","math":493,"reading":499,"science":495,"lon":2.2137,"lat":46.2276},
  {"year":2015,"country":"Germany","math":506,"reading":509,"science":509,"lon":10.4515,"lat":51.1657},
  {"year":2015,"country":"Greece","math":454,"reading":467,"science":455,"lon":21.8243,"lat":39.0742},
  {"year":2015,"country":"Hungary","math":477,"reading":470,"science":477,"lon":19.5033,"lat":47.1625},
  {"year":2015,"country":"Iceland","math":488,"reading":482,"science":473,"lon":-19.0208,"lat":64.9631},
  {"year":2015,"country":"Ireland","math":504,"reading":521,"science":503,"lon":-7.6921,"lat":53.1424},
  {"year":2015,"country":"Israel","math":470,"reading":479,"science":467,"lon":34.8516,"lat":31.0461},
  {"year":2015,"country":"Italy","math":490,"reading":485,"science":481,"lon":12.5674,"lat":41.8719},
  {"year":2015,"country":"Japan","math":532,"reading":516,"science":538,"lon":138.2529,"lat":36.2048},
  {"year":2015,"country":"Korea","math":524,"reading":517,"science":516,"lon":127.9785,"lat":37.664},
  {"year":2015,"country":"Latvia","math":482,"reading":488,"science":490,"lon":24.6032,"lat":56.8796},
  {"year":2015,"country":"Luxembourg","math":486,"reading":481,"science":483,"lon":6.1296,"lat":49.8153},
  {"year":2015,"country":"Mexico","math":408,"reading":423,"science":416,"lon":-102.5528,"lat":23.6345},
  {"year":2015,"country":"Netherlands","math":512,"reading":503,"science":509,"lon":5.2913,"lat":52.1326},
  {"year":2015,"country":"New Zealand","math":495,"reading":509,"science":513,"lon":174.886,"lat":-40.9006},
  {"year":2015,"country":"Norway","math":502,"reading":513,"science":498,"lon":8.4689,"lat":60.472},
  {"year":2015,"country":"Poland","math":504,"reading":506,"science":501,"lon":19.1451,"lat":51.9194},
  {"year":2015,"country":"Portugal","math":492,"reading":498,"science":501,"lon":-8.2245,"lat":39.3999},
  {"year":2015,"country":"Slovak Republic","math":475,"reading":453,"science":461,"lon":19.699,"lat":48.669},
  {"year":2015,"country":"Slovenia","math":510,"reading":505,"science":513,"lon":14.9955,"lat":46.1512},
  {"year":2015,"country":"Spain","math":486,"reading":496,"science":493,"lon":-3.7492,"lat":40.4637},
  {"year":2015,"country":"Sweden","math":494,"reading":500,"science":493,"lon":18.6435,"lat":60.1282},
  {"year":2015,"country":"Switzerland","math":521,"reading":492,"science":506,"lon":8.2275,"lat":46.8182},
  {"year":2015,"country":"Turkey","math":420,"reading":428,"science":425,"lon":35.2433,"lat":38.9637},
  {"year":2015,"country":"United Kingdom","math":492,"reading":498,"science":509,"lon":-3.436,"lat":55.3781},
  {"year":2015,"country":"United States","math":470,"reading":497,"science":496,"lon":-95.7129,"lat":37.0902},
  {"year":2012,"country":"Australia","math":504,"reading":512,"science":521,"lon":133.7751,"lat":-25.2744},
  {"year":2012,"country":"Austria","math":506,"reading":490,"science":506,"lon":14.5501,"lat":47.5162},
  {"year":2012,"country":"Belgium","math":515,"reading":509,"science":505,"lon":4.4699,"lat":50.5039},
  {"year":2012,"country":"Canada","math":518,"reading":523,"science":525,"lon":-106.3468,"lat":56.1304},
  {"year":2012,"country":"Chile","math":423,"reading":441,"science":445,"lon":-71.543,"lat":-35.6751},
  {"year":2012,"country":"Czech Republic","math":499,"reading":493,"science":508,"lon":15.473,"lat":49.8175},
  {"year":2012,"country":"Denmark","math":500,"reading":496,"science":498,"lon":9.5018,"lat":56.2639},
  {"year":2012,"country":"Estonia","math":521,"reading":516,"science":541,"lon":25.0136,"lat":58.5953},
  {"year":2012,"country":"Finland","math":519,"reading":524,"science":545,"lon":25.7482,"lat":61.9241},
  {"year":2012,"country":"France","math":495,"reading":505,"science":499,"lon":2.2137,"lat":46.2276},
  {"year":2012,"country":"Germany","math":514,"reading":508,"science":524,"lon":10.4515,"lat":51.1657},
  {"year":2012,"country":"Greece","math":453,"reading":477,"science":467,"lon":21.8243,"lat":39.0742},
  {"year":2012,"country":"Hungary","math":477,"reading":488,"science":494,"lon":19.5033,"lat":47.1625},
  {"year":2012,"country":"Iceland","math":493,"reading":483,"science":478,"lon":-19.0208,"lat":64.9631},
  {"year":2012,"country":"Ireland","math":501,"reading":523,"science":522,"lon":-7.6921,"lat":53.1424},
  {"year":2012,"country":"Israel","math":466,"reading":486,"science":470,"lon":34.8516,"lat":31.0461},
  {"year":2012,"country":"Italy","math":485,"reading":490,"science":494,"lon":12.5674,"lat":41.8719},
  {"year":2012,"country":"Japan","math":536,"reading":538,"science":547,"lon":138.2529,"lat":36.2048},
  {"year":2012,"country":"Korea","math":554,"reading":536,"science":538,"lon":127.9785,"lat":37.664},
  {"year":2012,"country":"Latvia","math":491,"reading":489,"science":502,"lon":24.6032,"lat":56.8796},
  {"year":2012,"country":"Luxembourg","math":490,"reading":488,"science":491,"lon":6.1296,"lat":49.8153},
  {"year":2012,"country":"Mexico","math":413,"reading":424,"science":415,"lon":-102.5528,"lat":23.6345},
  {"year":2012,"country":"Netherlands","math":523,"reading":511,"science":522,"lon":5.2913,"lat":52.1326},
  {"year":2012,"country":"New Zealand","math":500,"reading":512,"science":516,"lon":174.886,"lat":-40.9006},
  {"year":2012,"country":"Norway","math":489,"reading":504,"science":495,"lon":8.4689,"lat":60.472},
  {"year":2012,"country":"Poland","math":518,"reading":518,"science":526,"lon":19.1451,"lat":51.9194},
  {"year":2012,"country":"Portugal","math":487,"reading":488,"science":489,"lon":-8.2245,"lat":39.3999},
  {"year":2012,"country":"Slovak Republic","math":482,"reading":463,"science":471,"lon":19.699,"lat":48.669},
  {"year":2012,"country":"Slovenia","math":501,"reading":481,"science":514,"lon":14.9955,"lat":46.1512},
  {"year":2012,"country":"Spain","math":484,"reading":488,"science":496,"lon":-3.7492,"lat":40.4637},
  {"year":2012,"country":"Sweden","math":478,"reading":483,"science":485,"lon":18.6435,"lat":60.1282},
  {"year":2012,"country":"Switzerland","math":531,"reading":509,"science":515,"lon":8.2275,"lat":46.8182},
  {"year":2012,"country":"Turkey","math":448,"reading":475,"science":463,"lon":35.2433,"lat":38.9637},
  {"year":2012,"country":"United Kingdom","math":494,"reading":499,"science":514,"lon":-3.436,"lat":55.3781},
  {"year":2012,"country":"United States","math":481,"reading":498,"science":497,"lon":-95.7129,"lat":37.0902},
  {"year":2009,"country":"Australia","math":514,"reading":515,"science":527,"lon":133.7751,"lat":-25.2744},
  {"year":2009,"country":"Austria","math":496,"reading":470,"science":494,"lon":14.5501,"lat":47.5162},
  {"year":2009,"country":"Belgium","math":515,"reading":506,"science":507,"lon":4.4699,"lat":50.5039},
  {"year":2009,"country":"Canada","math":527,"reading":524,"science":529,"lon":-106.3468,"lat":56.1304},
  {"year":2009,"country":"Chile","math":421,"reading":449,"science":447,"lon":-71.543,"lat":-35.6751},
  {"year":2009,"country":"Czech Republic","math":493,"reading":478,"science":500,"lon":15.473,"lat":49.8175},
  {"year":2009,"country":"Denmark","math":503,"reading":495,"science":499,"lon":9.5018,"lat":56.2639},
  {"year":2009,"country":"Estonia","math":512,"reading":501,"science":528,"lon":25.0136,"lat":58.5953},
  {"year":2009,"country":"Finland","math":541,"reading":536,"science":554,"lon":25.7482,"lat":61.9241},
  {"year":2009,"country":"France","math":497,"reading":496,"science":498,"lon":2.2137,"lat":46.2276},
  {"year":2009,"country":"Germany","math":513,"reading":497,"science":520,"lon":10.4515,"lat":51.1657},
  {"year":2009,"country":"Greece","math":466,"reading":483,"science":470,"lon":21.8243,"lat":39.0742},
  {"year":2009,"country":"Hungary","math":490,"reading":494,"science":503,"lon":19.5033,"lat":47.1625},
  {"year":2009,"country":"Iceland","math":507,"reading":500,"science":496,"lon":-19.0208,"lat":64.9631},
  {"year":2009,"country":"Ireland","math":487,"reading":496,"science":508,"lon":-7.6921,"lat":53.1424},
  {"year":2009,"country":"Israel","math":447,"reading":474,"science":455,"lon":34.8516,"lat":31.0461},
  {"year":2009,"country":"Italy","math":483,"reading":486,"science":489,"lon":12.5674,"lat":41.8719},
  {"year":2009,"country":"Japan","math":529,"reading":520,"science":539,"lon":138.2529,"lat":36.2048},
  {"year":2009,"country":"Korea","math":546,"reading":539,"science":538,"lon":127.9785,"lat":37.664},
  {"year":2009,"country":"Latvia","math":482,"reading":484,"science":494,"lon":24.6032,"lat":56.8796},
  {"year":2009,"country":"Luxembourg","math":489,"reading":472,"science":484,"lon":6.1296,"lat":49.8153},
  {"year":2009,"country":"Mexico","math":419,"reading":425,"science":416,"lon":-102.5528,"lat":23.6345},
  {"year":2009,"country":"Netherlands","math":526,"reading":508,"science":522,"lon":5.2913,"lat":52.1326},
  {"year":2009,"country":"New Zealand","math":519,"reading":521,"science":532,"lon":174.886,"lat":-40.9006},
  {"year":2009,"country":"Norway","math":498,"reading":503,"science":500,"lon":8.4689,"lat":60.472},
  {"year":2009,"country":"Poland","math":495,"reading":500,"science":508,"lon":19.1451,"lat":51.9194},
  {"year":2009,"country":"Portugal","math":487,"reading":489,"science":493,"lon":-8.2245,"lat":39.3999},
  {"year":2009,"country":"Slovak Republic","math":497,"reading":477,"science":490,"lon":19.699,"lat":48.669},
  {"year":2009,"country":"Slovenia","math":501,"reading":483,"science":512,"lon":14.9955,"lat":46.1512},
  {"year":2009,"country":"Spain","math":483,"reading":481,"science":488,"lon":-3.7492,"lat":40.4637},
  {"year":2009,"country":"Sweden","math":494,"reading":497,"science":495,"lon":18.6435,"lat":60.1282},
  {"year":2009,"country":"Switzerland","math":534,"reading":501,"science":517,"lon":8.2275,"lat":46.8182},
  {"year":2009,"country":"Turkey","math":445,"reading":464,"science":454,"lon":35.2433,"lat":38.9637},
  {"year":2009,"country":"United Kingdom","math":492,"reading":494,"science":514,"lon":-3.436,"lat":55.3781},
  {"year":2009,"country":"United States","math":487,"reading":500,"science":502,"lon":-95.7129,"lat":37.0902},
  {"year":2006,"country":"Australia","math":520,"reading":513,"science":527,"lon":133.7751,"lat":-25.2744},
  {"year":2006,"country":"Austria","math":505,"reading":490,"science":511,"lon":14.5501,"lat":47.5162},
  {"year":2006,"country":"Belgium","math":520,"reading":501,"science":510,"lon":4.4699,"lat":50.5039},
  {"year":2006,"country":"Canada","math":527,"reading":527,"science":534,"lon":-106.3468,"lat":56.1304},
  {"year":2006,"country":"Chile","math":411,"reading":442,"science":438,"lon":-71.543,"lat":-35.6751},
  {"year":2006,"country":"Czech Republic","math":510,"reading":483,"science":513,"lon":15.473,"lat":49.8175},
  {"year":2006,"country":"Denmark","math":513,"reading":494,"science":496,"lon":9.5018,"lat":56.2639},
  {"year":2006,"country":"Estonia","math":515,"reading":501,"science":531,"lon":25.0136,"lat":58.5953},
  {"year":2006,"country":"Finland","math":548,"reading":547,"science":563,"lon":25.7482,"lat":61.9241},
  {"year":2006,"country":"France","math":496,"reading":488,"science":495,"lon":2.2137,"lat":46.2276},
  {"year":2006,"country":"Germany","math":504,"reading":495,"science":516,"lon":10.4515,"lat":51.1657},
  {"year":2006,"country":"Greece","math":459,"reading":460,"science":473,"lon":21.8243,"lat":39.0742},
  {"year":2006,"country":"Hungary","math":491,"reading":482,"science":504,"lon":19.5033,"lat":47.1625},
  {"year":2006,"country":"Iceland","math":506,"reading":484,"science":491,"lon":-19.0208,"lat":64.9631},
  {"year":2006,"country":"Ireland","math":501,"reading":517,"science":508,"lon":-7.6921,"lat":53.1424},
  {"year":2006,"country":"Israel","math":442,"reading":439,"science":454,"lon":34.8516,"lat":31.0461},
  {"year":2006,"country":"Italy","math":462,"reading":469,"science":475,"lon":12.5674,"lat":41.8719},
  {"year":2006,"country":"Japan","math":523,"reading":498,"science":531,"lon":138.2529,"lat":36.2048},
  {"year":2006,"country":"Korea","math":547,"reading":556,"science":522,"lon":127.9785,"lat":37.664},
  {"year":2006,"country":"Latvia","math":486,"reading":479,"science":490,"lon":24.6032,"lat":56.8796},
  {"year":2006,"country":"Luxembourg","math":490,"reading":479,"science":486,"lon":6.1296,"lat":49.8153},
  {"year":2006,"country":"Mexico","math":406,"reading":410,"science":410,"lon":-102.5528,"lat":23.6345},
  {"year":2006,"country":"Netherlands","math":531,"reading":507,"science":525,"lon":5.2913,"lat":52.1326},
  {"year":2006,"country":"New Zealand","math":522,"reading":521,"science":530,"lon":174.886,"lat":-40.9006},
  {"year":2006,"country":"Norway","math":490,"reading":484,"science":487,"lon":8.4689,"lat":60.472},
  {"year":2006,"country":"Poland","math":495,"reading":508,"science":498,"lon":19.1451,"lat":51.9194},
  {"year":2006,"country":"Portugal","math":466,"reading":472,"science":474,"lon":-8.2245,"lat":39.3999},
  {"year":2006,"country":"Slovak Republic","math":492,"reading":466,"science":488,"lon":19.699,"lat":48.669},
  {"year":2006,"country":"Slovenia","math":504,"reading":494,"science":519,"lon":14.9955,"lat":46.1512},
  {"year":2006,"country":"Spain","math":480,"reading":461,"science":488,"lon":-3.7492,"lat":40.4637},
  {"year":2006,"country":"Sweden","math":502,"reading":507,"science":503,"lon":18.6435,"lat":60.1282},
  {"year":2006,"country":"Switzerland","math":530,"reading":499,"science":512,"lon":8.2275,"lat":46.8182},
  {"year":2006,"country":"Turkey","math":424,"reading":447,"science":424,"lon":35.2433,"lat":38.9637},
  {"year":2006,"country":"United Kingdom","math":495,"reading":495,"science":515,"lon":-3.436,"lat":55.3781},
  {"year":2006,"country":"United States","math":474,"science":489,"lon":-95.7129,"lat":37.0902}
];

var avgScores = {math: 493.4, reading: 492.7, science: 498.2};

var niceOptions = {
  width:40,
  height:40,
  colors: ["#7A8B99", "#91ADC2", "#A9DDD6"]
}

// Initialize maps.
initMap("map0");
initMap("map1", niceOptions);
var charts = initMap("map", niceOptions);

function initMap(id, options) {
  var coord = [48.861415, 6.349326];
  var mymap = L.map(id).setView(coord, 4);
  var tiles = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}');
  tiles.addTo(mymap);
  var charts = {};
  var d, scoresDiff;

  for (var i = 0; i < data.length; i++) {
    d = data[i];

    if (d.year == 2015) {
      scoresDiff = [
        d.math - avgScores.math,
        d.reading - avgScores.reading,
        d.science - avgScores.science
      ];
      charts[d.country] = L.minichart([d.lat, d.lon], {data: scoresDiff, maxValues: 90});
      mymap.addLayer(charts[d.country]);
      if (options) {
        charts[d.country].setOptions(options);
      }
    }
  }

  return charts;
}

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
