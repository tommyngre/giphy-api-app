function welcome() {
  console.log("welcome fool")
}

var session = {
  sessionData: '',
  queryBuilder: function (q) {
    var url = "https://api.giphy.com/v1/gifs/search?limit=10&offset=0&rating=G&lang=en";
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
      var result = $("<div class='r-element'>");
      var html =
        `
        <img class="gif-onload" src="${element.images.downsized_still.url}">
        `;
      result.html(html);
      results.append(result);
    });

    $("#container").append(results);
  }
}

$("#show-me").on("click", function () {
  var query = $("#user-input").val();
  //console.log(query);
  session.queryBuilder(query);
});

$(document).ready(function () {
  welcome();
})