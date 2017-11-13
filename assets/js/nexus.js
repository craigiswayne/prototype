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
