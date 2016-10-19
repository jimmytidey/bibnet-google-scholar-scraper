Meteor.chrome_extension_xhr = {}; 

Meteor.chrome_extension_xhr.get = function(url){ 
	console.log('chrome_extension_xhr called')
	//apparently there is nothing you can do about this rather unpleasant in band messaging
 	window.postMessage("__bibnet_xhr_request__"+ url, "http://localhost:3000");
}


window.addEventListener('message', function(event) {

	if(event.data.indexOf("__bibnet_xhr_response__") > -1) {
		
		var response = event.data.split("__bibnet_xhr_response__")[1];
		
		if(response.indexOf('bibnet_error') > -1) {
			Notifications.error('Error Accessing Google Scholar', 'Maybe give it a while. (Error ' + response + ')');
		}

		else { 
			Meteor.parsePublications.displayPublication(response);
		}

	}
});



