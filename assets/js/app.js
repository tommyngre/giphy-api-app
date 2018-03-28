var topics = ["spongebob","patrick","squidward","sandy cheeks","howard blandy","mr. krabs","mrs. puff","pearl krabs","doodlebob"];


var session = {
  search: '',
  searches: [],
  topics: [],
  loadButtons: function(){
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
    console.log(url);
    $.ajax({
      url: url,
      method: "GET"
    }).then(function (response) {
      session.handleResponse(response);
    })
  },
  handleResponse: function (r) {
    this.drawGifs(r)
  },
  drawGifs: function (r) {
    var resultsLabel = $("<h2 class='results-label text-center'>")
    resultsLabel.text(session.search);

    var results = $("<div class='r-container'>");
    

    r.data.forEach(element => {
      console.log(element);
      var result = $("<div class='r-element'>");
      var html =
        `
        <img class="gif-onload" src="${element.images.fixed_width_small_still.url}" data-motion="${element.images.fixed_width_small.url}" data-still="${element.images.fixed_width_small_still.url}" data-switch="0">
        <div class="img-rating">
          <span class="rating-label">rated</span>
          <span class="rating">${element.rating}</span>
        </div>
        `;
      result.html(html);
      results.append(result);
    });

    $("#container").prepend(results);
    $("#container").prepend(resultsLabel);

    // redirect to #container on click
  }
}

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

  if (!(session.topics.indexOf(query) > -1)){
  session.topics.push(query);
  session.loadButtons(query);
  }  
});

$("#topic-wrappers").on("click", ".btn", function(){
  var query = $(this).html();
  session.search = query;
  session.searches.push(query);
  session.queryBuilder(query);
})

$("#container").on("click", ".gif-onload", function(){
  //console.log(this); // returns div
  if ($(this).attr("data-switch") == "0"){
    $(this).attr("src",$(this).attr("data-motion"));
    $(this).attr("data-switch","1");
  } else {
    $(this).attr("src",$(this).attr("data-still"));
    $(this).attr("data-switch","0");
  }
})

$(document).ready(function () {
  session.topics = topics.map(x => x);
  session.loadButtons();
})