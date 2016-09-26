Meteor.methods({
	addCitations: function () {
		console.log('Add citations called'); 
		
		bibnet.addCitationsTimer = Meteor.setInterval(function(){
			
			var publication_obj = Publications.findOne({citation_search: false});

			if (publication_obj) {
				bibnet.addCitations(publication_obj);
			} else { 
				console.log('*******************************************')
				console.log(' ')
				console.log('SEARCH ENDED');
				Meteor.clearInterval(bibnet.addCitationsTimer);
			}
		}, (Math.random() * 10000) + 2000) 
	}, 
});

Meteor.methods({
	removeCitations: function () {
		console.log('Remove citations called'); 
		
	}, 
});