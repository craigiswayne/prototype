<?php
	$min_prefix = $uikit_path_prefix = $font_awesome_path_prefix = $jquery_path_prefix = $jquery_cookie_path_prefix = NULL;
	
	/**
	 * Run from commandline
	 */
	if ( PHP_SAPI !== 'fpm-fcgi' ) {
		$min_prefix                = '.min';
		$uikit_path_prefix         = 'https://cdnjs.cloudflare.com/ajax/libs/uikit/2.27.4/css';
		$font_awesome_path_prefix  = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css';
		$jquery_path_prefix        = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1';
		$jquery_cookie_path_prefix = 'https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1';
		$ace_builds_path_prefix    = 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.9';
	} else {
		$min_prefix                = '';
		$uikit_path_prefix         = '/node_modules/uikit/dist/css';
		$font_awesome_path_prefix  = '/node_modules/font-awesome/css';
		$jquery_path_prefix        = '/node_modules/jquery/dist';
		$jquery_cookie_path_prefix = '/node_modules/jquery.cookie';
		$ace_builds_path_prefix    = '/node_modules/ace-builds/src-min';
	}
?>
<!doctype html>
<html class="uk-height-1-1 uk-width uk-display-block uk-padding-remove">
<head>
    <meta charset="utf-8">
    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="#215A6D" />
    <meta name="viewport" content="user-scalable=0, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height" />
    <title>Prototype</title>
    <link rel="icon" type="image/png" href="/assets/images/nexus_prototype.png" />
    <link rel="stylesheet" href="/assets/css/style<?php echo $min_prefix; ?>.css" />
    <link rel="stylesheet" href="<?php echo $uikit_path_prefix; ?>/uikit<?php echo $min_prefix; ?>.css" />
    <link rel="stylesheet" href="<?php echo $font_awesome_path_prefix; ?>/font-awesome<?php echo $min_prefix; ?>.css" />
</head>

<body class="uk-height-1-1 uk-width initializing">
<header class="no_select uk-position-fixed uk-width uk-position-top-left uk-padding-remove">
    <a id="main_menu_toggle" class="fa fa-bars action uk-text-center uk-padding-remove"></a>
    <label id="app_name">Prototype</label>
    <input id="filename" type="text" value="prototype.html" class="uk-position-absolute uk-text-center" />
</header>

<form id="main" class="uk-flex flex box uk-width uk-height-1-1 uk-text-truncate">

    <nav id="main_menu" class="uk-height-1-1 uk-position-relative menu accordion uk-text-left uk-display-block uk-height-1-1 uk-margin-remove">

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
        <div id="code_boxes_container" class="uk-width-1-2 uk-height-1-1 uk-position-relative uk-display-inline-block uk-float-left">
            <div id="resize_bar" class="no_select uk-height-1-1 uk-position-absolute uk-position-top-right uk-flex uk-flex-middle uk-flex-center uk-flex-column uk-flex-space-between">
                <span id="btn_editor_min" class="fa fa-step-backward"></span>
                <span class="fa fa-ellipsis-v"></span>
                <span id="btn_editor_max" class="fa fa-step-forward"></span>
            </div>
        </div>
        <div id="preview_container" class="uk-width-1-2 uk-height-1-1 uk-position-relative uk-display-inline-block uk-float-left">
            <div id="preview_mask" class="uk-position-absolute uk-position-top-left uk-width uk-height-1-1"></div>
            <iframe class="preview uk-width uk-height-1-1" src="/preview.html" sandbox="allow-same-origin allow-scripts allow-popups allow-forms"></iframe>
            <div id="grid uk-position-absolute uk-width uk-height-1-1 uk-position-top-left">
                <iframe src="/grid.html"></iframe>
                <div id="grid_mask"></div>
            </div>
        </div>

    </div>

    <div class="menu uk-height-1-1 uk-display-block uk-position-relative uk-text-left" id="share_menu">
        <a class="fa fa-codepen" id="export_codepen">CodePen</a>
        <a href="mailto:?subject=" target="_blank" class="fa fa-envelope-o" id="export_email">Email</a>
    </div>
</form>
<script src="<?php echo $jquery_path_prefix; ?>/jquery<?php echo $min_prefix; ?>.js"></script>
<script src="<?php echo $jquery_cookie_path_prefix; ?>/jquery.cookie<?php echo $min_prefix; ?>.js"></script>
<script src="<?php echo $ace_builds_path_prefix; ?>/ace.js"></script>
<script src="/assets/js/script.js"></script>
</body>
</html>
