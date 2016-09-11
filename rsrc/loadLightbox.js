var NUM_IMAGES = 20;
var API_PARAMS = {
    format: 'json',
    method: 'flickr.photosets.getPhotos',
    photoset_id: '72157604010317412',
    api_key: 'f23ef6e2baf7ae9076b20d612c9e9438',
    extras: 'url_m',
    per_page: NUM_IMAGES,
    nojsoncallback: 1
};

// Stores index of image currently displayed in lightbox
var currentImageIndex = null;

function loadLightbox() {
    var APIurl = buildAPIUrl('https://api.flickr.com/services/rest/', API_PARAMS);
    httpGetAsync(APIurl, buildLightbox);
}

// Create thumbnails of images returned from API and add to grid
function buildLightbox(response) {
    var parsedResponse = JSON.parse(response);
    var photos = parsedResponse.photoset.photo;

    // Remove loading gif before creating and adding image thumbnails
    var loading = document.getElementById('loading');
    loading.remove();

    var grid = document.getElementById('grid');
    for (var i = 0; i < photos.length; i++) {
        var thumbnail = createThumbnail(photos[i], i);
        grid.appendChild(thumbnail);
    }

    attachLightboxTriggers();
}

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

// Attach click handler to each thumbnail to open lightbox
function attachLightboxTriggers() {
    var thumbnails = document.getElementsByClassName('thumbnail');
    for (var i = 0; i < thumbnails.length; i++) {
        thumbnails[i].addEventListener('click', openLightbox);
    }
}

// Open lightbox with controls and render clicked image
function openLightbox() {
    var clickedThumbnail = this;

    var imageSrc = clickedThumbnail.dataset.imgurl;
    var imageTitle = clickedThumbnail.dataset.title;
    currentImageIndex = parseInt(clickedThumbnail.dataset.index);

    var lightboxHTML =
        '<div id="lightbox">' +
            '<span id="close"></span>' +
            '<span id="left"></span>' +
            '<span id="right"></span>' +
            '<img id="lightboxImage" src="' + imageSrc +'" />' +
            '<p id="title">' + imageTitle + '<p>' +
        '</div>';
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);

    buildLightboxControls();
}

// Attach click and key press handlers to close lightbox and view previous/next images
function buildLightboxControls() {
    var thumbnails = document.getElementsByClassName('thumbnail');

    var closeButton = document.getElementById('close');
    closeButton.onclick = closeLightbox;

    var leftButton = document.getElementById('left');
    leftButton.onclick = function() { previousImage(thumbnails); };

    var rightButton = document.getElementById('right');
    rightButton.onclick = function() { nextImage(thumbnails); };

    document.onkeydown = function(event) {
        if (event.keyCode == 27) { // escape key maps to keycode 27
            closeLightbox();
        }
        if (event.keyCode == 39) { // right arrow maps to keycode 39
            nextImage(thumbnails);
        }
        if (event.keyCode == 37) { // left arrow maps to keycode 37
            previousImage(thumbnails);
        }
    }
}

function closeLightbox() {
    var lightbox = document.getElementById('lightbox');
    lightbox.remove();
}

// Display next image in lightbox
function nextImage(thumbnails) {
    currentImageIndex = mod(currentImageIndex+1, NUM_IMAGES);

    var newImage = thumbnails[currentImageIndex].dataset.imgurl;
    var newTitle = thumbnails[currentImageIndex].dataset.title;

    var lightboxImage = document.getElementById('lightboxImage');
    lightboxImage.src = newImage;

    var lightboxTitle = document.getElementById('title');
    lightboxTitle.innerHTML = newTitle;
}

// Display prevoius image in lightbox
function previousImage(thumbnails) {
    currentImageIndex = mod(currentImageIndex-1, NUM_IMAGES);

    var newImage = thumbnails[currentImageIndex].dataset.imgurl;
    var newTitle = thumbnails[currentImageIndex].dataset.title;

    var lightboxImage = document.getElementById('lightboxImage');
    lightboxImage.src = newImage;

    var lightboxTitle = document.getElementById('title');
    lightboxTitle.innerHTML = newTitle;
}