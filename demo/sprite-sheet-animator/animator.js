var image_element = document.getElementById("image");
var image_file_width = 0;
var image_file_height = 0;
var sheet_sprite_count_x;
var sheet_sprite_width;
var sheet_sprite_height;
var frame_index_current = 0;
var frame_index_start = 0;
var frame_index_count;
var frame_time_total;
var frame_time_current = 0;
var frame_step = 0;
var zoom_factor;
var sheet_padding_top = 0;
var sheet_padding_bottom = 0;
var sheet_padding_left = 0;
var sheet_padding_right = 0;
var sheet_spacing_vertical = 0;
var sheet_spacing_horizontal = 0;
var canvas = document.getElementById("imgCanvas");
var canvas_context = canvas.getContext("2d");
var image_background_color = "white";
var border_bool = true;
var image_src = "";
var ui_slider = true;
var ui_framenum = true;
var ui_framecontrols = true;
var gif_loop = true;
var gif_quality = 1;
var gif_show = true;

function Debug(msg)
{
    $("#debug").append(msg+"<br/>");
}
function Update()
{   
    if (!image.src || frame_step == 0)
        return;
    frame_time_current -= 16;
    if (frame_time_current <= 0)
    {
        frame_time_current += parseInt(frame_time_total);
        frame_index_current += frame_step;
        if (frame_index_current >= frame_index_count)
            frame_index_current = 0;
        else if (frame_index_current < 0)
            frame_index_current = frame_index_count - 1;        
        $("#frameSlider").slider('value',frame_index_current + 1); //update slider

        UpdateSprite();
    }
}
function UpdateSprite()
{
    // frame_index_current = 0 based index
    var x = (frame_index_start + frame_index_current) % sheet_sprite_count_x;
    var y = parseInt((frame_index_start + frame_index_current) / sheet_sprite_count_x);

    // sprite position on sheet in pixels
    var spritePosX = x * sheet_sprite_width + sheet_padding_left + x * sheet_spacing_horizontal;
    var spritePosY =  y * sheet_sprite_height + sheet_padding_top + y * sheet_spacing_vertical;

    $("#imgInfo").text("Frame: "+(frame_index_current + frame_index_start + 1));

    canvas_context.clearRect(0, 0, canvas.width, canvas.height);
    
    canvas_context.imageSmoothingEnabled = false;
    canvas_context.webkitImageSmoothingEnabled = false;
    canvas_context.mozImageSmoothingEnabled = false;
    canvas_context.fillStyle = image_background_color;
    canvas_context.fillRect(0, 0, canvas.width, canvas.height);
    canvas_context.drawImage(image_element, spritePosX, spritePosY, sheet_sprite_width, sheet_sprite_height, 0, 0, sheet_sprite_width * zoom_factor, sheet_sprite_height * zoom_factor);
}

function LoadImageFromDisk(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#image').attr('src', e.target.result);
            $('#imgsrc').val(encodeURIComponent(e.target.result));
            UpdateCanvasSize();
            SetFrameStep(1);
        };
        reader.readAsDataURL(input.files[0]);  
    }
}
function UpdateCanvasSize()
{    
    var wMinusPadL = image_file_width - sheet_padding_left;
    sheet_sprite_count_x = Math.floor(wMinusPadL / (sheet_sprite_width + sheet_spacing_horizontal));
    sheet_padding_right = wMinusPadL - sheet_sprite_count_x * sheet_sprite_width - (sheet_sprite_count_x - 1) * sheet_spacing_horizontal;
    if (sheet_padding_right >= sheet_sprite_width + sheet_spacing_horizontal)
    {
        sheet_sprite_count_x = sheet_sprite_count_x + 1;
        sheet_padding_right = sheet_padding_right - sheet_sprite_width - sheet_spacing_horizontal;
    }

    $("#imgCanvas").attr("width", sheet_sprite_width * zoom_factor);
    $("#imgCanvas").attr("height", sheet_sprite_height * zoom_factor);    

    UpdateSprite();
}
function SetFrameStep(step)
{
    frame_step = step;
    $("#frameStop").css("border","0px solid black"); 
    $("#framePlayForward").css("border","0px solid black"); 
    $("#framePlayBack").css("border","0px solid black"); 
    if(step == 0)
        $("#frameStop").css("border","2px solid black");
    else if (step > 0)
        $("#framePlayForward").css("border","2px solid black"); 
    else        
        $("#framePlayBack").css("border","2px solid black"); 
}
function SaveSettings()
{           
    localStorage["img"] =  encodeURIComponent($("#image").attr("src"));
    localStorage["sW"] = sheet_sprite_width;
    localStorage["sH"] = sheet_sprite_height;
    localStorage["fC"] = frame_index_count;
    localStorage["fT"] = frame_time_total;
    localStorage["c"] = image_background_color;
    localStorage["zoom"] = zoom_factor;
    localStorage["fS"] = frame_index_start;
    localStorage["pT"] = sheet_padding_top;
    localStorage["pL"] = sheet_padding_left;
    localStorage["spH"] = sheet_spacing_horizontal;
    localStorage["spV"] = sheet_spacing_vertical;
    localStorage["b"] = $("#border").is(':checked');
    localStorage["uiS"] = $("#uiSlider").is(':checked');
    localStorage["uiFN"] = $("#uiFrameNum").is(':checked');
    localStorage["uiFC"] = $("#uiFrameControls").is(':checked');
    localStorage["gifLoop"] = gif_loop;
    localStorage["gifShow"] = gif_show;
    localStorage["gifQuality"] = gif_quality;
}
function ReadSettings()
{      
    if (localStorage.getItem("img") != null)
        image_src = decodeURIComponent(localStorage["img"]);
    if (localStorage.getItem("sW") != null)
        sheet_sprite_width = parseInt(localStorage["sW"]); 
    if (localStorage.getItem("sH") != null) 
        sheet_sprite_height = parseInt(localStorage["sH"]);
    if (localStorage.getItem("fC") != null)
        frame_index_count = parseInt(localStorage["fC"]);
    if (localStorage.getItem("fT") != null)
        frame_time_total = parseInt(localStorage["fT"]);
    if (localStorage.getItem("c") != null)
        image_background_color = localStorage["c"];
    if (localStorage.getItem("zoom") != null)
        zoom_factor = parseInt(localStorage["zoom"]);
    if (localStorage.getItem("fS") != null)
        frame_index_start = parseInt(localStorage["fS"]);
    if (localStorage.getItem("pT") != null)
        sheet_padding_top = parseInt(localStorage["pT"]);
    if (localStorage.getItem("pL") != null)
        sheet_padding_left = parseInt(localStorage["pL"]);
    if (localStorage.getItem("spH") != null)
        sheet_spacing_horizontal = parseInt(localStorage["spH"]);
    if (localStorage.getItem("spV") != null)
        sheet_spacing_vertical = parseInt(localStorage["spV"]);
    if (localStorage.getItem("b") != null)
        border_bool = (localStorage["b"] == 'true');
    if (localStorage.getItem("uiS") != null)
        ui_slider = (localStorage["uiS"] == 'true');
    if (localStorage.getItem("uiFN") != null)
        ui_framenum = (localStorage["uiFN"] == 'true');
    if (localStorage.getItem("uiFC") != null)
        ui_framecontrols = (localStorage["uiFC"] == 'true');
    if (localStorage.getItem("gifLoop") != null)
        gif_loop = (localStorage["gifLoop"] == 'true');
    if (localStorage.getItem("gifShow") != null)
        gif_show = (localStorage["gifShow"] == 'true');
    if (localStorage.getItem("gifQuality") != null)
        gif_quality = parseInt(localStorage["gifQuality"]);

    // if there are url passed values they should take precedence
    var PageURL = window.location.search.substring(1);
    var URLVariables = PageURL.split('&');
    for (var i = 0; i < URLVariables.length; i++)
    {
        var ParameterName = URLVariables[i].split('=');
        switch (ParameterName[0])
        {
            case "img":
                image_src = ParameterName[1];
                break;
            case "sW":
                sheet_sprite_width = parseInt(ParameterName[1]);
                break;
            case "sH":
                sheet_sprite_height = parseInt(ParameterName[1]);
                break;
            case "fT":
                frame_time_total = parseInt(ParameterName[1]);
                break;
            case "fC":
                frame_index_count = parseInt(ParameterName[1]);
                break;
            case "fS":
                frame_index_start = parseInt(ParameterName[1]); 
                break;
            case "zoom":
                zoom_factor = parseInt(ParameterName[1]);
                break;
            case "pT":
                sheet_padding_top = parseInt(ParameterName[1]);
                break;
            case "pL":
                sheet_padding_left = parseInt(ParameterName[1]);
                break;
            case "spH":
                sheet_spacing_horizontal = parseInt(ParameterName[1]);
                break;        
            case "spV":
                sheet_spacing_vertical = parseInt(ParameterName[1]);
                break;
            case "c":
                image_background_color = ParameterName[1];
                break;
            case "b":
                border_bool = (ParameterName[1] == 'true'); 
                break;
           /* case "gL":
                gif_loop = (ParameterName[1] == 'true'); 
                break;            
            case "gS":
                gif_show = (ParameterName[1] == 'true'); 
                break;            
            case "gQ":
                gif_quality = parseInt(ParameterName[1]);
                break;*/
        }	
    }      
}
function AssignSettings()
{
    $("#spriteW").val(sheet_sprite_width);
    $("#spriteH").val(sheet_sprite_height);
    $("#frameTime").val(frame_time_total);
    $("#frameCount").val(frame_index_count);
    $("#frameStart").val(frame_index_start + 1); // 0 based index (logic) to 1 based index (UI) 
    $("#zoom").val(zoom_factor);
    $("#padTop").val(sheet_padding_top);
    $("#padLeft").val(sheet_padding_left);
    $("#spacingHor").val(sheet_spacing_horizontal);
    $("#spacingVer").val(sheet_spacing_vertical);
    $("#color").val(image_background_color);
    $("#border").prop("checked", border_bool);  
    $("#uiSlider").prop("checked", ui_slider);  
    $("#uiFrameNum").prop("checked", ui_framenum);  
    $("#uiFrameControls").prop("checked", ui_framecontrols);  
    $("#gifloop").prop("checked", gif_loop);  
    $("#gifshow").prop("checked", gif_show);   
    $("#gifquality").val(gif_quality); 
    
    if (!ui_slider)
        $("#frameSlider").css("display","none");
    if (!ui_framenum)
        $("#imgInfo").css("display","none");
    if (!ui_framecontrols)
        $("#frameControls").css("display","none");
    if (!gif_show)        
        $("#gifimg").css("display","none");
                     
    if (!border_bool)             
        canvas.style.border = "0px";
    if (image_background_color == "")
        image_background_color = "white";
    $("#image").attr("src", decodeURIComponent(image_src)); 
    if (image_src != "")
        SetFrameStep(1);
    UpdateCanvasSize();	
    UpdateSprite(); 
}
function GenerateGif()
{
    var encoder = new GIFEncoder(); 
    if (gif_loop)
        encoder.setRepeat(0);  //0 - loop forever   n - loop n times then stop
    else
        encoder.setRepeat(1);
    encoder.setDelay(frame_time_total); 
    encoder.setQuality(gif_quality); //1=best  
    
    var curframe = frame_index_current; 
    encoder.start();
    for (var i = 0; i < frame_index_count; i++)
    {
        frame_index_current = i;
        UpdateSprite();
        encoder.addFrame(canvas_context);
    }
    encoder.finish();    
    frame_index_current = curframe;
    UpdateSprite();

    var binary_gif = encoder.stream().getData();  
    var data_url = 'data:image/gif;base64,'+encode64(binary_gif);
    var gifimgel = document.getElementById("gifimg");
    gifimgel.src = data_url;
    encoder.download("download.gif");
}


$(document).ready(function(){	
    // register event functions
    $("#image").load(function(){        
        image_file_width = this.naturalWidth;
        image_file_height = this.naturalHeight;      
        UpdateCanvasSize();
    }); 
    $("#imgInp").change(function()
    {
        LoadImageFromDisk(this);
    });
    $("#frameCount").change(function()
    {
        frame_index_count = parseInt($("#frameCount").val()); 
        $("#frameSlider").slider("option", "max", frame_index_count);
    }); 
    $("#frameTime").change(function()
    {
        frame_time_total = parseInt($("#frameTime").val());            
    });
    $("#frameStart").change(function()
    {
        // 1 based index (UI) to 0 based index (logic)
        frame_index_start = parseInt($("#frameStart").val()) - 1;  
        frame_index_current = 0;        
        $("#frameSlider").slider('value',frame_index_current + 1); //update slider
    });
    $("#spriteW").change(function()
    {
        sheet_sprite_width = parseInt($("#spriteW").val()); 
        UpdateCanvasSize();
    });
    $("#spriteH").change(function()
    {
        sheet_sprite_height = parseInt($("#spriteH").val());   
        UpdateCanvasSize(); 
    });
    $("#zoom").change(function()
    {
        zoom_factor = parseInt($("#zoom").val());   
        UpdateCanvasSize();          
    });
    $("#color").change(function()
    {
        image_background_color = $("#color").val();   
        UpdateSprite();
    });    
    $("#padTop").change(function(){
        sheet_padding_top = parseInt($("#padTop").val());
        UpdateCanvasSize();
    });
    $("#padLeft").change(function(){
        sheet_padding_left = parseInt($("#padLeft").val());
        UpdateCanvasSize();
    });
    $("#spacingHor").change(function(){
        sheet_spacing_horizontal = parseInt($("#spacingHor").val());
        UpdateCanvasSize();
    });      
     $("#spacingVer").change(function(){
        sheet_spacing_vertical = parseInt($("#spacingVer").val());
        UpdateCanvasSize();
    });   
    $("#generate").click(function()
    {        
        var link = window.location.href.split('?')[0] + "?sW="+sheet_sprite_width+"&sH="+sheet_sprite_height+"&fC="+frame_index_count+"&fT="+frame_time_total;
        link += "&c="+image_background_color;    
        link += "&zoom="+zoom_factor;     
        link += "&fS="+ (frame_index_start);  
        link += "&pT="+sheet_padding_top;    
        link += "&pL="+sheet_padding_left;   
        link += "&spH="+sheet_spacing_horizontal; 
        link += "&spV="+sheet_spacing_vertical; 
        link += "&b="+$("#border").is(':checked');
        link += "&img="+encodeURIComponent($("#image").attr("src"));       

        //$("#link").text(link).css("border", "1px solid black");
        $("#link").val(link);
        $("#linkarea").css("display", "block");
    });    
    $("#load").click(function()
    {            
        var link = $("#imgUrl").val();   
        $("#image").attr("src", link).load(function(){        
            image_file_width = this.width;
            image_file_height = this.height;          
            UpdateCanvasSize();
            SetFrameStep(1);
        });             
        $('#imgsrc').val(encodeURIComponent(link));
        UpdateSprite();
    });    
    $("#border").click(function()
    {       
        border_bool = $("#border").is(':checked');
        if (border_bool)
            canvas.style.border = "1px solid black";
        else
            canvas.style.border = "0px";
    });   
    $("#frameStepForward").click(function()
    {       
        frame_index_current += 1;
        if (frame_index_current >= frame_index_count)
            frame_index_current = 0;            
        $("#frameSlider").slider('value',frame_index_current + 1); //update slider
        UpdateSprite();    
    });    
    $("#frameStepBack").click(function()
    {       
        frame_index_current -= 1;
        if (frame_index_current < 0)
            frame_index_current = frame_index_count - 1;
        $("#frameSlider").slider('value',frame_index_current + 1); //update slider
        UpdateSprite();    
    });
    $("#frameStop").click(function() { SetFrameStep(0); });
    $("#framePlayForward").click(function() { SetFrameStep(1); });
    $("#framePlayBack").click(function() { SetFrameStep(-1);  });
    $("#save").click(SaveSettings);
    $("#uiSlider").click(function(){
        ui_slider = $("#uiSlider").is(':checked');
        if (ui_slider)
            $("#frameSlider").css("display","");
        else
            $("#frameSlider").css("display","none");
    });
    $("#uiFrameNum").click(function(){
        ui_framenum = $("#uiFrameNum").is(':checked');
        if (ui_framenum)
            $("#imgInfo").css("display","");
        else
            $("#imgInfo").css("display","none");
    });
    $("#uiFrameControls").click(function(){
        ui_framecontrols = $("#uiFrameControls").is(':checked');
        if (ui_framecontrols)
            $("#frameControls").css("display","");
        else
            $("#frameControls").css("display","none");
    });
    $("#copylink").click(function(){
        var l = document.getElementById("link");
        l.select();
        document.execCommand('copy');
    });
    $("#gif").click(function(){
        GenerateGif();
    });   
    $("#gifloop").click(function(){
        gif_loop = $("#gifloop").is(':checked');
    });
    $("#gifshow").click(function(){
        gif_show = $("#gifshow").is(':checked');
        if (gif_show)
            $("#gifimg").css("display","");
        else
            $("#gifimg").css("display","none");
    });        
    $("#gifquality").change(function(){
        gif_quality = parseInt($("#gifquality").val());
    });
 
    // get default variable values from form inputs
    image_src = $("#imgsrc").val();
    image_background_color = $("#color").val();
    border_bool = $("#border").is(":checked");   
    frame_time_total = parseInt($("#frameTime").val());
    frame_index_count = parseInt($("#frameCount").val());
    frame_index_start = parseInt($("#frameStart").val()) - 1; // 1 based index (UI) to 0 based index (logic)
    sheet_sprite_width = parseInt($("#spriteW").val());
    sheet_sprite_height = parseInt($("#spriteH").val());
    zoom_factor = parseInt($("#zoom").val());    
    sheet_padding_top = parseInt($("#padTop").val());  
    sheet_padding_left = parseInt($("#padLeft").val());   
    sheet_spacing_horizontal = parseInt($("#spacingHor").val());
    sheet_spacing_vertical = parseInt($("#spacingVer").val());      
    ui_slider = $("#uiSlider").is(":checked");
    ui_framenum = $("#uiFrameNum").is(":checked");
    ui_framecontrols = $("#uiFrameControls").is(":checked");
    gif_loop = $("#gifloop").is(":checked");
    gif_show = $("#gifshow").is(":checked");
    gif_quality = parseInt($("#gifquality").val());    
    
    // read any saved or url settings
    ReadSettings();

    // apply any settings
    AssignSettings();

    $("#frameSlider").slider({
        value:1,
        min: 1,
        max: frame_index_count,
        step: 1,
        slide: function(event, ui) {
            frame_index_current = ui.value - 1;
            UpdateSprite();
        }
    });
});   