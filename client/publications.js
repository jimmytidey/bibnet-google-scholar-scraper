Meteor.parsePublications = {}; 

Meteor.parsePublications.searchPublications = function(search_string) { 
	var url  = "https://scholar.google.co.uk/scholar?hl=en&as_sdt=1,5&as_vis=1&q=" + search_string;
	Meteor.chrome_extension_xhr.get(url);

}

Meteor.parsePublications.addCitations = function() { 
	
	Meteor.call('returnCitationsToCheck', Session.get('current_project'), function(err,citation_check_objs){ 
		console.log(citation_check_objs);
		
		window.bibnet_timer = setInterval(function(){
			
			if (citation_check_objs.length>1) {
				console.log('left to process: ', citation_check_objs.length );
				cite_search_obj = citation_check_objs.pop(); 
				
				console.log('cite_search_obj.url', cite_search_obj.url);

				Meteor.chrome_extension_xhr.get(cite_search_obj.url);
			} else { 
				console.log('*******************************************')
				console.log(' ')
				console.log('SEARCH ENDED');
				Meteor.clearInterval(window.bibnet_timer);
			}

		}, 2000);
		
	})

}


