function preview(input){
    if (input.files && input.files[0]) {

          var reader = new FileReader();
          var container = $("#image_preview_container");
          var image     = $("#image_preview");
          var polaroid  = $("#polaroid");
          reader.onload = function (e) {

              polaroid.removeClass('notify');
              image.removeClass('active');
              image.css('margin-left', '');
              image.css('margin-top', '');
              image.removeClass('active');
              container.addClass('busy');
              container.removeClass('blur');
              container.css('background-image', '');

              image.attr('src', e.target.result);
              image.css('margin-left', -(parseInt(image.css('width'))/2) + 'px');
              image.css('margin-top', -(parseInt(image.css('height'))/2)-20 + 'px');

              var colorThief = new ColorThief();
              var color = colorThief.getColor(image[0]);
              color = "rgb("+ color[0]+","+color[1]+","+color[2]+")";
              container.css('background-color',color);
              var palette = colorThief.getPalette(image[0])
              var palette_container = $("#palette");
              $(palette_container).find('*:not(.title)').remove();

              setTimeout(function(){
                polaroid.addClass('notify');
                image.addClass('active');
                container.addClass('blur');
                container.css('background-image', 'url('+e.target.result+')');
                container.removeClass('busy');
                for(var i=0; i<palette.length; i++ ){
                    color = "rgb("+palette[i][0]+","+palette[i][1]+","+palette[i][2]+")";
                    var block = "<div class=swab_container><div class=swab style='background-color:"+color+"''></div><label>"+color+"</label></div>";
                    palette_container.append(block).hide().delay(i*1000).fadeIn(300);
                }
              },1000);
          }

          reader.readAsDataURL(input.files[0]);
        }
    }
