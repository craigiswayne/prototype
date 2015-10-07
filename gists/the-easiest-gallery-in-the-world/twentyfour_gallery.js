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

var nexus = {
  parse_template: function(template,data){
    template = template || '';
    data = data || {};

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

  }
};

function twentyfour_gallery (selector, settings){
  this.container = null;
  this.html      = null;
  this.interval  = null;
  this.stage     = null;
  this.slide_index = 0;
  this.slides = [];
  this.buttons = {};
  this.settings = {
    prefix:"twentyfour_gallery_",
    css:'*{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}html,body{min-height:100%;min-height:100vh}img{border:none;max-height:100%;max-width:100%}button:not([disabled]),input[type=button] input:not([disabled]),a[href]:not([disabled]),.button:not([disabled]),select:not([disabled]){cursor:pointer}button[disabled],input[type=button] input[disabled],a[href][disabled],.button[disabled],select[disabled]{cursor:not-allowed}.twentyfour.gallery{background-color:#141414;min-height:100px;min-width:100px;display:block;margin:10px auto;color:white;font-family:Tahoma, Arial;position:relative;overflow:hidden;padding:0 0 30px 0;width:50%;height:300px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.twentyfour.gallery:not(.ready){background-image:url(data:image/svg+xml;base64,PCEtLSBCeSBTYW0gSGVyYmVydCAoQHNoZXJiKSwgZm9yIGV2ZXJ5b25lLiBNb3JlIEAgaHR0cDovL2dvby5nbC83QUp6YkwgLS0+Cjxzdmcgd2lkdGg9IjQ0IiBoZWlnaHQ9IjQ0IiB2aWV3Qm94PSIwIDAgNDQgNDQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjZmZmIj4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc3Ryb2tlLXdpZHRoPSIyIj4KICAgICAgICA8Y2lyY2xlIGN4PSIyMiIgY3k9IjIyIiByPSIxIj4KICAgICAgICAgICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iciIKICAgICAgICAgICAgICAgIGJlZ2luPSIwcyIgZHVyPSIxLjhzIgogICAgICAgICAgICAgICAgdmFsdWVzPSIxOyAyMCIKICAgICAgICAgICAgICAgIGNhbGNNb2RlPSJzcGxpbmUiCiAgICAgICAgICAgICAgICBrZXlUaW1lcz0iMDsgMSIKICAgICAgICAgICAgICAgIGtleVNwbGluZXM9IjAuMTY1LCAwLjg0LCAwLjQ0LCAxIgogICAgICAgICAgICAgICAgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIC8+CiAgICAgICAgICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9InN0cm9rZS1vcGFjaXR5IgogICAgICAgICAgICAgICAgYmVnaW49IjBzIiBkdXI9IjEuOHMiCiAgICAgICAgICAgICAgICB2YWx1ZXM9IjE7IDAiCiAgICAgICAgICAgICAgICBjYWxjTW9kZT0ic3BsaW5lIgogICAgICAgICAgICAgICAga2V5VGltZXM9IjA7IDEiCiAgICAgICAgICAgICAgICBrZXlTcGxpbmVzPSIwLjMsIDAuNjEsIDAuMzU1LCAxIgogICAgICAgICAgICAgICAgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIC8+CiAgICAgICAgPC9jaXJjbGU+CiAgICAgICAgPGNpcmNsZSBjeD0iMjIiIGN5PSIyMiIgcj0iMSI+CiAgICAgICAgICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9InIiCiAgICAgICAgICAgICAgICBiZWdpbj0iLTAuOXMiIGR1cj0iMS44cyIKICAgICAgICAgICAgICAgIHZhbHVlcz0iMTsgMjAiCiAgICAgICAgICAgICAgICBjYWxjTW9kZT0ic3BsaW5lIgogICAgICAgICAgICAgICAga2V5VGltZXM9IjA7IDEiCiAgICAgICAgICAgICAgICBrZXlTcGxpbmVzPSIwLjE2NSwgMC44NCwgMC40NCwgMSIKICAgICAgICAgICAgICAgIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiAvPgogICAgICAgICAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJzdHJva2Utb3BhY2l0eSIKICAgICAgICAgICAgICAgIGJlZ2luPSItMC45cyIgZHVyPSIxLjhzIgogICAgICAgICAgICAgICAgdmFsdWVzPSIxOyAwIgogICAgICAgICAgICAgICAgY2FsY01vZGU9InNwbGluZSIKICAgICAgICAgICAgICAgIGtleVRpbWVzPSIwOyAxIgogICAgICAgICAgICAgICAga2V5U3BsaW5lcz0iMC4zLCAwLjYxLCAwLjM1NSwgMSIKICAgICAgICAgICAgICAgIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiAvPgogICAgICAgIDwvY2lyY2xlPgogICAgPC9nPgo8L3N2Zz4=);background-repeat:no-repeat;background-size:50% 50%;background-position:50% 50%}.twentyfour.gallery:not(.ready) *{display:none}.twentyfour.gallery .slider{display:block;height:100%;width:100%;white-space:nowrap;-webkit-transition:margin-left 0.3s ease;-moz-transition:margin-left 0.3s ease;-o-transition:margin-left 0.3s ease;transition:margin-left 0.3s ease}.twentyfour.gallery .slider .slide{display:inline-block;vertical-align:top;text-align:center;height:100%}.twentyfour.gallery .action_area{position:absolute;top:0;height:100%;text-align:center;cursor:pointer}.twentyfour.gallery .action_area.left{left:0}.twentyfour.gallery .action_area.right{right:0}.twentyfour.gallery .action_area .icon{position:absolute;top:50%;width:100%;text-align:center}.twentyfour.gallery .stage{position:relative;height:100%;padding:0;z-index:1}.twentyfour.gallery .stage .slide{padding:10px;width:100%}.twentyfour.gallery .stage .slide .caption{display:block;background-color:white;background-color:rgba(255,255,255,0.9);color:#777;position:absolute;text-align:left;bottom:0;left:0;width:100%;padding:5px 10px;overflow:hidden;font-size:12px;border:none}.twentyfour.gallery .stage .action_area{width:100px;max-width:15%;-webkit-transition:background-color 0.1s ease-in-out;-moz-transition:background-color 0.1s ease-in-out;-o-transition:background-color 0.1s ease-in-out;transition:background-color 0.1s ease-in-out}.twentyfour.gallery .stage .action_area:hover{background-color:rgba(0,0,0,0.5)}.twentyfour.gallery .stage .action_area:hover .icon.left{left:0}.twentyfour.gallery .stage .action_area:hover .icon.right{right:0}.twentyfour.gallery .stage .action_area .icon{font-size:30px;margin-top:-15px}.twentyfour.gallery .stage .action_area .icon.left{left:-100%}.twentyfour.gallery .stage .action_area .icon.right{right:-100%}.twentyfour.gallery .stage .fullscreen.toggler{position:absolute;top:-30px;right:-30px;font-size:20px;z-index:3;cursor:pointer;background-color:black;background-color:rgba(0,0,0,0.8);text-align:center;width:30px;height:30px;line-height:30px;-webkit-transition:all 0.1s ease-in-out;-moz-transition:all 0.1s ease-in-out;-o-transition:all 0.1s ease-in-out;transition:all 0.1s ease-in-out}.twentyfour.gallery .media_bar{width:100%;height:30px;line-height:30px;position:absolute;bottom:0;left:0;z-index:2;background:#45484d;background:-moz-linear-gradient(top, #45484d 0%, #000 100%);background:-webkit-gradient(linear, left top, left bottom, color-stop(0%, #45484d), color-stop(100%, #000));background:-webkit-linear-gradient(top, #45484d 0%, #000 100%);background:-o-linear-gradient(top, #45484d 0%, #000 100%);background:-ms-linear-gradient(top, #45484d 0%, #000 100%);background:linear-gradient(to bottom, #45484d 0%, #000 100%);filter:progid:DXImageTransform.Microsoft.gradient( startColorstr="#45484d", endColorstr="#000000",GradientType=0 )}.twentyfour.gallery .media_bar .toggler{padding:5px 20px;position:absolute;height:100%;top:0;border-color:black;border-width:1px;font-size:16px}.twentyfour.gallery .media_bar .toggler:hover{background-color:#141414}.twentyfour.gallery .media_bar .toggler.play_pause_toggle{left:0;border-right-style:solid}.twentyfour.gallery .media_bar .toggler.tray_toggle{right:0;border-left-style:solid}.twentyfour.gallery .media_bar .icon.pause{display:none}.twentyfour.gallery .media_bar .status{display:block;height:100%;width:100%;text-align:center}.twentyfour.gallery .tray{position:absolute;z-index:1;bottom:-50px;left:0;width:100%;background-color:black;height:70px;padding:10px 20px;-webkit-transition:bottom 0.3s ease;-moz-transition:bottom 0.3s ease;-o-transition:bottom 0.3s ease;transition:bottom 0.3s ease}.twentyfour.gallery .tray .slider .slide{width:80px;margin-left:5px;cursor:pointer}.twentyfour.gallery .tray .slider .slide:first-child{margin-left:0}.twentyfour.gallery .tray .slider .slide.active{border:2px solid #00afea}.twentyfour.gallery .tray .action_area{width:20px;background-color:black}.twentyfour.gallery .tray .action_area .icon{font-size:20px;margin-top:-10px}.twentyfour.gallery:hover .fullscreen.toggler{top:10px;right:10px}.twentyfour.gallery.playing .media_bar .icon.play{display:none}.twentyfour.gallery.playing .media_bar .icon.pause{display:block}.twentyfour.gallery.show_tray .tray{bottom:30px}.twentyfour.gallery.fullscreen{height:100%;width:100%;position:fixed;top:0;left:0;margin:0}[data-embed24="Images"]{min-height:100px;display:block;background-color:#141414;font-size:13px;color:white;text-align:center}[data-embed24="Images"] .slide{display:block;padding:0 5px}[data-embed24="Images"] .slide img{margin:5px auto}[data-embed24="Images"] .slide .caption{text-align:left;border-top:1px solid #ef3f3f;padding:5px 10px}[data-embed24="Images"][data-pos="middle"]{width:100%;max-height:100%;clear:both;margin:10px auto}[data-embed24="Images"][data-pos="left"]{float:left;margin:0 10px 10px 0}',
    id:null,
    container_class:"twentyfour gallery",
    fullscreen_icon_class:"icon-expand",
    play_icon_class: "icon-playback-play",
    pause_icon_class:"icon-playback-pause",
    nav_left_icon_class:"icon-angle-left",
    nav_right_icon_class:"icon-angle-right",
    toggle_tray_icon_class:"icon-th",
    show_speed:3000,
    autolink_css:true,
    minimum_slides:2,
    fullsize_image_attribute:'data-original-url',
    templates:{
      gallery:'<div id="(#id#)" (#attributes#)>(#stage#)(#tray#)(#media_bar#)</div>',
      stage:'<div class="stage"><div class="fullscreen toggler icon (#fullscreen_icon_class#)"></div><div class="action_area nav left"> <div class="icon left (#nav_left_icon_class#)"></div></div><div class="slider">(#slides#)</div><div class="action_area nav right"><div class="icon right (#nav_right_icon_class#)"></div></div></div>',
      tray:'<div class="tray"><div class="action_area nav left"> <div class="icon (#nav_left_icon_class#)"></div></div><div class="slider">(#thumbnails#)</div><div class="action_area nav right"><div class="icon (#nav_right_icon_class#)"></div></div></div>',
      media_bar:'<div class="media_bar"><div class="play_pause_toggle toggler button"><span class="icon play (#play_icon_class#)"></span><span class="icon pause (#pause_icon_class#)"></span></div><div class="status"><span class=current>1</span>/<span class="total">(#total_slides#)</span></div><div class="tray_toggle toggler button icon (#toggle_tray_icon_class#)"></div></div>'
    }
  };

  this.go_fullscreen = function(){
    var container = this.container[0];
    if (container.requestFullscreen) {
      container.requestFullscreen();
    } else if (container.mozRequestFullScreen) {
      container.mozRequestFullScreen();
    } else if (container.webkitRequestFullscreen) {
      container.webkitRequestFullscreen();
    } else if (container.msRequestFullscreen) {
      container.msRequestFullscreen();
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
  };

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

    $(this.attributes).each(function(i){
      console.debug(this[i]);
    });

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

  this.generate_gallery = function(){
    data              = this.settings;
    data.slides       = this.generate_slides();
    data.thumbnails   = this.generate_thumbnails();
    data.total_slides = this.slides.length;
    data.attributes   = this.generate_attributes();

    data.stage        = nexus.parse_template(this.settings.templates.stage, data);
    data.tray         = nexus.parse_template(this.settings.templates.tray, data);
    data.media_bar    = nexus.parse_template(this.settings.templates.media_bar, data);
    return nexus.parse_template(this.settings.templates.gallery, data);
  };
  this.inject_css = function(){
    if($('style.'+this.settings.prefix).length == 0){
      $('head').prepend('<style class="'+this.settings.prefix+'">'+this.settings.css+'</style>');
    }
    return this.settings.css;
  };
  this.init = function(jElement,settings){

      gallery = this;
      this.container = jElement;

      var slides = $(this.container).find(".slide");
      if(slides.length < this.settings.minimum_slides){
        console.group("TwentyFour Gallery");
        console.warn("too few slides");
        console.info(this.container);
        console.groupEnd();

        return null;
      }
      else{
        //this.inject_css();
      }
      $(slides).each(function(index){
        gallery.slides[index] = $(this);
      });

      this.attributes = this.container.attr();
      this.update_settings(settings);
      this.update_settings(this.container.data());
      this.settings.id = this.container.attr("id") || this.settings.prefix + Math.round(Math.random()*100);

      this.container.replaceWith(this.generate_gallery());
      this.container  = $("#" + this.settings.id);
      //todo you gotta check that there are no duplicated id's

      this.stage      = $(this.container).find(">.stage");
      this.tray       = $(this.container).find(">.tray");
      this.media_bar  = $(this.container).find(">.media_bar");
      this.buttons.fullscreen = this.container.find(".icon.fullscreen");
      this.add_event_listeners();
      this.go_to_slide(0);
      this.container.addClass("ready");


      return this;
  };

  return this.init(selector,settings);
}

$(document).ready(function(){
  $("[data-embed24=Images]").each(function(){
      new twentyfour_gallery($(this));
  });
});