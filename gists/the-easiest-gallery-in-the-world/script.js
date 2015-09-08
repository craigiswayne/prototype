var siteGallery = {
    galleryComponent: null,
    slideIndex: null,
    totalSlides: 0,
    canFullscreen: false,
    goFullScreen: function () {

        var docElement, request;
        docElement = document.getElementById('galleryComponent');

        element = docElement;
        if (element.requestFullscreen) {

            element.requestFullscreen();
            siteGallery.galleryComponent.addClass('fullscreen');
            siteGallery.goToSlide(siteGallery.slideIndex);
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
            siteGallery.galleryComponent.addClass('fullscreen');
            siteGallery.goToSlide(siteGallery.slideIndex);
        } else if (element.webkitRequestFullscreen) {

            element.webkitRequestFullscreen();
            siteGallery.galleryComponent.addClass('fullscreen');
            siteGallery.goToSlide(siteGallery.slideIndex);
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
            siteGallery.galleryComponent.addClass('fullscreen');
            siteGallery.goToSlide(siteGallery.slideIndex);
        }
    },
    exitFullScreen: function () {

        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }

        siteGallery.galleryComponent.removeClass('fullscreen');
        siteGallery.goToSlide(siteGallery.slideIndex);
    },
    checkFullscreenFunctionality: function () {
        var element = document.getElementById('galleryComponent');
        if (element.requestFullscreen) {
            siteGallery.canFullscreen = true;
        } else if (element.mozRequestFullScreen) {
            siteGallery.canFullscreen = true;
        } else if (element.webkitRequestFullscreen) {
            siteGallery.canFullscreen = true;
        } else if (element.msRequestFullscreen) {
            siteGallery.canFullscreen = true;
        }

        if (siteGallery.canFullscreen != true) {
            siteGallery.galleryComponent.addClass('no_fullscreen');
        }
    },
    init: function () {
        this.galleryComponent = this.galleryComponent || $j("#galleryComponent");
        siteGallery.checkFullscreenFunctionality();
        //icons
        this.galleryComponent.find(".stage").append("<a class='icon icon-expand fullscreen'></a>");
        this.galleryComponent.find(".stage").append("<a class='icon icon-compress minimize'></a>");
        this.galleryComponent.find(".stage").append("<div class='nav_container left'><a class='icon icon-arrow-circle-o-left nav left'></a></div>");
        this.galleryComponent.find(".stage").append("<div class='nav_container right'><a class='icon icon-arrow-circle-o-right nav right'></a></div>");
        this.galleryComponent.find(".thumbnails.widget").append("<a class='icon icon-angle-left nav left'></a>");
        this.galleryComponent.find(".thumbnails.widget").append("<a class='icon icon-angle-right nav right'></a>");

        //event listeners
        //fullscreen
        this.galleryComponent.find('.stage .icon.fullscreen').on('click', function () {
            siteGallery.goFullScreen();
        });

        this.galleryComponent.find('.stage .icon.minimize').on('click', function () {
            siteGallery.exitFullScreen();
        });

        $j(document).bind('webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange', function (e) {

            var state = document.mozFullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled || document.fullScreen;
            var event = state ? 'FullscreenOn' : 'FullscreenOff';
            if (document.msFullscreenEnabled && document.msFullscreenElement == null) {
                event = 'FullscreenOff';
            }
            if (event == 'FullscreenOff') {
                siteGallery.exitFullScreen();
            }
        });

        this.galleryComponent.find('.stage .icon.nav.left').click(function () {
            siteGallery.goToSlide(siteGallery.slideIndex - 1);
        });

        this.galleryComponent.find('.stage .icon.nav.right').click(function () {
            siteGallery.goToSlide(siteGallery.slideIndex + 1);
        });

        this.galleryComponent.find('.thumbnails.widget .icon.nav.left').click(function () {
            siteGallery.goToSlide(siteGallery.slideIndex - 1);
        });

        this.galleryComponent.find('.thumbnails.widget .icon.nav.right').click(function () {
            siteGallery.goToSlide(siteGallery.slideIndex + 1);
        });

        this.galleryComponent.find(".widget.thumbnails .item").each(function (i) {
            siteGallery.totalSlides++;
            $j(this).click(function () {
                siteGallery.goToSlide(i);
                return false;
            });
        });

        if (siteGallery.galleryComponent.hasClass('images')) {
            //center large images
            $j(this.galleryComponent).find('.stage .slider .slide img').each(function (i) {
                $j(this).parent().css('background-image', 'url(' + $j(this).attr('src') + ')');
                $j(this).remove();
            });
        }


        if (siteGallery.galleryComponent.hasClass('video')) {
            siteGallery.initVideos();
        }

        //fix for thumbnail widget
        if(siteGallery.totalSlides)

        this.goToSlide(0);
    },
    initVideos: function () {

        var tag = document.createElement('script');

        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        siteGallery.galleryComponent.find('.stage .slider .item .media').each(function (i) {
            var video_url = $j(this).attr("src");

            if (video_url.indexOf("youtube") > -1 || video_url.indexOf("youtu.be") > -1) {
                $j(this).replaceWith('<div class="media youtube" src="' + $j(this).attr("src") + '"></div');
            }
            else if (video_url.indexOf("cdn.24.co.za") > -1) {
                var new_tag_id = "jwplayer_"+i;
                $j(this).replaceWith('<div class="media jwplayer" id="' + new_tag_id + '"></div');

                var playerInstance = jwplayer(new_tag_id);
                playerInstance.setup({
                    file: video_url,
                    image: "http://dev.cdn.24.co.za/files/Cms/General/d/682/ae0b812114644fe59ec692ef3e9df42a.jpg",
                    width: siteGallery.galleryComponent.width(),
                    height: siteGallery.galleryComponent.find(".stage").height(),
                    title: $j(this).attr("title"),
                    description: $j(this).parent().find(".caption").text()
                });
            }
        });

        window.onYouTubeIframeAPIReady = function() {
            siteGallery.galleryComponent.find('.stage .slider .slide .youtube').each(function () {
                var source = $j(this).attr('src');
                var videoId = null;
                if (source.indexOf("youtu.be") > -1) {
                    videoId = source.substring(source.indexOf("youtu.be") + 9, source.length);
                } else {
                    videoId = source.substring(source.indexOf('watch?v=') + 8, source.length);
                }

                var player = new YT.Player(this, {
                    height: 'auto',
                    width: siteGallery.galleryComponent.width(),
                    videoId: videoId
                });
            });
        };
    },
    goToSlide: function (index) {
        //zeroBased
        index = (index < 0) ? 0 : index;
        index = (index >= siteGallery.totalSlides) ? siteGallery.totalSlides - 1 : index;
        siteGallery.slideIndex = index;
        var slideWidth = this.galleryComponent.find('.stage .slider').width();
        siteGallery.galleryComponent.find('.stage .slider').css('left', -(index * slideWidth));

        siteGallery.galleryComponent.find('.widget.thumbnails .item').removeClass('active');
        $j(siteGallery.galleryComponent.find('.widget.thumbnails .item')[index]).addClass('active');

        siteGallery.galleryComponent.removeClass('first');
        siteGallery.galleryComponent.removeClass('last');

        if (index == 0) {
            siteGallery.galleryComponent.addClass('first');
        }

        if (index == siteGallery.totalSlides - 1) {
            siteGallery.galleryComponent.addClass('last');
        }

        if ($j(siteGallery.galleryComponent).not('.fullscreen')) {

            if (index > 5) {
                var shift_multiplier = index - 5;
                siteGallery.galleryComponent.find('.thumbnails.widget .slider').css('left', "-" + (shift_multiplier * 90) + 'px');
            }
            else {
                siteGallery.galleryComponent.find('.thumbnails.widget .slider').css('left', "0");
            }
        }
    }
};
$j(document).ready(function () {
    siteGallery.init();
});
