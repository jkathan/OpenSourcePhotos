//things that need to be done
//build logic to make wikipedia reset value if new value is applied
//make images larger from flickr
    //seems like it requires me to make a photoid call and return the photo
//build lightbox - doesnt work necessarily, maybe needs a function call?

//logic to create a clickable box to open each photo via mobile - Next iteration. not going to happen
//logic to reduce the number of photos shown based on size. built this but it worked weird. 
//responsivenes is good except for ^
//aXe wants lis to have individual class tags
//labels as well

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

//write array for other apis where uiDesc is the same, apiVal is different
var apiFlickrPage = 0;
var apiPixabayPage = 0;
var wikiPageNumber = 1;
var searchTerm = ''
var licenseType = ''
var imageReturn = 4

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
        console.log($(window).width())
        if ($(window).width() < 460) { //&& $(window).width() > 460
          flickrGetRequest(searchTerm, licenseType, 1, 2);
          }
        else if  ($(window).width() < 1073 && $(window).width() > 460) { 
          flickrGetRequest(searchTerm, licenseType, 1, 3);
          }
        else {
          flickrGetRequest(searchTerm, licenseType, 1)
        };
        if ($(window).width() < 460) { //&& $(window).width() > 460
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
        else if ($(window).width() < 460) { //&& $(window).width() > 460
          pixabayGetRequest(searchTerm, 1, 2)
          }
        else if  ($(window).width() < 1073 && $(window).width() > 460) { 
          pixabayGetRequest(searchTerm, 1, 3)
          }
        else {
          pixabayGetRequest(searchTerm, 1, 4)
        //googleGetRequest(searchTerm, licenseType)
        //console.log(searchTerm)
        }
      });
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

function flickrNext() {
  document.getElementById('nextFlickr').addEventListener("click", function(e) {
  apiFlickrPage ++;
  flickrGetRequest(searchTerm, licenseType, apiFlickrPage, imageReturn);
});
}

//flickrPrevious() {
function flickrPrevious() {
  document.getElementById('previousFlickr').addEventListener("click", function(e) {
  //needs if statement
  apiFlickrPage --;
  flickrGetRequest(searchTerm, licenseType, apiFlickrPage, imageReturn);
});
}

function pixabayNext() {
  document.getElementById('nextPixabay').addEventListener("click", function(e) {
  apiPixabayPage ++;
  pixabayGetRequest(searchTerm, apiPixabayPage, imageReturn);
});
}

//flickrPrevious() {
function pixabayPrevious() {
  document.getElementById('previousPixabay').addEventListener("click", function(e) {
  //needs if statement
  apiPixabayPage -- ;
  pixabayGetRequest(searchTerm, apiPixabayPage, imageReturn);
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
      const altText = photo.title.replace(/\"/g, "");
      console.log(altText)
      //hover isn't working why?
      return `<li class="flickrImages">
     <a href="${thumbnail}" class="lightbox_trigger" target="_blank"><img src ="${thumbnail}" alt = '${altText}' class="imageSource" id="imageSource" title="Click to open new tab"></a>
      </li>
    `;
}
//Pixabay API CAll
function pixabayGetRequest(searchTerm, apiPixabayPage, imageReturn) {
    url = 'https://pixabay.com/api/';
    const params = {
        key: '9415919-232c4dd0b6ca28882e4ff7fba',
        q: searchTerm,
        per_page: imageReturn?imageReturn:4,
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
      return `<li class="pixabayImages">
     <a href="${thumbnail}" tabindex target="_blank"><img src ="${thumbnail}" alt = "${photo.tags}" class="imagesP" title="Click to open new tab"></a>
    </li>    
    `;
}

function wikiPageMaker () {
    var results = '';
    for(var i = (wikiPageNumber * imageReturn - imageReturn) ; i < (wikiPageNumber * imageReturn); i++) {
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

function wikiPreviousButton (){
  document.getElementById('previousWiki').addEventListener("click", function(e) {
  wikiPageNumber--;
  const results = wikiPageMaker();
  $('#wikiResults').html(results)
});
}

function wikiGetRequest(searchTerm) {
  console.log(searchTerm);
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
         if(!wikiImages) {
              $('#wikiResults').html('No results');
              }
         else {const results = wikiPageMaker();
         $('#wikiResults').html(results)
       }
});
}

function buildWikiThumbnailUrl(photo) {
      const urlWiki = photo.title.replace('File:', '').replace(/\s/g, '_');
      const thumbnail = 'https://commons.wikimedia.org/wiki/Special:FilePath/' + urlWiki; 
      console.log(thumbnail);
      return `<li class="wikiImages">
     <a href="${thumbnail}" tabindex target="_blank"><img src ="${thumbnail}" alt = "${photo.title}" class="imagesP" title="Click to open new tab"></a>
    </li>    
    `;
}

/*function writeLightbox () {

  $('.lightbox_trigger').click(function(e) {
      e.preventDefault();
      var image_href = $(this).attr("href");
      if ($('#lightbox').length > 0) {
        ('#content').html('<img src="' + image_href + '" />');
        $('#lightbox').show();
        }
      else { 
        var lightbox = 
        '<div id="lightbox">' +
          '<p>Click to close</p>' +
          '<div id="content">' + //insert clicked link's href into img src
            '<img src="' + image_href +'" />' +
            //'<a href"' image_href + '" download>Click here to download</a>' + //will this work without html code from above?
          '</div>' +  
        '</div>';
  $('body').append(lightbox);
}
});
  function doThis () {
  $('body').on('click', '#lightbox', function() {
    $('#lightbox').hide();

  });
}
doThis ();
}*/


$(document).ready(function () {
        submitAction();
        flickrPrevious();
        flickrNext();
        pixabayNext();
        pixabayPrevious ();
        wikiNextButton ();
        wikiPreviousButton ();
        //writeLightbox ();
});
