'use strict';

$(document).ready(function () {
    // draw all pics on page load
    $.ajax({
        type: "POST",
        url: "/all", 
        success: drawAllPics
    });
    
    //let masonry.js rearrange once divs drawn to screen
    setTimeout(function() {
        var $grid = $('.grid').masonry({
          itemSelector: '.grid-item',
          columnWidth: 220,
          gutter: 10,
        });
        
        // finally wait for images to load if not done
        $grid.imagesLoaded().progress( function() {
            $grid.masonry('layout');
        });
    }, 250);

    
    // like button clicked, toggle like
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
    });;
});

// replace broken images with template image
function imgError (image) {
    image.onerror = "";
    image.src = "http://i1064.photobucket.com/albums/u373/bartowski20/imageBroken_zpsc6wvowrj.png";
    return true;
}


function drawAllPics (data) {
    var html = '';
    data.docs.forEach(function (element) {
        html += "<div class='grid-item'>" + "<img class='img' src='" + element.url + "' onerror='imgError(this);' />";
        html += "<p class='descrip'>" + element.descrip + "</p>";
        html += "<div class='bottom row'><div class='col-xs-4'><img class='logo' src='" + element.postedLogo + "' /></div>";
        
        // check if logged in
        if (data.user) {
                html += "<div class='col-xs-4'></div><div class='col-xs-4'><button id='like" + element["_id"] + "' class='like btn'><div class='row'>";
                var liked = false;
                
                // check if user already liked photo, color in star if so
                element.likedby.forEach(function (el) {
                    if (data.user.twitterid == el) {
                         html += "<div id='star" + element["_id"] + "' class='col-xs-6'><i class='fa fa-star' aria-hidden='true'></i></div>";
                         liked = true;
                    }
                    // open star if not one of the likes
                    if (el == element.likedby[element.likedby.length-1] && liked == false) {
                        html += "<div id='star" + element["_id"] + "' class='col-xs-6'><i class='fa fa-star-o' aria-hidden='true'></i></div>"; 
                    }
                });
                // open star if pic has no likes
                if (element.likedby.length === 0) {
                    html += "<div id='star" + element["_id"] + "' class='col-xs-6'><i class='fa fa-star-o' aria-hidden='true'></i></div>"; 
                }
            }
    
        // otherwise disable liking if not logged in
        else {
            html += "<div class='col-xs-4'></div><div class='col-xs-4'><button class='disabled like btn'><div class='row'>";
            html += "<div id='star" + element["_id"] + "' class='col-xs-6'><i class='fa fa-star-o' aria-hidden='true'></i></div>";
        }
        
        html += "<div class='col-xs-6'><p id='likenum" + element["_id"] + "' class='likenum'>" + element.likedby.length + "</p></div></div></button></div></div></div>";
    });
    $(".grid").html(html);
}