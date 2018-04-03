# giphy-api-app
## Here we have a simply laid out gif search engine powered by the giphy API. Here's a brief outline of features
### Search controls
* Search anything in the "i wanna see..." search box. If the API find something, a <div> with results will be drawn immediately below the controls. Subsequent searches will be prepended to the div, so they appear above previous searches. Previous searches intentionally kept on the page.
* If the API finds nothing (e.g. search "kqqqqw"), then the search box will display "no results :(" in red, briefly
* You can click "save search" in order to add the search term as a "preset" (the smaller buttons currently composed of spongbob characters. Saved search store in localStorage and thus persist until cleared from the browser
* You can click "hide presets" in order save screen real estate if desired (e.g. if they take up too much room on a mobile device... although I'll mention these controls are quite responsive)
* Click "favorites" to see gifs which you have favorites (more on this feature below). These will be built in the same manner as other searches
  
### Result controls
* As far as results of a query go, right now 10 will be returned. That is a global param which can easily be modified. In the future, it can be exposed to end users
* Results will be returned in a "still" state. That is, the gifs will not be animated. To animate them, click on them. To stop them, click again
* gifs are returned in a homemade "gallery." Use arrows at the sides of the container to scroll right and left. Right now, if you're at the left boundary, the arrow just wiggles in order to indicate resistance. If you're at the right boundary and click the right arrow, you will be moved back to the left boundary (i.e. you "start over")
* **Note: the arrows are drawn only after the width of the container is calculated. That is achieved by a setTimeout function which is slightly delayed so as to ensure the width of HTML elements can be calculated. If a connection is poor, then the arrows might not render because the setTimeout function was not delayed sufficiently**
* Click the expand icon of a result in order to launch a modal with the full-size gif. If the full size of the gif is small, this might seem like an anti-climactic feature, but the effect is cool for larger images. Click anywhere to dismiss the modal
* Click the heart icon of a result in order to store it to favorites.
* **Note: the implementation of this feature is partial. Initially, favorites were stored as HTML elements. But when I tried to store them in localStorage, I discovered the JSON wouldn't parse. Thereafter, I started storing favorites as JSON object and drawing them into HTML on page load. I achieved that (i.e. favorites now store to/load from localStorage), but I haven't yet totally reconciled the original "favorites" data model with the new one, so there are some bugs.**
* Lastly, click the blue "download" icon of a result in order to download it
