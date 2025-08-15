window.HELP_IMPROVE_VIDEOJS = false;

var INTERP_BASE = "./static/interpolation/stacked";
var NUM_INTERP_FRAMES = 240;

var interp_images = [];
function preloadInterpolationImages() {
  for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
    var path = INTERP_BASE + '/' + String(i).padStart(6, '0') + '.jpg';
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }
}

function setInterpolationImage(i) {
  var image = interp_images[i];
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  $('#interpolation-image-wrapper').empty().append(image);
}


$(document).ready(function() {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

    });

    var options = {
			slidesToScroll: 1,
			slidesToShow: 1,
			loop: true,
			infinite: true,
			autoplay: false,
			autoplaySpeed: 3000,
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);

    // Loop on each carousel initialized
    for(var i = 0; i < carousels.length; i++) {
    	// Add listener to  event
    	carousels[i].on('before:show', state => {
    		console.log(state);
    	});
    }

    // Access to bulmaCarousel instance of an element
    var element = document.querySelector('#my-element');
    if (element && element.bulmaCarousel) {
    	// bulmaCarousel instance is available as element.bulmaCarousel
    	element.bulmaCarousel.on('before-show', function(state) {
    		console.log(state);
    	});
    }

    /*var player = document.getElementById('interpolation-video');
    player.addEventListener('loadedmetadata', function() {
      $('#interpolation-slider').on('input', function(event) {
        console.log(this.value, player.duration);
        player.currentTime = player.duration / 100 * this.value;
      })
    }, false);*/
    preloadInterpolationImages();

    $('#interpolation-slider').on('input', function(event) {
      setInterpolationImage(this.value);
    });
    setInterpolationImage(0);
    $('#interpolation-slider').prop('max', NUM_INTERP_FRAMES - 1);

    bulmaSlider.attach();

    // Interactive Demo functionality
    initializeInteractiveDemo();

})

// Interactive Demo Functions
function initializeInteractiveDemo() {
    const contentSelect = document.getElementById('contentSelect');
    const styleSelect = document.getElementById('styleSelect');
    const contentContainer = document.querySelector('.content-image-container');
    const styleContainer = document.querySelector('.style-image-container');
    const resultContainer = document.querySelector('.result-image-container');

    // Predefined image pools - using actual images from cross_comb folder
    const contentImages = {
        'ballon': './static/images/cross_comb/ballon.png',
        'lantern': './static/images/cross_comb/latern.png',
        'cat': './static/images/cross_comb/cat.png',
        'deer': './static/images/cross_comb/deer.png',
        // 'piano': './static/images/cross_comb/piano.png',
        // 'microscope': './static/images/cross_comb/microscope.png'
    };

    const styleImages = {
        'sketch': './static/images/cross_comb/cat.png',
        'chinese_painting': './static/images/cross_comb/deer.png',
        'watercolor_painting': './static/images/cross_comb/latern.png',
        '3d_rendering': './static/images/cross_comb/ballon.png'
    };

    // Predefined result images for each combination
    const resultImages = {
        'ballon_sketch': './static/images/cross_comb/ballon_sketch.png',
        'ballon_chinese_painting': './static/images/cross_comb/ballon_chinese_painting.png',
        // 'ballon_watercolor_painting': './static/images/cross_comb/ballon_watercolor_painting.png',
        'ballon_3d_rendering': './static/images/cross_comb/ballon.png',
        'lantern_sketch': './static/images/cross_comb/latern_sketch.png',
        'lantern_chinese_painting': './static/images/cross_comb/latern_chinese_painting.png',
        'lantern_watercolor_painting': './static/images/cross_comb/latern.png',
        // 'latern_3d_rendering': './static/images/cross_comb/latern.png',
        'cat_sketch': './static/images/cross_comb/cat.png',
        'cat_chinese_painting': './static/images/cross_comb/cat_chinese_painting.png',
        'cat_watercolor_painting': './static/images/cross_comb/cat_watercolor.png',
        'cat_3d_rendering': './static/images/cross_comb/cat_3d_rendering.png',
        'deer_sketch': './static/images/cross_comb/deer_sketch.png',
        'deer_chinese_painting': './static/images/cross_comb/deer.png',
        'deer_watercolor_painting': './static/images/cross_comb/deer_watercolor.png',
        'deer_3d_rendering': './static/images/cross_comb/deer_3d_rendering.png'
    };

    // Content image selection handler
    contentSelect.addEventListener('change', function(e) {
        const selectedValue = e.target.value;
        if (selectedValue && contentImages[selectedValue]) {
            displayImage(contentContainer, contentImages[selectedValue]);
            updateResult();
        } else {
            resetContentContainer();
        }
    });

    // Style image selection handler
    styleSelect.addEventListener('change', function(e) {
        const selectedValue = e.target.value;
        if (selectedValue && styleImages[selectedValue]) {
            displayImage(styleContainer, styleImages[selectedValue]);
            updateResult();
        } else {
            resetStyleContainer();
        }
    });

    function displayImage(container, imageSrc) {
        container.innerHTML = `
            <img src="${imageSrc}" alt="Selected Image" style="max-width: 100%; max-height: 200px; object-fit: contain;">
        `;
    }

    function resetContentContainer() {
        contentContainer.innerHTML = `
            <div class="has-text-centered">
                <span class="icon is-large">
                    <i class="fas fa-image fa-2x has-text-grey"></i>
                </span>
                <p class="is-size-7 has-text-grey mt-2">Select content image</p>
            </div>
        `;
    }

    function resetStyleContainer() {
        styleContainer.innerHTML = `
            <div class="has-text-centered">
                <span class="icon is-large">
                    <i class="fas fa-palette fa-2x has-text-grey"></i>
                </span>
                <p class="is-size-7 has-text-grey mt-2">Select style image</p>
            </div>
        `;
    }

    function updateResult() {
        const contentValue = contentSelect.value;
        const styleValue = styleSelect.value;
        
        if (contentValue && styleValue) {
            const resultKey = `${contentValue}_${styleValue}`;
            const resultImage = resultImages[resultKey];
            
            if (resultImage) {
                displayImage(resultContainer, resultImage);
            } else {
                // Fallback if no predefined result exists
                resultContainer.innerHTML = `
                    <div class="has-text-centered">
                        <span class="icon is-large">
                            <i class="fas fa-exclamation-triangle fa-2x has-text-warning"></i>
                        </span>
                        <p class="is-size-7 has-text-grey mt-2">Result not available</p>
                        <p class="is-size-7 has-text-grey">for this combination</p>
                    </div>
                `;
            }
        } else {
            // Reset result container if not both are selected
            resultContainer.innerHTML = `
                <div class="has-text-centered">
                    <span class="icon is-large">
                        <i class="fas fa-magic fa-2x has-text-grey"></i>
                    </span>
                    <p class="is-size-7 has-text-grey mt-2">Combined result will appear here</p>
                </div>
            `;
        }
    }
}
