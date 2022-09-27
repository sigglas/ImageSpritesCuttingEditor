var jcrop_api;
jQuery(function ($) {

    //    var jcrop_api;
    //    $('#target').Jcrop({
    //        onChange: showCoords,
    //        onSelect: showCoords,
    //        onRelease: clearCoords
    //    }, function () {
    //        jcrop_api = this;
    //    });

    $("#addNewPoint").click(function () {
        /*
        <rect x="70" y="30" width="38" height="50" class="rects" data-value="a2">
        </rect>*/
        if (!window.posVal) {
            alert(getDeplang("msg_selpos"));
            return;
        }
        rectAttr = new Object();
        rectAttr["x"] = posVal.x; rectAttr["y"] = posVal.y;
        rectAttr["width"] = posVal.w; rectAttr["height"] = posVal.h;
        rectAttr["class"] = 'rects'; rectAttr["data-value"] = $("#t_posName").val();

        if ($("#c_useEvent")[0].checked) {
            $(".eventblock").each(function () {
                if ($(this).find(".t_eventname").val().length > 0 && $(this).find(".t_funcname").val().length > 0) {
                    rectAttr[$(this).find(".t_eventname").val()] = $(this).find(".t_funcname").val() + '(this)';

                    var child = "function " + $(this).find(".t_funcname").val() + "(obj){ alert($(obj).attr('data-value'));}";

                    $("#d_out").append($("<script>").append(child));
                    $("#s_out").append('\r\n' + child);
                }
            });
        }
        var newrect = $("<rect>")
                .attr(rectAttr);

        newrect.append($("<title>").html($("#t_posName").val()));
        var to_Orirect = newrect.clone().attr('class', 'orirects').attr($("#t_eventname").val(), '');


        document.getElementById('posted_svg').appendChild(parseSVG(newrect[0].outerHTML));

        document.getElementById('target').appendChild(parseSVG(to_Orirect[0].outerHTML));
        $("#t_jsonout").val(
                    $("#t_jsonout").val()
                    + JSON.stringify({
                        x: posVal.x,
                        y: posVal.y,
                        width: posVal.w,
                        height: posVal.h
                    })
                    + ",\r\n"
                );
    });

    $("#expSVG").click(function () {
        switch ($("#expSel").val()) {
            case "Full Element":
                $("#export").val($("#css_out")[0].outerHTML + '\r\n' + $("#posted_svg")[0].outerHTML + '\r\n' + $("#s_out")[0].outerHTML);
                break;
            case "Points Only":
                $("#export").val("[" + $("#t_jsonout").val() + "]");
                break;
        }
    });

    $("#reDragIn").click(function () {
        var svg = document.getElementById('target');
        var svg_parent = $(svg).parents("div[id=target_parent]");

        $(svg.childNodes).each(function () {
            svg.removeChild(this);
        });
        var bak_svg = svg_parent.find("svg").clone().attr('style', '');
        var posted_svg = document.getElementById('posted_svg');
        $(posted_svg.childNodes).each(function () {
            posted_svg.removeChild(this);
        });
        if (jcrop_api) {
            jcrop_api.destroy();
            svg_parent.append(bak_svg);
        }
        $("#s_out").html('');
        var status = document.getElementById('status');
        status.innerHTML = getDeplang("status_default");
        $('#imgarea').fadeOut(function () {
            $("#drop_area").show();

        });
    });

    $('#c_fullsize').click(function () {
        if (this.checked) {
            $('#c_width').attr('readonly', 'readonly').val('');
            $('#c_height').attr('readonly', 'readonly').val('');

        }
        else {
            $('#c_width').removeAttr('readonly');
            $('#c_height').removeAttr('readonly');
        }

    });
    $('#c_useEvent').click(function () {
        if (this.checked) {
            $('#eventArea').show();

        }
        else {
            $('#eventArea').hide();
        }

    });
    $('#addevent').click(function () {

        var newEvent = $($(".eventblock")[0]).clone();
        $(newEvent).find("label").text($(".eventblock").length + 1);
        $("#eventAreaList").append(newEvent);
        $("#eventArea").scrollTop($("#eventArea")[0].scrollHeight);

    });

    $('#clearevents').click(function () {
        $("#eventAreaList").html($(".eventblock").splice(0, 1));
    });

});
function parseSVG(s) {
    var div = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
    div.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg">' + s + '</svg>';
    var frag = document.createDocumentFragment();
    while (div.firstChild.firstChild)
        frag.appendChild(div.firstChild.firstChild);
    return frag;
}

function showCoords(c) {
    posVal = c;
    $('#x1').val(c.x);
    $('#y1').val(c.y);
    $('#x2').val(c.x2);
    $('#y2').val(c.y2);
    $('#w').val(c.w);
    $('#h').val(c.h);

};


function clearCoords() {
    $('#coords input').val('');
};



//function droppic(e) {
//    e.dataTransfer.setData("Text", eval.target.id);
//    var a = '';
//}
//function allowDrop(e) {
//    e.preventDefault();
//}


function event_isdropover(e, img) {

    $("#drop_area").hide();
    $('#imgarea').fadeIn(function () {
        var svg = document.getElementById('target');

        $(svg.childNodes).each(function () {
            svg.removeChild(this);
        });
        if ($('#c_fullsize')[0].checked) {
            svg.width.baseVal.value = img.width;
            svg.height.baseVal.value = img.height;
        }
        else {
            svg.width.baseVal.value = parseInt($('#c_width').val());
            svg.height.baseVal.value = parseInt($('#c_height').val());
        }
        var replaceimg = $("<image>").attr({ 'xlink:href': $(img).attr('src'), x: "0", y: "0", height: "100%", width: "100%" });
        svg.appendChild(parseSVG(replaceimg[0].outerHTML));

        $(svg).Jcrop({
            onChange: showCoords,
            onSelect: showCoords,
            onRelease: clearCoords
        }, function () {
            jcrop_api = this;
        });


        var posted_svg = document.getElementById('posted_svg');
        $(posted_svg.childNodes).each(function () {
            posted_svg.removeChild(this);
        });
        posted_svg.appendChild(parseSVG(replaceimg[0].outerHTML));
    });
}