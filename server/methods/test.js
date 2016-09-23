Meteor.methods({
	test: function (list) {
		var list = ['ostrom governing the commons', 'mancur olson the logic of collective action', 'ostrom and hess']; 

		_.each(list, function(publication_search_string, key){ 
			
				bibnet.getPublicationFromSearch(publication_search_string);
				
		})
	}
});
