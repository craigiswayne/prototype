/*STRING PROTOTYPES*/
String.prototype.replaceAll = function(f,r){return this.split(f).join(r);}
String.prototype.parse_color = function(color){
    //CREDIT http://www.javascripter.net/faq/rgbtohex.htm
    color = this.replaceAll(" ", "");
    var converted_color = "Invalid Input";

    function toHex(n) {
     n = parseInt(n,10);
     if (isNaN(n)) return "00";
     n = Math.max(0,Math.min(n,255));
     return "0123456789ABCDEF".charAt((n-n%16)/16)
          + "0123456789ABCDEF".charAt(n%16);
    }    

    if(color.indexOf("rgb(") === 0 && color.length <= 16 && color.length >= 10 && color.indexOf(")") == color.length -1){
        color = color.replace("rgb(","").replace(")","").split(",");
        converted_color = "#" + toHex(color[0]) + toHex(color[1]) + toHex(color[2]);
    }
    else if(color.length <=7 && color.indexOf("#") == 0){
        color = color.replace("#","");
        converted_color = "rgb(" + parseInt(color.substring(0,2),16) + "," + parseInt(color.substring(2,4),16) + "," + parseInt(color.substring(4,6),16) + ")";
    }
    else if(color.indexOf("cmyk(" === 0) && color.length <= 21 && color.length >= 13 && color.indexOf(")") == color.length -1){
        color = color.replace("cmyk(","").replace(")","").split(",");
        var c = (color[0]/100);
        var m = (color[1]/100);
        var y = (color[2]/100);
        var k = (color[3]/100);
        converted_color = "rgb(" + Math.round(255 * (1 - c) * (1-k)) + "," + Math.round(255 * (1 - m) * (1-k)) + "," + Math.round(255 * (1 - y) * (1-k)) + ")";
    }

    return converted_color;
};


var nexus = function(){
	
    //nexus error module
    nexus.error = function(title,message){
         if(window.location.search.indexOf("debug=true") < 0) return;
        
		if(message) console.error(title,message);
		else console.error(title);
    };
    
	//nexus google maps module
	nexus.google = {};
	nexus.google.maps = {
		
		api_url     : "https://maps.googleapis.com/maps/api/js?v=3.exp&signed_in=true&callback=nexus.google.maps.post_install",
		installed   : false,
		options     : {
			zoom: 8,
            latitude: -34.397,
            longitude: 150.644
		},
		
		post_install: function(){
			nexus.debug("Google Map API installtion complete...");
			nexus.google.maps.installed = true;
		},
		
		create      : function(element){
			if(!nexus.google.maps.installed){
				nexus.google.maps.install(function(){
					nexus.google.maps.create(element);
				});
			}
			else if(element instanceof HTMLElement){
				nexus.debug("creating the map....");

				//var map_options = array_m

				element.nexus			    = element.nexus || {};
				element.nexus.google	    = element.nexus.google || {};
				//element.nexus.google.map =  new google.maps.Map(element,nexus.google.maps.options);
                var map_options             = nexus.google.maps.options;
                map_options.center          = new google.maps.LatLng(map_options.latitude, map_options.longitude);
                element.nexus.google.map    =  new google.maps.Map(element,nexus.google.maps.options);
				return element.nexus.google.map;
				nexus.debug("Finished creating map...");
			}
			else{

			}

		},
		
		install     : function(callback){
			nexus.debug("Installing Google Map API...", nexus.google.maps.api_url);
			nexus.scripts.install(nexus.google.maps.api_url);
		},
		
		init        : function(){
			//check if the google map script is installed
			for(var i=0; i<document.scripts.length; i++){
				if(document.scripts[i].src){
					if(document.scripts[i].src == nexus.google.maps.api_url) return; 
				}
			}
			nexus.google.maps.install();
		}
	};
	
    //nexus mask module
    nexus.hide_mask = function(force){
        
        force = (typeof force == "boolean") ? force : false;
		
        var source = event.srcElement || event.target;
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
        
        mask.innerHTML  = "<table class='aligner'><tr class='aligner'><td class='aligner'><div class='content popup animate'></div></td></tr></table>";
        
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
        }            
    },
    
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
            table_header_checkbox.className = "nexus";
            table_header_checkbox.addEventListener("change",function(){
            
                var table = this.parentNode.parentNode.parentNode.parentNode;
                var row_checkboxes = table.querySelectorAll(".row_checkbox_cell input[type=checkbox].row_checkbox");
                for(var i=0; i<row_checkboxes.length; i++){
                    row_checkboxes[i].checked = this.checked;
					event.preventDefault();
    				$(row_checkboxes[i]).trigger("change");
					//$(row_checkboxes[i]).prop('checked', true).change();
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
                row_checkbox.className      = "nexus row_checkbox";
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
        menu.className = "nexus menu";
        
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
                    $(".mask td.aligner .content").html("<iframe class='ajax error fallback' src='"+this.url+"'></iframe>");
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
		nexus.debug("Installing Script:",src);
		var script	= document.createElement("script");
		script.type = "text/javascript";
		script.src	= src;
		document.body.appendChild(script);
		return script;
	};
	
	nexus.init = function(){
		nexus.debug("Initializing nexus...");
		//install jquery library
		nexus.scripts.install("jquery.js");
	};
	nexus.init();
};

document.addEventListener("DOMContentLoaded",nexus,false);