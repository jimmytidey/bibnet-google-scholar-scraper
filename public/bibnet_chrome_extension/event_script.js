chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
	
	var request = new XMLHttpRequest();
	request.open('GET', 'http://localhost:3000', false);  // `false` makes the request synchronous
	request.send(null);

	sendResponse({farewell: request.responseText});

});