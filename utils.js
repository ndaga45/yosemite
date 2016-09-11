/* Helper functions not directly related to creation/function of lightbox */


// Javascript's native modulus function (%) behaves like the remainder operator
//(which returns negative numbers) so this is a proper mod function
function mod(n, m) {
    return ((n % m) + m) % m;
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

// Hit a REST API endpoint and pass the response to a callback function
function httpGetAsync(url, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.response);
    }
    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);
}

// Augment native DOM functions so you don't have to access parent node every time
// to remove an element
Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}