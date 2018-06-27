function submitAction() {
    $('#search-term').submit(function (event) {
        event.preventDefault();
        var queryTarget = $(event.currentTarget).find('#query');
        var searchTerm = queryTarget.val();
        getRequest(searchTerm);
        //console.log(params.maxResults)
    });
};

function getRequest(searchTerm) {
    url = 'https://www.googleapis.com/youtube/v3/search';
    const params = {
        part: 'snippet',
        key: 'AIzaSyBF5iNtaIhV7dxpUra_Dab06RhnT7rakZQ',
        q: searchTerm,
        maxResults: 6,        
    };
  
    $.getJSON(url, params, function (response) {
        console.log(response.items);
        //showResults(searchTerm);
         const results = response.items.map((item, response) => showResults(item));
         $('#search-results').html(results)
         const totalResults = displayResults(response.items.length);
         $('.resultCount').html(totalResults)
         });
}

function showResults (item) {
    let clickable = 'https://www.youtube.com/watch?v='+`${item.id.videoId}`;
    return `
     <div>
     <a href="${clickable}" tabindex><img src ="${item.snippet.thumbnails.medium.url}" alt = "${item.snippet.title}"></a>
     <div>    
    `;
   }

function displayResults (numCount) {
   return `
    <h3> ${numCount} videos displayed on page</h3>
    `;
}

$(submitAction)