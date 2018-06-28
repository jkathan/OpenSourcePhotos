const flickrLicense = [
{uiDesc: "No Domain", apiVal: 1}, 
{uiDesc: "", apiVal: 2}, 
{uiDesc: "", apiVal: 3}, 
{uiDesc: "", apiVal: 4}, 
{uiDesc: "", apiVal: 5}, 
{uiDesc: "", apiVal: 6}, 
{uiDesc: "", apiVal: 7}, 
{uiDesc: "", apiVal: 8}, 
{uiDesc: "", apiVal: 9}, 
]
//write array for other apis where uiDesc is the same, apiVal is different

function mapLicenseType(uiLicenseType, apiName) {
    let mapToUse = (apiName === 'flickr') ? flickrLicense: null;
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
        getRequest(searchTerm, licenseType);
        //console.log(searchTerm)
    });
};
//do next three functions for each api
function getRequest(searchTerm, licenseType) {
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



/*function displayResults (numCount) {
   return `
    <h3> ${numCount} videos displayed on page</h3>
    `;
}*/

$(submitAction)