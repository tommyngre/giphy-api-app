//if i had more time, 'topics' would retrieve 'trending topics' from somewhere
var topics = ["spongebob", "patrick star", "squidward", "sandy cheeks", "mr. krabs", "mrs. puff"];
var numberOfGifs = 10;

var session = {
  search: '',
  searches: [],
  savedSearches: [],
  searchIndex: 0,
  topics: [],
  favorites: [],
  favoritesJSONFriendly: [],
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
    this.drawGifs(r)
  },
  drawGifs: function (r) {
    var resultsLabel = $("<h2 class='results-label text-center'>")
    resultsLabel.text(session.search);
    resultsLabel.id = 'results-label-' + session.searchIndex;

    var results = $("<div class='r-container'>");
    $(results).attr("id", "r-container-" + session.searchIndex);
    var left = $("<div id='left-" + session.searchIndex + "' class='arrow-left arrow'>"); //##NEW
    $(left).val(session.searchIndex);
    var right = $("<div id='right-" + session.searchIndex + "' class='arrow-right arrow'>"); //##NEW
    $(right).val(session.searchIndex);

    r.data.forEach(element => {

      var result = $("<div class='r-element'>");

      var html =
        `
        <img id="search-${session.searchIndex}-img-${r.data.indexOf(element)}" class="gif" src="${element.images.original_still.url}" data-motion="${element.images.original.url}" data-still="${element.images.original_still.url}" data-switch="0" data-width="${element.images.original.width}">
        <div class="img-rating">
        <span class="rating-label">rated</span>
          <span class="rating">${element.rating}</span>
          <span class="icon fas fa-expand"></span>
          <span class="icon fav far fa-heart"></span>

          <!-- giphy seems to disable downloads and redirects to site hm...
          <a class="dl" download="${element.title}" href="${element.images.original.mp4}"><span class="icon fas fa-download"</span></a>
          -->

          </div>
        `;
      result.html(html);
      results.append(result);

    });

    //hide at first
    ///right only displayed if size warrants
    $(left).css('display', 'none');
    $(right).css('display', 'none');

    $(results).append(right);
    $("#container").prepend(results);
    $(results).prepend(left);
    $("#container").prepend(resultsLabel);

    setTimeout(function () {
      session.getResultContainerWidth('', r);
    }, 300)
    // #TODO redirect to #container on click
  },
  getResultContainerWidth: function (param, array) {
    var containerID = '';
    var containerWidth = 0;
    
    //diff handling for favorites
    if (param == "favs") {
      containerID = 999;
      session.favorites.forEach(favorite => {
        var img = $(favorite).children(img);
        console.log(containerWidth);
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

    //only show right arrow if larger than window
    $('#left-' + containerID).addClass('fadeIn').css('display', 'block');
    var w = window.innerWidth;
    if (containerWidth > w) {
      $('#right-' + containerID).addClass('fadeIn').css('display', 'block');
    }
    setTimeout(function () {
      $('#left-' + containerID).removeClass('fadeIn');
      $('#right-' + containerID).removeClass('fadeIn');
    }, 2000)
  },


  showFavorites: function () {
    //check if favs
    if (session.favorites.length < 1) {
      showNoFavsMesg();
      return;
    }

    //build 'r-container' of favs
    ///first remove prev if exists
    $('#r-container-999').remove();
    $('#results-label-999').remove();
    var resultsLabel = $("<h2 id='results-label-999' class='results-label text-center'>")
    resultsLabel.text("favorites");

    var results = $("<div class='r-container'>");
    $(results).attr("id", "r-container-999");
    var left = $("<div id='left-999' class='arrow-left arrow'>");
    var right = $("<div id='right-999' class='arrow-right arrow'>");

    session.favorites.forEach(favorite => {
      results.append(favorite);
    })

    //hide until width calculated
    ///display right only if size warrants
    $(left).css('display', 'none');
    $(right).css('display', 'none');

    $(results).append(right);
    $("#container").prepend(results);
    $(results).prepend(left);
    $("#container").prepend(resultsLabel);

    setTimeout(function () {
      session.getResultContainerWidth("favs");
    }, 400)
  }
}

//DISPLAY FULL-SIZE GIF IN MODAL
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


//SHOW 'NO RESULTS' MESSAGE
function showNoDataMesg() {
  let userInput = $("#user-input");
  userInput.val("no results :(").css("color", "red");
  setTimeout(function () {
    userInput.val("i wanna see...").css("color", "#495057");
  }, 1200)
}

//CLICK EVENTS TO HANDLE 'GALLERY' SCROLLING
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
        $(arrow).removeClass("shake fadeIn");
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
        /// xtra vars than strictly nec for readability
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
      rightArrowX = rightArrowX + "px";

    }
    $(arrow).css("right", rightArrowX);
    $("#left-" + n).css("left", leftArrowX);
  }
})

//CLICK EVENT INITIATES SEARCH
$("#show").unbind().on("click", function (e) {
  e.preventDefault();
  //do nothin if null
  var query = $("#user-input").val();
  if (query == "") {
    return;
  }
  //set session vars & query api
  session.search = query;
  session.searches.push(query);
  localStorage.setItem('searches', JSON.stringify(session.searches));
  session.queryBuilder(query);
});

//CLICK EVENT TO ADD SAVED SEARCHES
$("#save").unbind().on("click", function (e) {
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
    session.savedSearches.push(query);
    localStorage.setItem('presets', JSON.stringify(session.savedSearches));
    session.loadButtons(query);
  }
});

//SHOW 'NO FAVORITES' MESSAGE
function showNoFavsMesg() {
  let favButton = $(".favs");
  favButton.text("no favs :(")
    .css("color", "navajowhite");
  setTimeout(function () {
    favButton.text("favorites")
      .css("color", "white");
  }, 1200)
}

//SHOW/HIDE PRESETS (most useful for mobile)
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
//CLICK EVENTS THAT TRIGGER SECONDARY FUNCTIONS (e.g. hide presets, save search)
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

//TOGGLE STILL/MOTION
function toggleMotion(element) {
  if ($(element).attr("data-switch") == "0") {
    $(element).attr("src", $(element).attr("data-motion"));
    $(element).attr("data-switch", "1");
  } else {
    $(element).attr("src", $(element).attr("data-still"));
    $(element).attr("data-switch", "0");
  }
}

//CLICK EVENTS TRIGGER FULL-SIZE MODAL VIEW
$('#container').unbind().on('click', '.fa-expand', function () {
  let element = $(this).parent().parent().clone();
  let image = $(element).find('img');
  $(image).css('width', 'data-width' + "px")
    .css('height', 'auto')
    .attr('data-switch', '0');
  //switch to zero so toggle turns motion on
  toggleMotion(image);
  expand(element);
})
//event that closes/hides modal
$('#modal').unbind().on('click', function (event) {
  $(this).css('display', 'none');
  $('#modal-container').html('');
})

// CLICK EVENTS TRIGGER STILL/MOTION TOGGLE
$("#container").on("click", ".gif", function () {
  toggleMotion(this);
})
$("#modal-container").on("click", ".gif", function () {
  toggleMotion(this);
})

//CLICK EVENT TO ADD/REMOVE FAVORITES
$("#container").on("click", ".fav", function () {
  //change from hollow black to solid red
  let fav = $(this).parent().parent();
  if ($(this).hasClass('far')) {
    $(this).removeClass('far').addClass('fas')
      .css("color", "red");
    //get r-element
    ///this is sufficient for in-session storage,
    session.favorites.push(fav);
    ///JSON/localStorage--friendly data modeal
    var newFav = {};
    var img = fav.find('img');
    //assign id a random # favs never have same id
    ///fingers crossed
    newFav.id = `${img.attr('id')}-${Math.round(Math.random() * 99999)}`;
    newFav.still = img.attr('data-still');
    newFav.motion = img.attr('data-motion');
    newFav.width = img.attr('data-width');
    newFav.rating = fav.find('.rating').text();
    console.log(session.favoritesJSONFriendly, " before add");
    session.favoritesJSONFriendly.push(newFav);
    console.log(session.favoritesJSONFriendly, " after add");
    localStorage.setItem('favorites', JSON.stringify(session.favoritesJSONFriendly));
  } else {
    $(this).removeClass('fas').addClass('far')
      .css("color", "black");
    //remove from in-session storage
    let i = session.favorites.indexOf(fav);
    session.favorites.splice(i, 1);
    //remove from localStorage
    let id = fav.find('img').attr('id');
    
    let j = session.favoritesJSONFriendly.indexOf(id);
    console.log(session.favoritesJSONFriendly, " before splice");
    session.favoritesJSONFriendly.splice(j,1);
    console.log(session.favoritesJSONFriendly, " after splice");
    localStorage.setItem('favorites', JSON.stringify(session.favoritesJSONFriendly));
  }
})

//CLICK EVENTS TRIGGER FULL-SIZE MODAL VIEW
$('#container').on('click', '.fa-expand', function () {
  let element = $(this).parent().parent().clone();
  let image = $(element).find('img');
  $(image).css('width', 'data-width' + "px")
    .css('height', 'auto')
    .attr('data-switch', '0');
  //switch to zero so toggle turns motion on
  toggleMotion(image);
  expand(element);
})
//event that closes/hides modal
$('#modal').unbind().on('click', function (event) {
  $(this).css('display', 'none');
  $('#modal-container').html('');
})

//GET FAVORITES FROM LOCALSTORAGE
function getFavorites() {
  let favorites = localStorage.getItem('favorites');
  if (favorites == null) {
    return;
  }
  favorites = JSON.parse(favorites);
  favorites.forEach(favorite => {

    //keep favorites in favoritesJSONFriendly
    session.favoritesJSONFriendly.push(favorite);
    var favAsHTML =
      `
      <div class="r-element">
        <img id="${favorite.id}" class="gif" src="${favorite.still}" data-motion="${favorite.motion}" data-still="${favorite.still}" data-switch="0" data-width="${favorite.width}">
        <div class="img-rating">
          <span class="rating-label">rated</span>
          <span class="rating">${favorite.rating}</span>
          <span class="icon fas fa-expand"></span>
          <span class="icon fav fas fa-heart" style="color:red"></span>
        </div>
      </div>
    `
    session.favorites.push(favAsHTML);
  })
}

//GET 'PRESETS' FROM LOCALSTORAGE
function getPresets() {
  let presets = localStorage.getItem('presets');
  presets = JSON.parse(presets);
  if (presets == null) {
    return;
  }
  presets.forEach(preset => {
    session.savedSearches.push(preset);
    session.topics.push(preset);
  })
}

$(document).ready(function () {
  session.topics = topics.map(x => x);
  getPresets();
  getFavorites();
  session.loadButtons();
})