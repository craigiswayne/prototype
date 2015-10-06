//extend jquery
(function($) {
          // duck-punching to make attr() return a map
          var _old = $.fn.attr;
          $.fn.attr = function() {
            var a, aLength, attributes, map;
            if (this[0] && arguments.length === 0) {
                    map = {};
                    attributes = this[0].attributes;
                    aLength = attributes.length;
                    for (a = 0; a < aLength; a++) {
                            map[attributes[a].name.toLowerCase()] = attributes[a].value;
                    }
                    return map;
            } else {
                    return _old.apply(this, arguments);
            }
    }
  }(jQuery));
//end extend jquery

$(document).ready(function(){
    set_active_links();
});

function set_active_links(){
    $("a[href]").each(function(){
        if(document.location.href == this.href){
            $(this).addClass("active");
            //TODO THIS MUST GET DONE ON THE SERVER SIDE IF POSSIBLE
        }
    });
}

var nexus = {
  init: function(){
    //todo find all init functions in the nexus object and run them
    nexus.init_mask();
    nexus.init_tables();
    //todo monitor changes and auto run for input type time
    nexus.init_timepickers();
  },
  init_mask: function(){
    nexus.mask = $('.mask'),
    nexus.mask.show = function(){
      $('.mask').show();
      $('body').addClass('blur');
    };
    nexus.mask.hide = function(){
      $('.mask').hide();
      $('body').removeClass('blur');
    };
  },
  init_tables: function(){

    $('table.sortable').each(function(i){
        $(this).find('thead th .fa-sort').each(function(j){
            $(this).click(function(){
              //todo sort here
            })
        });
    });

    $('table').each(function(i){
      this.add_row = function(){
        var template = nexus.get_template(this.id);
        if(template){
          //window.cw = template;
          //console.debug($(template));
          //console.debug($(template).find('tr')[0]);
          var new_row = this.tBodies[0].appendChild(document.createElement("tr"));
          $(new_row).replaceWith(template);

        }
      };
    });
  },
  init_timepickers: function(){
    $('input[type=time].nexus').each(function(i){
        $(this).attr('type','text');
        $(this).timepicker();
    });

  },
  parse_template: function(template,data){
    template = template || '';
    data = data || {};
    /*todod
    var check = mixed_input.split(" ");
    var template = null;
    if(check.length > 1){
      template = mixed_input;
    }
    else{
      template = nexus.find_template(mixed_input) || '';
    }*/
    //
    // var re = /\(#(.*?)#\)/g;
    // var str = 'hello (#world#) (#city#)';
    // var subst = 'test';
    //
    // var result = str.replace(re, subst);

    var re = /\(#(.*?)#\)/g;
    var str = template;

    var m;

    while ((m = re.exec(str)) !== null) {

        if (m.index === re.lastIndex) { re.lastIndex++; }

        var variable_name = m[0].replace("(#","").replace("#)","");
        if(data[variable_name]){
          template = template.replace(m[0],data[variable_name].toString());
        }
        else{
          template = template.replace(m[0],'');
        }
    }
    return template;

  },

  get_template: function(id){

    var template = null;

    if(id){
        template = $(id) || $('#'+id) || $('#template_'+id);
    }

    if(template){
      template = $(template).text();
    }

    return template;
  }
};

$(document).ready(nexus.init);

//window.history.pushState([], "Title", "/new-url");




function twentyfour_gallery (selector, settings){
  this.prefix = "twentyfour";
  this.container = null;
  this.interval  = null;
  this.stage     = null;
  this.slide_index = 0;
  this.slides = [];
  this.templates = {
    gallery:null,
    stage:null,
    media_bar:null
  };
  this.show = {
    interval:null
  };
  this.buttons = {
    fullscreen:null,
    stage_nav_left:null,
    stage_nav_right:null,
    tray_nav_left:null,
    tray_nav_right:null,
    media_bar_play:null
  };

  this.settings = {
    container_class:"twentyfour gallery",
    fullscreen_icon_class:"icon-screen-full",
    play_icon_class: "icon-playback-play",
    pause_icon_class:"icon-playback-pause",
    nav_left_icon_class:"icon-angle-left",
    nav_right_icon_class:"icon-angle-right",
    toggle_tray_icon_class:"icon-th",
    gallery_template_selector:"#twentyfour_gallery_template",
    tray_template_selector:"#twentyfour_gallery_tray_template",
    media_bar_template_selector:"#twentyfour_gallery_media_bar_template",
    stage_template_selector:"#twentyfour_gallery_stage_template",
    query_selector: ".gallery24",
    show_speed:3000,
    autolink_css:true,
    thumbnail_selector:'.thumbnail'
  };

  this.go_fullscreen = function(){
    var container = this.container[0];
    if (container.requestFullscreen) {
      container.requestFullscreen();
      //siteGallery.galleryComponent.addClass('fullscreen');
      //siteGallery.goToSlide(siteGallery.slideIndex);
    } else if (container.mozRequestFullScreen) {
      container.mozRequestFullScreen();
      //siteGallery.galleryComponent.addClass('fullscreen');
      //siteGallery.goToSlide(siteGallery.slideIndex);
    } else if (container.webkitRequestFullscreen) {
      container.webkitRequestFullscreen();
      //siteGallery.galleryComponent.addClass('fullscreen');
      //siteGallery.goToSlide(siteGallery.slideIndex);
    } else if (container.msRequestFullscreen) {
      container.msRequestFullscreen();
      //siteGallery.galleryComponent.addClass('fullscreen');
      //siteGallery.goToSlide(siteGallery.slideIndex);
    }
    this.container.addClass("fullscreen");
  };

  this.exit_fullscreen = function(){
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }

    this.container.removeClass('fullscreen');
  };

  this.toggle_fullscreen = function(force){
    var container, request;
    container = this.container;
    if(this.container.hasClass("fullscreen")){
      this.exit_fullscreen();
    }
    else{
      this.go_fullscreen();
    }
  };

  this.go_to_slide = function(index){

    if(index < 0){
      index = this.slides.length-1;
      $(this.container).addClass("last");
    }
    else{
      $(this.container).removeClass("last");
    }

    if(index > this.slides.length-1){
      index = 0;
      $(this.container).addClass("first");
    }
    else{
      $(this.container).removeClass("first");
    }

    this.slide_index = index;

    $(this.stage).find(">.slider").css("margin-left",(-(index*100))+"%");
    $(this.tray).find(">.slider>.slide").each(function(i){
      $(this).removeClass("active");
    });

    var current_thumbnail = $(this.tray).find(">.slider>.slide")[this.slide_index];
    $(current_thumbnail).addClass("active");

    if($(current_thumbnail).is(":visible")){
      console.debug("current thumbnail is visible");
    }
    else{
      console.debug("current thumbnail is NOT visible");
    }

    $(this.media_bar).find(".current").text(this.slide_index+1);
    return this.slide_index;
  };

  this.toggle_show = function(){
    $(this.container).toggleClass('playing');
    if($(this.container).hasClass('playing')){
      this.play();
    }
    else{
      this.pause();
    }
  };

  this.toggle_tray = function(){
    $(this.container).toggleClass("show_tray");
  };

  this.play = function(){
    var gallery = this;
      this.interval = setInterval(function(){
        gallery.go_to_slide(gallery.slide_index+1);
      },this.settings.show_speed);
  }.bind(this);

  this.pause = function(){
      clearInterval(this.interval);
  };

  this.add_event_listeners = function(){
    var gallery = this;

    $(this.tray).find(".slide").each(function(i){
      $(this).click(function(j){
        gallery.go_to_slide(i);
      });
    });

    $(this.media_bar).find(".play_pause_toggle").click(function(){
        gallery.toggle_show();
    }).bind(gallery);

    $(this.media_bar).find(".tray_toggle").click(function(){
      gallery.toggle_tray();
    }).bind(gallery);

    $(this.container).find('.action_area.nav.left').click(function(){
      gallery.go_to_slide(gallery.slide_index-1);
    }).bind(gallery);

    $(this.container).find('.action_area.nav.right').click(function(){
      gallery.go_to_slide(gallery.slide_index+1);
    }).bind(gallery);

    this.buttons.fullscreen.click(gallery.toggle_fullscreen.bind(gallery));

    $(document).bind('webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange', function (e) {
        var state = document.mozFullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled || document.fullScreen;
        var event = state ? 'FullscreenOn' : 'FullscreenOff';
        if (document.msFullscreenEnabled && document.msFullscreenElement == null) {
            event = 'FullscreenOff';
        }
        if (event == 'FullscreenOff') {
            gallery.exit_fullscreen();
        }
    });
  };

  this.generate_slides = function(){
    var slides = '';
    for(var i=0; i<this.slides.length; i++){
      slides += $(this.slides[i])[0].outerHTML;
    }
    return slides;
  };

  this.generate_thumbnails = function(){
    thumbnails = '';
    for(var i=0; i<this.slides.length; i++){
      thumbnails += $(this.slides[i])[0].outerHTML;
    }
    return thumbnails;
  };

  this.generate_attributes = function(){
    var html = "";
    this.attributes["class"] = this.attributes["class"] || "";
    this.attributes["class"] += " " + this.settings.container_class;
    for(var i=0; i<Object.keys(this.attributes).length; i++){
        var label = Object.keys(this.attributes)[i];
        var value = this.attributes[label];
        html += label + "='" + value + "'";
    }

    return html;
  };

  this.update_settings = function(settings){
    $.extend(this.settings, settings);
  };

  this.update_templates = function(data){

    data                  = data || {};
    $.extend(data, this.settings);
    data.slides           = this.generate_slides();
    data.thumbnails       = this.generate_thumbnails();
    data.total_slides     = this.slides.length;
    data.attributes       = this.generate_attributes();

    this.templates.stage     = nexus.get_template(this.settings.stage_template_selector);
    this.templates.stage     = nexus.parse_template(this.templates.stage, data);
    data.stage               = this.templates.stage;

    this.templates.tray      = nexus.get_template(this.settings.tray_template_selector);
    this.templates.tray      = nexus.parse_template(this.templates.tray, data);
    data.tray                = this.templates.tray;

    this.templates.media_bar = nexus.get_template(this.settings.media_bar_template_selector);
    this.templates.media_bar = nexus.parse_template(this.templates.media_bar, data);
    data.media_bar           = this.templates.media_bar;

    this.templates.gallery   = nexus.get_template(this.settings.gallery_template_selector);
    this.templates.gallery   = nexus.parse_template(this.templates.gallery, data);
  };

  this.init = function(selector,settings){
      this.selector = selector || this.settings.query_selector;
      this.container = $(selector).first();
      this.attributes = this.container.attr();
      $.extend(this.settings, settings,this.container.data());
      gallery = this;

      var slides = $(this.container).find(".slide");
      $(slides).each(function(index){
        gallery.slides[index] = $(this);
      });

      var generated_id = this.container.attr("id") || this.prefix + "_gallery_" + Math.round(Math.random()*100);
      this.update_templates({"id":generated_id});
      this.container.replaceWith(this.templates.gallery);
      this.container  = $("#" + generated_id);
      this.stage      = $(this.container).find(">.stage");
      this.tray       = $(this.container).find(">.tray");
      this.media_bar  = $(this.container).find(">.media_bar");
      //todo sort out the buttons initialize function
      this.buttons.fullscreen = this.container.find(".icon.fullscreen");
      //console.debug($(this.element).outerHTML);
      //this.element = $(this.element).replaceWith(this.templates.gallery);
      this.add_event_listeners();
      //todo allow for multiple results from selctor
      this.go_to_slide(0);
      this.container.addClass("ready");
      console.debug(this.settings);
      return this;
  }.bind(this);

  return this.init(selector,settings);
}


// var siteGallery = {
//     galleryComponent: null,
//     slideIndex: null,
//     totalSlides: 0,
//     canFullscreen: false,
//     goFullScreen: function () {
//
//         var docElement, request;
//         docElement = document.getElementById('galleryComponent');
//
//         element = docElement;
//         if (element.requestFullscreen) {
//
//             element.requestFullscreen();
//             siteGallery.galleryComponent.addClass('fullscreen');
//             siteGallery.goToSlide(siteGallery.slideIndex);
//         } else if (element.mozRequestFullScreen) {
//             element.mozRequestFullScreen();
//             siteGallery.galleryComponent.addClass('fullscreen');
//             siteGallery.goToSlide(siteGallery.slideIndex);
//         } else if (element.webkitRequestFullscreen) {
//
//             element.webkitRequestFullscreen();
//             siteGallery.galleryComponent.addClass('fullscreen');
//             siteGallery.goToSlide(siteGallery.slideIndex);
//         } else if (element.msRequestFullscreen) {
//             element.msRequestFullscreen();
//             siteGallery.galleryComponent.addClass('fullscreen');
//             siteGallery.goToSlide(siteGallery.slideIndex);
//         }
//     },
//     exitFullScreen: function () {
//
//         if (document.exitFullscreen) {
//             document.exitFullscreen();
//         } else if (document.mozCancelFullScreen) {
//             document.mozCancelFullScreen();
//         } else if (document.webkitExitFullscreen) {
//             document.webkitExitFullscreen();
//         } else if (document.msExitFullscreen) {
//             document.msExitFullscreen();
//         }
//
//         siteGallery.galleryComponent.removeClass('fullscreen');
//         siteGallery.goToSlide(siteGallery.slideIndex);
//     },
//     checkFullscreenFunctionality: function () {
//         var element = document.getElementById('galleryComponent');
//         if (element.requestFullscreen) {
//             siteGallery.canFullscreen = true;
//         } else if (element.mozRequestFullScreen) {
//             siteGallery.canFullscreen = true;
//         } else if (element.webkitRequestFullscreen) {
//             siteGallery.canFullscreen = true;
//         } else if (element.msRequestFullscreen) {
//             siteGallery.canFullscreen = true;
//         }
//
//         if (siteGallery.canFullscreen != true) {
//             siteGallery.galleryComponent.addClass('no_fullscreen');
//         }
//     },
//     init: function () {
//         this.galleryComponent = this.galleryComponent || $j("#galleryComponent");
//         siteGallery.checkFullscreenFunctionality();
//         //icons
//         this.galleryComponent.find(".stage").append("<a class='icon icon-expand fullscreen'></a>");
//         this.galleryComponent.find(".stage").append("<a class='icon icon-compress minimize'></a>");
//         this.galleryComponent.find(".stage").append("<div class='nav_container left'><a class='icon icon-arrow-circle-o-left nav left'></a></div>");
//         this.galleryComponent.find(".stage").append("<div class='nav_container right'><a class='icon icon-arrow-circle-o-right nav right'></a></div>");
//         this.galleryComponent.find(".thumbnails.widget").append("<a class='icon icon-angle-left nav left'></a>");
//         this.galleryComponent.find(".thumbnails.widget").append("<a class='icon icon-angle-right nav right'></a>");
//
//         //event listeners
//         //fullscreen
//         this.galleryComponent.find('.stage .icon.fullscreen').on('click', function () {
//             siteGallery.goFullScreen();
//         });
//
//         this.galleryComponent.find('.stage .icon.minimize').on('click', function () {
//             siteGallery.exitFullScreen();
//         });
//
//         $j(document).bind('webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange', function (e) {
//
//             var state = document.mozFullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled || document.fullScreen;
//             var event = state ? 'FullscreenOn' : 'FullscreenOff';
//             if (document.msFullscreenEnabled && document.msFullscreenElement == null) {
//                 event = 'FullscreenOff';
//             }
//             if (event == 'FullscreenOff') {
//                 siteGallery.exitFullScreen();
//             }
//         });
//
//         this.galleryComponent.find('.stage .icon.nav.left').click(function () {
//             siteGallery.goToSlide(siteGallery.slideIndex - 1);
//         });
//
//         this.galleryComponent.find('.stage .icon.nav.right').click(function () {
//             siteGallery.goToSlide(siteGallery.slideIndex + 1);
//         });
//
//         this.galleryComponent.find('.thumbnails.widget .icon.nav.left').click(function () {
//             siteGallery.goToSlide(siteGallery.slideIndex - 1);
//         });
//
//         this.galleryComponent.find('.thumbnails.widget .icon.nav.right').click(function () {
//             siteGallery.goToSlide(siteGallery.slideIndex + 1);
//         });
//
//         this.galleryComponent.find(".widget.thumbnails .item").each(function (i) {
//             siteGallery.totalSlides++;
//             $j(this).click(function () {
//                 siteGallery.goToSlide(i);
//                 return false;
//             });
//         });
//
//         if (siteGallery.galleryComponent.hasClass('images')) {
//             //center large images
//             $j(this.galleryComponent).find('.stage .slider .slide img').each(function (i) {
//                 $j(this).parent().css('background-image', 'url(' + $j(this).attr('src') + ')');
//                 $j(this).remove();
//             });
//         }
//
//
//         if (siteGallery.galleryComponent.hasClass('video')) {
//             siteGallery.initVideos();
//         }
//
//         //fix for thumbnail widget
//         if(siteGallery.totalSlides)
//
//         this.goToSlide(0);
//     },
//     initVideos: function () {
//
//         var tag = document.createElement('script');
//
//         tag.src = "https://www.youtube.com/iframe_api";
//         var firstScriptTag = document.getElementsByTagName('script')[0];
//         firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
//
//         siteGallery.galleryComponent.find('.stage .slider .item .media').each(function (i) {
//             var video_url = $j(this).attr("src");
//
//             if (video_url.indexOf("youtube") > -1 || video_url.indexOf("youtu.be") > -1) {
//                 $j(this).replaceWith('<div class="media youtube" src="' + $j(this).attr("src") + '"></div');
//             }
//             else if (video_url.indexOf("cdn.24.co.za") > -1) {
//                 var new_tag_id = "jwplayer_"+i;
//                 $j(this).replaceWith('<div class="media jwplayer" id="' + new_tag_id + '"></div');
//
//                 var playerInstance = jwplayer(new_tag_id);
//                 playerInstance.setup({
//                     file: video_url,
//                     image: "http://dev.cdn.24.co.za/files/Cms/General/d/682/ae0b812114644fe59ec692ef3e9df42a.jpg",
//                     width: siteGallery.galleryComponent.width(),
//                     height: siteGallery.galleryComponent.find(".stage").height(),
//                     title: $j(this).attr("title"),
//                     description: $j(this).parent().find(".caption").text()
//                 });
//             }
//         });
//
//         window.onYouTubeIframeAPIReady = function() {
//             siteGallery.galleryComponent.find('.stage .slider .slide .youtube').each(function () {
//                 var source = $j(this).attr('src');
//                 var videoId = null;
//                 if (source.indexOf("youtu.be") > -1) {
//                     videoId = source.substring(source.indexOf("youtu.be") + 9, source.length);
//                 } else {
//                     videoId = source.substring(source.indexOf('watch?v=') + 8, source.length);
//                 }
//
//                 var player = new YT.Player(this, {
//                     height: 'auto',
//                     width: siteGallery.galleryComponent.width(),
//                     videoId: videoId
//                 });
//             });
//         };
//     },
//     goToSlide: function (index) {
//         //zeroBased
//         index = (index < 0) ? 0 : index;
//         index = (index >= siteGallery.totalSlides) ? siteGallery.totalSlides - 1 : index;
//         siteGallery.slideIndex = index;
//         var slideWidth = this.galleryComponent.find('.stage .slider').width();
//         siteGallery.galleryComponent.find('.stage .slider').css('left', -(index * slideWidth));
//
//         siteGallery.galleryComponent.find('.widget.thumbnails .item').removeClass('active');
//         $j(siteGallery.galleryComponent.find('.widget.thumbnails .item')[index]).addClass('active');
//
//         siteGallery.galleryComponent.removeClass('first');
//         siteGallery.galleryComponent.removeClass('last');
//
//         if (index == 0) {
//             siteGallery.galleryComponent.addClass('first');
//         }
//
//         if (index == siteGallery.totalSlides - 1) {
//             siteGallery.galleryComponent.addClass('last');
//         }
//
//         if ($j(siteGallery.galleryComponent).not('.fullscreen')) {
//
//             if (index > 5) {
//                 var shift_multiplier = index - 5;
//                 siteGallery.galleryComponent.find('.thumbnails.widget .slider').css('left', "-" + (shift_multiplier * 90) + 'px');
//             }
//             else {
//                 siteGallery.galleryComponent.find('.thumbnails.widget .slider').css('left', "0");
//             }
//         }
//     }
// };
// $j(document).ready(function () {
//     siteGallery.init();
// });
