if (window.FileReader) {
    var drop;
    addEventHandler(window, 'load', function () {
        var status = document.getElementById('status');
        drop = document.getElementById('drop');
        var list = document.getElementById('list');
        var myimg = document.getElementById('target');

        function cancel(e) {
            if (e.preventDefault) { e.preventDefault(); }
            return false;
        }

        // Tells the browser that we *can* drop on this target
        addEventHandler(drop, 'dragover', cancel);
        addEventHandler(drop, 'dragenter', cancel);

        addEventHandler(drop, 'drop', function (e) {

           
            e = e || window.event; // get window.event if e argument missing (in IE)   
            if (e.preventDefault) { e.preventDefault(); } // stops the browser from redirecting off to the image.

            var dt = e.dataTransfer;
            var files = dt.files;

            if ($('#c_fullsize')[0].checked) {
            }
            else {
                if ($.trim($('#c_width').val()).length == 0 || $.trim($('#c_height').val()).length == 0) {
                    alert(getDeplang("msg_HeiWet"));
                    $('#c_width').focus().select();
                    return false;
                }
                else if (parseInt($('#c_width').val()) <= 0) {
                    alert(getDeplang("msg_needwidth"));
                    $('#c_width').focus().select();
                    return false;
                }
                else if ( parseInt($('#c_height').val()) <= 0) {
                    alert(getDeplang("msg_needheight"));
                    $('#c_height').focus().select();
                    return false;
                }
            }
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var reader = new FileReader();

                //attach event handlers here...

                reader.readAsDataURL(file);
                addEventHandler(reader, 'loadend', function (e, file) {
                    $(list.childNodes).each(function () {
                        list.removeChild(this);
                    });
                    var bin = this.result;
                    status.innerHTML = (getDeplang("msg_doneloading") +
                       getDeplang("msg_loaded") + file.name + getDeplang("msg_size") + file.size + ' B');

                    var img = document.createElement("img");
                    img.file = file;
                    img.src = bin;

                    if (typeof event_isdropover == 'function')
                        event_isdropover(e, img);
                } .bindToEventHandler(file));
            }
            return false;
        });
        Function.prototype.bindToEventHandler = function bindToEventHandler() {
            var handler = this;
            var boundParameters = Array.prototype.slice.call(arguments);
            //create closure
            return function (e) {
                e = e || window.event; // get window.event if e argument missing (in IE)   
                boundParameters.unshift(e);
                handler.apply(this, boundParameters);
            }
        };
    });
} else {
    document.getElementById('status').innerHTML = 'Your browser does not support the HTML5 FileReader.';
}
function addEventHandler(obj, evt, handler) {
    if (obj.addEventListener) {
        // W3C method
        obj.addEventListener(evt, handler, false);
    } else if (obj.attachEvent) {
        // IE method.
        obj.attachEvent('on' + evt, handler);
    } else {
        // Old school method.
        obj['on' + evt] = handler;
    }
}