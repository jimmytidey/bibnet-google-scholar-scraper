Meteor.chrome_extension_xhr = {}; 

Meteor.chrome_extension_xhr.get = function(url){

	if ($('.bibnet_plugin_is_installed_v05').length == 0){
		Modal.show('pluginModal');
	} 

	console.log('chrome_extension_xhr called')
	//apparently there is nothing you can do about this rather unpleasant in band messaging
 	window.postMessage("__bibnet_xhr_request__"+ url, Meteor.absoluteUrl());
}


window.addEventListener('message', function(event) {

	if(event.data.indexOf("__bibnet_xhr_response__") > -1) {
		
		var response = event.data.split("__bibnet_xhr_response__")[1];
		
		if(response.indexOf('bibnet_error') > -1) {
			Notifications.error('Error Accessing Google Scholar', 'Maybe give it a while. (Error ' + response + ')');
			clearInterval(window.bibnet_timer);
		}

		else { 
			Meteor.chrome_extension_xhr.determineType(response)
			
		}	
	}
});

Meteor.chrome_extension_xhr.determineType = function(response){

	var html = response.split('__bibnet_html__')[1];
	var url  = response.split('__bibnet_html__')[0];
	
	console.log('url',url);
	
	var jquery_remote_dom = jQuery.parseHTML( html );
	//error page, cition search page, or publication search page? 
	var is_rate_limited_1 	= $(jquery_remote_dom).find('#gs_captcha_f');
	var is_rate_limited_2 	= $(jquery_remote_dom).find('#captcha');
	var is_citation_page  	= url.search('cites');

	if(is_rate_limited_1.length > 0 || is_rate_limited_2.length > 0) { 
		Notifications.error('Error Accessing Google Scholar', 'You have been rate limited');
		clearInterval(window.bibnet_timer);
		return false 
	}
 	
 	if(is_citation_page > 0) { 
 		var query_terms = url.split('&');
 		var author_name = decodeURI(query_terms[1].split('=')[1]);
 		var google_pub_id =query_terms[6].split('=')[1];
 		console.log(author_name);
 		console.log(google_pub_id);

 		var number_of_results = $(jquery_remote_dom).find('#gs_ccl_results > div').length;

 		Meteor.call('clusterIdtoPaperTitle', google_pub_id,function(err,res){
 			console.log('res', res);
 			Notifications.warn('Citation search', 
 			author_name + ' cites <br/>' +res.title +' <br/>' + number_of_results + ' times');
 		})

 		var cite_obj = { 
 			author_name: author_name, 
 			google_pub_id: google_pub_id, 
 			html: html
	 	}

 		Meteor.call('addCitations',cite_obj); 
 		
 	} else { 
 		var number_of_results = $(jquery_remote_dom).find('#gs_ccl_results > div').length;  
 		Notifications.info('Search completed with ' + number_of_results + ' results');
 		Meteor.call('parsePublicationHTML', html, Session.get("current_project"));
 	}	
}


