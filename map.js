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

  function centerAndZoomMap(points) {
    var mapCenter = L.latLng();
    var mapZoom = 0;

    // center and zoom map based on points or to user-specified zoom and center
    if (documentSettings["Initial Center Latitude:"] !== '' && documentSettings["Initial Center Longitude:"] !== '') {
      // center and zoom
      mapCenter = L.latLng(documentSettings["Initial Center Latitude:"], documentSettings["Initial Center Longitude"]);
      map.setView(mapCenter);
    } else {
      var groupBounds = points.getBounds();
      mapZoom = map.getBoundsZoom(groupBounds);
      mapCenter = groupBounds.getCenter();
    }

    if (documentSettings["Initial Zoom:"] !== '') {
      mapZoom = parseInt(documentSettings["Initial Zoom:"]);
    }

    map.setView(mapCenter, mapZoom);

    // once map is recentered, open popup in center of map
    if (documentSettings["Info Popup Text:"] !== '') {
      initInfoPopup(documentSettings["Info Popup Text:"], mapCenter);
    };
  }

  // only run this after Tabletop has loaded (onTabletopLoad())
  function mapPoints(points) {
    var markerArray = [];
    // check that map has loaded before adding points to it?
    for (var i in points) {
      var point = points[i];
      if (point.Latitude !== "" && point.Longitude !== "") {
        markerArray.push(L.marker([point.Latitude, point.Longitude], {
          icon: createMarkerIcon(point['Marker Icon'], 'fa', point['Marker Color'].toLowerCase(), point['Marker Icon Color'])
        }).bindPopup("<b>" + point["Title"] + "</b><br>" + point["Description"]));
      }
    }

    var group = L.featureGroup(markerArray);

    // cluster markers, or don't
    if (documentSettings["Markercluster:"] === 'on') {
        var cluster = L.markerClusterGroup({
            polygonOptions: {
                opacity: 0.3,
                weight: 3
            }
        });
    
        cluster.addLayer(group);
        map.addLayer(cluster);
    } else {
        map.addLayer(group);
    }

    centerAndZoomMap(group);
  }
  // reformulate documentSettings as a dictionary, e.g.
  // {"webpageTitle": "Leaflet Boilerplate", "infoPopupText": "Stuff"}
  function createDocumentSettings(settings) {

    documentSettings = {};

    for (var i in settings) {
      var setting = settings[i];
      documentSettings[setting.Setting] = setting.Customization;
    }
  }

  function onTabletopLoad() {
    // documentSettings = tabletop.sheets(constants.informationSheetName).elements;
    createDocumentSettings(tabletop.sheets(constants.informationSheetName).elements);
    addBaseMap();
    document.title = documentSettings["Webpage Title:"];
    mapPoints(tabletop.sheets(constants.pointsSheetName).elements);
  }

  var tabletop = Tabletop.init( { key: constants.googleDocID, // from constants.js
    callback: function(data, tabletop) { onTabletopLoad() } 
  });

  function initInfoPopup(info, coordinates) {
    L.popup({className: 'intro-popup'})
      .setLatLng(coordinates) // this needs to change
      .setContent(info)
      .openOn(map);
  }

  // map
  
  function addBaseMap() {
    var basemap = documentSettings["Tile Provider:"] === '' ? 'Stamen.TonerLite' : documentSettings["Tile Provider:"];

    L.tileLayer.provider(basemap, {
      maxZoom: 18
    }).addTo(map);

    L.control.attribution({
      position: 'bottomleft'
    }).addTo(map);

    var attributionHTML = document.getElementsByClassName("leaflet-control-attribution")[0].innerHTML;
    attributionHTML = 'Built with <a href="https://github.com/ProximityViz/leaflet-google-docs-boilerplate">Civic Mapomatic</a> by <a href="http://www.codeforatlanta.org/">Code for Atlanta <img src="images/codeforatlanta.png" height=30></a><br>' + attributionHTML;
    document.getElementsByClassName("leaflet-control-attribution")[0].innerHTML = attributionHTML;
  }

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