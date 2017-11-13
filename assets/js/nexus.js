String.prototype.trim = function(){
    //REF: https://alvinabad.wordpress.com/2009/02/12/extending-javascripts-string-object/
    return this.replace(/^\s+|\s+$/g, "")
};
String.prototype.extension = function(){
    var string = this.trim();
    var extension = null;
    if(string.lastIndexOf(".") > -1){
        if(string.length > string.lastIndexOf(".") + 1){
            extension = string.substring(string.lastIndexOf(".")+1,string.length);
        }
    }
    return extension;
};

var nexus = function(){

    nexus.notify = function(){

    };

    //nexus error module
    nexus.error = function(title,message){
         if(window.location.search.indexOf("debug=true") < 0) return;

		if(message) console.error(title,message);
		else console.error(title);
    };
    nexus.show_error = function(title,message){
        alert(title);
    };

    //nexus mask module
    nexus.hide_mask = function(force){

        force = (typeof force == "boolean") ? force : false;
		var source;
        if(event){source = event.srcElement || event.target;}

		if(force || source == document.querySelector(".mask>table.aligner") || source == document.querySelector(".mask>table.aligner td.aligner")){
            $(document.querySelector(".mask")).removeClass("active");
			document.querySelector(".mask").innerHTML = "";
		}
    };
    nexus.show_mask   = function(content){
        content = content || "";

        var mask;
        if(!document.querySelector(".mask")){
            mask = document.body.appendChild(document.createElement("div"));
            mask.onclick    = nexus.hide_mask;
        }
        else{
            mask = document.querySelector(".mask");
        }

        mask.innerHTML  = "<table class='aligner uk-width uk-height-1-1 uk-text-center'><tr class='aligner'><td class='aligner'><div class='content uk-overflow-hidden popup uk-container-center uk-position-relative animate'></div></td></tr></table>";

        if(content.trim() != ""){content_div.innerHTML   = content;}

        $(mask).addClass("mask");
        $(mask).addClass("active");
    };

	//nexus file module
	nexus.file = {
        read_san:function(files){

            nexus.debug(this);
            nexus.debug(event);

            if(!event || !event.srcElement || !event.srcElement instanceof HTMLInputElement || !event.srcElement.type == "file"){return;}

            var file_input = event.srcElement;
            files = files || file_input.files;

            if(files.length == 0){nexus.error("No files present"); return;}

            var f = files[0];
            var reader = new FileReader();

            reader.onload = function(e) {
                var data = e.target.result;
                var worker = new Worker('./xlsxworker2.js');
                worker.onmessage = function(e) {
                    switch(e.data.t) {
                        case 'ready': break;

                        case 'e': console.error(e.data.d); break;
                        default:

                            var o = "", l = 0, w = 10240;
                            for(; l<e.data.byteLength/w; ++l) o+=String.fromCharCode.apply(null,new Uint16Array(e.data.slice(l*w,l*w+w)));
                            o+=String.fromCharCode.apply(null, new Uint16Array(e.data.slice(l*w)));

                            xx=o.replace(/\n/g,"\\n").replace(/\r/g,"\\r");

                            var temp_2 = JSON.parse(xx);
                            var result = {};
                            temp_2.SheetNames.forEach(function(sheetName) {
                                var roa = XLSX.utils.sheet_to_row_object_array(temp_2.Sheets[sheetName]);
                                if(roa.length > 0){
                                    result[sheetName] = roa;
                                }
                            });
                            console.debug(result);
                            window.test = result["Stores Map"];
                            nexus.json.table(result["Stores Map"],{generate_header:false});
                            return result;
                            break;
                    }
                };

                var b = new ArrayBuffer(data.length*2), v = new Uint16Array(b);
                for (var i=0; i != data.length; ++i) v[i] = data.charCodeAt(i);
                var val =  [v, b];

                worker.postMessage(val[1], [val[1]]);
            };
            reader.readAsBinaryString(f);
        },

        image_to_base64: function(input){
            /*//function convertImgToBase64URL(url, callback, outputFormat){
            //credit: http://stackoverflow.com/questions/6150289/how-to-convert-image-into-base64-string-using-javascript
            var img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = function(){
                var canvas = document.createElement('CANVAS'),
                ctx = canvas.getContext('2d'), dataURL;
                canvas.height = img.height;
                canvas.width = img.width;
                ctx.drawImage(img, 0, 0);
                dataURL = canvas.toDataURL(outputFormat);
                return dataURL;
                canvas = null;
            };
            img.src = url;
            //}*/

            //credit: http://stackoverflow.com/questions/4459379/preview-an-image-before-it-is-uploaded
            //credit: http://jsfiddle.net/LvsYc/

            if (input.files && input.files[0]) {
                var reader = new FileReader();
                reader.onload = function(e){
                    console.debug(e.target.result);
                    return e.target.result;
                }
                reader.readAsDataURL(input.files[0]);
            }
        },

        read: function(file){
            //REF: https://api.jquery.com/deferred.promise/
            var dfd = jQuery.Deferred();
            var reader = new FileReader();
            reader.onload = function(e){
                dfd.resolve(e.target.result);
            };
            var blob = file.slice(0, file.size);
            reader.readAsBinaryString(blob);

            return dfd.promise();
        }

    },
    nexus.dropzone = function(element,settings){
        //ref http://html5demos.com/drag#view-source
        settings                = settings                  || {};
        settings.accept         = settings.accept           || [];
        settings.ondrop         = settings.ondrop           || function(){};
        settings.ondragenter    = settings.ondragenter      || function(){};
        settings.ondragover     = settings.ondragover       || function(){};
        settings.ondragleave    = settings.ondragleave      || function(){};

        if(!element) return null;

        $(element).addClass("dropzone");

        element.ondragenter = function(){
            this.remove_drag_states();
            $(this).addClass("drag enter");
            settings.ondragenter();

        };

        element.ondragover = function(){
            event.preventDefault();
            this.remove_drag_states();
            $(this).addClass("drag over");
            settings.ondragover();
        };

        element.ondragleave= function(){
            this.remove_drag_states();
            $(this).addClass("drag leave");
            settings.ondragleave();
        };

        element.ondrop = function(e){
            //REF: http://www.html5rocks.com/en/tutorials/file/dndfiles/
            e.stopPropagation();
            e.preventDefault();
            this.remove_drag_states();
            $(this).addClass("drag drop");

            var files = e.dataTransfer.files;
            for (var i = 0, f; f = files[i]; i++) {
                var file = null;
                if(settings.accept.length > 0){
                    if(settings.accept.indexOf(f.name.extension()) > -1) file = f;
                    else console.warn("Unsupported Media");
                }
                settings.ondrop(file);
            }
            this.remove_drag_states();

        };

        element.remove_drag_states = function(){
            $(this).removeClass("drag");
            $(this).removeClass("over");
            $(this).removeClass("leave");
            $(this).removeClass("drop");
            $(this).removeClass("enter");
        };

        return element;

    };

	//nexus json module
    nexus.json = {
		table:function(json, options){
            nexus.debug(options);
            options = options || {};
            //options.generate_header = options.generate_header || true;
            nexus.debug(options);

            json = json || {};

            var table = document.createElement("table");
            table.className                 = "nexus enable_row_select";
            var table_header                = table.appendChild(document.createElement("thead"));
            var table_header_row            = table_header.appendChild(document.createElement("tr"));
            var table_header_checkbox_cell  = table_header_row.appendChild(document.createElement("th"));
            var table_header_checkbox       = table_header_checkbox_cell.appendChild(document.createElement("input"));
            table_header_checkbox.type      = "checkbox";
            table_header_checkbox.className = "nexus uk-position-relative";
            table_header_checkbox.addEventListener("change",function(){

                var table = this.parentNode.parentNode.parentNode.parentNode;
                var row_checkboxes = table.querySelectorAll(".row_checkbox_cell input[type=checkbox].row_checkbox");
                for(var i=0; i<row_checkboxes.length; i++){
                    row_checkboxes[i].checked = this.checked;
					event.preventDefault();
    				$(row_checkboxes[i]).trigger("change");
                }

            },false);

            if(options.generate_header === true){

                for(var i in Object.keys(json)){
                    var header_cell = table_header_row.appendChild(document.createElement("th"));
                    header_cell.innerHTML = Object.keys(json)[i];
                }
            }

            var table_body = table.appendChild(document.createElement("tbody"));
            for(var i in Object.keys(json)){
                var row_entry               = table_body.appendChild(document.createElement("tr"));
                row_entry.className         = "selected";
                var row_checkbox_cell       = row_entry.appendChild(document.createElement("td"));
                row_checkbox_cell.className = "row_checkbox_cell";
                var row_checkbox            = row_checkbox_cell.appendChild(document.createElement("input"));
                row_checkbox.type           = "checkbox";
                row_checkbox.checked        = true;
                row_checkbox.className      = "nexus uk-position-relative row_checkbox";
                row_checkbox.addEventListener("change",function(){
					console.debug("checkbox change function");
                    if(this.checked){$(this.parentNode.parentNode).addClass("selected");}
                    else{$(this.parentNode.parentNode).removeClass("selected");}
                },false);


                for(var j in Object.keys(Object.keys(json)[i])){
                    var cell_value = json[i][Object.keys(json[i])[j]];
                    if(cell_value !== undefined){
                        var row_cell = row_entry.appendChild(document.createElement("td"));
                        row_cell.className = Object.keys(json[i])[j];
                        row_cell.innerHTML = cell_value;
                    }
                }
            }

            document.querySelector("#table_output").innerHTML = "";
            document.querySelector("#table_output").appendChild(table);
            return table;
        }
    },

	//nexus jquery module
	nexus.jquery_url = "http://code.jquery.com/jquery.js";

	nexus.debug = function(title,message){
        if(window.location.search.indexOf("debug=true") < 0) return;

		if(message) console.debug(title,message);
		else console.debug(title);
    };

	nexus.link = function(src){

		if(src.substring(src.length-4, src.length) == ".css"){
			var link = document.createElement("link");
			link.rel = "stylesheet";
			link.href = src;
			document.head.appendChild(link);
		}
	};

    nexus.menu = function(json_tree){

        var menu = document.createElement("ul");
        menu.className = "nexus menu uk-margin-remove";

        console.debug(Object.keys(json_tree));

        for(var i in Object.keys(json_tree)){
            var key = Object.keys(json_tree)[i];
            var menu_item = menu.appendChild(document.createElement("li"));
            menu_item.className = "item";
            menu_item.innerHTML = key;
            if(Object.keys(json_tree[key]).length > 0){
                menu_item.appendChild(new nexus.menu(json_tree[key]));
            }
        }

        return menu;

    };

    nexus.show_popup =  function(params){
        params = params || {};

        if(params.url){
            $.ajax({
                url: params.url
            }).done(function(result) {
                $(".mask td.aligner .content").html(result);
            }).error(function(e,f){
                try{
                    $(".mask td.aligner .content").html("<iframe class='ajax error fallback uk-width uk-display-block uk-height-1-1 uk-margin-remove' src='"+this.url+"'></iframe>");
                    console.debug(this);
                    console.debug(e);
                    console.debug(f);
                }
                catch(e){
                    console.debug(e);
                }
            });
        }
    };

	//nexus scripts module
	nexus.scripts = {};
	nexus.scripts.install = function(src){
		var script	= document.createElement("script");
		script.type = "text/javascript";
		script.src	= src;
		document.body.appendChild(script);
		return script;
	};
};

document.addEventListener("DOMContentLoaded",nexus,false);
