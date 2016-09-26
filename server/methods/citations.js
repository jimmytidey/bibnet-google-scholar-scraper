Meteor.methods({
	addCitations: function () {
		console.log('*******************************************')
		console.log('Add citations called'); 
		
		bibnet.citation_search_array = []; 

		var publications = Publications.find().fetch();
		var authors 	 = Authors.find().fetch(); 

		_.each(publications, function(publication, pub_key){
			_.each(authors, function(author, author_key){
				var url = "https://scholar.google.co.uk/scholar?as_vis=1&q="+ author.name +"&btnG=&hl=en&as_sdt=2005&sciodt=0%2C5&cites=" + publication.google_cluster_id + "=1";
				var cite_search_obj = { 
					publication_obj	: publication,  
					author_obj		: author,
					url 			: url
				}; 

				bibnet.citation_search_array.push(cite_search_obj)
			}); 
		}); 

		bibnet.citation_search_array = bibnet.citation_search_array.slice(0, 4);

		bibnet.addCitationsTimer = Meteor.setInterval(function(){
			if (bibnet.citation_search_array.length>1) {
				cite_search_obj = bibnet.citation_search_array.pop(); 
				bibnet.addCitations(cite_search_obj);
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
		Edges.remove({type:'cites'}); 
	}, 
});