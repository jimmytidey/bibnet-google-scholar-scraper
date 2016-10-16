chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
	
  	console.log('request', request); 

	var request = new XMLHttpRequest();
	request.open('GET', 'https://scholar.google.com', false);  // `false` makes the request synchronous
	request.send(null);

	sendResponse({farewell: request.responseText});

});