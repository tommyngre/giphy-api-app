var topics = ["spongebob", "patrick star", "squidward", "sandy cheeks", "howard blandy", "mr. krabs", "mrs. puff", "pearl krabs", "doodlebob"];
var numberOfGifs = 10;

var session = {
  search: '',
  searches: [],
  searchIndex: 0,
  topics: [],
  favorites: [],
  //add buttons for search in searches
  loadButtons: function (param) {
    $("#topic-wrapper").text("");
    $("#topic-wrapper-sm").text("");
    session.topics.forEach(topic => {
      var button = $("<button class='preset col-md-3 col-sm-4 btn btn-info'>");
      var buttonSm = $("<button class='preset col-xs-6 btn btn-info'>");
      button.text(topic);
      buttonSm.text(topic);
      $("#topic-wrapper").append(button);
      $("#topic-wrapper-sm").append(buttonSm);
    })
    var hide = $("<button class='hide col-md-3 col-sm-4 btn btn-secondary'>")
      .text("hide presets")
      .attr("data-shown", "1");
    var hideSm = $("<button class='hide col-xs-6 btn btn-secondary'>")
      .text("hide presets")
      .attr("data-shown", "1");
    $("#topic-wrapper").append(hide);
    $("#topic-wrapper-sm").append(hideSm);
    var favs = $("<button class='favs col-md-3 col-sm-4 btn btn-secondary'>")
      .text("favorites")
    var favsSm = $("<button class='favs col-xs-6 btn btn-secondary'>")
      .text("favorites")
    $("#topic-wrapper").append(favs);
    $("#topic-wrapper-sm").append(favsSm);
  },
  queryBuilder: function (q) {
    var url = "https://api.giphy.com/v1/gifs/search?offset=0&lang=en";
    var key = "&api_key=Q3JTt1KN39pzl91g1Pyh7pBNzyX9XuPv";
    var limit = `&limit=${numberOfGifs}`;
    var query = `&q=+${q}`;
    url = url + key + limit + query;
    this.call(url);
  },
  call: function (url) {
    $.ajax({
      url: url,
      method: "GET"
    }).then(function (response) {
      session.handleResponse(response);
      session.searchIndex++;
    })
  },
  handleResponse: function (r) {
    //if no data, do not continue
    if (r.data == "") {
      return;
    }
    this.drawGifs(r)
  },
  drawGifs: function (r) {
    var resultsLabel = $("<h2 class='results-label text-center'>")
    resultsLabel.text(session.search);
    resultsLabel.id = 'results-label-' + session.searchIndex;

    var results = $("<div class='r-container'>");
    $(results).attr("id", "r-container-" + session.searchIndex);
    var left = $("<div id='left-" + session.searchIndex + "' class='animated arrow-left arrow'>"); //##NEW
    $(left).val(session.searchIndex);
    var right = $("<div id='right-" + session.searchIndex + "' class='animated arrow-right arrow'>"); //##NEW
    $(right).val(session.searchIndex);

    r.data.forEach(element => {

      var result = $("<div class='r-element'>");

      var html =
        `
        <img id="search-${session.searchIndex}-img-${r.data.indexOf(element)}" class="gif-onload" src="${element.images.fixed_height_still.url}" data-motion="${element.images.fixed_height.url}" data-still="${element.images.fixed_width_small_still.url}" data-switch="0">
        <div class="img-rating">
        <span class="rating-label">rated</span>
          <span class="rating">${element.rating}</span>
          <span>| fav?</span>
          <span class="fav far fa-heart"</span>

        </div>
        `;
      result.html(html);
      results.append(result);

    });

    $(results).append(right);
    $("#container").prepend(results);
    $(results).prepend(left);
    $("#container").prepend(resultsLabel);

    setTimeout(function () {
      session.getResultContainerWidth('',r);
    }, 500)
    // redirect to #container on click
  },
  getResultContainerWidth: function (param,array) {
    if (param == "favs") {
      var containerID=999;
      var containerWidth = 0
      session.favorites.forEach(favorite => {
        var img = $(favorite).children(img);
        containerWidth += $(img).width();
      })
      containerWidth += (session.favorites.length * 20);
      containerWidth = Math.floor(containerWidth);
      $('#r-container-999').attr("data-width", containerWidth);
    } else {
      //-1 because searchIndex already incremented at this point
      var containerID = session.searchIndex - 1;
      var containerWidth = 0;
      for (i = 0; i < array.length; i++) {
        var id = "#search-" + containerID + "-img-" + i;
        containerWidth += $(id).width();
        console.log($(id).width());
      }
      //correct for margins
      containerWidth += (numberOfGifs * 20);
      containerWidth = Math.floor(containerWidth);
      //set container div attribute to this
      $('#r-container-' + (session.searchIndex - 1)).attr("data-width", containerWidth);
    }
    //hide right arrow if with smalled than window
    var w = window.innerWidth;
    if (containerWidth < w) {
      $('#right-'+containerID).css('display','none');
    }
  },
  showFavorites: function () {
    //build r-container of favs
    var resultsLabel = $("<h2 class='results-label text-center'>")
    resultsLabel.text("favorites");
    resultsLabel.id = 'results-label-999'; //999 to keep numeric

    var results = $("<div class='r-container'>");
    $(results).attr("id", "r-container-999");
    var left = $("<div id='left-999' class='animated arrow-left arrow'>");
    var right = $("<div id='right-999' class='animated arrow-right arrow'>"); //##NEW

    session.favorites.forEach(favorite => {
      results.append(favorite);
    })

    $(results).append(right);
    $("#container").prepend(results);
    $(results).prepend(left);
    $("#container").prepend(resultsLabel);

    setTimeout(function () {
      session.getResultContainerWidth("favs");
    }, 500)
  }
}

//handle gallery scrolling
$("body").unbind().on("click", ".arrow", function () {

  var arrow = this;
  var whichArrow = arrow.id;

  //get # from arrow id
  var n = whichArrow.split("-");
  n = n[1];

  //vars to determine arrows x positions
  if ($(this).hasClass('arrow-left')) {
    var leftArrowX = parseInt($(this).css("left"));
    var rightArrowX = parseInt($("#right-" + n).css("right"));
  } else {
    var leftArrowX = parseInt($("#left-" + n).css("left"));
    var rightArrowX = parseInt($(this).css("right"));
  }

  //helps determine when to stop scrolling right
  const maxWidth = $('#r-container-' + n).attr('data-width');

  //more vars to help w gallery scrolling
  var w = window.innerWidth;
  var scrollAmount = w - 100;
  var container = $(this).parent();
  var cx = container.scrollLeft();

  if ($(arrow).hasClass('arrow-left')) {
    $(container).animate({ scrollLeft: cx - scrollAmount }, 500);

    //if all-the-way-scrolled left
    if ((leftArrowX - scrollAmount) < 0) {
      $(arrow).addClass("shake");
      setTimeout(function () {
        $(arrow).removeClass("shake");
      }, 500);

      leftArrowX = "10px";
      rightArrowX = "10px";
    }
    else {
      leftArrowX -= scrollAmount;
      rightArrowX += scrollAmount;

      leftArrowX = leftArrowX + "px";
      rightArrowX = rightArrowX + "px"

    }
    $(arrow).css("left", leftArrowX);
    $("#right-" + n).css("right", rightArrowX);

  }
  else {

    //check if next click brings against right bounds 
    if ((rightArrowX) - (scrollAmount * 2) < (maxWidth * -1)) {

      // check if already against right bounds
      if (rightArrowX == (Math.round(-1 * (maxWidth - scrollAmount) + 100))) {
        $(container).animate({ scrollLeft: 0 }, 1000);

        leftArrowX = "10px";
        rightArrowX = "10px";
      } else {
        $(container).animate({ scrollLeft: maxWidth }, 1000);

        //set leftArrowX based on change in rightArrowX
        /// more vars than strictly nec for readability
        var rBefore = parseInt(rightArrowX);
        rightArrowX = (Math.round(-1 * (maxWidth - scrollAmount) + 100)) + "px";
        var rAfter = parseInt(rightArrowX);
        var diff = rBefore - rAfter;
        leftArrowX = leftArrowX + diff + "px";
      }
    } else {
      $(container).animate({ scrollLeft: cx + scrollAmount }, 500);

      leftArrowX += scrollAmount;
      rightArrowX -= scrollAmount;

      leftArrowX = leftArrowX + "px";
      rightArrowX = rightArrowX + "px"

    }
    $(arrow).css("right", rightArrowX);
    $("#left-" + n).css("left", leftArrowX);
  }
})

//handle searches
$("#show").on("click", function (e) {
  e.preventDefault();
  //do nothin if null
  var query = $("#user-input").val();
  if (query == "") {
    return;
  }
  //set session vars & query api
  session.search = query;
  session.searches.push(query);
  session.queryBuilder(query);
});

//add saved searches
$("#save").on("click", function (e) {
  e.preventDefault();
  //do nothin if null
  var query = $("#user-input").val();
  if (query == "") {
    return;
  }
  //else proceed
  query = query.toLowerCase();
  if (!(session.topics.indexOf(query) > -1)) {
    session.topics.push(query);
    session.loadButtons(query);
  }
});

$("#container").on("click", ".fav", function () {
  //change from hollow black to solid red
  $(this).removeClass('far').addClass('fas');
  //get r-element
  var fav = $(this).parent().parent();
  session.favorites.push(fav);
})

function showHidePresets(hideButton) {
  //if show, hide
  if ($(hideButton).attr('data-shown') == '1') {
    $(hideButton).attr('data-shown', '0')
      .text("show presets");
    $(".preset").css('display', 'none');
  }
  // else show
  else {
    $(hideButton).attr('data-shown', '1')
      .text("hide presets");;
    $(".preset").css('display', 'inline-block');
  }
}

//presets and options
$("#topic-wrappers").unbind().on("click", ".btn", function () {
  if ($(this).hasClass('hide')) {
    showHidePresets(this);
  } else if ($(this).hasClass('favs')) {
    session.showFavorites(this);
  } else {
    var query = $(this).html();
    session.search = query;
    session.searches.push(query);
    session.queryBuilder(query);
  }
})

//switch img from still to motion
$("#container").on("click", ".gif-onload", function () {
  if ($(this).attr("data-switch") == "0") {
    $(this).attr("src", $(this).attr("data-motion"));
    $(this).attr("data-switch", "1");
  } else {
    $(this).attr("src", $(this).attr("data-still"));
    $(this).attr("data-switch", "0");
  }
})

$(document).ready(function () {
  session.topics = topics.map(x => x);
  session.loadButtons();
})