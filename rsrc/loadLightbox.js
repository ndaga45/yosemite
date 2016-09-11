function loadLightbox() {
    var APIparams = {
        format: 'json',
        method: 'flickr.photosets.getPhotos',
        photoset_id: '72157604010317412',
        api_key: 'f23ef6e2baf7ae9076b20d612c9e9438',
        extras: 'url_m',
        per_page: 20,
        nojsoncallback: 1
    };

    var APIurl = buildAPIUrl('https://api.flickr.com/services/rest/', APIparams);
    httpGetAsync(APIurl, buildLightbox);
}

function buildAPIUrl(url, params) {
    if (params) {
        var queryString = '?';
        var paramKeys = Object.keys(params);

        for (var i = 0; i < paramKeys.length; i++) {
            queryString += paramKeys[i] + '=' + params[paramKeys[i]] + '&';
        }
    }
    return url + queryString;
}

function httpGetAsync(url, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.response);
    }
    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);
}

function buildLightbox(response) {
    var parsedResponse = JSON.parse(response);
    var photos = parsedResponse.photoset.photo;

    var loading = document.getElementById('loading');
    loading.parentNode.removeChild(loading);

    var grid = document.getElementById('grid');

    for (var i = 0; i < photos.length; i++) {
        var thumbnail = document.createElement('div');
        thumbnail.className = 'thumbnail';
        thumbnail.style.backgroundImage = "url("+photos[i].url_m+")";
        thumbnail.setAttribute('data-imgUrl', photos[i].url_m);

        grid.appendChild(thumbnail);
    }

    attachLightboxTriggers();
}

function attachLightboxTriggers() {
    var thumbnails = document.getElementsByClassName('thumbnail');
    for (var i = 0; i < thumbnails.length; i++) {
        thumbnails[i].addEventListener('click', lightboxTrigger);
    }
}

function lightboxTrigger() {
    var clickedThumbnail = this;
    var imageSrc = clickedThumbnail.getAttribute('data-imgUrl');

    var lightboxHTML =
    '<div id="lightbox">' +
        '<span id="close">x</span>' +
        '<div id="content">' +
            '<img src="' + imageSrc +'" />' +
        '</div>' +  
    '</div>';

    document.body.insertAdjacentHTML('beforeend', lightboxHTML);

    var closeButton = document.getElementById('close');
    closeButton.onclick = function() {
        var lightbox = document.getElementById('lightbox');
        lightbox.parentNode.removeChild(lightbox);
    }
}
