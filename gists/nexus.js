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
