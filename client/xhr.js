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
			Meteor.chrome_extension_xhr.determineType(response)
		}	
	}
});

Meteor.chrome_extension_xhr.determineType = function(remote_dom){ 

	var jquery_remote_dom = jQuery.parseHTML( remote_dom );
	//error page, cition search page, or publication search page? 
	var is_rate_limited_1 	= $(jquery_remote_dom).find('#gs_captcha_f');
	var is_rate_limited_2 	= $(jquery_remote_dom).find('#captcha');
	var is_citation_page  	= $(jquery_remote_dom).find('.gs_rt_hdr');

	if(is_rate_limited_1.length > 0 || is_rate_limited_2.length > 0) { 
		Notifications.error('Error Accessing Google Scholar', 'You have been rate limited');
		return false 
	}
 	
 	if(is_citation_page.length > 0) { 
 		console.log('this is a citation page'); 
 	} else { 
 		var number_of_results = $(jquery_remote_dom).find('#gs_ccl_results > div').length;  
 		Notifications.info('Search completed with ' + number_of_results + ' results');
 		Meteor.call('parsePublicationHTML', remote_dom, Session.get("current_project"));
 	}	
}


