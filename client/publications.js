Meteor.parsePublications = {}; 

Meteor.parsePublications.searchPublications = function(search_string) { 
	var url  = "https://scholar.google.co.uk/scholar?hl=en&as_sdt=1,5&as_vis=1&q=" + search_string;
	Meteor.chrome_extension_xhr.get(url);

}

Meteor.parsePublications.displayPublication = function(html) {
	var remote_dom = jQuery.parseHTML( html );
	var test = $(remote_dom).find('#gs_ccl_results');
	console.log(test);

	if ($('#gs_captcha_f').length > 0 || $('#captcha').length > 0 ) {
	}
}
