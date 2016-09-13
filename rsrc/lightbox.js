var NUM_IMAGES = 20;
var API_PARAMS = {
    format: 'json',
    method: 'flickr.photosets.getPhotos',
    api_key: 'f23ef6e2baf7ae9076b20d612c9e9438',
    extras: 'url_m',
    nojsoncallback: 1
};

/*
 * @param photosetId: the ID of the Flick album to pull images from
 * @param numImages: the number of images to pull from the API and to display in the grid of thumbnails
 * Usage: Call Lightbox.load(<photosetId>, <numImages>) after loading this script and the utils script
 * to display a gallery of thumbnails that can trigger lightbox view on click.
 */
function Lightbox(photosetId, numImages) {
    this.photosetId = photosetId;
    this.numImages = numImages;
    this.currentImageIndex = null;
    this.thumbnails = [];
}

Lightbox.prototype = {
    constructor: Lightbox,

    load: function() {
        API_PARAMS.photoset_id = this.photosetId;
        API_PARAMS.per_page = this.numImages;
        this._loadFlickrAPI(API_PARAMS, this._buildLightbox);
    },

    closeLightbox: function() {
        var lightbox = document.getElementById('lightbox');
        lightbox.remove();
    },

    nextImage: function(self) {
        self.currentImageIndex = mod(self.currentImageIndex+1, NUM_IMAGES);

        var newImage = self.thumbnails[self.currentImageIndex].dataset.imgurl;
        var newTitle = self.thumbnails[self.currentImageIndex].dataset.title;

        var lightboxImage = document.getElementById('lightboxImage');
        lightboxImage.src = newImage;

        var lightboxTitle = document.getElementById('title');
        lightboxTitle.innerHTML = newTitle;
    },

    previousImage: function(self) {
        self.currentImageIndex = mod(self.currentImageIndex-1, NUM_IMAGES);

        var newImage = self.thumbnails[self.currentImageIndex].dataset.imgurl;
        var newTitle = self.thumbnails[self.currentImageIndex].dataset.title;

        var lightboxImage = document.getElementById('lightboxImage');
        lightboxImage.src = newImage;

        var lightboxTitle = document.getElementById('title');
        lightboxTitle.innerHTML = newTitle;
    },



    /*
     * Private functions
     */

     _loadFlickrAPI: function(params, callback) {
        var self = this;
        var url = buildAPIUrl('https://api.flickr.com/services/rest/', params);
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() { 
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                callback(self, xmlHttp.response);
        }
        xmlHttp.open("GET", url, true); // true for asynchronous 
        xmlHttp.send(null);
     },

    _buildLightbox: function(self, response) {
        var photoSet = JSON.parse(response).photoset;
        var photos = photoSet.photo;

        // Remove loading gif before creating and adding image thumbnails
        var loading = document.getElementById('loading');
        loading.remove();

        // Title
        document.title = photoSet.title;
        document.body.insertAdjacentHTML('afterbegin', '<h1>' + photoSet.title + '</h1>');

        // Thumbnail grid
        var grid = document.getElementById('grid');
        for (var i = 0; i < photos.length; i++) {
            var thumbnail = createThumbnail(photos[i], i);
            grid.appendChild(thumbnail);
        }

        self.thumbnails = document.getElementsByClassName('thumbnail');
        for (var i = 0; i < self.thumbnails.length; i++) {
            self.thumbnails[i].addEventListener('click', function(clickEvent) {
                self._openLightbox(clickEvent);
            });
        }
    },

    _openLightbox: function(clickEvent) {
        var clickedThumbnail = clickEvent.target;

        var imageSrc = clickedThumbnail.dataset.imgurl;
        var imageTitle = clickedThumbnail.dataset.title;
        this.currentImageIndex = parseInt(clickedThumbnail.dataset.index);

        var lightboxHTML =
            '<div id="lightbox">' +
                '<span id="close"></span>' +
                '<span id="left"></span>' +
                '<span id="right"></span>' +
                '<img id="lightboxImage" src="' + imageSrc +'" />' +
                '<p id="title">' + imageTitle + '<p>' +
            '</div>';
        document.body.insertAdjacentHTML('beforeend', lightboxHTML);

        this._buildLightboxControls();
    },

    _buildLightboxControls: function() {
        var self = this;
        var closeButton = document.getElementById('close');
        closeButton.onclick = this.closeLightbox;

        var leftButton = document.getElementById('left');
        //leftButton.onclick = this.previousImage;
        leftButton.addEventListener('click', function() {
            self.previousImage(self);
        });

        var rightButton = document.getElementById('right');
        //rightButton.onclick = this.nextImage;
        rightButton.addEventListener('click', function() {
            self.nextImage(self);
        });

        document.onkeydown = function(event) {
            if (event.keyCode == 27) { // escape key maps to keycode 27
                self.closeLightbox();
            }
            if (event.keyCode == 39) { // right arrow maps to keycode 39
                self.nextImage(self);
            }
            if (event.keyCode == 37) { // left arrow maps to keycode 37
                self.previousImage(self);
            }
        }
    }
}



 /*
  * Helper functions
  */

// Create thumbnail of photo
function createThumbnail(photo, index) {
    var thumbnail = document.createElement('div');
    thumbnail.className = 'thumbnail';
    thumbnail.style.backgroundImage = "url("+photo.url_m+")";
    thumbnail.setAttribute('data-imgUrl', photo.url_m);
    thumbnail.setAttribute('data-title', photo.title);
    thumbnail.setAttribute('data-index', index);

    return thumbnail;
}

// Given a REST API endpoint and a params object, construct the full endpoint URL
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