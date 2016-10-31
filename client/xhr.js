Meteor.parsePublications = {}; 

Meteor.parsePublications.searchPublications = function(search_string) { 
	if ($('.bibnet_plugin_is_installed_v07').length == 0){
		Modal.show('pluginModal');
	} 
	else {	
		var url  = "https://scholar.google.co.uk/scholar?hl=en&as_sdt=1,5&as_vis=1&q=" + search_string;
		Notifications.info('This will generate popup windows, you may need to allow them');
		window.open(url + '&wc_pub_search=true&project_id=' + Session.get('current_project'), 'xhr_window',"width=400,height=400");	
	}
}

Meteor.parsePublications.addCitations = function() { 
	if ($('.bibnet_plugin_is_installed_v07').length == 0){
		Modal.show('pluginModal');
	} 
	else {	
		Notifications.info('This will generate popup windows, you may need to allow them');

		Meteor.call('returnCitationsToCheck', Session.get('current_project'), function(err,citation_check_objs){ 
			
			Notifications.success('Adding '+ citation_check_objs.length +' citations');
			
			window.bibnet_timer = setInterval(function(){
				
				if (citation_check_objs.length>0) {
					console.log('left to process: ', citation_check_objs.length );
					
					cite_search_obj = citation_check_objs.pop();
					
					window.open(cite_search_obj.url + '&wc_cite_search=true&project_id=' + Session.get('current_project'), 'xhr_window',"width=400,height=400");
				
				} else { 
					console.log('*******************************************')
					console.log(' ')
					console.log('SEARCH ENDED');
					$('.iframe_container').remove('.iframe'); 
					clearInterval(window.bibnet_timer);
				}


			}, 3000);
			
		})
	}
}


