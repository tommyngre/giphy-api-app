var topics = ["spongebob","patrick","squidward","sandy cheeks","howard blandy","mr. krabs","mrs. puff","pearl krabs","doodlebob"];


var session = {
  search: '',
  searches: [],
  loadButtons: function(){
    topics.forEach(topic => {
      var button = $("<button class='col-md-2 btn btn-info btn-lg'>");
      button.text(topic);
      $("#topic-wrapper").append(button);
    })
  },
  queryBuilder: function (q) {
    var url = "https://api.giphy.com/v1/gifs/search?limit=3&offset=0&lang=en";
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
    var results = $("<div class='r-container'>");
    var resultsLabel = $("<h2 class='results-label text-center'>")
    resultsLabel.text(session.search);
    results.append(resultsLabel);

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
  }
}

$("#show").on("click", function () {
  var query = $("#user-input").val();
  //set session vars
  session.search = query;
  session.searches.push(query);
  session.queryBuilder(query);
});

$("#topic-wrapper").on("click", ".btn", function(){
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
  session.loadButtons();
})