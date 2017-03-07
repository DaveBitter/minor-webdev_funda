(function() {
    // set variables
    var url = 'http://funda.kyrandia.nl/feeds/Aanbod.svc/json/detail/271175433a7c4fe2a45750d385dd9bfd/koop/643335c8-380f-4350-b0df-dff5b6da1573/';
    var config = {
        BASEURL: 'http://funda.kyrandia.nl/feeds/Aanbod.svc/json/',
        AUTOSUGGESTBASEURL: 'http://zb.funda.info/frontend',
        MAPBASEURL: 'http://mt1.funda.nl/maptiledata.ashx',
        APIKEY: '271175433a7c4fe2a45750d385dd9bfd/',
        SEARCHURL: '?type=koop&zo=/amsterdam/tuin/&page=1&pagesize=25',
        OBJECTURL: 'detail/',
        AUTOSUGGESTURL: '/geo/suggest/?query=amsterdam&max=7&type=koop&callback=callback',
        MAPURL: '?z=7&x=66&y=42&zo=koop/heel-nederland&callback=callback',
        GUIDURL: ' http://funda.kyrandia.nl/tinyId/'
    }
    var sections = {
        preferences: document.querySelector('#preferences'),
        preferencesInputs: document.querySelector('#preferencesInputs'),
        map: document.querySelector('#map'),
        detail: document.querySelector('#detail')
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
        sections.preferences.classList.remove('hide');
        sections.map.classList.add('hide');
        var preferencesInputs = sections.preferencesInputs,
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
        sections.preferences.classList.add('hide');
        sections.map.classList.remove('hide');
        var map = sections.map,
            mapTemplate = templates.map,
            source = mapTemplate.innerHTML,
            compile = Handlebars.compile(source),
            html = '';
        html = compile();
        map.innerHTML += html;
    }
    var renderDetail = function(id) {
        sections.preferences.classList.add('hide');
        sections.map.classList.add('hide');
        sections.detail.classList.remove('hide');
        sections.detail.innerHTML = ''
        var url = config.GUIDURL + id
        aja().url(url).on('success', function(property) {
            var guid = property[0].intid
            var url = config.BASEURL + config.OBJECTURL + config.APIKEY + "koop/" + guid
            aja().url(url).on('success', function(detailData) {
                var detail = sections.detail,
                    detailTemplate = templates.detail,
                    source = detailTemplate.innerHTML,
                    compile = Handlebars.compile(source),
                    html = '';
                html = compile(detailData);
                detail.innerHTML += html;
            }).go();
        }).go();
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
        }
    });
})();