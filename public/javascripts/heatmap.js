// Adding 500 Data Points
var map, pointarray, heatmap, numberOfDataPoints;
var zillowData = [];


function initialize() {
  var mapOptions = {
    zoom: 11,
    center: new google.maps.LatLng(35.69028, -81.21818),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  map = new google.maps.Map(document.getElementById('map'),
      mapOptions);

  //var pointArray = new google.maps.MVCArray(zillowdata);

  heatmap = new google.maps.visualization.HeatmapLayer({
    data: zillowData
    //dissipating: false
  });

  heatmap.setMap(map);
  heatmap.set('radius', heatmap.get('radius') ? null : 20);
}

function toggleHeatmap() {
  heatmap.setMap(heatmap.getMap() ? null : map);
}

function changeGradient() {
  var gradient = [
    'rgba(0, 255, 255, 0)',
    'rgba(0, 255, 255, 1)',
    'rgba(0, 191, 255, 1)',
    'rgba(0, 127, 255, 1)',
    'rgba(0, 63, 255, 1)',
    'rgba(0, 0, 255, 1)',
    'rgba(0, 0, 223, 1)',
    'rgba(0, 0, 191, 1)',
    'rgba(0, 0, 159, 1)',
    'rgba(0, 0, 127, 1)',
    'rgba(63, 0, 91, 1)',
    'rgba(127, 0, 63, 1)',
    'rgba(191, 0, 31, 1)',
    'rgba(255, 0, 0, 1)'
  ]
  heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
}

function changeRadius() {
  heatmap.set('radius', heatmap.get('radius') ? null : 20);
}

function changeOpacity() {
  heatmap.set('opacity', heatmap.get('opacity') ? null : 0.2);
}

google.maps.event.addDomListener(window, 'load', initialize);

function createHeatMapObject(data) {
  data.forEach(function (element, index) {
    var SPSQF = element.taxAssessment / element.finishedSqFt;
    if (isFinite(SPSQF)) {
      numberOfDataPoints++;
      zillowData.push({location: new google.maps.LatLng(element.latitude, element.longitude), SPSQF})
    }
  }
)
console.log(numberOfDataPoints.toString());
}