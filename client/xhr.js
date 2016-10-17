Meteor.chrome_extension_xhr = {}; 

Meteor.chrome_extension_xhr.get = function(url){ 
	console.log('chrome_extension_xhr called')
 	window.postMessage(url, "http://localhost:3000");
}

window.addEventListener('message', function(event) {
	console.log(event);
});