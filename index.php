<!doctype html>
<html class="uk-height-1-1 uk-width uk-display-block uk-padding-remove">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="user-scalable=0, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height">
    <title>Prototype</title>
    <link rel="icon" type="image/png" href="nexus_prototype.png"/>
    <link rel="stylesheet" href="assets/css/style.css"/>
    <link rel="stylesheet" href="node_modules/uikit/dist/css/uikit.css"/>
    <link rel="stylesheet" href="node_modules/font-awesome/css/font-awesome.min.css"/>
</head>

<body class="uk-height-1-1 initializing">
<header class="no_select uk-position-fixed uk-width uk-position-top-left uk-padding-remove">
    <a id="main_menu_toggle" class="fa fa-bars action uk-text-center uk-padding-remove"></a>
    <label id="app_name">Prototype</label>
    <input id=filename type=text value="prototype.html" class="uk-position-absolute uk-text-center"/>
    <div id="quick_actions" class="uk-position-absolute uk-position-top-right">
        <a id="toggle_grid" class="fa fa-table action uk-text-center uk-padding-remove"></a>
        <a id="share_menu_toggle" class="fa fa-share action uk-text-center uk-padding-remove"></a>
    </div>

</header>

<form id="main" class="uk-flex flex box uk-width uk-height-1-1 uk-text-truncate">

    <nav id="main_menu" class="uk-height-1-1 uk-position-relative menu accordion">

        <ul>File
            <label class="fa fa-folder-open">Open<input id="open_btn" type="file" style="display:none;" accept=".html,.css,.js"></label>
            <a id="import_btn" class="nexus fa fa-cloud-download disabled">Import</a>
            <a class="fa fa-save" id="download_btn" href="" download>Save</a>
            <a class="fa fa-share" id="share_btn">Share</a>
            <span class="fa fa-eraser reset">Reset</span>
        </ul>

        <ul><span class="fa fa-wrench">Toolbox</span>
            <a id="color_converter_btn" class="fa fa-paint-brush">Color Converter</a>
            <a id="base64_encoder_btn">Base64 Encoder</a>
            <a id="lorem_ipsum_generator_btn">Lorem Ipsum Generator</a>
        </ul>

        <span class="fa fa-cog" id="settings_btn">Settings</span>

        <a class="fa fa-question">Help</a>

        <a href="http://www.github.com/craigiswayne" class="fa fa-github" target="_blank">Github</a>

        <a id="about_btn" class="fa fa-info">About</a>

    </nav>

    <div id="workspace" class="uk-flex-item-1 fill uk-height-1-1 uk-position-relative">
        <div id="code_boxes_container">
            <div id="resize_bar" class="no_select">
                <span id="btn_editor_min" class="fa fa-step-backward"></span><span class="fa fa-ellipsis-v"></span><span id="btn_editor_max" class="fa fa-step-forward"></span>
            </div>
        </div>
        <div id="preview_container">
            <div id="preview_mask"></div>
            <iframe class="preview uk-width uk-height-1-1" src="preview.html" sandbox="allow-same-origin allow-scripts allow-popups allow-forms"></iframe>
            <div id="grid uk-position-absolute uk-width uk-height-1-1 uk-position-top-left">
                <iframe src="grid.html"></iframe>
                <div id="grid_mask"></div>
            </div>
        </div>

    </div>

    <div class="menu" id="share_menu">
        <a class="fa fa-codepen" id="export_codepen">CodePen</a>
        <a href="mailto:?subject=" target="_blank" class="fa fa-envelope-o" id="export_email">Email</a>
    </div>
</form>
<script src="assets/js/nexus.js"></script>
<script src="node_modules/jquery/dist/jquery.min.js"></script>
<script src="node_modules/jquery.cookie/jquery.cookie.js"></script>
<script src="node_modules/ace-builds/src-min/ace.js"></script>
<script src="assets/js/nexus_prototype.js"></script>
</body>
</html>
