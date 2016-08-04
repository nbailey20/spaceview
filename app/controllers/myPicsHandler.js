'use strict';

$(document).ready(function () {
    
    // make sure user is logged in
    $.ajax({
        type: "POST",
        url: "/user",
        success: function (data) {
            if (!data.twitterid)
                window.location = "/";
        }
    });
    
    // if so, draw pics
    setTimeout(function () {
        $.ajax({
            type: "POST",
            url: "/my", 
            success: drawPics
        });
    }, 250);
    
    // once images loaded, call masonry.js, CHANGE TO NOT USE TIMEOUT
    setTimeout(function() {
        $('.grid').masonry({
          itemSelector: '.grid-item',
          columnWidth: 220,
          gutter: 10,
        });
    }, 750);
    
    // change number of likes upon clicking star
    $("#gridspace").on("click", ".like", function (event) {
        var picID = event.currentTarget.id.substr(4, event.currentTarget.id.length);
        $.ajax({
            type: "POST",
            url: "/like",
            data: {id: picID},
            success: function (data) {
                var currentNumLikes =  $("#likenum" + picID).html();
                if (parseInt(data, 10) > parseInt(currentNumLikes, 10)) {
                    $("#star" + picID).html('<i class="fa fa-star" aria-hidden="true"></i>');
                }
                else {
                   $("#star" + picID).html('<i class="fa fa-star-o" aria-hidden="true"></i>');
                }
               $("#likenum" + picID).html(data);
            }
        });
    });
    
    // delete pic when X is clicked
    $("#gridspace").on("click", ".delete", function (event) {
        var picID = event.currentTarget.id.substr(6, event.currentTarget.id.length);
        $.ajax({
            type: "POST",
            url: "/delete",
            data: {id: picID},
            success: function (data) {
               window.location.reload();
            }
        });
    });
    
});


// if image is broken, replace with template
function imgError(image) {
    image.onerror = "";
    image.src = "http://i1064.photobucket.com/albums/u373/bartowski20/imageBroken_zpsc6wvowrj.png";
    return true;
}


function drawPics (data) {
    var html = '';
    data.docs.forEach(function (element) {
        html += "<div class='grid-item'>" + "<img class='img' src='" + element.url + "' onerror='imgError(this);' />";
        html += "<p class='descrip'>" + element.descrip + "</p>";
        html += "<div class='bottom row'><div class='col-xs-4'><img class='logo' src='" + element.postedLogo + "' /></div>";
        html += "<div class='col-xs-4'><button id='delete" + element["_id"] + "' class='delete btn'><i class='fa fa-times-circle-o' aria-hidden='true'></i></button></div>";
        html += "<div class='col-xs-4'><button id='like" + element["_id"] + "' class='like btn'><div class='row'>";
        
        // check if user already liked picture, color in star if so
        var liked = false;
        element.likedby.forEach(function (el) {
            if (data.user.twitterid == el) {
                 html += "<div id='star" + element["_id"] + "' class='col-xs-6'><i class='fa fa-star' aria-hidden='true'></i></div>";
                 liked = true;
            }
            // otherwise draw open star if not liked
            if (el == element.likedby[element.likedby.length-1] && liked == false) {
                html += "<div id='star" + element["_id"] + "' class='col-xs-6'><i class='fa fa-star-o' aria-hidden='true'></i></div>"; 
            }
        });
        // draw open star if pic has no likes
        if (element.likedby.length === 0) {
            html += "<div id='star" + element["_id"] + "' class='col-xs-6'><i class='fa fa-star-o' aria-hidden='true'></i></div>"; 
        }

        html += "<div class='col-xs-6'><p id='likenum" + element["_id"] + "' class='likenum'>" + element.likedby.length + "</p></div></div></button></div></div></div>";
    });
    $(".grid").html(html);
}
