window.onload = function () {

  var documentSettings = {};

  function createMarkerIcon(icon, prefix, markerColor, iconColor) {
    return L.AwesomeMarkers.icon({
      icon: icon,
      prefix: prefix,
      markerColor: markerColor,
      iconColor: iconColor
    });
  }

  // only run this after Tabletop has loaded (onTabletopLoad())
  function mapPoints(points) {
    var markerArray = [];
    console.log(points[0]);
    // check that map has loaded before adding points to it?
    for (var i in points) {
      var point = points[i];
      markerArray.push(L.marker([point.Latitude, point.Longitude], {
        icon: createMarkerIcon(point['Marker Icon'], 'fa', point['Marker Color'].toLowerCase(), point['Marker Icon Color'])
      }).bindPopup("<b>" + point["Title"] + "</b><br>" + point["Description"]));
    }

    var group = L.featureGroup(markerArray).addTo(map);

    // center and zoom map based on points
    // TODO: unless user has specified a zoom and center
    var groupBounds = group.getBounds();
    console.log(groupBounds.getCenter());
    map.fitBounds(groupBounds);

    // once map is recentered, open popup in center of map
    if (documentSettings["Info Popup Text:"] !== '') {
      // TODO: put user-chosen center instead, if they selected one
      initInfoPopup(documentSettings["Info Popup Text:"], groupBounds.getCenter());
    };
  }
  // reformulate documentSettings as a dictionary, e.g.
  // {"webpageTitle": "Leaflet Boilerplate", "infoPopupText": "Stuff"}
  function createDocumentSettings(settings) {

    documentSettings = {};

    for (var i in settings) {
      var setting = settings[i];
      console.log(setting);
      documentSettings[setting.Setting] = setting.Customization;
    }

  }

  function onTabletopLoad() {
    // documentSettings = tabletop.sheets("Information").elements;
    createDocumentSettings(tabletop.sheets("Information").elements);
    document.title = documentSettings["Webpage Title:"];
    mapPoints(tabletop.sheets("Points").elements);
  }

  var tabletop = Tabletop.init( { key: '1I1bHQTUNCPHD6AuyNQfYV6g0qqJI8OjF9UHP9MW4XYg',
    callback: function(data, tabletop) { onTabletopLoad() } 
  });

  function initInfoPopup(info, coordinates) {
    console.log(info);
    L.popup({className: 'intro-popup'})
      .setLatLng(coordinates) // this needs to change
      .setContent(info)
      .openOn(map);
  }

  var pollingIcon = L.AwesomeMarkers.icon({
    icon: 'check-square-o',
    prefix: 'fa',
    markerColor: 'red'
  });

  // function createCountyLayer(county) {
  //   return L.geoJson(polling, {
  //     filter: function(feature, latlng) {
  //       switch (feature.properties.County) {
  //         case county: return true;
  //         default: return false;
  //       };
  //     },
  //     onEachFeature: onEachPolling,
  //     pointToLayer: function(feature, latlng) {
  //       return L.marker(latlng, {icon: pollingIcon});
  //     }
  //   });
  // };

  // var fultonLayer = createCountyLayer("Fulton").addTo(map);

  // map

  L.control.attribution({position: 'bottomleft'}).addTo(map);

  L.tileLayer('http://otile4.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
    attribution: 'Tiles &copy; <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png" /><br>' +
    'Made for <a href="http://www.codeforatlanta.org/"><img src="images/code-for-atlanta.png" height=70></a> by <a href="http://proximityviz.com/"><img src="images/prox-small.png"></a>',
    maxZoom: 18
  }).addTo(map);

  // var counties = {
  //   "Fulton": fultonLayer
  // };

  // L.control.layers(null, null, {
  //   collapsed: false
  // }).addTo(map);

  // // change zoom and center of map when county changes
  // map.on('baselayerchange', function(e) {
  //   map.fitBounds(e.layer.getBounds(), {
  //     maxZoom: 14
  //   });
  // });
};