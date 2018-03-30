var topics = ["spongebob", "patrick", "squidward", "sandy cheeks", "howard blandy", "mr. krabs", "mrs. puff", "pearl krabs", "doodlebob"];


var session = {
  search: '',
  searches: [],
  searchIndex: 0,
  topics: [],
  loadButtons: function () {
    $("#topic-wrapper").text("");
    session.topics.forEach(topic => {
      var button = $("<button class='col-md-3 col-sm-4 btn btn-info'>");
      var buttonSm = $("<button class='col-xs-6 btn btn-info'>");
      button.text(topic);
      buttonSm.text(topic);
      $("#topic-wrapper").append(button);
      $("#topic-wrapper-sm").append(buttonSm);
    })
  },
  queryBuilder: function (q) {
    var url = "https://api.giphy.com/v1/gifs/search?limit=10&offset=0&lang=en";
    var key = "&api_key=Q3JTt1KN39pzl91g1Pyh7pBNzyX9XuPv";
    var query = "&q=" + q;
    url = url + key + query;
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
    this.drawGifs(r)
  },
  drawGifs: function (r) {
    var resultsLabel = $("<h2 class='results-label text-center'>")
    resultsLabel.text(session.search);
    resultsLabel.id = 'results-label-' + session.searchIndex; //##NEW

    var results = $("<div class='r-container'>");
    $(results).attr("id","r-container-" + session.searchIndex); //##NEW
    var left = $("<div id='left-" + session.searchIndex + "' class='arrow-left arrow'>"); //##NEW
    $(left).val(session.searchIndex);
    var right = $("<div id='right-" + session.searchIndex + "' class='arrow-right arrow'>"); //##NEW
    $(left).val(session.searchIndex);

    r.data.forEach(element => {

      var result = $("<div class='r-element'>");

      var html =
        `
        <img id="search-${session.searchIndex}-img-${r.data.indexOf(element)}" class="gif-onload" src="${element.images.fixed_width_small_still.url}" data-motion="${element.images.fixed_width_small.url}" data-still="${element.images.fixed_width_small_still.url}" data-switch="0">
        <div class="img-rating">
          <span class="rating-label">rated</span>
          <span class="rating">${element.rating}</span>
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
      session.getResultContainerWidth();
    }, 500)
    // redirect to #container on click
  },
  getResultContainerWidth: function () {
    console.log(this.searchIndex, "searchIndex");
    var containerWidth = 0;
    for (i = 0; i < 10; i++) {
      var id = "#search-" + (session.searchIndex-1) + "-img-" + i;
      containerWidth += $(id).width();
      containerWidth = Math.floor(containerWidth);
    }
    //set container div attribute to this
    $('#r-container-'+(session.searchIndex-1)).attr("data-width",containerWidth);
  }
}

//##PRETTY MUCH NEW
$("body").unbind().on("click", ".arrow", function () {

  var arrow = this;
  var whichArrow = arrow.id;

  //get # from arrow id
  var n = whichArrow.split("-");
  n = n[1];

  if ($(this).hasClass('arrow-left')) {
    var leftArrowX = parseInt($(this).css("left"));
    var rightArrowX = parseInt($("#right-" + n).css("right"));
  } else {
    var leftArrowX = parseInt($("#left-" + n).css("left"));
    var rightArrowX = parseInt($(this).css("right"));
  }

  var w = window.innerWidth;

  var scrollAmount = w - 100;

  var container = $(this).parent();
  var cx = container.scrollLeft();

  if ($(arrow).hasClass('arrow-left')) {
    $(container).animate({ scrollLeft: cx - scrollAmount }, 500);

    //if all-the-way-scrolled left
    if ((leftArrowX - scrollAmount) < 0) {
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
    const maxWidth = $('#r-container-'+n).attr('data-width');
    console.log(scrollAmount, " scrollAmount");
    console.log(maxWidth, " maxWidth");
    console.log(rightArrowX, " right arrow x");
    console.log(leftArrowX, " left arrow x");

    //gotta get this conditional sorted out. math, man... math
    if ( (rightArrowX) - (scrollAmount * 2) < (maxWidth * -1 ) ) {

      $(container).animate({ scrollLeft: maxWidth }, 1000);

      var rBefore = parseInt(rightArrowX);
      rightArrowX = ( -1 * (maxWidth - scrollAmount) -100 ) + "px";
      var rAfter = parseInt(rightArrowX);
      var diff = rBefore-rAfter;

      leftArrowX = leftArrowX + diff + "px";
      rightArrowX = ( -1 * (maxWidth - scrollAmount) -100 ) + "px";

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

$("#show").on("click", function () {
  var query = $("#user-input").val();
  //set session vars
  session.search = query;
  session.searches.push(query);
  session.queryBuilder(query);
});

$("#save").on("click", function () {
  var query = $("#user-input").val();
  query = query.toLowerCase();

  if (!(session.topics.indexOf(query) > -1)) {
    session.topics.push(query);
    session.loadButtons(query);
  }
});

$("#topic-wrappers").on("click", ".btn", function () {
  var query = $(this).html();
  session.search = query;
  session.searches.push(query);
  session.queryBuilder(query);
})

$("#container").on("click", ".gif-onload", function () {
  //console.log(this); // returns div
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