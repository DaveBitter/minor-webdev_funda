(function() {
    // set variables
    var url = 'http://funda.kyrandia.nl/feeds/Aanbod.svc/json/detail/271175433a7c4fe2a45750d385dd9bfd/koop/643335c8-380f-4350-b0df-dff5b6da1573/';
    var app = {
        listen: function() {
            events.clickEvent()
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
        detail: document.querySelector('#templateDetail')
    }
    var preferences = {
        coffeeshop: {
            lable: "Koffieshops",
            value: 9
        },
        bar: {
            lable: "Bars",
            value: 8
        },
        gym: {
            lable: "Sportscholen",
            value: 6
        },
        park: {
            lable: "Parken",
            value: 7
        },
        school: {
            lable: "Scholen",
            value: 2
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
        Object.keys(preferences).map(function(objectKey, index) {
            var value = preferences[objectKey];
            html = compile(value);
            preferencesInputs.innerHTML += html;
        });
    }
    var renderMap = function() {
        elements.preferences.classList.add('hide');
        elements.map.classList.remove('hide');
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
        var parks = localStorage.getItem("parks")
        console.log(JSON.parse(bars), JSON.parse(parks))
        elements.preferences.classList.add('hide');
        elements.map.classList.add('hide');
        elements.detail.classList.add('hide');
        elements.place.classList.remove('hide');
        elements.place.innerHTML = ''
        id = 'ChIJN1t_tDeuEmsRUsoyG83frY4'
        var url = config.MAPSBASEURL + config.MAPSDETAILURL + id + config.MAPSAPIKEY
        console.log(url)
        aja().url(url).on('success', function(placeData) {
            console.log(placeData)
        }).go();
    }
    var events = {
        clickEvent: function() {
            elements.propertyButton.addEventListener('click', function(e) {
                console.log(e)
                elements.propertyButton.classList.add('active')
                elements.servicesButton.classList.remove('active')
                elements.propertyList.classList.remove('hide')
                elements.servicesList.classList.add('hide')
            })
            elements.servicesButton.addEventListener('click', function(e) {
                console.log(e)
                elements.propertyButton.classList.remove('active')
                elements.servicesButton.classList.add('active')
                elements.propertyList.classList.add('hide')
                elements.servicesList.classList.remove('hide')
            })
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
})();