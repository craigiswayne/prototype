<<<<<<< HEAD

window.onbeforeunload = function(){return "All your work will be erased!";}

var resizer;
var workspace;
var editor;
var resize_start;
var editor_width;
var preview;
var code_boxes;
var preview_doc;
//resize events
document.addEventListener("DOMContentLoaded",function(){
	window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
	preview = document.querySelector(".preview");
	preview_doc = preview.contentDocument || preview.contentWindow.document;
	workspace = document.querySelector(".main");
	resizer = document.querySelector(".resizer");
	editor 	= document.querySelector(".editor");

	document.querySelector(".menu input[type=file]").onchange = upload_files;

	resizer.addEventListener("mousedown",function(event){
		editor.dataset.resizing = true;
		resize_start = event.clientX;
		editor_width = window.getComputedStyle(editor).width;
	},false);

resizer.addEventListener("contextmenu",function(){editor.dataset.resizing=false;},false);

//dont need this, just check if the src element is the resizer
document.addEventListener("mouseup",function(){editor.dataset.resizing = false;},false);

document.addEventListener("mousemove",function(event)
{
	//NOTE: the new_width is a percentage of the container not in pixels (px)
	if(editor.dataset.resizing=="true")
	{
		var workspace_width = parseInt(window.getComputedStyle(workspace).width);

		var resizer_width = parseInt(window.getComputedStyle(resizer).width);

		var difference = event.clientX-resize_start;

		var new_width = ((parseInt(editor_width)+difference)/workspace_width)*100;

		editor.style.width	= new_width + "%";

		preview.style.width	= "calc(100% - "+editor.style.width+")";
	}
},false);

code_boxes = document.querySelectorAll(".code_box");

for(var i=0; i<code_boxes.length; i++)
{
	code_boxes[i].querySelector(".code_area").addEventListener("keyup",show_preview,false);
	code_boxes[i].querySelector(".code_area").addEventListener("scroll",function(){this.style.backgroundPositionY = (0-this.scrollTop)+"px";},false);
	code_boxes[i].querySelector("label input[type=checkbox]").addEventListener("change",resize_code_boxes);
}

},false);

function resize_code_boxes()
{
	var showing_code_boxes = new Array();
	for(var i=0; i<code_boxes.length; i++)
	{
		if(!code_boxes[i].querySelector("label input[type=checkbox]").checked)
		{
			code_boxes[i].dataset.showing = false;
			code_boxes[i].style.height = "";
		}
		else
		{
			code_boxes[i].dataset.showing = true;
			showing_code_boxes.push(code_boxes[i]);
		}
	}
	var not_showing = code_boxes.length - showing_code_boxes.length;
	for(var i=0; i<showing_code_boxes.length; i++)
	{
		showing_code_boxes[i].style.height = "calc((100% - 19px*"+not_showing+")/"+showing_code_boxes.length+")";
	}
}

function get_html_code(){return document.querySelector(".code_area.html").value;}

function get_js_code(){return document.querySelector(".code_area.js").value;}

function get_css_code(){return document.querySelector(".code_area.css").value;}


function get_preview_code()
{
	var html = '<html>\n';
	html += "<head>\n"
	html += "<title>"+get_filename()+"</title>\n";

	if(get_css_code() != ""){
		html += "\n<style>\n\n"+get_css_code()+"\n\n</style>\n";
	}


	if(get_js_code() != ""){

		html += "\n<script>\n\n"+get_js_code()+"\n\n</script>\n";
	}
	html += "</head>\n";
	html += "<body>\n\n";
	html += get_html_code();
	html += "\n\n</body>\n";
	html += "</html>"
	return html;
}


function show_preview()
{
	preview_doc.open();
	preview_doc.write(get_preview_code());
	preview_doc.close();
	workspace.dataset.loading = false;
}


function editor_width_min(){
	document.querySelector('.editor').style.width='0';
	preview.style.width	= "calc(100% - "+editor.style.width+")";
}

function editor_width_max(){
	document.querySelector('.editor').style.width='100%';
	preview.style.width	= "calc(100% - "+editor.style.width+")";
}

function catch_save_functions()
{
	document.addEventListener("keydown", function(e)
{
	if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey))
	{
		e.preventDefault();
		save_code_as();
		document.querySelector(".menu a[download]").click();
	}
}, false);
}

function save_code_as()
{
	var data = 'data:application/xml;charset=utf-8,' + encodeURIComponent(get_preview_code());
	document.querySelector(".menu a[download]").download = get_filename();
	document.querySelector(".menu a[download]").href = data;
}

function get_filename(){
	var filename = document.querySelector("#filename").value;
	return filename;
}

function upload_files(){
	var files = this.files;
	window.requestFileSystem(window.TEMPORARY, 1024*1024, function(fs) {
		for (var i = 0, file; file = files[i]; ++i) {
			document.querySelector("#download_button").download = get_filename();
			(function(f){
				//var current_date = new Date();
				fs.root.getFile("uploaded.html", {create: true, exclusive: false}, function(fileEntry){
					fileEntry.createWriter(function(fileWriter){
						fileWriter.write(f);
						fs.root.getFile("uploaded.html", {}, function(fileEntry) {
							fileEntry.file(function(file){
								var reader = new FileReader();
								this.result = "";
								reader.onloadend = function(e){
									reset_codeareas();
									document.querySelector(".code_area.html").value = this.result;
									document.querySelector(".menu input[type=file]").value = null;
									show_preview();
									$(".menu").removeClass("active");
								};

								reader.readAsText(file);
							}, errorHandler);
						}, errorHandler);
					}, errorHandler);
				}, errorHandler);
			})(file);
		}
	}, errorHandler);
}

function errorHandler(e){
	console.error(e);
}

function get_functionality(){

	var upload_button = document.querySelector(".menu input[type=file]");
	//var codepen_export_button = document.querySelector("nav>label.action[data-icon_name=share]>.share_menu>a[onclick='export_to_codepen()']");
	if(!document.domain){
		//codepen_export_button.setAttribute("onclick","local_functionality_notice()");
		upload_button.type = "button";
		upload_button.addEventListener("click",local_functionality_notice,false);
	}

}

function catch_query_strings(){

	if(get_query_variable("html")){document.querySelector(".code_area.html").value = get_query_variable("html");}
	if(get_query_variable("js")){document.querySelector(".code_area.js").value = get_query_variable("js");}
	if(get_query_variable("css")){document.querySelector(".code_area.css").value = get_query_variable("css");}
	history.pushState(null,null,document.location.origin+document.location.pathname);
	show_preview();
}

function local_functionality_notice(){alert("Only available online","test");}


function reset_codeareas(){
	for(var i=0; i<document.querySelectorAll(".code_area").length; i++){
		document.querySelectorAll(".code_area")[i].value = '';
	}
	show_preview();
}

document.addEventListener("DOMContentLoaded",function(){
	document.forms[0].addEventListener("reset",function(){show_preview();},false);
	get_functionality();
},false);

catch_save_functions();
=======
	
	window.onbeforeunload = function(){return "All your work will be erased!";}

	var resizer; 
	var workspace;
	var editor;
	var resize_start;
	var editor_width;
	var preview;
	var code_boxes;
	var preview_doc;
	//resize events
	document.addEventListener("DOMContentLoaded",function(){
		preview = document.querySelector(".preview");
		preview_doc = preview.contentDocument || preview.contentWindow.document;
		workspace = document.querySelector(".main");
		resizer = document.querySelector(".resizer");
		editor 	= document.querySelector(".editor");
		resizer.addEventListener("mousedown",function(event)
		{
			editor.dataset.resizing = true;
	        resize_start = event.clientX;
			editor_width = window.getComputedStyle(editor).width;
		},false);

		resizer.addEventListener("contextmenu",function(){editor.dataset.resizing=false;},false);

		//dont need this, just check if the src element is the resizer
		document.addEventListener("mouseup",function(){editor.dataset.resizing = false;},false);
		
		document.addEventListener("mousemove",function(event)
		{
			//NOTE: the new_width is a percentage of the container not in pixels (px)
			if(editor.dataset.resizing=="true")
			{	
				var workspace_width = parseInt(window.getComputedStyle(workspace).width);
				
				var resizer_width = parseInt(window.getComputedStyle(resizer).width);
				
				var difference = event.clientX-resize_start;
				
				var new_width = ((parseInt(editor_width)+difference)/workspace_width)*100;
				
				editor.style.width	= new_width + "%";
				
				preview.style.width	= "calc(100% - "+editor.style.width+")";
			}
		},false);

		code_boxes = document.querySelectorAll(".code_box");
		
		for(var i=0; i<code_boxes.length; i++)
		{
			code_boxes[i].querySelector(".code_area").addEventListener("keyup",show_preview,false);
			code_boxes[i].querySelector(".code_area").addEventListener("scroll",function(){this.style.backgroundPositionY = 0-this.scrollTop;},false);		
			code_boxes[i].querySelector("label input[type=checkbox]").addEventListener("change",resize_code_boxes);
		}

	},false);

	function resize_code_boxes()
	{
		var showing_code_boxes = new Array();
		for(var i=0; i<code_boxes.length; i++)
		{
			if(!code_boxes[i].querySelector("label input[type=checkbox]").checked)
			{
				code_boxes[i].dataset.showing = false;
				code_boxes[i].style.height = "";
			}
			else
			{
				code_boxes[i].dataset.showing = true;
				showing_code_boxes.push(code_boxes[i]);
			}		
		}
		var not_showing = code_boxes.length - showing_code_boxes.length;
		for(var i=0; i<showing_code_boxes.length; i++)
		{
			showing_code_boxes[i].style.height = "calc((100% - 22px*"+not_showing+")/"+showing_code_boxes.length+")";
		}
	}

	function get_html_code(){return document.querySelector(".code_area.html").value;}

	function get_js_code(){return document.querySelector(".code_area.js").value;}

	function get_css_code(){return document.querySelector(".code_area.css").value;}


	function get_preview_code()
	{
		var html = '';
		html += "<style>"+get_css_code()+"</style>";
		html += "<script>"+get_js_code()+"</script>";
		html += get_html_code();
		return html;
	}


	function show_preview()
	{	
		preview_doc.open();
		preview_doc.write(get_preview_code());
		preview_doc.close();
		workspace.dataset.loading = false;
	}
	
	
	function editor_width_min(){
		document.querySelector('.editor').style.width='0';
		preview.style.width	= "calc(100% - "+editor.style.width+")";
	}

	function editor_width_max(){
		document.querySelector('.editor').style.width='100%';
		preview.style.width	= "calc(100% - "+editor.style.width+")";
	}
	
>>>>>>> origin/master
