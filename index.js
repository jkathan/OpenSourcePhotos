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

var wikiImages = null

//write array for other apis where uiDesc is the same, apiVal is different
var apiFlickrPage = 0;
var apiPixabayPage = 0;
var wikiPageNumber = 1;
var searchTerm = ''
var licenseType = ''

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
        searchTerm = queryTarget.val();
        var licenseQuery = $(event.currentTarget).find('.license');
        licenseType = licenseQuery.val();
        flickrGetRequest(searchTerm, licenseType, 1);
        wikiGetRequest(searchTerm);
        pixabayGetRequest(searchTerm, 1);
        $(event.currentTarget).val('');
        //googleGetRequest(searchTerm, licenseType)
        //console.log(searchTerm)
        });
}

function flickrNext() {
  document.getElementById('nextFlickr').addEventListener("click", function(e) {
  apiFlickrPage ++;
  flickrGetRequest(searchTerm, licenseType, apiFlickrPage);
});
}

//flickrPrevious() {
function flickrPrevious() {
  document.getElementById('previousFlickr').addEventListener("click", function(e) {
  //needs if statement
  apiFlickrPage --;
  flickrGetRequest(searchTerm, licenseType, apiFlickrPage);
});
}

function pixabayNext() {
  document.getElementById('nextPixabay').addEventListener("click", function(e) {
  apiPixabayPage ++;
  pixabayGetRequest(searchTerm, apiPixabayPage);
});
}

//flickrPrevious() {
function pixabayPrevious() {
  document.getElementById('previousPixabay').addEventListener("click", function(e) {
  //needs if statement
  apiPixabayPage -- ;
  pixabayGetRequest(searchTerm, apiPixabayPage);
});
}

//Flickr API Call 
function flickrGetRequest(searchTerm, licenseType, apiFlickrPage) { 
    url = 'https://api.flickr.com/services/rest/';
    const params = {
        method: 'flickr.photos.search',
        api_key: '65d8a1e8c35c504a238f9c7bd46b425c',
        tags: searchTerm,
        tagmode: 'all',
        format: 'json',
        nojsoncallback: 1,
        per_page: 6,
        page: apiFlickrPage,
        //Work through owner name
        license: mapLicenseType(licenseType, 'flickr'),
    };
    //console.log(params);
  
    $.getJSON(url, params, function (response) {
        console.log(response);
        //showResults(searchTerm);
         const results = response.photos.photo.map((item, response) => buildThumbnailUrl(item));
         $('#flickrResults').html(results)
         });
}

function buildThumbnailUrl(photo) {
      const thumbnail = 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server +
      '/' + photo.id + '_' + photo.secret + '_q.jpg';
      console.log(thumbnail);
      return `<li class="flickrImages">
     <a href="${thumbnail}" class = "lightbox_trigger" tabindex><img src ="${thumbnail}" alt = "${photo.title}"></a>
    </li>    
    `;
}
//Pixabay API CAll
function pixabayGetRequest(searchTerm, apiPixabayPage) {
    url = 'https://pixabay.com/api/';
    const params = {
        key: '9415919-232c4dd0b6ca28882e4ff7fba',
        q: searchTerm,
        per_page: 6,
        page: apiPixabayPage,
        //Work through owner name
        //license: mapLicenseType(licenseType, 'flickr'),
    };
    //console.log(params);
  
    $.getJSON(url, params, function (response) {
        console.log(response);
        //showResults(searchTerm);
         const results = response.hits.map((item, response) => buildPixabayThumbnailUrl(item));
         $('#pixabayResults').html(results)
         
});
}
function buildPixabayThumbnailUrl(photo) {
      const thumbnail = photo.largeImageURL;
      console.log(thumbnail);
      return `<div class="pixabayImages">
     <a href="${thumbnail}" tabindex><img src ="${thumbnail}" alt = "${photo.tags}" class="imagesP"></a>
    <div>    
    `;
}

function wikiPageMaker () {
    var results = '';
    for(var i = (wikiPageNumber * 6 - 6) ; i < (wikiPageNumber * 6 - 1); i++) {
    //{show wikiImages[i]
    results += buildWikiThumbnailUrl (wikiImages[i]);
  }
  return results
}

function wikiNextButton (){
  document.getElementById('nextWiki').addEventListener("click", function(e) {
  wikiPageNumber++;
  const results = wikiPageMaker();
  $('#wikiResults').html(results)
});
}

function wikiGetRequest(searchTerm) {
    url = 'https://commons.wikimedia.org/w/api.php?';
    const params = {
        //method: 'flickr.photos.search',
        format: 'json',
        action: 'query', 
        titles: searchTerm, 
        //prop: 'imageinfo',
        prop: 'images',
        //iiprop: 'url', 
        //srsearch: searchTerm, 
        origin: '*',
        imlimit: 500,
        //limit: 6,
        //per_page: 6,
        //prop: 'imageinfo',
        //license: mapLicenseType(licenseType, 'flickr'),
    };
    //method: "GET",
    //dataType: "jsonp",
    //console.log(params);
  
    $.getJSON(url, params, function (response) {
        console.log(response);
         //const results = response.query.pages[Object.keys(response.query.pages)[0]].images.map((item, response) => buildWikiThumbnailUrl(item));
         wikiImages = response.query.pages[Object.keys(response.query.pages)[0]].images;
         const results = wikiPageMaker();
         $('#wikiResults').html(results)
});
}

function buildWikiThumbnailUrl(photo) {
      const urlWiki = photo.title.replace('File:', '').replace(/\s/g, '_');
      const thumbnail = 'https://commons.wikimedia.org/wiki/Special:FilePath/' + urlWiki; 
      console.log(thumbnail);
      return `<div class="wikiImages">
     <a href="${thumbnail}" tabindex><img src ="${thumbnail}" alt = "${photo.title}" class="imagesP"></a>
    <div>    
    `;
}

function lightBox() {
$('.lightbox_trigger').click(function(e) {
  e.preventDefault();
  var image_href = $(this).attr("href");
  if ($('#lightbox').length > 0) { 
    $('#content').html('<img src="' + image_href + '" />');
    $('#lightbox').show();
  }
  //if statement depending on what type of photo was pressed. Question around how to pull data from api within a function that doesnt provide thos parameters. Do i have to write a lightbox for each?
  else {
      var lightbox = 
      '<div id="lightbox">' +
        '<p>Click to close</p>' +
        '<div id="content">' + 
          '<img src="' + image_href +'" />' +
        '</div>' +  
      '</div>';
      $('body').append(lightbox);
    }
  });
  $('#lightbox').on('click', function() { 
    $('#lightbox').hide();
  });
}

$(document).ready(function () {
        submitAction();
        lightBox();
        flickrPrevious();
        flickrNext();
        pixabayNext();
        pixabayPrevious ();
        wikiNextButton ();
});
