
const flickrLicense = [
{uiDesc: "Attribution-NonCommercial-ShareAlike License", apiVal: 1}, 
{uiDesc: "Attribution-NonCommercial License", apiVal: 2}, 
{uiDesc: "Attribution-NonCommercial-NoDerivs License", apiVal: 3}, 
{uiDesc: "Attribution-ShareAlike License", apiVal: 4}, 
{uiDesc: "Attribution-NoDerivs License", apiVal: 5}, 
{uiDesc: "No known copyright restrictions", apiVal: 6},  
{uiDesc: "Public Domain Dedication (CC0)", apiVal: 8}, 
]


var wikiImages = null

var apiFlickrPage = 0;
var apiPixabayPage = 0;
var wikiPageNumber = 1;
var searchTerm = ''
var licenseType = ''
var imageReturn = 4

//mapping license for flickr images to the api call
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
        wikiGetRequest(searchTerm);
        //determining number of photos to show for each API
        if ($(window).width() < 460) {
          flickrGetRequest(searchTerm, licenseType, 1, 2);
          }
        else if  ($(window).width() < 1073 && $(window).width() > 460) { 
          flickrGetRequest(searchTerm, licenseType, 1, 3);
          }
        else {
          flickrGetRequest(searchTerm, licenseType, 1)
        };
        if ($(window).width() < 460) {
          imageReturn = 2
          }
        else if  ($(window).width() < 1073 && $(window).width() > 460) { 
          imageReturn = 3
          }
        else {
          imageReturn = 4
        };                
        $(event.currentTarget).val('');
        if (searchTerm == '') {
            return null
          }
        else if ($(window).width() < 460) { 
          pixabayGetRequest(searchTerm, 1, 2)
          }
        else if  ($(window).width() < 1073 && $(window).width() > 460) { 
          pixabayGetRequest(searchTerm, 1, 3)
          }
        else {
          pixabayGetRequest(searchTerm, 1, 4)
        }
      });
    //page animations
      $(".submit").click(function() {
        $('html, body').animate({
        scrollTop: $(".main").offset().top
    }, 2000);
});
      $(".toTop").click(function() {
        $('html, body').animate({
        scrollTop: $("header").offset().top
    }, 2000);
        });
     
}

//Flickr API Call 
function flickrGetRequest(searchTerm, licenseType, apiFlickrPage, imageReturn) { 
    url = 'https://api.flickr.com/services/rest/';
    const params = {
        method: 'flickr.photos.search',
        api_key: '65d8a1e8c35c504a238f9c7bd46b425c',
        tags: searchTerm,
        tagmode: 'all',
        format: 'json',
        nojsoncallback: 1,
        per_page: imageReturn?imageReturn:4,
        page: apiFlickrPage,
        sort: 'relevance',
        license: mapLicenseType(licenseType, 'flickr'),
    };
    
    $.getJSON(url, params, function (response) {
         const results = response.photos.photo.map((item, response) => buildThumbnailUrl(item));
         $('#flickrResults').html(results)
         });
}
//flickr html builder
function buildThumbnailUrl(photo) {
      const thumbnail = 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server +
      '/' + photo.id + '_' + photo.secret + '_q.jpg';
      const altText = photo.title.replace(/\"/g, "");
      return `<li class="flickrImages">
     <a href="${thumbnail}" class="lightbox_trigger" target="_blank"><img src ="${thumbnail}" alt = '${altText}' class="imageSource" id="imageSource" title="Click to open new tab"></a>
      </li>
    `;
}
//flicr next button
function flickrNext() {
  document.getElementById('nextFlickr').addEventListener("click", function(e) {
  apiFlickrPage ++;
  flickrGetRequest(searchTerm, licenseType, apiFlickrPage, imageReturn);
});
}
//flickr previous button
function flickrPrevious() {
  document.getElementById('previousFlickr').addEventListener("click", function(e) {
  apiFlickrPage --;
  flickrGetRequest(searchTerm, licenseType, apiFlickrPage, imageReturn);
});
}

//Pixabay API Call
function pixabayGetRequest(searchTerm, apiPixabayPage, imageReturn) {
    url = 'https://pixabay.com/api/';
    const params = {
        key: '9415919-232c4dd0b6ca28882e4ff7fba',
        q: searchTerm,
        per_page: imageReturn?imageReturn:4,
        page: apiPixabayPage,
    };
  
  
    $.getJSON(url, params, function (response) {
         const results = response.hits.map((item, response) => buildPixabayThumbnailUrl(item));
         $('#pixabayResults').html(results)
         
});
}
//pixabay html builder
function buildPixabayThumbnailUrl(photo) {
      const thumbnail = photo.largeImageURL;
      console.log(thumbnail);
      return `<li class="pixabayImages">
     <a href="${thumbnail}" tabindex target="_blank"><img src ="${thumbnail}" alt = "${photo.tags}" class="imagesP" title="Click to open new tab"></a>
    </li>    
    `;
}
//pixabay next button
function pixabayNext() {
  document.getElementById('nextPixabay').addEventListener("click", function(e) {
  apiPixabayPage ++;
  pixabayGetRequest(searchTerm, apiPixabayPage, imageReturn);
});
}
//pixabay previous button
function pixabayPrevious() {
  document.getElementById('previousPixabay').addEventListener("click", function(e) {
  apiPixabayPage -- ;
  pixabayGetRequest(searchTerm, apiPixabayPage, imageReturn);
});
}
//Wiki Commons API call
function wikiGetRequest(searchTerm) {
    url = 'https://commons.wikimedia.org/w/api.php?';
    const params = {
        format: 'json',
        action: 'query', 
        titles: searchTerm, 
        prop: 'images',
        origin: '*',
        imlimit: 500,
    };
  
    $.getJSON(url, params, function (response) {
         wikiImages = response.query.pages[Object.keys(response.query.pages)[0]].images;
         if(!wikiImages) {
              $('#wikiResults').html('<h1 class="noResults">No results</h1>');
              }
         else {const results = wikiPageMaker();
         $('#wikiResults').html(results)
       }
});
}
//due to Wiki's API structure, function is required to show designated number of photos from array of photos
function wikiPageMaker () {
    var results = '';
    for(var i = (wikiPageNumber * imageReturn - imageReturn) ; i < (wikiPageNumber * imageReturn); i++) {
    results += buildWikiThumbnailUrl (wikiImages[i]);
  }
  return results
}
//build wiki html
function buildWikiThumbnailUrl(photo) {
      const urlWiki = photo.title.replace('File:', '').replace(/\s/g, '_');
      const thumbnail = 'https://commons.wikimedia.org/wiki/Special:FilePath/' + urlWiki; 
      return `<li class="wikiImages">
     <a href="${thumbnail}" tabindex target="_blank"><img src ="${thumbnail}" alt = "${photo.title}" class="imagesP" title="Click to open new tab"></a>
    </li>    
    `;
}
//wiki next button
function wikiNextButton (){
  document.getElementById('nextWiki').addEventListener("click", function(e) {
  wikiPageNumber++;
  const results = wikiPageMaker();
  $('#wikiResults').html(results)
});
}
//wiki previous button
function wikiPreviousButton (){
  document.getElementById('previousWiki').addEventListener("click", function(e) {
  wikiPageNumber--;
  const results = wikiPageMaker();
  $('#wikiResults').html(results)
});
}

$(document).ready(function () {
        submitAction();
        flickrPrevious();
        flickrNext();
        pixabayNext();
        pixabayPrevious ();
        wikiNextButton ();
        wikiPreviousButton ();
        });
