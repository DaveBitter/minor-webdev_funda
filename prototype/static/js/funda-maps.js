function FundaTest(oOptions) {
    this.opt = oOptions;
    this.TILE_WIDTH = 256;
    this.TILE_HEIGHT = 256;
    this.MARKER_WIDTH = 32;
    this.MARKER_HEIGHT = 32;
    this.MARKER_ICON = 'http://www.fundainbusiness.nl/img/kaart/marker/marker-small.png';
    this.PLACE_ICON = 'static/images/icons/place.png';
    this.BAR_ICON = 'static/images/icons/bar.png';
    this.GYM_ICON = 'static/images/icons/gym.png';
    this.SCHOOL_ICON = 'static/images/icons/school.png';
    this.PARK_ICON = 'static/images/icons/park.png';
    this.init()
    localStorage.setItem("bars", "")
    localStorage.setItem("parks", "")
}
FundaTest.prototype.init = function() {
    this.oTargetDoc = document.getElementById(this.opt.sTargetContainerId);
    if (this.oTargetDoc == null) alert('Could not find target container');
    this.oDataTiles = {};
}
FundaTest.prototype.doStuff = function() {
    // Get a detail object.
    this.loadDataWrapper(this.opt.sAanbodApiBasePath + '/detail/' + this.opt.sApiKey + '/koop/643335c8-380f-4350-b0df-dff5b6da1573/', 'onReceiveDetailObject');
    // Get a search query result.
    this.loadDataWrapper(this.opt.sAanbodApiBasePath + '/' + this.opt.sApiKey + '/?type=koop&zo=/amsterdam/tuin/&page=1&pagesize=25', 'onReceiveSearchResult');
};
FundaTest.prototype.onReceiveDetailObject = function(oObjectDetails, sError) {
    if (sError != null) {
        alert('Something went wrong: ' + sError);
        return;
    }
    var oNewSection = document.createElement('div');
    oNewSection.innerHTML = '<h2>Object details example</h2>' + '<b>Address:</b> ' + oObjectDetails.Adres + '<br />' + '<b>ID:</b> ' + oObjectDetails.InternalId;
    this.oTargetDoc.appendChild(oNewSection);
};
FundaTest.prototype.onReceiveSearchResult = function(oSearchResult, sError) {
    if (sError != null) {
        alert('Something went wrong: ' + sError);
        return;
    }
    var oNewSection = document.createElement('div');
    var sResult = '<h2>Object search example</h2><ul>';
    for (var i = 0, n = oSearchResult.Objects.length; i < n; i++) {
        var myObject = oSearchResult.Objects[i];
        sResult += '<li>' + myObject.Adres + '</li>';
    }
    sResult += '</ul>';
    oNewSection.innerHTML = sResult;
    this.oTargetDoc.appendChild(oNewSection);
};
FundaTest.prototype.initMap = function() {
    var mapDiv = document.getElementById(this.opt.sMapId);
    this.oMap = new google.maps.Map(mapDiv, {
        center: {
            lat: 52.353344,
            lng: 4.896417
        },
        zoom: 16
    });
    sSearchQuery = 'koop/heel-nederland';
    //this.GenerateMapFromImageTiles(this.oMap, sSearchQuery);
    this.GenerateMapFromDataTiles(this.oMap, sSearchQuery);
}
FundaTest.prototype.GenerateMapFromDataTiles = function(oMap, sSearchQuery) {
    var iTileWidth = this.TILE_WIDTH;
    var iTileHeight = this.TILE_HEIGHT;
    var iMarkerWidth = this.MARKER_WIDTH;
    var iMarkerHeight = this.MARKER_HEIGHT;
    var sMarkerIcon = this.MARKER_ICON;
    var sPlaceIcon = this.PLACE_ICON;
    var sBarIcon = this.BAR_ICON;
    var sGymIcon = this.GYM_ICON;
    var sSchoolIcon = this.SCHOOL_ICON;
    var sParkIcon = this.PARK_ICON;
    // Instantiate our custom map tile handler.
    var oMapType = new FundaMapType(new google.maps.Size(iTileWidth, iTileHeight), sSearchQuery, function(oTileData, sDivId) {
        calcMatch(oTileData)
        var oMapTile = document.getElementById(sDivId);
        var propertyList = document.getElementById('property-list');
        propertyList.innerHTML = '';
        for (var i = 0, n = oTileData.points.length; i < n; i++) {
            // This is the object we've found.
            var oPoint = oTileData.points[i];
            var propertyListItemTemplate = document.getElementById('templateListItem'),
                source = propertyListItemTemplate.innerHTML,
                compile = Handlebars.compile(source),
                html = '';
            html = compile(oPoint);
            propertyList.innerHTML += html;
            // Create and position an HTML element.
            var marker = document.createElement('img');
            marker.style.position = 'absolute';
            marker.style.left = Math.floor(-(iMarkerWidth / 2) + iTileWidth * ((oPoint.x - oTileData.lng) / oTileData.spanlng)) + 'px';
            marker.style.top = Math.floor(-(iMarkerHeight / 2) + iTileHeight - iTileHeight * ((oPoint.y - oTileData.lat) / oTileData.spanlat)) + 'px';
            marker.src = sMarkerIcon;
            oMapTile.appendChild(marker);
        }
        var servicesList = document.getElementById('services-list');
        servicesList.innerHTML = '';
        if (oTileData.bars !== null) {
            for (var i = 0, n = oTileData.bars.length; i < n; i++) {
                var oBar = oTileData.bars[i];
                oBar.y = oBar.geometry.location.lat();
                oBar.x = oBar.geometry.location.lng();
                oBar.iconSrc = sBarIcon
                var servicesListItemTemplate = document.getElementById('templateServicesListItem'),
                    source = servicesListItemTemplate.innerHTML,
                    compile = Handlebars.compile(source),
                    html = '';
                html = compile(oBar);
                servicesList.innerHTML += html;
                var marker = document.createElement('img');
                marker.style.position = 'absolute';
                marker.style.left = Math.floor(-(iMarkerWidth / 2) + iTileWidth * ((oBar.x - oTileData.lng) / oTileData.spanlng)) + 'px';
                marker.style.top = Math.floor(-(iMarkerHeight / 2) + iTileHeight - iTileHeight * ((oBar.y - oTileData.lat) / oTileData.spanlat)) + 'px';
                marker.style.width = "10px";
                marker.style.height = "10px"
                marker.src = sBarIcon;
                oMapTile.appendChild(marker);
            }
        }
        if (oTileData.gyms !== null) {
            for (var i = 0, n = oTileData.gyms.length; i < n; i++) {
                var oGym = oTileData.gyms[i];
                oGym.y = oGym.geometry.location.lat();
                oGym.x = oGym.geometry.location.lng();
                oGym.iconSrc = sGymIcon
                var servicesListItemTemplate = document.getElementById('templateServicesListItem'),
                    source = servicesListItemTemplate.innerHTML,
                    compile = Handlebars.compile(source),
                    html = '';
                html = compile(oGym);
                servicesList.innerHTML += html;
                var marker = document.createElement('img');
                marker.style.position = 'absolute';
                marker.style.left = Math.floor(-(iMarkerWidth / 2) + iTileWidth * ((oGym.x - oTileData.lng) / oTileData.spanlng)) + 'px';
                marker.style.top = Math.floor(-(iMarkerHeight / 2) + iTileHeight - iTileHeight * ((oGym.y - oTileData.lat) / oTileData.spanlat)) + 'px';
                marker.style.width = "10px";
                marker.style.height = "10px"
                marker.src = sGymIcon;
                oMapTile.appendChild(marker);
            }
        }
        if (oTileData.schools !== null) {
            for (var i = 0, n = oTileData.schools.length; i < n; i++) {
                var oSchool = oTileData.schools[i];
                oSchool.y = oSchool.geometry.location.lat();
                oSchool.x = oSchool.geometry.location.lng();
                oSchool.iconSrc = sSchoolIcon
                var servicesListItemTemplate = document.getElementById('templateServicesListItem'),
                    source = servicesListItemTemplate.innerHTML,
                    compile = Handlebars.compile(source),
                    html = '';
                html = compile(oSchool);
                servicesList.innerHTML += html;
                var marker = document.createElement('img');
                marker.style.position = 'absolute';
                marker.style.left = Math.floor(-(iMarkerWidth / 2) + iTileWidth * ((oSchool.x - oTileData.lng) / oTileData.spanlng)) + 'px';
                marker.style.top = Math.floor(-(iMarkerHeight / 2) + iTileHeight - iTileHeight * ((oSchool.y - oTileData.lat) / oTileData.spanlat)) + 'px';
                marker.style.width = "10px";
                marker.style.height = "10px"
                marker.src = sSchoolIcon;
                oMapTile.appendChild(marker);
            }
        }
        if (oTileData.parks !== null) {
            for (var i = 0, n = oTileData.parks.length; i < n; i++) {
                var oPark = oTileData.parks[i];
                oPark.y = oPark.geometry.location.lat();
                oPark.x = oPark.geometry.location.lng();
                oPark.iconSrc = sParkIcon
                var servicesListItemTemplate = document.getElementById('templateServicesListItem'),
                    source = servicesListItemTemplate.innerHTML,
                    compile = Handlebars.compile(source),
                    html = '';
                html = compile(oPark);
                servicesList.innerHTML += html;
                var marker = document.createElement('img');
                marker.style.position = 'absolute';
                marker.style.left = Math.floor(-(iMarkerWidth / 2) + iTileWidth * ((oPark.x - oTileData.lng) / oTileData.spanlng)) + 'px';
                marker.style.top = Math.floor(-(iMarkerHeight / 2) + iTileHeight - iTileHeight * ((oPark.y - oTileData.lat) / oTileData.spanlat)) + 'px';
                marker.style.width = "10px";
                marker.style.height = "10px"
                marker.src = sParkIcon;
                oMapTile.appendChild(marker);
            }
        }
        setTimeout(function() {
            var value = JSON.parse(localStorage.hoodMatch)
            if (value > 10) {
                value = 10
            }
            document.querySelector('#message').innerHTML = ""
            document.querySelector('#message-container').classList.add("hide")
            document.querySelector('#match').classList.remove("hide")
            document.querySelector('#hood-match').value = value;
        }, 1000);
    });
    // Use this map type as overlay.
    oMap.overlayMapTypes.insertAt(0, oMapType);
}
// Create an overlay of image map tiles.
FundaTest.prototype.GenerateMapFromImageTiles = function(oMap, sSearchQuery) {
    var oMapType = new google.maps.ImageMapType({
        getTileUrl: function(coord, zoom) {
            return 'http://mt1.funda.nl/maptileimage.ashx?z=' + zoom + '&x=' + coord.x + '&y=' + coord.y + '&mode=png&zo=' + sSearchQuery;
        },
        tileSize: new google.maps.Size(this.TILE_WIDTH, this.TILE_HEIGHT),
        isPng: true
    });
    oMap.overlayMapTypes.insertAt(0, oMapType);
};
/*
    Helper methods.
*/
FundaTest.prototype.loadDataWrapper = function(sUrl, sCallbackMethod) {
    this.tmpMethod = window[this.opt.sInstanceName].getXmlHttpDocument;
    this.tmpMethod(sUrl, this[sCallbackMethod]);
    delete this.tmpMethod;
};
FundaTest.prototype.getXmlHttpDocument = function(sUrl, funcCallback) {
    if (!window.XMLHttpRequest) return null;
    if (typeof JSON == 'undefined' || !('parse' in JSON)) return null;
    if (!('call' in funcCallback) || typeof funcCallback.call == 'undefined') return null;
    var oMyDoc = new XMLHttpRequest();
    var oCaller = this;
    oMyDoc.onreadystatechange = function() {
        if (oMyDoc.readyState != 4) return;
        var oResponse = null,
            sError = null;
        if (oMyDoc.status != 200) sError = 'Connection error: ' + oMyDoc.status + ' ' + oMyDoc.statusText;
        if (oMyDoc.responseText == null) sError = 'Invalid response';
        else {
            try {
                oResponse = JSON.parse(oMyDoc.responseText);
            } catch (e) {
                sError = 'Error parsing JSON: ' + e;
            }
        }
        funcCallback.call(oCaller, oResponse, sError);
    };
    oMyDoc.open('GET', sUrl, true);
    oMyDoc.send(null);
    return oMyDoc;
};
/*
    FundaMapType
    Customized map type that can be used as overlay of a regular Google map.
*/
function FundaMapType(tileSize, sSearchQuery, funcCallback) {
    this.tileSize = tileSize;
    this.funcCallback = funcCallback;
}
FundaMapType.prototype.maxZoom = 19;
FundaMapType.prototype.name = 'Tile #s';
FundaMapType.prototype.alt = 'Tile Coordinate Map Type';
FundaMapType.prototype.getTile = function(coord, zoom, ownerDocument) {
    localStorage.hoodMatch = "5"
    var div = ownerDocument.createElement('div');
    div.id = 'funda_tile_' + zoom + '_' + coord.x + '-' + coord.y;
    div.innerHTML = coord;
    div.style.width = this.tileSize.width + 'px';
    div.style.height = this.tileSize.height + 'px';
    div.style.fontSize = '10';
    div.style.borderStyle = 'solid';
    div.style.borderWidth = '1px';
    div.style.borderColor = '#AAAAAA';
    div.style.backgroundColor = 'transparent';
    var funcCallback = this.funcCallback;
    this.getJsonpDoc('http://mt2.funda.nl/maptiledata.ashx?z=' + zoom + '&x=' + coord.x + '&y=' + coord.y + '&zo=' + sSearchQuery, function(oJson) {
        funcCallback(oJson, div.id);
    })
    return div;
};
FundaMapType.prototype.loadJsonpWrapper = function(sUrl, sCallbackMethod) {
    this.tmpMethod = window[this.opt.sInstanceName].getJsonpDoc;
    this.tmpMethod(sUrl, this[sCallbackMethod]);
    delete this.tmpMethod;
}
FundaMapType.prototype.getJsonpDoc = function(sUrl, funcCallback) {
    var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
    window[callbackName] = function(data) {
        document.querySelector('#message-container').classList.remove("hide")
        document.querySelector('#match').classList.add("hide")
        document.querySelector('#message').innerHTML = "buurt aan het onderzoeken"
        // data.points = data.points.slice(0, 3)
        var service = new google.maps.places.PlacesService(mapPlaces);
        service.nearbySearch({
            location: {
                lat: data.points[0].y,
                lng: data.points[0].x
            },
            radius: 500,
            type: ['bar']
        }, getGyms);

        function getGyms(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                data.bars = results
            } else {
                data.bars = null;
            }
            service.nearbySearch({
                location: {
                    lat: data.points[0].y,
                    lng: data.points[0].x
                },
                radius: 500,
                type: ['gym']
            }, getSchools);
        }

        function getSchools(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                data.gyms = results
            } else {
                data.gyms = null;
            }
            service.nearbySearch({
                location: {
                    lat: data.points[0].y,
                    lng: data.points[0].x
                },
                radius: 500,
                type: ['school']
            }, getParks);
        }

        function getParks(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                data.schools = results
            } else {
                data.schools = null;
            }
            service.nearbySearch({
                location: {
                    lat: data.points[0].y,
                    lng: data.points[0].x
                },
                radius: 500,
                type: ['parks']
            }, callback);
        }

        function callback(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                data.parks = results;
                localStorage.setItem("bars", JSON.stringify(data.bars));
            } else {
                data.parks = null;
            }
            delete window[callbackName];
            document.body.removeChild(script);
            funcCallback(data);
        }
    };
    var script = document.createElement('script');
    script.src = sUrl + (sUrl.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
    document.body.appendChild(script);
}
var calcMatch = function(data) {
    var preferences = JSON.parse(localStorage.preferences)
    var hoodMatch = JSON.parse(localStorage.hoodMatch)
    if (data.bars == null && preferences.bar.value >= 5) {
        hoodMatch -= 1
    } else {
        hoodMatch += 1
    }
    if (data.gyms == null && preferences.gym.value >= 5) {
        hoodMatch -= 1
    } else {
        hoodMatch += 1
    }
    if (data.schools == null && preferences.school.value >= 5) {
        hoodMatch -= 1
    } else {
        hoodMatch += 1
    }
    if (data.parks == null && preferences.park.value >= 5) {
        hoodMatch -= 1
    } else {
        hoodMatch += 1
    }
    localStorage.hoodMatch = JSON.stringify(hoodMatch)
}