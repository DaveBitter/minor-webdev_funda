(function() {
    // set variables
    var url = 'http://funda.kyrandia.nl/feeds/Aanbod.svc/json/detail/271175433a7c4fe2a45750d385dd9bfd/koop/643335c8-380f-4350-b0df-dff5b6da1573/';
    var app = {
        listen: function() {
            events.clickEvent()
        },
        init: function() {
            if(localStorage.preferences == undefined) {
                localStorage.setItem("preferences", JSON.stringify(preferences))
            }
        }
    }
    var config = {
        BASEURL: 'http://funda.kyrandia.nl/feeds/Aanbod.svc/json/',
        AUTOSUGGESTBASEURL: 'http://zb.funda.info/frontend',
        MAPBASEURL: 'http://mt1.funda.nl/maptiledata.ashx',
        APIKEY: '271175433a7c4fe2a45750d385dd9bfd/',
        SEARCHURL: '?type=koop&zo=/amsterdam/tuin/&page=1&pagesize=25',
        OBJECTURL: 'detail/',
        AUTOSUGGESTURL: '/geo/suggest/?query=amsterdam&max=7&type=koop&callback=callback',
        MAPURL: '?z=7&x=66&y=42&zo=koop/heel-nederland&callback=callback',
        GUIDURL: ' http://funda.kyrandia.nl/tinyId/',
        MAPSBASEURL: 'https://maps.googleapis.com/maps/api/place/',
        MAPSDETAILURL: 'details/json?placeid=',
        MAPSAPIKEY: '&key=AIzaSyD678UpslldDRc3PAvzZ0XNLXAUU2bcsIg'
    }
    var elements = {
        preferences: document.querySelector('#preferences'),
        preferencesInputs: document.querySelector('#preferencesInputs'),
        map: document.querySelector('#map'),
        detail: document.querySelector('#detail'),
        place: document.querySelector('#place'),
        propertyList: document.querySelector('#property-list'),
        servicesList: document.querySelector('#services-list'),
        propertyButton: document.querySelector('#property-button'),
        servicesButton: document.querySelector('#services-button')
    }
    var templates = {
        preferences: document.querySelector('#templatePreferences'),
        map: document.querySelector('#templateMap'),
        listItem: document.querySelector('#templateListItem'),
        detail: document.querySelector('#templateDetail'),
        place: document.querySelector('#templatePlace'),
    }
    var preferences = {
        bar: {
            lable: "bars",
            value: 5
        },
        gym: {
            lable: "sportscholen",
            value: 5
        },
        school: {
            lable: "scholen",
            value: 5
        },
        park: {
            lable: "parken",
            value: 5
        }
    }
    var renderPreferences = function() {
        elements.preferences.classList.remove('hide');
        elements.map.classList.add('hide');
        var preferencesInputs = elements.preferencesInputs,
            preferencesTemplate = templates.preferences,
            source = preferencesTemplate.innerHTML,
            compile = Handlebars.compile(source),
            html = '';

         if(localStorage.preferences == undefined) {
                localStorage.setItem("preferences", JSON.stringify(preferences))
            }
        var preferencesList = JSON.parse(localStorage.preferences)
        Object.keys(preferencesList).map(function(objectKey, index) {
            var value = preferencesList[objectKey];
            html = compile(value);
            preferencesInputs.innerHTML += html;
        });
        events.changeEvent()
    }
    var renderMap = function() {
        elements.preferences.classList.add('hide');
        elements.map.classList.remove('hide');
        elements.detail.classList.add('hide');
        elements.place.classList.add('hide');
        var map = elements.map,
            mapTemplate = templates.map,
            source = mapTemplate.innerHTML,
            compile = Handlebars.compile(source),
            html = '';
        html = compile();
        map.innerHTML += html;
    }
    var renderDetail = function(id) {
        elements.preferences.classList.add('hide');
        elements.map.classList.add('hide');
        elements.detail.classList.remove('hide');
        elements.place.classList.add('hide');
        elements.detail.innerHTML = ''
        var url = config.GUIDURL + id
        aja().url(url).on('success', function(property) {
            var guid = property[0].intid
            var url = config.BASEURL + config.OBJECTURL + config.APIKEY + "koop/" + guid
            aja().url(url).on('success', function(detailData) {
                var detail = elements.detail,
                    detailTemplate = templates.detail,
                    source = detailTemplate.innerHTML,
                    compile = Handlebars.compile(source),
                    html = '';
                html = compile(detailData);
                detail.innerHTML += html;
            }).go();
        }).go();
    }
    var renderPlace = function(id) {
        var bars = localStorage.getItem("bars")
        bars = JSON.parse(bars)
        elements.preferences.classList.add('hide');
        elements.map.classList.add('hide');
        elements.detail.classList.add('hide');
        elements.place.classList.remove('hide');
        elements.place.innerHTML = ''
        var placeData = bars.find(function(result) {
            return result.id == id
        });
        placeData.photo = formatPlaceImage(placeData.photos[0].html_attributions[0])
        var place = elements.place,
            placeTemplate = templates.place,
            source = placeTemplate.innerHTML,
            compile = Handlebars.compile(source),
            html = '';
        html = compile(placeData);
        place.innerHTML += html;
        return
    }
    var formatPlaceImage = function(element) {
        var start = element.indexOf("=") + 2;
        var end = element.indexOf("photos") - 3;
        var url = element.substr(start, end);
        return url
    }
    var setPreference = function(lable, value) {
        var currentPreferences = JSON.parse(localStorage.preferences)
        currentPreferences[lable].value = value
        localStorage.preferences = JSON.stringify(currentPreferences)
    }
    var events = {
        clickEvent: function() {
            document.querySelector('#property-button').addEventListener('click', function(e) {
                document.querySelector('#property-button').classList.add('active')
                document.querySelector('#services-button').classList.remove('active')
                document.querySelector('#property-list').classList.remove('hide')
                document.querySelector('#services-list').classList.add('hide')
            })
            document.querySelector('#services-button').addEventListener('click', function(e) {
                document.querySelector('#property-button').classList.remove('active')
                document.querySelector('#services-button').classList.add('active')
                document.querySelector('#property-list').classList.add('hide')
                document.querySelector('#services-list').classList.remove('hide')
            })
        },
        changeEvent: function() {
            document.querySelector('#bars-preference').addEventListener('change', function(e) {
                setPreference("bar", e.target.value)
            });
            document.querySelector('#sportscholen-preference').addEventListener('change', function(e) {
                setPreference("gym", e.target.value)
            });
            document.querySelector('#parken-preference').addEventListener('change', function(e) {
                setPreference("park", e.target.value)
            });
            document.querySelector('#scholen-preference').addEventListener('change', function(e) {
                setPreference("school", e.target.value)
            });
        }
    }
    // routie
    routie({
        '': function(id) {
            renderPreferences();
        },
        'map': function() {
            renderMap();
        },
        'detail/:id': function(id) {
            renderDetail(id);
        },
        'place/:id': function(id) {
            renderPlace(id);
        }
    });
    app.listen()
    app.init()
})();