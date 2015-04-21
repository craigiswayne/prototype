 nexus_prototype = {
	 
	mask:null,
	form:null,
	code_boxes:null,
	supported_languages:["html","css","js"],
	preview_frame:null,

	import_from_codepen : function (url) {

		url = url || window.prompt("Paste codepen url...");
	    if(!url){sonsole.error("No URL supplied"); return;}

	    var user                = url.replace("http://codepen.io/","");
	    user                    = user.substring(0,user.indexOf("/pen"));
	    var slug_hash           = url.substring(url.lastIndexOf('/')+1,url.length);

	    var codepen_embed       = document.body.appendChild(document.createElement("iframe"));
	    var codepen_doc         = codepen_embed.contentDocument || codepen_embed.contentWindow.document;
	    codepen_embed.className = "cp_embed_iframe codepen";
	    codepen_embed.id        = "cp_embed_"+slug_hash;
	    codepen_embed.src       = "//codepen.io/"+user+"/embed/"+slug_hash+"?slug-hash="+slug_hash+"&amp;user="+user;
	    codepen_embed.setAttribute("scrolling","no");
	    codepen_embed.setAttribute("frameborder","0");
	    codepen_embed.setAttribute("height",parseInt(window.getComputedStyle(nexus_prototype.preview_frame)["height"]));
	    codepen_embed.setAttribute("style","width:100%;min-height:100%;");
	    codepen_embed.setAttribute("allowtransparency","true");
	    codepen_embed.setAttribute("allowfullscreen","true");

	    document.querySelector(".code_area.html").value = codepen_embed.outerHTML;
	    codepen_embed.parentNode.removeChild(codepen_embed);
	    nexus_prototype.show_preview();

	},

	get_html_code : function () {return document.querySelector(".code_area.html").value; },
	
	generate_share_url: function () {
		var content = "<textarea style='font-size: 1.5em;width: 30%;height: 30%;text-align: left;padding: 5px;'>" + document.location.href + "?html=" + encodeURIComponent(nexus_prototype.get_html_code())+ "&css=" +encodeURIComponent(get_css_code()) + "&js=" + encodeURIComponent(get_js_code()) +"</textarea>";
		nexus_prototype.show_mask(content);
		nexus_prototype.mask.removeAttribute("onclick");
	},

	show_mask: function(content){
		content = content || "";
		this.mask.innerHTML = "<table><tr><td>"+content+"</td></tr></table>";
		this.mask.className = "active";
		this.mask.setAttribute("onclick","nexus_prototype.hide_all_menus()");
	},

	show_preview: function(){
		var tmp_preview = document.querySelector("#preview iframe");
		var tmp_preview_doc = tmp_preview.contentDocument || tmp_preview.contentWindow.document;
		tmp_preview_doc.open();
		tmp_preview_doc.write(get_preview_code());
		tmp_preview_doc.close();
	},

	reset:function(){
		nexus_prototype.form.reset();
		for(var i=0; i<this.code_boxes.length; i++){
			this.code_boxes[i].querySelector('label input[type=checkbox]').removeAttribute('checked');
		}
		nexus_prototype.show_preview();
		nexus_prototype.hide_all_menus();
		nexus_prototype.resize_code_boxes();
		document.querySelector("#editor").removeAttribute("style");
		document.querySelector("#preview").removeAttribute("style");
	},

	code_areas:function(){
		return document.querySelectorAll(".code_area");
	},
    
	collapse_unused_code_boxes:function(){
		for(var i=0; i<this.code_boxes.length; i++){
			var code_box = this.code_boxes[i];
			if(code_box.querySelector(".code_area").value.trim() == "" && !code_box.querySelector("label input[type=checkbox][checked=checked]")){
				code_box.querySelector("label input[type=checkbox]").checked = false;
			}
			else{
				code_box.querySelector("label input[type=checkbox]").checked = true;
			}
		}
			nexus_prototype.resize_code_boxes();
	},

	resize_code_boxes:function(){
		
		var showing_code_boxes = new Array();
		for(var i=0; i<nexus_prototype.code_boxes.length; i++)
		{
			if(!nexus_prototype.code_boxes[i].querySelector("label input[type=checkbox]").checked){
				//nexus_prototype.code_boxes[i].dataset.showing = false;
				nexus_prototype.code_boxes[i].style.height = "";
			}
			else{
				//nexus_prototype.code_boxes[i].dataset.showing = true;
				showing_code_boxes.push(nexus_prototype.code_boxes[i]);
			}
		}
		var not_showing = nexus_prototype.code_boxes.length - showing_code_boxes.length;
		for(var i=0; i<showing_code_boxes.length; i++){
			showing_code_boxes[i].style.height = "calc((100% - 25px*"+not_showing+")/"+showing_code_boxes.length+")";
		}
	},

	hide_all_menus:function(){
		$("#main_menu").removeClass('active');
		$("#share_menu").removeClass('active');
		document.querySelector("#main_menu_toggle").className = "fa fa-bars action";
		document.querySelector("#share_menu_toggle").className = "fa fa-share action";
		this.hide_mask();
	},

	hide_mask: function(){
		document.querySelector("#mask").className = "";
	},

	set_filename: function(name){
		document.querySelector("#filename").value = name;
	},

	get_filename: function(){
		var filename = document.querySelector("#filename").value;
		return filename;
	},

	catch_query_strings: function(){
		if(this.get_query_variable("html")){document.querySelector(".code_area.html").value = this.get_query_variable("html");}
		if(this.get_query_variable("js")){document.querySelector(".code_area.js").value = this.get_query_variable("js");}
		if(this.get_query_variable("css")){document.querySelector(".code_area.css").value = this.get_query_variable("css");}
		history.pushState(null,null,document.location.origin+document.location.pathname);
		nexus_prototype.show_preview();
	},

	get_query_variable: function(variable){
			var query = window.location.search.substring(1);
			var vars = query.split("&");
			for (var i=0;i<vars.length;i++)
			{
				var pair = vars[i].split("=");
				if(pair[0] == variable)
				{
					return decodeURIComponent(pair[1]);
				}
			}
			return false;
	},

	show_about: function(){

		nexus_prototype.hide_all_menus();
		nexus_prototype.show_mask();
		$.ajax({
		  url: "about.html"
		}).done(function(r) {
			nexus_prototype.mask.querySelector("td").innerHTML = r;
		});
	},
	
	export_to_codepen : function () {
		var form = document.createElement("form");
		form.style.display="none";
		form.target = "_blank";
		form.method = "POST";
		form.action = "http://codepen.io/pen/define";

		var data = form.appendChild(document.createElement("input"));
		data.type = "hidden";
		data.name = "data";

		//set the name as the same name as the download OR! nexus prototype export
		var data_obj = {
			"title":nexus_prototype.get_filename(),
			"html":nexus_prototype.get_html_code(),
			"css":get_css_code(),
			"js":get_js_code()
		}
		data.value = JSON.stringify(data_obj).replace(/"/g, "&quot;").replace(/'/g,"&apos;");

		form.submit();
	},
	
	catch_save : function () {
		document.addEventListener("keydown", function(e){
			if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)){
				e.preventDefault();
				nexus_prototype.save();
				document.querySelector("#download_btn").click();
			}
		}, false);
	},
	 
	catch_open : function () {
		document.addEventListener("keydown", function(e){
			if (e.keyCode == 79 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)){
				e.preventDefault();
				document.querySelector("#open_btn").click();
			}
		}, false);
	},
	 
	save : function () {
		var data = 'data:application/xml;charset=utf-8,' + encodeURIComponent(get_preview_code());
		document.querySelector("#download_btn").download = nexus_prototype.get_filename();
		document.querySelector("#download_btn").href = data;
	},
	 
	open : function(){
		var files = document.querySelector('#open_btn').files;
		var file  = files[0];
		nexus_prototype.set_filename(file.name);
		var reader = new FileReader();
		reader.onloadend = function(evt) {
			if (evt.target.readyState == FileReader.DONE) {
				
				var file_contents = evt.target.result;
				console.debug(file.type);
				switch(file.type){
					case "text/css":
						document.querySelector('.code_area.css').value = file_contents;
						break;
					
						
					case "application/javascript":
						document.querySelector('.code_area.js').value = file_contents;
						break;
					
						
					default:
					//strip css
					var tag = "style";
					var opening_tag_index; 
					var closing_tag_index;
					while(file_contents.indexOf("<"+tag+">") != -1 && file_contents.indexOf("</"+tag+">") !=-1){
						opening_tag_index  = file_contents.indexOf("<"+tag+">");
						closing_tag_index = file_contents.indexOf("</"+tag+">");
						document.querySelector('.code_area.css').value  += file_contents.substring(opening_tag_index + 2 + tag.length,closing_tag_index);
						file_contents = file_contents.substring(0,opening_tag_index) + file_contents.substring(closing_tag_index+tag.length+3,file_contents.length);
					}

					//strip js
					tag = "script";
					while(file_contents.indexOf("<"+tag+">") != -1 && file_contents.indexOf("</"+tag+">") !=-1){
						opening_tag_index  = file_contents.indexOf("<"+tag+">");
						closing_tag_index = file_contents.indexOf("</"+tag+">");
						document.querySelector('.code_area.js').value  += file_contents.substring(opening_tag_index + 2 + tag.length,closing_tag_index);
						file_contents = file_contents.substring(0,opening_tag_index) + file_contents.substring(closing_tag_index+tag.length+3,file_contents.length);
					}

					file_contents = file_contents.replace("<html>","");
					file_contents = file_contents.replace("</html>","");
					file_contents = file_contents.replace("<body>","");
					file_contents = file_contents.replace("</body>","");
					document.querySelector('.code_area.html').value = file_contents;
					
				}
				
				nexus_prototype.show_preview();

				setTimeout(function(){
					nexus_prototype.collapse_unused_code_boxes();
					nexus_prototype.hide_all_menus();
				},300);
			}
		};

		var blob = file.slice(0, file.size);
		reader.readAsBinaryString(blob);
		nexus_prototype.reset();
	},

	settings : {
		
	},
	 
	init : function () {
		document.querySelector(".reset").setAttribute("onclick", "nexus_prototype.reset();");

		document.querySelector("#export_codepen").setAttribute("onclick", "nexus_prototype.export_to_codepen();");
		document.querySelector("#export_url").setAttribute("onclick", "nexus_prototype.generate_share_url()");

		document.querySelector("#export_email").onclick = function () {
			this.href = "mailto:?subject=Prototype&body=" + encodeURIComponent(get_preview_code());
		};
		this.code_boxes = document.querySelectorAll(".code_box");

		this.catch_save();
		this.catch_open();

        document.querySelector("#open_btn").onchange = nexus_prototype.open;
        document.querySelector("#share_btn").onclick = toggle_share_menu;
        
		document.querySelector("#about_btn").addEventListener("click",nexus_prototype.show_about,false);
		document.querySelector("#toggle_grid").addEventListener("click",function(){
			$(document.body).toggleClass("grid");
		},false);
		
		this.code_boxes = document.querySelectorAll(".code_box");
		this.form		= document.querySelector("#main");
		this.mask 		= document.querySelector("#mask");
		this.preview_frame = document.querySelector("#preview iframe");
		this.catch_query_strings();
		
		this.collapse_unused_code_boxes();
				 
		$(document.body).removeClass("initializing");
	}

};

document.addEventListener("DOMContentLoaded",function(){
	nexus_prototype.init();
},false);

window.onbeforeunload = function(){return "All your work will be erased!";}

var resizer;
var workspace;
var editor;
var resize_start;
var editor_width;
var preview;
//var code_boxes;
var preview_doc;
//resize events

document.addEventListener("DOMContentLoaded",function(){

	//window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
	preview = document.querySelector("#preview");
	var preview_pane = preview.querySelector("iframe.preview");
	preview_doc = preview_pane.contentDocument || preview_pane.contentWindow.document;
	workspace = document.querySelector(".main");
	resizer = document.querySelector(".resizer");
	editor 	= document.querySelector(".editor");

	var code_area_html = document.querySelector(".code_area.html");
	var code_area_css = document.querySelector(".code_area.css");
	var code_area_js = document.querySelector(".code_area.js");

	code_area_html.addEventListener("keydown",catch_tab_key,false);
	code_area_css.addEventListener("keydown",catch_tab_key,false);
	code_area_js.addEventListener("keydown",catch_tab_key,false);

	var export_email = document.querySelector("#export_email");
	var export_url   = document.querySelector("#export_url");

	resizer.addEventListener("mousedown",function(event){
		$(document.body).addClass("resizing");
		resize_start = event.clientX;
		editor_width = window.getComputedStyle(editor).width;
	},false);

	resizer.addEventListener("contextmenu",function(){$(document.body).removeClass("resizing");},false);

	//dont need this, just check if the src element is the resizer
	document.addEventListener("mouseup",function(){$(document.body).removeClass("resizing");},false);

	document.addEventListener("mousemove",function(event){
		//NOTE: the new_width is a percentage of the container not in pixels (px)
		editor = editor || document.querySelector("#editor");
		workspace = workspace || document.querySelector("#workspace");
		if(document.querySelector("body.resizing")){
			var workspace_width = parseInt(window.getComputedStyle(workspace).width);

			var resizer_width = parseInt(window.getComputedStyle(resizer).width);

			var difference = event.clientX-resize_start;

			var new_width = ((parseInt(editor_width)+difference)/workspace_width)*100;

			editor.style.width	= new_width + "%";

			preview.style.width	= "calc(100% - "+editor.style.width+")";
		}
	},false);

	//code_boxes = document.querySelectorAll(".code_box");

	for(var i=0; i<nexus_prototype.code_boxes.length; i++){
		nexus_prototype.code_boxes[i].querySelector(".code_area").addEventListener("keyup",nexus_prototype.show_preview,false);
		nexus_prototype.code_boxes[i].querySelector(".code_area").addEventListener("scroll",function(){this.style.backgroundPositionY = (0-this.scrollTop)+"px";},false);
		nexus_prototype.code_boxes[i].querySelector("label input[type=checkbox]").addEventListener("change",nexus_prototype.resize_code_boxes);
	}

	get_functionality();

},false);

function get_js_code(){return document.querySelector(".code_area.js").value;}

function get_css_code(){return document.querySelector(".code_area.css").value;}

function get_preview_code(){
	var html = '<html>\n';
	html += "<head>\n"
	html += "\t<title>"+nexus_prototype.get_filename()+"</title>\n";

	if(get_css_code() != ""){
		html += "\n<style>\n\n"+get_css_code()+"\n\n</style>\n";
	}

	if(get_js_code() != ""){
		html += "\n\t<script>\n\n"+get_js_code()+"\n\n</script>\n";
	}

	html += "</head>\n";
	html += "<body>\n\n";
	html += ""+nexus_prototype.get_html_code();
	html += "\n\n</body>\n";
	html += "</html>"
	return html;
}

function editor_width_min(){
	document.querySelector('.editor').style.width='0';
	preview.style.width	= "calc(100% - "+editor.style.width+")";
}

function editor_width_max(){
	document.querySelector('.editor').style.width='100%';
	preview.style.width	= "calc(100% - "+editor.style.width+")";
}

function get_functionality(){

	var upload_button = document.querySelector("#open_btn");
	var codepen_export_button = document.querySelector("#export_codepen");
	if(!document.domain){
		codepen_export_button.addEventListener("click",local_functionality_notice,false);
		upload_button.type = "button";
		upload_button.addEventListener("click",local_functionality_notice,false);
	}
	else{
		codepen_export_button.addEventListener("click",nexus_prototype.export_to_codepen,false);
	}

}

function local_functionality_notice(){
	//alert("Only available online","test");
}

function toggle_main_menu(){
	$('#main_menu_toggle').toggleClass('fa-bars fa-times');
	document.querySelector("#share_menu_toggle").className = "fa fa-share action";

	$('#main_menu').toggleClass('active');
	$('#share_menu').removeClass('active');

	if(document.querySelector("#main_menu_toggle.fa-times")){
		nexus_prototype.show_mask();
	}
	else{
		nexus_prototype.hide_mask();
	}
}

function toggle_share_menu(){
	document.querySelector("#main_menu_toggle").className = "fa fa-bars action";
	$('#share_menu').toggleClass('active');
	$('#main_menu').removeClass('active');
	$('#share_menu_toggle').toggleClass('fa-share fa-times');

	if(document.querySelector("#share_menu_toggle.fa-times")){
		nexus_prototype.show_mask();
	}
	else{
		nexus_prototype.hide_mask();
	}
}

function catch_tab_key(ev){
		var keyCode = ev.keyCode || ev.which;

		if (keyCode == 9) {
			ev.preventDefault();
			var start = this.selectionStart;
			var end = this.selectionEnd;
			var val = this.value;
			var selected = val.substring(start, end);
			var re, count;

			if(ev.shiftKey) {
				//re = /^\t/gm;
				re = /^/gm;
				count = -(selected.match(re).length);
				this.value = val.substring(0, start) + selected.replace(re, '') + val.substring(end);
				// todo: add support for shift-tabbing without a selection
			} else {
				re = /^/gm;
				count = selected.match(re).length;
				this.value = val.substring(0, start) + selected.replace(re, '\t') + val.substring(end);
			}

			if(start === end) {
				this.selectionStart = end + count;
			} else {
				this.selectionStart = start;
			}

			this.selectionEnd = end + count;
		}
}