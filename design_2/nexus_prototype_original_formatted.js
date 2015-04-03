var workspace, code_boxes, preview_doc;
document.addEventListener("DOMContentLoaded",function()
{
	window.onbeforeunload = function(){return "All your work will be erased!";}

	code_boxes = document.querySelectorAll(".code_box");

	for(var i=0; i<code_boxes.length; i++)
	{
		code_boxes[i].querySelector(".code_area").addEventListener("keyup",show_preview,false);
		code_boxes[i].querySelector(".code_area").addEventListener("scroll",function(){this.style.backgroundPositionY = (0-this.scrollTop)+"px";},false);
		code_boxes[i].querySelector(".code_box label input[type=checkbox]").addEventListener("change",resize_code_boxes);
	}

	var editor 	= document.querySelector(".editor");
	var preview = document.querySelector("iframe.preview");


	document.querySelector(".resizer .fa-step-forward").addEventListener("click",function(){
		editor.style.width = window.getComputedStyle(editor).maxWidth;
		preview.style.width = window.getComputedStyle(preview).minWidth;
	},false);

	document.querySelector(".resizer .fa-step-backward").addEventListener("click",function(){
		editor.style.width = window.getComputedStyle(editor).minWidth;
		preview.style.width = window.getComputedStyle(preview).maxWidth;
	},false);


	//resize events
	workspace = document.querySelector(".editor");
	var resizer = document.querySelector(".resizer");
	resizer.addEventListener("mousedown",function(event){
		workspace.dataset.resizing = true;
		resize_start = event.clientX;
		editor_width = window.getComputedStyle(editor).width;
	},false);

resizer.addEventListener("contextmenu",function(){workspace.dataset.resizing=false;},false);

//dont need this, just check if the src element is the resizer
document.addEventListener("mouseup",function(){workspace.dataset.resizing = false;},false);

document.addEventListener("mousemove",function(event)
{
	//NOTE: the new_width is a percentage of the container not in pixels (px)
	if(workspace.dataset.resizing=="true"){
		var workspace_width = parseInt(window.getComputedStyle(workspace).width);
		var resizer_width = parseInt(window.getComputedStyle(resizer).width);
		var difference = event.clientX-resize_start;
		var new_width = ((parseInt(editor_width)+difference)/workspace_width)*100;
		editor.style.width	= new_width + "%";

		preview.style.width	= "calc(100% - "+editor.style.width+")";
	}
},false);



var preview_frame = document.querySelector("iframe.preview");
preview_doc = preview_frame.contentDocument || preview_frame.contentWindow.document;
document.querySelector("#download_button").addEventListener("click",function(){save_code_as();},false);
window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
document.querySelector(".menu input[type=file]").onchange = upload_files;
document.querySelector("input[type=reset]").onclick = reset_codeareas;
get_functionality();
resize_code_boxes();
show_preview();

catch_save_functions();

catch_query_strings();

},false);

function catch_query_strings(){

	if(get_query_variable("html")){document.querySelector(".code_area.html").value = get_query_variable("html");}
	if(get_query_variable("js")){document.querySelector(".code_area.js").value = get_query_variable("js");}
	if(get_query_variable("css")){document.querySelector(".code_area.css").value = get_query_variable("css");}
	history.pushState(null,null,document.location.origin+document.location.pathname);
	show_preview();
}


//ref:http://css-tricks.com/snippets/javascript/get-url-variables/
function get_query_variable(variable)
{
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
}

function catch_save_functions()
{
	document.addEventListener("keydown", function(e)
{
	if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey))
	{
		e.preventDefault();
		save_code_as();
		document.querySelector("#download_button").click();
	}
}, false);
}

function reset_codeareas(){
	for(var i=0; i<document.querySelectorAll(".code_area").length; i++){
		document.querySelectorAll(".code_area")[i].value = '';
	}
	show_preview();
}

function upload_files(){
	console.log("here");
	var files = this.files;
	window.requestFileSystem(window.TEMPORARY, 1024*1024, function(fs) {
		for (var i = 0, file; file = files[i]; ++i) {
			document.querySelector("#download_button").download = document.querySelector("header input[type=text]");
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

function save_code_as()
{
	var data = 'data:application/xml;charset=utf-8,' + encodeURIComponent(get_preview_code());
	document.querySelector("#download_button").download = document.querySelector("header input[type=text]").value;
	document.querySelector("#download_button").href = data;
}

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

function show_preview()
{
	console.clear();

	//document.querySelector("#workspace").dataset.loading = true;
	preview_doc.open();
	preview_doc.write(get_preview_code());
	preview_doc.close();
	//workspace.dataset.loading = false;
}

function get_html_code(){
	return document.querySelector(".code_area.html").value;
}

function get_js_code(){return document.querySelector(".code_area.js").value;}

function get_css_code(){return document.querySelector(".code_area.css").value;}

function get_preview_code()
{
	var html = '<html>\n';
	html += "<head>\n";
	html += "<title>"+document.querySelector("header input").value + "</title>\n";
	html += "<style>"+get_css_code()+"</style>";
	html += "<script>"+get_js_code()+"</script>";
	html += "</head>\n";
	html += "<body>\n\n";
	html += get_html_code();
	html += "\n\n</body>\n";
	html += "</html>";
	return html;
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

function local_functionality_notice(){alert("Only available online","test");}

/*function export_to_codepen(){
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
		"title":"Nexus Prototype Export",
		"html":get_html_code(),
		"css":get_css_code(),
		"js":get_js_code()
	}
	data.value = JSON.stringify(data_obj).replace(/"/g, "&quot;").replace(/'/g,"&apos;");

	form.submit();
}*/

//function generate_prototype_share_url(){
	//return document.location.href + "?html="+encodeURIComponent(get_html_code())+ "&css=" +encodeURIComponent(get_css_code()) + "&js=" + encodeURIComponent(get_js_code());
//}
