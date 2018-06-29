const flickrLicense = [
{uiDesc: "Attribution-NonCommercial-ShareAlike License", apiVal: 1}, 
{uiDesc: "Attribution-NonCommercial License", apiVal: 2}, 
{uiDesc: "Attribution-NonCommercial-NoDerivs License", apiVal: 3}, 
{uiDesc: "Attribution-ShareAlike License", apiVal: 4}, 
{uiDesc: "Attribution-NoDerivs License", apiVal: 5}, 
{uiDesc: "No known copyright restrictions", apiVal: 6},  
{uiDesc: "Public Domain Dedication (CC0)", apiVal: 8}, 
]

const googleLicense = [
{uiDesc: "Attribution-NonCommercial-ShareAlike License", apiVal: 'cc_sharealike'}, 
{uiDesc: "Attribution-NonCommercial License", apiVal: 'cc_noncommercial'}, 
{uiDesc: "Attribution-NonCommercial-NoDerivs License", apiVal: 'cc_attribute'}, 
{uiDesc: "Attribution-ShareAlike License", apiVal: 'cc_sharealike'}, 
{uiDesc: "Attribution-NoDerivs License", apiVal: 'cc_nonderived'}, 
{uiDesc: "Public Domain Dedication (CC0)", apiVal: 'cc_publicdomain'},
]
//write array for other apis where uiDesc is the same, apiVal is different

function mapLicenseType(uiLicenseType, apiName) {
    let mapToUse = (apiName === 'flickr') ? flickrLicense: (apiName === 'google') ? googleLicense:null;
    if (mapToUse === null) {
        return '';
    }
    for (let i=0; i < mapToUse.length; i++) {
        if (uiLicenseType === mapToUse[i].uiDesc) {
            return mapToUse[i].apiVal
        }
    }
    return '';
}

function submitAction() {
    $('#searchTerm').submit(function (event) {
        event.preventDefault();
        var queryTarget = $(event.currentTarget).find('#query');
        var searchTerm = queryTarget.val();
        var licenseQuery = $(event.currentTarget).find('.license');
        var licenseType = licenseQuery.val()
        flickrGetRequest(searchTerm, licenseType);
        wikiGetRequest(searchTerm);
        pixabayGetRequest(searchTerm)
        //googleGetRequest(searchTerm, licenseType)
        //console.log(searchTerm)
    });
};
//Flickr API Call 
function flickrGetRequest(searchTerm, licenseType) {
    url = 'https://api.flickr.com/services/rest/';
    const params = {
        method: 'flickr.photos.search',
        api_key: '65d8a1e8c35c504a238f9c7bd46b425c',
        tags: searchTerm,
        tagmode: 'all',
        format: 'json',
        nojsoncallback: 1,
        per_page: 6,
        //Work through owner name
        license: mapLicenseType(licenseType, 'flickr'),
    };
    //console.log(params);
  
    $.getJSON(url, params, function (response) {
        console.log(response);
        //showResults(searchTerm);
         const results = response.photos.photo.map((item, response) => buildThumbnailUrl(item));
         $('#flickrResults').html(results)
         buildThumbnailUrl(response)
});
}
function buildThumbnailUrl(photo) {
      const thumbnail = 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server +
      '/' + photo.id + '_' + photo.secret + '_q.jpg';
      console.log(thumbnail);
      return `<div>
     <a href="${thumbnail}" tabindex><img src ="${thumbnail}" alt = "${photo.title}"></a>
    <div>    
    `;
}
//Pixabay API CAll
function pixabayGetRequest(searchTerm) {
    url = 'https://pixabay.com/api/';
    const params = {
        key: '9415919-232c4dd0b6ca28882e4ff7fba',
        q: searchTerm,
        per_page: 6,
        //Work through owner name
        //license: mapLicenseType(licenseType, 'flickr'),
    };
    //console.log(params);
  
    $.getJSON(url, params, function (response) {
        console.log(response);
        //showResults(searchTerm);
         const results = response.hits.map((item, response) => buildPixabayThumbnailUrl(item));
         $('#pixabayResults').html(results)
         buildPixabayThumbnailUrl(response)
});
}
function buildPixabayThumbnailUrl(photo) {
      const thumbnail = photo.largeImageURL;
      console.log(thumbnail);
      return `<div>
     <a href="${thumbnail}" tabindex><img src ="${thumbnail}" alt = "${photo.tags}"></a>
    <div>    
    `;
}

/*function googleGetRequest(searchTerm, licenseType) {
  url = 'http://cse.google.com/cse.js';    
  const params = {
        api_key: 'AIzaSyD6dk-p7RfVw-O72J0NMHdiF9K1X-8gRB4',
        cx: '007932774772389185854:r76rtclzpi8',
        searchtype: 'image',
        q: searchTerm,
        //as_rights: mapLicenseType(licenseType, 'google'),
    };
    //console.log(params);
  
    $.getJSON(url, params, function (response) {
        console.log(response);
});
  }*/
function wikiGetRequest(searchTerm) {
    url = 'https://en.wikipedia.org/w/api.php';
    const params = {
        //method: 'flickr.photos.search',
        format: 'json',
        action: 'query', 
        list: 'search', 
        prop: 'imageinfo', 
        srsearch: searchTerm, 
        format: 'json',
        //per_page: 6,
        //prop: 'imageinfo',
        //license: mapLicenseType(licenseType, 'flickr'),
    };
    //method: "GET",
    //dataType: "jsonp",
    //console.log(params);
  
    $.getJSON(url, params, function (response) {
        console.log(response);
        //showResults(searchTerm);
         //const results = response.photos.photo.map((item, response) => buildThumbnailUrl(item));
         //$('wikiResults').html(results)
         //buildThumbnailUrl(response)
});
}

$(submitAction)