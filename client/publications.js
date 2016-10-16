Meteor.parsePublications = {}; 

Meteor.parsePublications.searchPublications = function(search_string) { 
	var url  = "https://scholar.google.co.uk/scholar?hl=en&as_sdt=1,5&as_vis=1&q=" + search_string;
	Meteor.chrome_extension_xhr.get(url);

}