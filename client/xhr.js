Meteor.chrome_extension_xhr = {}; 

Meteor.chrome_extension_xhr.get = function(url){ 

 	window.postMessage(url, "http://localhost:3000");
}