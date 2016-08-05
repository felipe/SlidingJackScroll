;(function ( $, window, document, undefined ) {

    // Create the defaults once
    var pluginName = "slidingJackScroll",
        defaults = {
            slidesClass: ".sliding-jack",
            tabsClass: ".sliding-jack-tabs",
            delta: 0,
            currentSlideIndex: 1,
            slideCount: 0,
            slide: true,
            scrollThreshold: 45
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;

        this.options = $.extend( {}, defaults, options) ;

        this._defaults = defaults;
        this._name = pluginName;

        this.slides = $( element ).find(this.options.slidesClass);
        this.tabs = $( element ).find(this.options.tabsClass);

        this.init();
    }

    Plugin.prototype = {

        init: function() {

            $( this.slides ).find('div').addClass('slide').hide();
            $( this.slides ).find('div:first-child').first().addClass('active').show();
            $( this.tabs ).find('div:first-child').first().addClass('active');

            this.options.slideCount = $( this.slides ).find('div').length;

            // Watch Page Scroll after short delay.
            setTimeout( this.pageScroll( this.element, this.slides, this.tabs, this.options ), 100 );

            this.tabClick( this.tabs )

        },

        pageScroll: function( element, slides, tabs, options ) {

          var ctx = this;

          if( $( window ).width() < 992 ){
            return false;
          }

          $( window ).scroll(function(e) {

            var stickyTop = $( element ).position().top;

            //  console.log("Current Pos: "+$(window).scrollTop());
            //  console.log("Element Pos: " + stickyTop );
            //  console.log("Height: "+$( element ).find('div.slide.active').height());
            //  console.log("Slide: "+options.slide);

            if(
                ( $(window).scrollTop() >= (stickyTop - 10) && $(window).scrollTop() <= (stickyTop + 10) )
                && options.slide
              )
            {

              //console.log('STUCK');

              $(window).on('DOMMouseScroll mousewheel', function( e ){
                ctx.slideScroll( e, ctx );
              });

              var html = jQuery('html');
              html.css('overflow', 'hidden');
              window.scrollTo(0, stickyTop);

            }

          });

        },

        slideScroll: function( e, ctx ) {

          // --- Scrolling up ---
          if (e.originalEvent.detail < 0 || e.originalEvent.wheelDelta > 0) {
            //console.log(" Scrolling Up /\\");

            ctx.options.delta--;

            // console.log( this.options.delta +", "+ scrollThreshold )
            if ( Math.abs(ctx.options.delta) >= ctx.options.scrollThreshold) {
              ctx.prevSlide();
            }

          }
          // --- Scrolling down ---
          else {
            //console.log(" Scrolling Down \\/");

            ctx.options.delta++;

            if (ctx.options.delta >= ctx.options.scrollThreshold) {
              ctx.nextSlide();
            }
          }

          return ctx.options.slide;
        },

        prevSlide() {
          var wantedSlide = this.options.currentSlideIndex - 1;
          if(wantedSlide < 1 ){
            wantedSlide = 1;
          }
          this.goToSlide( wantedSlide );
        },

        nextSlide() {
          var wantedSlide = this.options.currentSlideIndex + 1;

          if(wantedSlide > this.options.slideCount){
            wantedSlide = this.options.slideCount;
          }
          this.goToSlide( wantedSlide );
        },

        tabClick: function ( tabs ) {

          var ctx = this;

          $( tabs ).find('div').each(function(){
            $( this ).click(function(){
              ctx.goToSlide( $(this).attr('slideid') );
            });
          });
        },

        goToSlide( wantedSlideIndex ) {

          var wantedSlideIndex = Number(wantedSlideIndex);
          //.log('Slide');
          if (
              this.options.currentSlideIndex == wantedSlideIndex && wantedSlideIndex == 1 || // If the wanted slide is the current slide, and the first slide
              this.options.currentSlideIndex == wantedSlideIndex && wantedSlideIndex == this.options.slideCount  // If the wanted slide, is the current slide, and the last slide
              )
          {

              //console.log("release");
              this.options.slide = true;
              $(window).unbind('DOMMouseScroll mousewheel');
              $("html").css('overflow', 'scroll');

              this.pageScroll( this.element, this.slides, this.tabs, this.options );

          }
          else
          {
            var wantedElement = $( this.slides ).find('div:nth-child('+ wantedSlideIndex +')');
            if( !wantedElement.hasClass('active') ){
              $( this.slides ).find('div.active').slideUp().removeClass('active');
              $( this.slides ).find('div:nth-child('+ wantedSlideIndex +')').slideDown().addClass('active');
              this.options.currentSlideIndex = wantedSlideIndex;
            }
          }
        }
    };

    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                new Plugin( this, options ));
            }
        });
    };

})( jQuery, window, document );

$(function() {
  $('section.hero').slidingJackScroll();
});
