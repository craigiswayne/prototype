function twentyfour_gallery (selector, options){
  this.prefix = "twentyfour";
  this.slides = [];
  this.templates = {
    gallery:null,
    stage:null,
    media_bar:null
  };
  this.buttons = {
    fullscreen:null,
    stage_nav_left:null,
    stage_nav_right:null,
    tray_nav_left:null,
    tray_nav_right:null
  };

  this.settings = {
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
    query_selector: ".gallery24"
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
      console.debug("here");
    }
    else{
      this.go_fullscreen().bind(this);
      console.debug("else");
    }
  };

  this.go_to_slide = function(index){
    alert(index);
  };
  this.add_event_listeners = function(){
    var gallery = this;

    $(this.container).find('.action_area.nav.left').click(function(){
      //this.go_to_slide(1);
    });
    this.buttons.fullscreen.click(gallery.toggle_fullscreen.bind(gallery));
  };

  this.generate_slides = function(){
    var slides = '';
    for(var i=0; i<this.slides.length; i++){
      slides += $(this.slides[i])[0].outerHTML;
    }
    return slides;
  };

  this.update_settings = function(settings){
    $.extend(this.settings, settings);
  };

  this.update_templates = function(data){

    data = data || {};
    data.slides = this.generate_slides();
    $.extend(data, this.settings);

    this.templates.stage     = nexus.get_template(this.settings.stage_template_selector);
    this.templates.stage     = nexus.parse_template(this.templates.stage, data);
    data.stage               = this.templates.stage;

    this.templates.tray      = nexus.get_template(this.settings.tray_template_selector);
    this.templates.tray      = nexus.parse_template(this.templates.tray, data);
    data.tray                = this.templates.tray;

    this.templates.media_bar = nexus.get_template(this.settings.media_bar_template_selector);
    this.templates.media_bar = nexus.parse_template(this.templates.media_bar, data);
    data.media_bar                    = this.templates.media_bar;

    this.templates.gallery   = nexus.get_template(this.settings.gallery_template_selector);
    this.templates.gallery   = nexus.parse_template(this.templates.gallery, data);
  };

  this.init = function(selector){
      this.selector = selector || this.settings.query_selector;
      this.container = $(selector).first();
      gallery = this;
      var slides = $(this.container).find(".slide");
      $(slides).each(function(index){
        gallery.slides[index] = $(this);
      });

      var generated_id = this.prefix + "_gallery_" + Math.round(Math.random()*100);
      this.update_templates({"id":generated_id});
      this.container.replaceWith(this.templates.gallery);
      this.container = $("#" + generated_id);
      //todo sort out the buttons initialize function
      this.buttons.fullscreen = this.container.find(".icon.fullscreen");
      //console.debug($(this.element).outerHTML);
      //this.element = $(this.element).replaceWith(this.templates.gallery);
      this.add_event_listeners();
      //todo allow for multiple selctor items
      return this.container;
  }.bind(this);

  return this.init(selector);
}
