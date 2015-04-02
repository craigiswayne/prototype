	
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
	
