(function() {
    // set variables
    var url = 'http://funda.kyrandia.nl/feeds/Aanbod.svc/json/detail/271175433a7c4fe2a45750d385dd9bfd/koop/643335c8-380f-4350-b0df-dff5b6da1573/';
    var config = {
        BASEURL: 'http://funda.kyrandia.nl/feeds/Aanbod.svc/json/',
        AUTOSUGGESTBASEURL: 'http://zb.funda.info/frontend',
        MAPBASEURL: 'http://mt1.funda.nl/maptiledata.ashx',
        APIKEY: '271175433a7c4fe2a45750d385dd9bfd/',
        SEARCHURL: '?type=koop&zo=/amsterdam/tuin/&page=1&pagesize=25',
        OBJECTURL: 'detail/271175433a7c4fe2a45750d385dd9bfd/koop/643335c8-380f-4350-b0df-dff5b6da1573/',
        AUTOSUGGESTURL: '/geo/suggest/?query=amsterdam&max=7&type=koop&callback=callback',
        MAPURL: '?z=7&x=66&y=42&zo=koop/heel-nederland&callback=callback'
    }
    // get data
    var url = config.BASEURL + config.APIKEY + config.SEARCHURL;
    console.log(url)
    aja().url(url).on('success', function(data) {
        console.log(data)
    }).go();
})();