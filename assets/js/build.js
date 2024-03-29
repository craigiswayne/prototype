/*! Prototype - v - 2023-01-19
* Copyright (c) 2023 Craig Wayne; Licensed  */
String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, "");
};
String.prototype.extension = function () {
    var string = this.trim();
    var extension = null;
    if (string.lastIndexOf(".") > -1) {
        if (string.length > string.lastIndexOf(".") + 1) {
            extension = string.substring(string.lastIndexOf(".") + 1, string.length);
        }
    }
    return extension;
};

var nexus = function () {

    nexus.notify = function () {

    };

    nexus.show_error = function (title, message) {
        alert(title);
    };

    //nexus mask module
    nexus.hide_mask = function (force) {

        force = (typeof force == "boolean") ? force : false;
        var source;
        if (event) {
            source = event.srcElement || event.target;
        }

        if (force || source == document.querySelector(".mask>table.aligner") || source == document.querySelector(".mask>table.aligner td.aligner")) {
            $(document.querySelector(".mask")).removeClass("active");
            document.querySelector(".mask").innerHTML = "";
        }
    };
    nexus.show_mask = function (content) {
        content = content || "";

        var mask;
        if (!document.querySelector(".mask")) {
            mask = document.body.appendChild(document.createElement("div"));
            mask.onclick = nexus.hide_mask;
        }
        else {
            mask = document.querySelector(".mask");
        }

        mask.innerHTML = "<table class='aligner uk-width uk-height-1-1 uk-text-center'><tr class='aligner'><td class='aligner'><div class='content uk-overflow-hidden popup uk-container-center uk-position-relative animate'></div></td></tr></table>";

        if (content.trim() !== "") {
            content_div.innerHTML = content;
        }

        $(mask).addClass("mask");
        $(mask).addClass("active");
    };

    //nexus file module
    nexus.file = {

        read: function (file) {
            //REF: https://api.jquery.com/deferred.promise/
            var dfd = jQuery.Deferred();
            var reader = new FileReader();
            reader.onload = function (e) {
                dfd.resolve(e.target.result);
            };
            var blob = file.slice(0, file.size);
            reader.readAsBinaryString(blob);

            return dfd.promise();
        }

    },
        nexus.dropzone = function (element, settings) {
            //ref http://html5demos.com/drag#view-source
            settings = settings || {};
            settings.accept = settings.accept || [];
            settings.ondrop = settings.ondrop || function () {
                };
            settings.ondragenter = settings.ondragenter || function () {
                };
            settings.ondragover = settings.ondragover || function () {
                };
            settings.ondragleave = settings.ondragleave || function () {
                };

            if (!element) return null;

            $(element).addClass("dropzone");

            element.ondragenter = function () {
                this.remove_drag_states();
                $(this).addClass("drag enter");
                settings.ondragenter();

            };

            element.ondragover = function () {
                event.preventDefault();
                this.remove_drag_states();
                $(this).addClass("drag over");
                settings.ondragover();
            };

            element.ondragleave = function () {
                this.remove_drag_states();
                $(this).addClass("drag leave");
                settings.ondragleave();
            };

            element.ondrop = function (e) {
                //REF: http://www.html5rocks.com/en/tutorials/file/dndfiles/
                e.stopPropagation();
                e.preventDefault();
                this.remove_drag_states();
                $(this).addClass("drag drop");
                this.remove_drag_states();

            };

            element.remove_drag_states = function () {
                $(this).removeClass("drag");
                $(this).removeClass("over");
                $(this).removeClass("leave");
                $(this).removeClass("drop");
                $(this).removeClass("enter");
            };

            return element;

        };

    nexus.menu = function (json_tree) {

        var menu = document.createElement("ul");
        menu.className = "nexus menu uk-margin-remove";

        for (var i in Object.keys(json_tree)) {
            var key = Object.keys(json_tree)[i];
            var menu_item = menu.appendChild(document.createElement("li"));
            menu_item.className = "item";
            menu_item.innerHTML = key;
            if (Object.keys(json_tree[key]).length > 0) {
                menu_item.appendChild(new nexus.menu(json_tree[key]));
            }
        }

        return menu;

    };
};

document.addEventListener("DOMContentLoaded", nexus, false);

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
        code_box.editor = ace.edit(code_area);
        code_box.editor.$blockScrolling = Infinity;
        code_box.editor.setValue(nexus.prototype.settings.editors.languages[language].default_value || "");
        code_box.editor.setTheme(nexus.prototype.settings.editors.theme);
        code_box.editor.on("change", nexus.prototype.show_preview);

        code_box.editor.setShowPrintMargin(false);
        code_box.editor.setDisplayIndentGuides(nexus.prototype.settings.editors.show_indent_guides);
        code_box.editor.getSession().setMode(nexus.prototype.settings.editors.languages[language].session || "ace/mode/" + language);


        code_box.value = function () {
            return this.editor.getValue();
        };
        code_box.focus = function () {
            this.editor.focus();
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
            if (code_box.editor.getValue().trim() === "") {
                continue;
            }
            preview_code += "\n<" + nexus.prototype.settings.editors.languages[code_box.language].tag + " id='nexus_prototype_preview_" + code_box.language + "' >\n" + code_box.editor.getValue() + "\n</" + nexus.prototype.settings.editors.languages[code_box.language].tag + ">\n";
        }
        return preview_code;
    },

    has_user_code: function () {

        for (var i = 0; i < nexus.prototype.code_boxes.length; i++) {
            if (nexus.prototype.code_boxes[i].value() !== "") {
                return true;
            }
        }

        return false;
    },

    local_functionality_notice: function () {
    },

    toggle_main_menu: function () {
        $('#main_menu_toggle').toggleClass('fa-bars fa-times');
        $('#main_menu').toggleClass('active');
        if (document.querySelector("#main_menu_toggle.fa-times")) {
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

        window.onbeforeunload = function () {
            return "All your work will be erased!";
        };


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
        var showing_code_boxes = [];
        for (var i = 0; i < nexus.prototype.code_boxes.length; i++) {
            if (!nexus.prototype.code_boxes[i].querySelector(".code_box_toggler").checked) {
                nexus.prototype.code_boxes[i].style.height = "";
            } else {
                showing_code_boxes.push(nexus.prototype.code_boxes[i]);
            }
        }
        var not_showing = nexus.prototype.code_boxes.length - showing_code_boxes.length;
        for (i = 0; i < showing_code_boxes.length; i++) {
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
        document.querySelector("#main_menu_toggle").className = "fa fa-bars action uk-text-center uk-padding-remove";
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

        for (var i = 0; i < nexus.prototype.settings.editors.default.length; i++) {
            nexus.prototype.code_boxes_container.appendChild(new nexus.prototype.code_box(nexus.prototype.settings.editors.default[i]));
        }
        nexus.prototype.code_boxes[0].editor.focus();

        document.querySelector("#download_btn").addEventListener("click", nexus.prototype.save, false);
        document.querySelector("#main_menu_toggle").addEventListener("click", nexus.prototype.toggle_main_menu, false);
        document.querySelector("#btn_editor_min").addEventListener("click", nexus.prototype.editor_width_min, false);
        document.querySelector("#btn_editor_max").addEventListener("click", nexus.prototype.editor_width_max, false);

        nexus.prototype.catch_save();
        nexus.prototype.catch_open();

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
                    media_type: "text/css",
                    default_value: `body {
    padding: 1rem;
}`
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

        include_font_awesome: false,

        preview_time: 0
    }
};

document.addEventListener("DOMContentLoaded", function () {
    nexus.prototype.init();
}, false);
