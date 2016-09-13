/* Helper functions not directly related to creation/function of lightbox */

// Javascript's native modulus function (%) behaves like the remainder operator
//(which returns negative numbers) so this is a proper mod function
function mod(n, m) {
    return ((n % m) + m) % m;
}

// Augment native DOM functions so you don't have to access parent node every time
// to remove an element
Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}