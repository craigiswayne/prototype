/*unveil js*/
!function(t){t.fn.unveil=function(i,e){function n(){var i=a.filter(function(){var i=t(this);if(!i.is(":hidden")){var e=o.scrollTop(),n=e+o.height(),r=i.offset().top,s=r+i.height();return s>=e-u&&n+u>=r}});r=i.trigger("unveil"),a=a.not(r)}var r,o=t(window),u=i||0,s=window.devicePixelRatio>1,l=s?"data-src-retina":"data-src",a=this;return this.one("unveil",function(){var t=this.getAttribute(l);t=t||this.getAttribute("data-src"),t&&(this.setAttribute("src",t),"function"==typeof e&&e.call(this))}),o.on("scroll.unveil resize.unveil lookup.unveil",n),n(),this}}(window.jQuery||window.Zepto);

function twentyfour_gallery_mobile(jElement, settings){
  this.settings = {
    css:'*{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}html,body{min-height:100%;min-height:100vh}img{border:none;max-height:100%;max-width:100%}button:not([disabled]),input[type=button] input:not([disabled]),a[href]:not([disabled]),.button:not([disabled]),select:not([disabled]){cursor:pointer}button[disabled],input[type=button] input[disabled],a[href][disabled],.button[disabled],select[disabled]{cursor:not-allowed}.twentyfour.gallery{background-color:#141414;min-height:100px;min-width:100px;display:block;margin:10px auto;color:white;font-family:Tahoma, Arial;position:relative;overflow:hidden;padding:0 0 30px 0;width:50%;height:300px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}[data-embed24="Images"]{min-height:100px;display:block;font-size:13px;color:white;text-align:center}[data-embed24="Images"] .slide{display:block;background-color:#141414;margin-top:10px}[data-embed24="Images"] .slide:first-child{margin-top:0}[data-embed24="Images"] .slide img{margin:5px auto;padding:0 5px}[data-embed24="Images"] .slide .caption{text-align:left;border-top:1px solid #ef3f3f;padding:5px 10px;background-color:white;background-color:rgba(255,255,255,0.9);color:black}[data-embed24="Images"][data-pos="middle"]{width:100%;clear:both;margin:10px auto;float:none}[data-embed24="Images"][data-pos="left"]{float:left;margin:0 10px 10px 0}',
    prefix: 'twentyfour_gallery_mobile_',
    fullsize_image_attribute:'data-imageurl',
    unveil_loader_img:'data:image/svg+xml;base64,PCEtLSBCeSBTYW0gSGVyYmVydCAoQHNoZXJiKSwgZm9yIGV2ZXJ5b25lLiBNb3JlIEAgaHR0cDovL2dvby5nbC83QUp6YkwgLS0+Cjxzdmcgd2lkdGg9IjM4IiBoZWlnaHQ9IjM4IiB2aWV3Qm94PSIwIDAgMzggMzgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjZmZmIj4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMSAxKSIgc3Ryb2tlLXdpZHRoPSIyIj4KICAgICAgICAgICAgPGNpcmNsZSBzdHJva2Utb3BhY2l0eT0iLjUiIGN4PSIxOCIgY3k9IjE4IiByPSIxOCIvPgogICAgICAgICAgICA8cGF0aCBkPSJNMzYgMThjMC05Ljk0LTguMDYtMTgtMTgtMTgiPgogICAgICAgICAgICAgICAgPGFuaW1hdGVUcmFuc2Zvcm0KICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVOYW1lPSJ0cmFuc2Zvcm0iCiAgICAgICAgICAgICAgICAgICAgdHlwZT0icm90YXRlIgogICAgICAgICAgICAgICAgICAgIGZyb209IjAgMTggMTgiCiAgICAgICAgICAgICAgICAgICAgdG89IjM2MCAxOCAxOCIKICAgICAgICAgICAgICAgICAgICBkdXI9IjFzIgogICAgICAgICAgICAgICAgICAgIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIi8+CiAgICAgICAgICAgIDwvcGF0aD4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg=='
  };

  this.inject_css = function(){
    if($('style.'+this.settings.prefix).length == 0){
      $('head').prepend('<style class="'+this.settings.prefix+'">'+this.settings.css+'</style>');
    }
    return this.settings.css;
  };

  this.update_settings = function(settings){
    $.extend(this.settings, settings);
  };

  this.init = function(jElement,settings){
    this.update_settings(settings);
    this.inject_css();
    var gallery = this;
    jElement.addClass(this.settings.prefix);
    jElement.addClass("unveil");
    jElement.find("img").each(function(i){
      $(this).attr("src",gallery.settings.unveil_loader_img);
      $(this).attr("data-src",$(this).attr(gallery.settings.fullsize_image_attribute));
    });
    jElement.find("img").unveil();
  };

  this.init(jElement, settings);
}

$(document).ready(function(){
  $("[data-embed24=Images]").each(function(){
      new twentyfour_gallery_mobile($(this));
  });
});
