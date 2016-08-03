'use strict';

$(document).ready(function () {
   $.ajax({
       type: "POST",
       url: "/user",
       success: drawHeader
   });
});

$(document).on('click', '.dropdown-menu', function(e) {
    if ($(this).hasClass('keep-open-on-click')) { e.stopPropagation(); }
});




function drawHeader (data) {
    var html = "";
    if (data.twitterid) {
        html += '<div class="header row"><div class="col-xs-1"></div><div class="col-xs-1">';
        html += '<a class="btn btn-default" href="/"><i class="header-logo fa fa-space-shuttle" aria-hidden="true"></i></a></div>';
        html += '<div class="all col-xs-1"><a class="all btn btn-default" href="/"><p class="header-all">All Pics</p></a></div>';
        html += '<div class="my col-xs-1"><a class="my btn btn-default" href="/my"><p class="header-my">My Pics</p></a></div>';
        html += '<div class="col-xs-1"><div class="dropdown">';
        html += '<button class="header-add btn btn-default dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown">';
        html += 'Add a Pic <span class="caret"></span></button>';
        html += '<form class="dropdown-menu keep-open-on-click" action="/add" method="post">';
        html += '<div class="form-group" aria-labelledby="dropdownMenuButton">';
        html += '<input name="add-url" class="form-control add-input" type="text" placeholder="Pic url...">';
        html += '<input name="add-descrip" class="form-control add-input" type="text" placeholder="Pic description...">';
        html += '<li role="separator" class="divider"></li><button id="add-pic" class="btn btn-primary add-btn" type="submit">GO</button>';
        html += '</div></form></div></div><div class="col-xs-5"></div><div class="col-xs-1">';
        html += '<a class="btn btn-default" href="/logout"><i class="header-logout fa fa-power-off" aria-hidden="true"></i></a></div><div class="col-xs-1"></div></div>';
    }
    else {
        html += '<div class="header row"><div class="col-xs-1"></div><div class="col-xs-1">';
        html += '<a class="btn btn-default" href="/"><i class="header-logo fa fa-space-shuttle" aria-hidden="true"></i></a></div>';
        html += '<div class="col-xs-1"><a class="btn btn-default" href="/"><p class="header-all">All Pics</p></a></div>';
        html += '<div class="col-xs-7"></div><div class="col-xs-1">';
        html += '<a class="btn btn-primary" href="/auth"><p class="header-login">Sign in with Twitter</p></a></div><div class="col-xs-1"></div></div>';
    }
    $("#header").html(html);
    if (window.location.pathname == "/") {
        $(".all").css({"background-color": "darkgray"});
    }
    else if (window.location.pathname == "/my") {
        $(".my").css({"background-color": "darkgray"});
    }
}