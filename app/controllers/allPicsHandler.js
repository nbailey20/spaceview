'use strict';

$(document).ready(function () {
    $.ajax({
        type: "POST",
        url: "/all", 
        success: function (data) {
            var html = '';
            data.forEach(function (element) {
                html += "<div class='grid-item'>" + "<img class='img' src='" + element.url + "' onerror='imgError(this);' />";
                html += "<p class='descrip'>" + element.descrip + "</p>";
                html += "<div class='bottom row'><div class='col-xs-4'><img class='logo' src='" + element.postedLogo + "' /></div>";
                html += "<div class='col-xs-4'></div><div class='col-xs-4'><button class='like btn btn-default'><div class='row'>";
                html += "<div class='col-xs-6'><i class='fa fa-star-o' aria-hidden='true'></i></div>";
                html += "<div class='col-xs-6'><p class='likenum'>0</p></div></div></button></div></div></div>";
            });
            $(".grid").html(html);
            
        }
    });
    
    setTimeout(function() {
        $('.grid').masonry({
          itemSelector: '.grid-item',
          columnWidth: 220,
          gutter: 10,
        });
    }, 500);
});


function imgError(image) {
    image.onerror = "";
    image.src = "http://i1064.photobucket.com/albums/u373/bartowski20/imageBroken_zpsc6wvowrj.png";
    return true;
}