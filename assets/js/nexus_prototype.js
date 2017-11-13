if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/assets/js/sw.js').then(function (registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function (err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

nexus.prototype = {
    mask: null,
    form: null,
    code_boxes: [],
    workspace: null,
    code_boxes_container: null,
    preview_container: null,
    preview_frame: null,
    resize_bar: null,
    interface: null,

    catch_save: function () {
        document.addEventListener("keydown", function (e) {
            if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
                e.preventDefault();
                nexus.prototype.save();
                document.querySelector("#download_btn").click();
            }
        }, false);
    },

    catch_open: function () {
        document.addEventListener("keydown", function (e) {
            if (e.keyCode == 79 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
                e.preventDefault();
                document.querySelector("#open_btn").click();
            }
        }, false);
    },

    code_box: function (language) {

        language = language || "html";

        var code_box = document.createElement("div");
        code_box.language = language;
        code_box.className = "code_box uk-overflow-hidden uk-display-block uk-position-relative uk-width uk-margin-remove no_select " + language;

        var code_box_header = code_box.appendChild(document.createElement("label"));
        code_box_header.className = "code_box_header uk-overflow-hidden uk-width uk-display-inline-block uk-position-absolute uk-position-top-left no_select action";

        var code_box_title = code_box_header.appendChild(document.createElement("span"));
        code_box_title.className = "code_box_title";
        code_box_title.innerHTML = language;

        var code_box_toggler = code_box_header.appendChild(document.createElement("input"));
        code_box_toggler.type = "checkbox";
        code_box_toggler.className = "code_box_toggler nexus";
        code_box_toggler.checked = "checked";
        code_box_toggler.onchange = nexus.prototype.resize_code_boxes;

        var code_area = code_box.appendChild(document.createElement("div"));
        code_area.className = "code_area uk-overflow-container uk-width uk-display-block uk-height-1-1";
        code_box.editor = ace.edit(code_area); //http://ace.c9.io/api/editor.html
        code_box.editor.$blockScrolling = Infinity
        code_box.editor.setValue(nexus.prototype.settings.editors.languages[language].default_value || "");
        code_box.editor.setTheme(nexus.prototype.settings.editors.theme);
        code_box.editor.on("change", nexus.prototype.show_preview);

        code_box.editor.setShowPrintMargin(false);
        code_box.editor.setDisplayIndentGuides(nexus.prototype.settings.editors.show_indent_guides);
        code_box.editor.getSession().setMode(nexus.prototype.settings.editors.languages[language].session || "ace/mode/" + language);


        code_box.value = function () {
            return this.editor.getValue()
        };
        code_box.focus = function () {
            this.editor.focus()
        };
        code_box.set_value = function (value) {
            this.editor.setValue(value, -1);
        };
        code_box.refresh = function (ed) {
            this.editor.resize();
        };
        code_box.collapse = function () {
            this.querySelector(".code_box_toggler").checked = false;
            nexus.prototype.resize_code_boxes();
        };
        code_box.expand = function () {
            this.querySelector(".code_box_toggler").checked = true;
            nexus.prototype.resize_code_boxes();
        };
        code_box.toggle = nexus.prototype.resize_code_boxes;

        nexus.prototype.code_boxes.push(code_box);

        return code_box;

    },

    construct: function () {

        //construct menu
        var menu_tree = {
            "file": {
                "open": {

                    "hello": {}
                },
                "import": {},
                "save": {},
                "share": {},
                "reset": {}
            },
            "settings": {},
            "help": {},
            "github": {},
            "about": {}
        };

        nexus.prototype.mask = document.body.appendChild(document.createElement("div"));
        nexus.prototype.mask.id = "mask";
        nexus.prototype.mask.className = "nexus mask uk-position-absolute uk-position-top-left uk-width uk-height-1-1";
        nexus.prototype.mask.onclick = nexus.prototype.hide_all_menus;
    },

    get_preview_code: function () {
        var preview_code = "";
        for (var i = 0; i < nexus.prototype.code_boxes.length; i++) {
            var code_box = nexus.prototype.code_boxes[i];
            if (code_box.editor.getValue().trim() == "") {
                continue;
            }
            preview_code += "\n<" + nexus.prototype.settings.editors.languages[code_box.language].tag + " id='nexus_prototype_preview_" + code_box.language + "' >\n" + code_box.editor.getValue() + "\n</" + nexus.prototype.settings.editors.languages[code_box.language].tag + ">\n";
        }
        return preview_code;
    },

    has_user_code: function () {

        for (var i = 0; i < nexus.prototype.code_boxes.length; i++) {
            if (nexus.prototype.code_boxes[i].value() != "") {
                return true;
            }
        }

        return false;
    },

    local_functionality_notice: function () {
    },

    toggle_main_menu: function () {
        $('#main_menu_toggle').toggleClass('fa-bars fa-times');
        document.querySelector("#share_menu_toggle").className = "fa fa-share action";
        $('#main_menu').toggleClass('active');
        $('#share_menu').removeClass('active');
        if (document.querySelector("#main_menu_toggle.fa-times")) {
            nexus.show_mask();
        } else {
            nexus.hide_mask();
        }
    },

    toggle_share_menu: function () {

        document.querySelector("#main_menu_toggle").className = "fa fa-bars action uk-text-center uk-padding-remove";
        $('#share_menu').toggleClass('active');
        $('#main_menu').removeClass('active');
        $('#share_menu_toggle').toggleClass('fa-share fa-times');
        if (document.querySelector("#share_menu_toggle.fa-times")) {
            nexus.show_mask();
        } else {
            nexus.hide_mask();
        }

    },

    editor_width_min: function () {
        nexus.prototype.code_boxes_container.style.width = '0';
        preview.style.width = "calc(100% - " + nexus.prototype.code_boxes_container.style.width + ")";
    },

    editor_width_max: function () {
        nexus.prototype.code_boxes_container.style.width = '100%';
        preview.style.width = "calc(100% - " + nexus.prototype.code_boxes_container.style.width + ")";
    },

    get_functionality: function () {
        var upload_button = document.querySelector("#open_btn");
        var codepen_export_button = document.querySelector("#export_codepen");
        if (!document.domain) {
            codepen_export_button.addEventListener("click", nexus.prototype.local_functionality_notice, false);
            upload_button.type = "button";
            upload_button.addEventListener("click", nexus.prototype.local_functionality_notice, false);
        } else {
            codepen_export_button.addEventListener("click", nexus.prototype.export_to_codepen, false);
        }

        if (nexus.prototype.interface == "chrome_app") {
        }
        else {
            window.onbeforeunload = function () {
                return "All your work will be erased!";
            }
        }

        if (nexus.prototype.interface == "chrome_app") {
            nexus.link("nexus.prototype_chrome_app.css");
        }


    },

    refresh_code_boxes: function () {
        for (var i = 0; i < nexus.prototype.code_boxes.length; i++) {
            nexus.prototype.code_boxes[i].refresh();
        }
    },

    reset: function () {
        nexus.prototype.set_filename("prototype.html");
        for (var i = 0; i < nexus.prototype.code_boxes.length; i++) {
            nexus.prototype.code_boxes[i].set_value("");
            nexus.prototype.code_boxes[i].querySelector('.code_box_toggler').setAttribute("checked", "checked");
        }

        nexus.prototype.hide_all_menus();
        nexus.prototype.resize_code_boxes();
        nexus.prototype.code_boxes_container.removeAttribute("style");
        nexus.prototype.preview_container.removeAttribute("style");
        nexus.hide_mask(true);
    },

    resize_code_boxes: function () {
        var showing_code_boxes = new Array();
        for (var i = 0; i < nexus.prototype.code_boxes.length; i++) {
            if (!nexus.prototype.code_boxes[i].querySelector(".code_box_toggler").checked) {
                nexus.prototype.code_boxes[i].style.height = "";
            } else {
                showing_code_boxes.push(nexus.prototype.code_boxes[i]);
            }
        }
        var not_showing = nexus.prototype.code_boxes.length - showing_code_boxes.length;
        for (var i = 0; i < showing_code_boxes.length; i++) {
            showing_code_boxes[i].style.height = "calc((100% - 25px*" + not_showing + ")/" + showing_code_boxes.length + ")";

            setTimeout(function (code_box) {
                code_box.refresh();
            }, 300, showing_code_boxes[i]);
        }
    },

    show_settings: function () {
        nexus.prototype.hide_all_menus();
    },

    show_preview: function () {

        nexus.prototype.last_updated = new Date();

        setTimeout(function (event) {
            var now = new Date();
            if (Math.abs((now.getTime() - nexus.prototype.last_updated.getTime()) / 1000) < nexus.prototype.settings.preview_delay) return;

            console.clear();
            if (nexus.prototype.interface == "chrome_app") {

                for (var i = 0, code_box = null; i < nexus.prototype.code_boxes.length; i++) {
                    code_box = nexus.prototype.code_boxes[i];
                }
                chrome.storage.local.set({"preview": nexus.prototype.get_preview_code()});

            } else {
                var tmp_preview = nexus.prototype.preview_frame;
                var tmp_preview_doc = tmp_preview.contentDocument || tmp_preview.contentWindow.document;
                tmp_preview_doc.open();
                tmp_preview_doc.write(nexus.prototype.get_preview_code());
                tmp_preview_doc.close();
            }

        }, (nexus.prototype.settings.preview_delay * 1000), event);
    },

    hide_all_menus: function () {
        $("#main_menu").removeClass('active');
        $("#share_menu").removeClass('active');
        document.querySelector("#main_menu_toggle").className = "fa fa-bars action uk-text-center uk-padding-remove";
        document.querySelector("#share_menu_toggle").className = "fa fa-share action";
        nexus.hide_mask();
    },

    set_filename: function (name) {
        document.querySelector("#filename").value = name;
    },

    get_filename: function () {
        var filename = document.querySelector("#filename").value;
        return filename;
    },

    save: function () {
        var data = 'data:application/xml;charset=utf-8,' + encodeURIComponent(nexus.prototype.get_preview_code());
        document.querySelector("#download_btn").download = nexus.prototype.get_filename();
        document.querySelector("#download_btn").href = data;
    },

    editor_width: null,

    resize_start: null,

    init_resize_functionality: function () {

        nexus.prototype.resize_bar.addEventListener("mousedown", function (event) {
            $(document.body).addClass("resizing");
            nexus.prototype.resize_start = event.clientX;
            nexus.prototype.editor_width = parseInt(window.getComputedStyle(nexus.prototype.code_boxes_container).width);
        }, false);

        nexus.prototype.resize_bar.addEventListener("contextmenu", function () {
            $(document.body).removeClass("resizing");
        }, false);

        //dont need this, just check if the src element is the resizer
        document.addEventListener("mouseup", function () {
            if ($(document.body).hasClass("resizing")) {
                $(document.body).removeClass("resizing");
                nexus.prototype.refresh_code_boxes();
            }
        }, false);

        document.addEventListener("mousemove", function (event) {
            //NOTE: the new_width is a percentage of the container not in pixels (px)

            if (document.querySelector("body.resizing")) {
                var workspace_width = parseInt(window.getComputedStyle(nexus.prototype.workspace).width);
                var difference = event.clientX - nexus.prototype.resize_start;
                var new_width = ((nexus.prototype.editor_width + difference) / workspace_width) * 100;
                nexus.prototype.code_boxes_container.style.width = new_width + "%";
                nexus.prototype.preview_container.style.width = "calc(100% - " + nexus.prototype.code_boxes_container.style.width + ")";
            }
        }, false);
    },

    init: function () {

        nexus.prototype.construct();

        new nexus.dropzone(document.querySelector("html"));

        var mask = new nexus.dropzone(document.querySelector(".mask"), {
            "accept": ["js", "css", "html"], //TODO make this dynamic
            "ondrop": function (file) {
                document.querySelector("html").remove_drag_states();
                nexus.prototype.import(file);
            },
            "ondragenter": nexus.prototype.hide_all_menus
        });


        ace.require("ace/ext/language_tools");
        if (chrome) {
            if (chrome.storage) nexus.prototype.interface = "chrome_app";
        }

        nexus.prototype.code_boxes_container = document.querySelector("#code_boxes_container");
        nexus.prototype.preview_container = document.querySelector("#preview_container");
        nexus.prototype.preview_frame = nexus.prototype.preview_container.querySelector("iframe");
        nexus.prototype.resize_bar = document.querySelector("#resize_bar");
        nexus.prototype.workspace = document.querySelector("#workspace");

        //add code_boxes //todo make this better man
        for (var i = 0; i < nexus.prototype.settings.editors.default.length; i++) {
            nexus.prototype.code_boxes_container.appendChild(new nexus.prototype.code_box(nexus.prototype.settings.editors.default[i]));
        }
        nexus.prototype.code_boxes[0].editor.focus();

        document.querySelector(".reset").addEventListener("click", nexus.prototype.reset, false);
        document.querySelector("#export_codepen").addEventListener("click", nexus.prototype.export_to_codepen, false);
        document.querySelector("#download_btn").addEventListener("click", nexus.prototype.save, false);
        document.querySelector("#main_menu_toggle").addEventListener("click", nexus.prototype.toggle_main_menu, false);
        document.querySelector("#share_menu_toggle").addEventListener("click", nexus.prototype.toggle_share_menu, false);
        document.querySelector("#btn_editor_min").addEventListener("click", nexus.prototype.editor_width_min, false);
        document.querySelector("#btn_editor_max").addEventListener("click", nexus.prototype.editor_width_max, false);

        nexus.prototype.catch_save();
        nexus.prototype.catch_open();
        document.querySelector("#open_btn").onchange = nexus.prototype.open;
        document.querySelector("#share_btn").addEventListener("click", nexus.prototype.toggle_share_menu, false);
        document.querySelector("#settings_btn").addEventListener("click", nexus.prototype.show_settings, false);

        document.querySelector("#toggle_grid").addEventListener("click", function () {
            $(document.body).toggleClass("grid");
        }, false);

        nexus.prototype.code_boxes = document.querySelectorAll(".code_box");
        nexus.prototype.form = document.querySelector("#main");
        nexus.prototype.init_resize_functionality();
        nexus.prototype.get_functionality();
        nexus.prototype.resize_code_boxes();
        $(document.body).removeClass("initializing");
    },
    settings: {
        save: function () {
            nexus.prototype.settings.preview_delay = document.querySelector("[name=preview_delay]") ? parseInt(document.querySelector("[name=preview_delay]").value) : 0;
        },
        editors: {
            languages: {
                js: {
                    tag: "script",
                    session: "ace/mode/javascript",
                    media_type: "application/javascript"

                },
                css: {
                    tag: "style",
                    session: "ace/mode/css",
                    media_type: "text/css"
                },
                html: {
                    tag: "body",
                    session: "ace/mode/html",
                    media_type: "text/html"
                }
            },
            show_indent_guides: true,
            theme: "ace/theme/chrome",
            default: ["html", "css", "js"]
        },

        include_jquery: false,
        include_font_awesome: false,

        preview_time: 0,
        update: function () {
            console.debug("settings updated");
            nexus.prototype.settings.include_jquery = document.querySelector("input[type=checkbox][name=include_jquery]").checked

        }
    },
};

document.addEventListener("DOMContentLoaded", function () {
    nexus.prototype.init();
}, false);
