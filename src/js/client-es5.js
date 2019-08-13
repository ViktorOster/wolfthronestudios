
"use strict";
//forEach polyfill
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, thisArg) {
        thisArg = thisArg || window;
        for (var i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}

//Array.from polyfill
if (!Array.from) {
    Array.from = (function () {
        var toStr = Object.prototype.toString;
        var isCallable = function (fn) {
            return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
        };
        var toInteger = function (value) {
            var number = Number(value);
            if (isNaN(number)) { return 0; }
            if (number === 0 || !isFinite(number)) { return number; }
            return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
        };
        var maxSafeInteger = Math.pow(2, 53) - 1;
        var toLength = function (value) {
            var len = toInteger(value);
            return Math.min(Math.max(len, 0), maxSafeInteger);
        };

        // The length property of the from method is 1.
        return function from(arrayLike/*, mapFn, thisArg */) {
            // 1. Let C be the this value.
            var C = this;

            // 2. Let items be ToObject(arrayLike).
            var items = Object(arrayLike);

            // 3. ReturnIfAbrupt(items).
            if (arrayLike == null) {
                throw new TypeError("Array.from requires an array-like object - not null or undefined");
            }

            // 4. If mapfn is undefined, then let mapping be false.
            var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
            var T;
            if (typeof mapFn !== 'undefined') {
                // 5. else
                // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
                if (!isCallable(mapFn)) {
                    throw new TypeError('Array.from: when provided, the second argument must be a function');
                }

                // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
                if (arguments.length > 2) {
                    T = arguments[2];
                }
            }

            // 10. Let lenValue be Get(items, "length").
            // 11. Let len be ToLength(lenValue).
            var len = toLength(items.length);

            // 13. If IsConstructor(C) is true, then
            // 13. a. Let A be the result of calling the [[Construct]] internal method of C with an argument list containing the single item len.
            // 14. a. Else, Let A be ArrayCreate(len).
            var A = isCallable(C) ? Object(new C(len)) : new Array(len);

            // 16. Let k be 0.
            var k = 0;
            // 17. Repeat, while k < len… (also steps a - h)
            var kValue;
            while (k < len) {
                kValue = items[k];
                if (mapFn) {
                    A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
                } else {
                    A[k] = kValue;
                }
                k += 1;
            }
            // 18. Let putStatus be Put(A, "length", len, true).
            A.length = len;
            // 20. Return A.
            return A;
        };
    }());
}

var galleryImages = Array.from(document.querySelectorAll(".gallery-img"));
var galleryFullscreen = document.querySelector(".gallery-fullscreen");
var galleryCloseButton = document.querySelector(".gallery-close");
var siteOverlay = document.querySelector(".site-overlay");
var navItems = document.querySelectorAll(".nav-item");
var bandcampEmbeds = document.querySelectorAll(".sample__bandcamp");
var buttonSamples = document.querySelector("#button-samples");
var buttonQuote = document.querySelector("#button-quote");
var isBCEmbedsLoaded = false;

function getOffset(el) {
    var rect = el.getBoundingClientRect();
    return {
        left: rect.left + window.pageXOffset,
        top: rect.top + window.pageYOffset
    };
} //wait until images are loaded until section positions are defined


var aboutPosY, ratesPosY, clientsPosY, equipmentPosY, contactPosY;
setTimeout(function () {
    aboutPosY = getOffset(document.querySelector("#section-about")).top;
    ratesPosY = getOffset(document.querySelector("#section-rates")).top;
    clientsPosY = getOffset(document.querySelector("#section-clients")).top;
    equipmentPosY = getOffset(document.querySelector("#section-equipment")).top;
    contactPosY = getOffset(document.querySelector("#section-contact")).top;
}, 3000); //hero buttons

buttonSamples.addEventListener("click", function () {
    window.scrollTo({
        top: clientsPosY + 1200,
        left: 0,
        behavior: 'smooth'
    });
});
buttonQuote.addEventListener("click", function () {
    window.scrollTo({
        top: contactPosY,
        left: 0,
        behavior: 'smooth'
    });
}); //make nav links active on scroll

window.addEventListener("scroll", function () {
    //load bandcamp embeds when scrolled
    if (!isBCEmbedsLoaded && window.pageYOffset > 1000) {
        bandcampEmbeds.forEach(function (embed) {
            embed.setAttribute("src", embed.getAttribute("data-src"));
        });
        isBCEmbedsLoaded = true;
    }

    navItems.forEach(function (item) {
        item.classList.remove("active");
    });

    if (window.pageYOffset < ratesPosY) {
        document.querySelector(".nav-link-about").className += " active";
    } else if (window.pageYOffset >= ratesPosY && window.pageYOffset < clientsPosY) {
        document.querySelector(".nav-link-rates").className += " active";
    } else if (window.pageYOffset >= clientsPosY && window.pageYOffset < equipmentPosY) {
        document.querySelector(".nav-link-clients").className += " active";
    } else if (window.pageYOffset >= equipmentPosY && window.pageYOffset < contactPosY) {
        document.querySelector(".nav-link-equipment").className += " active";
    } else {
        document.querySelector(".nav-link-contact").className += " active";
    }
});
var menuMobile = document.querySelector(".menu-mobile");
var navbarToggler = document.querySelector(".navbar-toggler");
navbarToggler.addEventListener("click", function (e) {
    if (!menuMobile.classList.contains("is-visible")) menuMobile.className += " is-visible"; else menuMobile.classList.remove("is-visible");
});
navItems.forEach(function (link) {
    link.addEventListener("click", function (e) {
        e.preventDefault();
        var scrollPosY;
        if (link.classList.contains("nav-link-about")) scrollPosY = aboutPosY + 2; else if (link.classList.contains("nav-link-rates")) scrollPosY = ratesPosY + 2; else if (link.classList.contains("nav-link-clients")) scrollPosY = clientsPosY + 2; else if (link.classList.contains("nav-link-equipment")) scrollPosY = equipmentPosY + 2; else scrollPosY = contactPosY + 2;
        window.scrollTo({
            top: scrollPosY,
            left: 0,
            behavior: 'smooth'
        });
    });
});
galleryImages.forEach(function (img) {
    img.addEventListener("click", function (e) {
        if (!img.classList.contains("is-expanded")) {
            img.className += " is-expanded";
            siteOverlay.className += " is-visible is-gallery";
            galleryFullscreen.className += " is-visible";
        }
    });
});
galleryCloseButton.addEventListener("click", function (e) {
    galleryImages.forEach(function (img) {
        if (img.classList.contains("is-expanded")) {
            img.classList.remove("is-expanded");
            siteOverlay.classList.remove("is-visible");
            galleryFullscreen.classList.remove("is-visible");
            siteOverlay.classList.remove("is-gallery");
        }
    });
});
var pricesModal = document.querySelector(".prices-modal");
var pricesModalLinks = document.querySelectorAll(".prices-modal-link");
pricesModalLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
        if (!pricesModal.classList.contains("is-visible")) {
            pricesModal.className += " is-visible";
            siteOverlay.className += " is-visible";
        }
    });
});
var closeButtons = document.querySelectorAll(".button-close");
closeButtons.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
        btn.parentElement.classList.remove("is-visible");
        btn.parentElement.classList.remove("is-expanded");
        siteOverlay.classList.remove("is-visible");
    });
});
var galleryNext = document.querySelector(".gallery-next");
galleryNext.addEventListener("click", function (e) {
    var currIndex;
    galleryImages.forEach(function (img) {
        if (img.classList.contains("is-expanded")) {
            img.classList.remove("is-expanded");
            currIndex = galleryImages.indexOf(img);
        }
    });
    if (galleryImages[currIndex + 1]) galleryImages[currIndex + 1].className += " is-expanded"; else galleryImages[0].className += " is-expanded";
});
var galleryPrev = document.querySelector(".gallery-prev");
galleryPrev.addEventListener("click", function (e) {
    var currIndex;
    galleryImages.forEach(function (img) {
        if (img.classList.contains("is-expanded")) {
            img.classList.remove("is-expanded");
            currIndex = galleryImages.indexOf(img);
        }
    });
    if (galleryImages[currIndex - 1]) galleryImages[currIndex - 1].className += " is-expanded"; else galleryImages[galleryImages.length - 1].className += " is-expanded";
}); //lazy loaded youtube embeds with preview

'use strict';

function r(f) {
    /in/.test(document.readyState) ? setTimeout('r(' + f + ')', 9) : f();
}

r(function () {
    if (!document.getElementsByClassName) {
        // IE8 support
        var getElementsByClassName = function getElementsByClassName(node, classname) {
            var a = [];
            var re = new RegExp('(^| )' + classname + '( |$)');
            var els = node.getElementsByTagName("*");

            for (var i = 0, j = els.length; i < j; i++) {
                if (re.test(els[i].className)) a.push(els[i]);
            }

            return a;
        };

        var videos = getElementsByClassName(document.body, "youtube");
    } else {
        var videos = document.getElementsByClassName("youtube");
    }

    var nb_videos = videos.length;

    for (var i = 0; i < nb_videos; i++) {
        // Based on the YouTube ID, we can easily find the thumbnail image
        videos[i].style.backgroundImage = 'url(https://i.ytimg.com/vi/' + videos[i].id + '/sddefault.jpg)'; // Overlay the Play icon to make it look like a video player

        var play = document.createElement("div");
        play.setAttribute("class", "play");
        videos[i].appendChild(play);

        videos[i].onclick = function () {
            // Create an iFrame with autoplay set to true
            var iframe = document.createElement("iframe");
            var iframe_url = "https://www.youtube.com/embed/" + this.id + "?autoplay=1&autohide=1";
            if (this.getAttribute("data-params")) iframe_url += '&' + this.getAttribute("data-params");
            iframe.setAttribute("src", iframe_url);
            iframe.setAttribute("frameborder", '0'); // The height and width of the iFrame should be the same as parent

            iframe.style.width = this.style.width;
            iframe.style.height = this.style.height; // Replace the YouTube thumbnail with YouTube Player

            this.parentNode.replaceChild(iframe, this);
        };
    }
});