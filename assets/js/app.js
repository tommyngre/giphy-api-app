function welcome() {
  console.log("welcome fool")
}

var session = {
  sessionData: '',
  queryBuilder: function (q) {
    var url = "https://api.giphy.com/v1/gifs/search?limit=3&offset=0&rating=G&lang=en";
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

    r.data.forEach(element => {
      console.log(element);
      var result = $("<div class='r-element'>");
      var html =
        `
        <img class="gif-onload" src="${element.images.fixed_width_small_still.url}" data-motion="${element.images.fixed_width_small.url}" data-still="${element.images.fixed_width_small_still.url}" data-switch="0">
        `;
      result.html(html);
      results.append(result);
    });

    $("#container").append(results);
  }
}

$("#show-me").on("click", function () {
  var query = $("#user-input").val();
  session.queryBuilder(query);
});

$("#container").on("click", ".gif-onload", function(){
  console.log(this); // returns div
  console.log($(this).attr("src"));

  if ($(this).attr("data-switch") == "0"){
    $(this).attr("src",$(this).attr("data-motion"));
    $(this).attr("data-switch","1");
  } else {
    $(this).attr("src",$(this).attr("data-still"));
    $(this).attr("data-switch","0");
  }
})


$(document).ready(function () {
  welcome();
})