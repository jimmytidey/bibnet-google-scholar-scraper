Meteor.methods({
	findPapers: function (list_of_papers) {
		
		bibnet.list_of_papers = list_of_papers.split(/\n/)
		//var list = ['ostrom governing the commons', 'mancur olson the logic of collective action', 'ostrom and hess']; 
		
		/*
			ostrom governing the commons
			mancur olson the logic of collective action
			ostrom and hess
		*/

		_.each(list, function(publication_search_string, key){ 
			bibnet.SearchForPublications(publication_search_string);
		})

		bibnet.searchForCitations(); 
	}
});
