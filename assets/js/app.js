//todos
/// hide right arrow faster when results < window
///save presets to session storage
///save favorites to session storage

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
      showNoDataMesg();
      return;
    }
    console.log(r);
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
        <img id="search-${session.searchIndex}-img-${r.data.indexOf(element)}" class="gif" src="${element.images.original_still.url}" data-motion="${element.images.original.url}" data-still="${element.images.original_still.url}" data-switch="0" data-width="${element.images.original.width}">
        <div class="img-rating">
        <span class="rating-label">rated</span>
          <span class="rating">${element.rating}</span>
          <span class="icon fav far fa-heart"></span>
          <span class="icon fas fa-expand"</span>
          <!-- giphy seems to disable downloads and redirects to site hm...
          <a class="dl" download="${element.title}" href="${element.images.original.mp4}"><span class="icon fas fa-download"</span></a>
          -->
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
      session.getResultContainerWidth('', r);
    }, 500)
    // redirect to #container on click
  },
  getResultContainerWidth: function (param, array) {
    var containerID = '';
    var containerWidth = 0;
    //diff handling for favorites
    if (param == "favs") {
      containerID = 999;
      session.favorites.forEach(favorite => {
        var img = $(favorite).children(img);
        containerWidth += $(img).width();
      })
      containerWidth += (session.favorites.length * 20);
      //searches other than favs
    } else {
      //-1 because searchIndex already incremented at this point
      containerID = session.searchIndex - 1;
      for (i = 0; i < array.data.length; i++) {
        var id = "#search-" + containerID + "-img-" + i;
        containerWidth += $(id).width();
      }
      //correct for margins
      containerWidth += (array.data.length * 20);
    }
    //set container data-width
    containerWidth = Math.floor(containerWidth);
    $('#r-container-' + containerID).attr("data-width", containerWidth);

    //hide right arrow if with smalled than window
    var w = window.innerWidth;
    if (containerWidth < w) {
      $('#right-' + containerID).css('display', 'none');
    }
  },
  showFavorites: function () {
    //check if favs
    if (session.favorites.length < 1) {
      showNoFavsMesg();
      return;
    }
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

//create a new 'r-container' to display full-size elements
function expand(element) {
  //remove a lot of the junk fom the elem
  $(element).find('.img-rating').detach();
  $(element).addClass('mx-auto');
  //prepare modal for full size view
  let expandDiv = $("<div class='r-container'>")
    .append(element);
  $('#modal-container').prepend(expandDiv);
  $('#modal').css('display', 'block');
}

//expand size of element
$("#container").on("click", ".fa-expand", function () {
  let element = $(this).parent().parent().clone();
  let image = $(element).find('img');
  $(image).css('width', 'data-width' + "px")
    .css('height', 'auto')
    .attr('data-motion',1);
  expand(element);
})

//close/hide modal
$('#modal').on('click', function (event) {
  $(this).css('display', 'none');
  $('#modal-container').html('');
})

//show message is search returns no results
function showNoDataMesg() {
  let userInput = $("#user-input");
  userInput.val("no results :(").css("color", "red");
  setTimeout(function () {
    userInput.val("i wanna see...").css("color", "#495057");
  }, 1200)
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

//add/remove favorites
$("#container").on("click", ".fav", function () {
  //change from hollow black to solid red
  let fav = $(this).parent().parent();
  if ($(this).hasClass('far')) {
    $(this).removeClass('far').addClass('fas')
      .css("color", "red");
    //get r-element
    session.favorites.push(fav);
  } else {
    $(this).removeClass('fas').addClass('far')
      .css("color", "black");
    let i = session.favorites.indexOf(fav)
    session.favorites.splice(i, 1);
  }
})

//show no favorites message
function showNoFavsMesg() {
  let favButton = $(".favs");
  favButton.text("no favs :(")
    .css("color", "navajowhite");
  setTimeout(function () {
    favButton.text("favorites")
      .css("color", "white");
  }, 1200)
}

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

function toggleMotion(element) {
  if ($(element).attr("data-switch") == "0") {
    $(element).attr("src", $(element).attr("data-motion"));
    $(element).attr("data-switch", "1");
  } else {
    $(element).attr("src", $(element).attr("data-still"));
    $(element).attr("data-switch", "0");
  }
}

//switch img from still to motion
$("#container").on("click", ".gif", function () {
  toggleMotion(this);
})
$("#modal-container").on("click", ".gif", function () {
  toggleMotion(this);
})

$(document).ready(function () {
  session.topics = topics.map(x => x);
  session.loadButtons();
})