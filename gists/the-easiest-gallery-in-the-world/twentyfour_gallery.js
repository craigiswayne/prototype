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
    fullscreen_icon_class:"icon-expand",
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
    thumbnail_selector:'.thumbnail',
    minimum_slides:2
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
      gallery = this;
      this.selector = selector || this.settings.query_selector;
      this.container = $(selector).first();
      //todo allow for multiple galleries with one selector

      var slides = $(this.container).find(".slide");
      if(slides.length < this.settings.minimum_slides){
        console.group("TwentyFour Gallery");
        console.info("too few slides");
        console.groupEnd();
        
        return null;
      }
      $(slides).each(function(index){
        gallery.slides[index] = $(this);
      });

      this.attributes = this.container.attr();
      $.extend(this.settings, settings,this.container.data());



      var generated_id = this.container.attr("id") || this.prefix + "_gallery_" + Math.round(Math.random()*100);
      this.update_templates({"id":generated_id});
      this.container.replaceWith(this.templates.gallery);

      this.container  = $("#" + generated_id);
      //todo you gotta check that there are no duplicated id's

      this.stage      = $(this.container).find(">.stage");
      this.tray       = $(this.container).find(">.tray");
      this.media_bar  = $(this.container).find(">.media_bar");
      this.buttons.fullscreen = this.container.find(".icon.fullscreen");
      this.add_event_listeners();
      this.go_to_slide(0);
      this.container.addClass("ready");

      return this;
  }.bind(this);

  return this.init(selector,settings);
}
