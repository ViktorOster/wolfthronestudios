

const galleryImages = Array.from(document.querySelectorAll(".gallery-img"));
const galleryFullscreen = document.querySelector(".gallery-fullscreen")
const galleryCloseButton = document.querySelector(".gallery-close")
const siteOverlay = document.querySelector(".site-overlay");
const navItems = document.querySelectorAll(".nav-item");
const bandcampEmbeds = document.querySelectorAll(".sample__bandcamp");
const buttonSamples = document.querySelector("#button-samples")
const buttonQuote = document.querySelector("#button-quote")
let isBCEmbedsLoaded = false;

function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
        left: rect.left + window.pageXOffset,
        top: rect.top + window.pageYOffset
    };
}

//wait until images are loaded until section positions are defined
let aboutPosY, ratesPosY, clientsPosY, equipmentPosY, contactPosY;
setTimeout(() => {
    aboutPosY = getOffset(document.querySelector("#section-about")).top;
    ratesPosY = getOffset(document.querySelector("#section-rates")).top;
    clientsPosY = getOffset(document.querySelector("#section-clients")).top;
    equipmentPosY = getOffset(document.querySelector("#section-equipment")).top;
    contactPosY = getOffset(document.querySelector("#section-contact")).top;
}, 3000);


//hero buttons
buttonSamples.addEventListener("click", () => {
    window.scrollTo({
        top: clientsPosY + 1200,
        left: 0,
        behavior: 'smooth'
    });
})
buttonQuote.addEventListener("click", () => {
    window.scrollTo({
        top: contactPosY,
        left: 0,
        behavior: 'smooth'
    });
})

//make nav links active on scroll
window.addEventListener("scroll", () => {
    //load bandcamp embeds when scrolled
    if (!isBCEmbedsLoaded && window.pageYOffset > 1000) {
        bandcampEmbeds.forEach(embed => {
            embed.setAttribute("src", embed.getAttribute("data-src"))
        })
        isBCEmbedsLoaded = true;
    }
    navItems.forEach(item => {
        item.classList.remove("active")
    })

    if (window.pageYOffset < ratesPosY) {
        document.querySelector(".nav-link-about").classList += " active"
    }
    else if (window.pageYOffset >= ratesPosY && window.pageYOffset < clientsPosY) {
        document.querySelector(".nav-link-rates").classList += " active"
    }
    else if (window.pageYOffset >= clientsPosY && window.pageYOffset < equipmentPosY) {
        document.querySelector(".nav-link-clients").classList += " active"
    }
    else if (window.pageYOffset >= equipmentPosY && window.pageYOffset < contactPosY) {
        document.querySelector(".nav-link-equipment").classList += " active"
    }
    else {
        document.querySelector(".nav-link-contact").classList += " active"
    }
})
const menuMobile = document.querySelector(".menu-mobile")
const navbarToggler = document.querySelector(".navbar-toggler")
navbarToggler.addEventListener("click", (e) => {
    if (!menuMobile.classList.contains("is-visible")) menuMobile.className += " is-visible";
    else menuMobile.classList.remove("is-visible")
})

navItems.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault()
        let scrollPosY;
        if (link.classList.contains("nav-link-about")) scrollPosY = aboutPosY + 2
        else if (link.classList.contains("nav-link-rates")) scrollPosY = ratesPosY + 2
        else if (link.classList.contains("nav-link-clients")) scrollPosY = clientsPosY + 2
        else if (link.classList.contains("nav-link-equipment")) scrollPosY = equipmentPosY + 2
        else scrollPosY = contactPosY + 2

        window.scrollTo({
            top: scrollPosY,
            left: 0,
            behavior: 'smooth'
        });
    })
})

galleryImages.forEach(img => {
    img.addEventListener("click", (e) => {

        if (!img.classList.contains("is-expanded")) {
            img.className += " is-expanded";
            siteOverlay.classList += " is-visible is-gallery";
            galleryFullscreen.classList += " is-visible"
        }
    })
})
galleryCloseButton.addEventListener("click", (e) => {
    galleryImages.forEach(img => {
        if (img.classList.contains("is-expanded")) {
            img.classList.remove("is-expanded")
            siteOverlay.classList.remove("is-visible")
            galleryFullscreen.classList.remove("is-visible")
            siteOverlay.classList.remove("is-gallery")
        }
    })
})
const pricesModal = document.querySelector(".prices-modal");
const pricesModalLinks = document.querySelectorAll(".prices-modal-link");
pricesModalLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        if (!pricesModal.classList.contains("is-visible")) {
            pricesModal.classList += " is-visible";
            siteOverlay.classList += " is-visible";
        }
    })
})

const closeButtons = document.querySelectorAll(".button-close");
closeButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
        btn.parentElement.classList.remove("is-visible");
        btn.parentElement.classList.remove("is-expanded");
        siteOverlay.classList.remove("is-visible");
    })
})

const galleryNext = document.querySelector(".gallery-next")
galleryNext.addEventListener("click", (e) => {
    let currIndex;
    galleryImages.forEach(img => {
        if (img.classList.contains("is-expanded")) {
            img.classList.remove("is-expanded")
            currIndex = galleryImages.indexOf(img)
        }
    })
    if (galleryImages[currIndex + 1]) galleryImages[currIndex + 1].classList += " is-expanded";
    else galleryImages[0].classList += " is-expanded";
})

const galleryPrev = document.querySelector(".gallery-prev")
galleryPrev.addEventListener("click", (e) => {
    let currIndex;
    galleryImages.forEach(img => {
        if (img.classList.contains("is-expanded")) {
            img.classList.remove("is-expanded")
            currIndex = galleryImages.indexOf(img)
        }
    })
    if (galleryImages[currIndex - 1]) galleryImages[currIndex - 1].classList += " is-expanded";
    else galleryImages[galleryImages.length - 1].classList += " is-expanded";
})

//lazy loaded youtube embeds with preview
'use strict';
function r(f) { /in/.test(document.readyState) ? setTimeout('r(' + f + ')', 9) : f() }
r(function () {
    if (!document.getElementsByClassName) {
        // IE8 support
        var getElementsByClassName = function (node, classname) {
            var a = [];
            var re = new RegExp('(^| )' + classname + '( |$)');
            var els = node.getElementsByTagName("*");
            for (var i = 0, j = els.length; i < j; i++)
                if (re.test(els[i].className)) a.push(els[i]);
            return a;
        }
        var videos = getElementsByClassName(document.body, "youtube");
    } else {
        var videos = document.getElementsByClassName("youtube");
    }

    var nb_videos = videos.length;
    for (var i = 0; i < nb_videos; i++) {
        // Based on the YouTube ID, we can easily find the thumbnail image
        videos[i].style.backgroundImage = 'url(https://i.ytimg.com/vi/' + videos[i].id + '/sddefault.jpg)';

        // Overlay the Play icon to make it look like a video player
        var play = document.createElement("div");
        play.setAttribute("class", "play");
        videos[i].appendChild(play);

        videos[i].onclick = function () {
            // Create an iFrame with autoplay set to true
            var iframe = document.createElement("iframe");
            var iframe_url = "https://www.youtube.com/embed/" + this.id + "?autoplay=1&autohide=1";
            if (this.getAttribute("data-params")) iframe_url += '&' + this.getAttribute("data-params");
            iframe.setAttribute("src", iframe_url);
            iframe.setAttribute("frameborder", '0');

            // The height and width of the iFrame should be the same as parent
            iframe.style.width = this.style.width;
            iframe.style.height = this.style.height;

            // Replace the YouTube thumbnail with YouTube Player
            this.parentNode.replaceChild(iframe, this);
        }
    }
});