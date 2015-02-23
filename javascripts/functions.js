
/*

Tera JS
Version 2.3
Made by Themanoid

*/

(function($) {

    "use strict"; // Strict mode

    /* 
        Portfolio scripts 
    */

    //  Define the portfolio grid
    var $grid = $('#grid');

    //  Show filter options on trigger click
    $('#filter-trigger').on('tap', function(){
        $('#filter-trigger').fadeOut(200, function(){
             $('#filters').fadeIn(500);
        });
    });

    //  On filter click, filter grid
    $('#filters').on( 'tap', 'button', function(e) {
        e.stopPropagation();
        var filterValue = $(this).attr('data-filter');
        $grid.isotope({ filter: filterValue });
        $('.item').addClass('visible');
        e.preventDefault();
    });

    // Back to top button

    var $toTop = $('<div class="back-to-top"></div>');
    $('body').append($toTop);
    $('body').on('tap', '.back-to-top', function(e){
        $('html,body').animate({scrollTop : 0});
        e.preventDefault();
    });

    //  Scroll effects
    $(window).scroll(function(){
        var scrolled = $(window).scrollTop();
        var scrolledPercentage = (100-(scrolled/$(window).height()*100))/100;
        $('.jumbotron').css('opacity', scrolledPercentage);
        if(scrolled > 200)
            $toTop.addClass('active'); // Back to top button
        else
            $toTop.removeClass('active');
    });

    $(window).load(function(){
        resizeJumbotron(); // Get the right jumbotron size on pageload
        $('.container-fluid').addClass('loaded'); // Initialize the container
        $grid.isotope(); // Set the grid to isotope

        $('.item').waypoint(function(){
            $(this).addClass('visible'); // Show items
            $grid.isotope(); // Reload isotope items
        }, {offset : '70%'});

        $('.fadeIn').waypoint(function(){ // Fade in every .fadeIn class element
            $(this).addClass('visible');
        }, {offset : '70%'});

        var scrolled = $(window).scrollTop();
        if(scrolled > 200)
            $toTop.addClass('active'); // Back to top button
    });

    $('header').affix(); // Affix the header

    $('.trigger').on('tap', function(e){
        e.stopPropagation();
        $('#navigation').toggleClass('active'); // Toggle responsive menu
    });

    $('html').on('tap', function(){
        // Used to hide the responsive navigation on click outside
        $('#navigation').removeClass('active');
    });

    // Fade effect on navigation / header links
    $('a').on('tap', function(e){ 
        e.stopPropagation();
        var href = $(this).attr('href');
        if(href != '#' && !$(this).hasClass('lightbox') && !$(this).hasClass('anchor')){
            $('body').fadeOut(400, function(){
                window.location = href; // Go to url after smooth transition
            });
            e.preventDefault();
        }
        if($(this).hasClass('anchor')){
            var href = $(this).attr('href');
            $('html,body').animate({
                scrollTop : ($(href).offset().top)-50+'px'
            }, 800);
            $('#navigation').removeClass('active');
        }
    })

    // Get the right size for the jumbotron, based on viewport sizes
    function resizeJumbotron(){
        if($(window).height() > 800 && $(window).width() < 1400)
            $('.jumbotron').height($(window).height()-200); // 200px offset from bottom
        else
            $('.jumbotron').height($(window).height()); 
        $('.jumbotron.small').height(300);
    }

    // Call functions on resize
    $(window).resize(function(){
        resizeJumbotron();
        sliderResize();
    });

    /*
        Tera Slider
    */

    var $slider = $('.slider'); // Define the slider
    var $mousePos = { x: -1 };
    var $autoSlide;
    var $autoSlideDirection = 'right' // Can be 'right' or 'left' to set the direction
    
    $(document).mousemove(function(e){ // Get the cursor position
        $mousePos.x = e.pageX;
        if($mousePos.x > $(window).width()/2) {
            $slider.css('cursor', 'url(images/slide-right-dark.png), e-resize');
            if($('body').hasClass('dark-slide'))
                $slider.css('cursor', 'url(images/slide-right.png), e-resize');
        } else {
           $slider.css('cursor', 'url(images/slide-left-dark.png), w-resize');
            if($('body').hasClass('dark-slide'))
                $slider.css('cursor', 'url(images/slide-left.png), w-resize');
        }
    });

    // For each slider
    $slider.each(function(){
        var index = 0;
        var s = $(this);
        $(this).find('li.slide').each(function(){ // For each slide
            $(this).attr('data-index',index); // Add index to element
            if(index == 0)
                $(this).addClass('active'); // Add the active state to the first slide
            index++;
        });
        var $curSlide = $(this).find('.active');
        if($curSlide.hasClass('dark')) // Set dark mode if available for the first slide
            $('body').addClass('dark-slide');
        sliderResize();
        if(s.hasClass('auto-slide'))
            $autoSlide = setInterval( function() { toggleSlide(s,$autoSlideDirection); }, 4500 );
    });

    function sliderResize(){
        $slider.each(function(){ // Resize functions for each slider
            var slideCount = $(this).find('li.slide').length;
            var $sliderWidth = $(this).width();
            var $slides = $(this).find('ul.slides');
            var $curSlide = parseInt($slides.find('.active').attr('data-index'));
            $slides.width($sliderWidth*slideCount);
            $slides.css('margin-left', -$sliderWidth*($curSlide)+'px');
            $(this).find('li.slide').width(100/slideCount+'%');
        });
    }

    $('body').on('tap', '.slider', function(){
        toggleSlide($(this));
        var s = $(this);
        if(s.hasClass('auto-slide')){
            clearInterval($autoSlide);
            $autoSlide = setInterval( function() { toggleSlide(s,$autoSlideDirection); }, 4500 );
        }
    });

    function toggleSlide(e,d) {
        // Slide controls
        var $sliderWidth = e.parent().width();
        var $slides = e.parent().find('ul.slides');
        var $slideCount = e.find('li').length;
        var $activeSlide = e.find('.active');
        var $activeSlideIndex = parseInt($activeSlide.attr('data-index'));
        var $newSlide;
        // If direction is set
        if(d){
            if(d == 'right'){
                if(($slideCount-1) == $activeSlideIndex)
                    $newSlide = 0; 
                else
                    $newSlide = $activeSlideIndex+1; 
            } else if(d == 'left') {
                if(0 == $activeSlideIndex)
                    $newSlide = ($slideCount-1); 
                else
                    $newSlide = $activeSlideIndex-1; 
            }
        } else {
            // If clicked on next slide
            if($mousePos.x > $sliderWidth/2) {
                if(($slideCount-1) == $activeSlideIndex)
                    $newSlide = 0; 
                else
                    $newSlide = $activeSlideIndex+1; 
            }
            // If clicked on previous slide
            else {
                if(0 == $activeSlideIndex)
                    $newSlide = ($slideCount-1); 
                else
                    $newSlide = $activeSlideIndex-1; 
            }
        }        
        $slides.find('li').removeClass('active'); // First remove all active classes
        $slides.find('[data-index='+$newSlide+']').addClass('active'); // Set the current slide to active
        if($slides.find('.active').hasClass('dark')) // If the current slide is dark
            $('body').addClass('dark-slide'); // Set dark mode
        else
            $('body').removeClass('dark-slide'); // Unset dark mode
        $slides.css('margin-left','-'+$sliderWidth*($newSlide)+'px'); // Slide animation on css propert change
        setTimeout(sliderResize, 400);
    }

    /*
        Tera Lightbox
    */

    var $lightboxContainer = $('<div id="lightbox"><div class="controls"><div class="galleryPrev"><</div><div class="galleryNext">></div><div class="galleryClose">x</div></div>');
    if($('.lightbox').length)
        $('body').append($lightboxContainer);
    var $gallery = [];
    var $galleryIndex = 0;
    $('.lightbox').each(function(){ // For each lightbox link
        var href = $(this).attr('href');
        $gallery.push(href); // Push the img url to the gallery array
        $(this).attr('data-index', $galleryIndex);
        $galleryIndex++; // Next index
        $(this).on('tap', function(e){
            e.stopImmediatePropagation();
            var $index = $(this).attr('data-index');
            var $img = $('<img src="'+href+'" data-index="'+$index+'"/>').load(function(){
                $lightboxContainer.find('img').remove(); // Remove current image after new one is loaded
                $lightboxContainer.append($(this)).fadeIn(); // Fade in lightbox
                $img.delay(500).fadeIn(900); // Fade in image
            });
            e.preventDefault();
        });
    });

    $('body').on('tap', '.galleryClose', function(e) {
        $lightboxContainer.fadeOut(1000); // Fade out lightbox
    });

    // Lightbox controls
    $('body').on('tap', '.galleryNext, .galleryPrev', function(e){
        e.preventDefault();
        e.stopImmediatePropagation();
        var curIndex = $lightboxContainer.find('img').attr('data-index');
        var newIndex;
        if($(this).hasClass('galleryNext'))
            newIndex = parseInt(curIndex)+1; // New index will be the next one
        else
            newIndex = parseInt(curIndex)-1; // New index will be the previous one
        if($gallery.length == newIndex) // If the last item is reached
            newIndex = 0; // Set index to the first one
        if(newIndex == -1) // If the first item is reached 
            newIndex = $gallery.length-1; // Set it to the last item
        $('#lightbox img').fadeOut(500, function(){
            $(this).attr('data-index', newIndex); // Give the image a new index
            $(this).attr('src', $gallery[newIndex]).load(function(){
                $(this).fadeIn(); // Fade in new image after it's loaded
            });
        });
    });

    // New in 2.2

    // Added extra support for Tera slider
    
    //Fixes Firefox back button issue
    $(window).bind("unload", function() {
        // Nothing needed here :-)
    });

    // New in 2.3

    // Anchor link functionality
    $('body').on('tap', 'a.anchor', function(e){
        alert('ok');
        
        e.preventDefault();
    });

})(jQuery);
